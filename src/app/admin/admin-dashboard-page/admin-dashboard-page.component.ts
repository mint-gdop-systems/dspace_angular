import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
    combineLatest,
    Observable,
    of,
    zip,
} from 'rxjs';
import {
    map,
    shareReplay,
    startWith,
    switchMap,
    take,
} from 'rxjs/operators';

import { BitstreamDataService } from '../../core/data/bitstream-data.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { FindListOptions } from '../../core/data/find-list-options.model';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { followLink } from '../../shared/utils/follow-link-config.model';
import { Bitstream } from '../../core/shared/bitstream.model';
import { Collection } from '../../core/shared/collection.model';
import { getFirstCompletedRemoteData } from '../../core/shared/operators';
import { SearchService } from '../../core/shared/search/search.service';
import { MyDSpaceResponseParsingService } from '../../core/data/mydspace-response-parsing.service';
import { MyDSpaceRequest } from '../../core/data/request.models';
import { ClaimedTaskDataService } from '../../core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../core/tasks/pool-task-data.service';
import { WorkflowItemDataService } from '../../core/submission/workflowitem-data.service';
import { WorkspaceitemDataService } from '../../core/submission/workspaceitem-data.service';
import { Context } from '../../core/shared/context.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';
import { SearchObjects } from '../../shared/search/models/search-objects.model';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { PoolTask } from '../../core/tasks/models/pool-task-object.model';
import { ClaimedTask } from '../../core/tasks/models/claimed-task-object.model';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';

@Component({
    selector: 'ds-admin-dashboard-page',
    templateUrl: './admin-dashboard-page.component.html',
    styleUrls: ['./admin-dashboard-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
    ],
})
export class AdminDashboardPageComponent implements OnInit {

    collectionsCount$: Observable<number>;
    archivedItemsCount$: Observable<number>;
    workflowItemsCount$: Observable<number>;
    collectionsStats$: Observable<any[]>;

    constructor(
        protected searchService: SearchService,
        protected bitstreamDataService: BitstreamDataService,
        protected workspaceitemDataService: WorkspaceitemDataService,
        protected workflowItemDataService: WorkflowItemDataService,
        protected poolTaskDataService: PoolTaskDataService,
        protected claimedTaskDataService: ClaimedTaskDataService,
        protected collectionDataService: CollectionDataService,
        protected halService: HALEndpointService,
    ) { }

    ngOnInit(): void {
        this.refresh();
    }

    refresh(): void {
        const oneElementPagination = Object.assign(new PaginationComponentOptions(), { id: 'admin-stats-one', pageSize: 1 });
        const manyElementsPagination = Object.assign(new PaginationComponentOptions(), { id: 'admin-stats-many', pageSize: 100 });

        // 0. Collections count (Discovery is best for this)
        this.collectionsCount$ = this.searchService.search(new PaginatedSearchOptions({
            dsoTypes: [DSpaceObjectType.COLLECTION],
            pagination: oneElementPagination,
        })).pipe(
            getFirstCompletedRemoteData(),
            map((rs: RemoteData<SearchObjects<DSpaceObject>>) => rs.hasSucceeded ? rs.payload.totalElements : 0),
            startWith(0),
            shareReplay(1),
        );

        this.archivedItemsCount$ = this.searchService.search(new PaginatedSearchOptions({
            dsoTypes: [DSpaceObjectType.ITEM],
            pagination: oneElementPagination,
        })).pipe(
            getFirstCompletedRemoteData(),
            map((rs: RemoteData<SearchObjects<DSpaceObject>>) => rs.hasSucceeded ? rs.payload.totalElements : 0),
            startWith(0),
            shareReplay(1),
        );


        // 3. Workflow items count (Targeted Workflow Search to match table)
        this.workflowItemsCount$ = this.searchService.search(new PaginatedSearchOptions({
            configuration: 'workflow',
            pagination: oneElementPagination,
        }), undefined, false).pipe(
            getFirstCompletedRemoteData(),
            map((rs: RemoteData<SearchObjects<DSpaceObject>>) => rs.hasSucceeded ? rs.payload.totalElements : 0),
            startWith(0),
            shareReplay(1),
        );

        // 5. Collection Statistics (List ALL collections with Discovery counts)
        this.collectionsStats$ = this.collectionDataService.findAll({ elementsPerPage: 100 }, false).pipe(
            getFirstCompletedRemoteData(),
            switchMap((rd: RemoteData<PaginatedList<Collection>>) => {
                if (rd.hasSucceeded && rd.payload?.page?.length > 0) {
                    const collections = rd.payload.page;
                    const stats$ = collections.map((coll) => {
                        // 5a. Archived count from Discovery for this bucket
                        const archived$ = this.searchService.search(new PaginatedSearchOptions({
                            scope: coll.id,
                            dsoTypes: [DSpaceObjectType.ITEM],
                            pagination: oneElementPagination,
                        }), undefined, false).pipe(getFirstCompletedRemoteData(), startWith(null));

                        // 5b. Workflow count from Discovery for this bucket
                        const workflow$ = this.searchService.search(new PaginatedSearchOptions({
                            configuration: 'workflow',
                            scope: coll.id,
                            pagination: oneElementPagination,
                        }), undefined, false).pipe(getFirstCompletedRemoteData(), startWith(null));

                        return combineLatest([archived$, workflow$]).pipe(
                            map(([archivedRd, workflowRd]) => ({
                                label: coll.name,
                                archivedCount: (archivedRd && archivedRd.hasSucceeded) ? archivedRd.payload.totalElements : 0,
                                workflowCount: (workflowRd && workflowRd.hasSucceeded) ? workflowRd.payload.totalElements : 0,
                            })),
                        );
                    });
                    return combineLatest(stats$);
                }
                return of<any[]>([]);
            }),
            shareReplay(1),
        );
    }
}
