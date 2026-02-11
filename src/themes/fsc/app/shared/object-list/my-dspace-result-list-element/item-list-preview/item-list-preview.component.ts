import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  Input,
  OnInit,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Context } from '../../../../../../../app/core/shared/context.model';
import { WorkflowItem } from '../../../../../../../app/core/submission/models/workflowitem.model';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../../../../../config/app-config.interface';
import { DSONameService } from '../../../../../../../app/core/breadcrumbs/dso-name.service';
import { Item } from '../../../../../../../app/core/shared/item.model';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';
import { fadeInOut } from '../../../../../../../app/shared/animations/fade';
import { ThemedBadgesComponent } from '../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { ItemCollectionComponent } from '../../../../../../../app/shared/object-collection/shared/mydspace-item-collection/item-collection.component';
import { ItemSubmitterComponent } from '../../../../../../../app/shared/object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { SearchResult } from '../../../../../../../app/shared/search/models/search-result.model';
import { TruncatableComponent } from '../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';

/**
 * This component show metadata for the given item object in the list view.
 */
@Component({
  selector: 'ds-base-item-list-preview',
  styleUrls: ['item-list-preview.component.scss'],
  templateUrl: 'item-list-preview.component.html',
  animations: [fadeInOut],
  standalone: true,
  imports: [
    AsyncPipe,
    ItemCollectionComponent,
    ItemSubmitterComponent,
    NgClass,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemListPreviewComponent implements OnInit {

  /**
   * The item to display
   */
  @Input() item: Item;

  /**
   * The search result object
   */
  @Input() object: SearchResult<any>;

  /**
   * Represents the badge context
   */
  @Input() badgeContext: Context;

  /**
   * A boolean representing if to show submitter information
   */
  @Input() showSubmitter = false;

  /**
   * Represents the workflow of the item
   */
  @Input() workflowItem: WorkflowItem;

  /**
   * Display thumbnails if required by configuration
   */
  showThumbnails: boolean;

  dsoTitle: string;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    public dsoNameService: DSONameService,
  ) {
  }

  ngOnInit(): void {
    this.showThumbnails = this.appConfig.browseBy.showThumbnails;
    this.dsoTitle = this.dsoNameService.getHitHighlights(this.object, this.item);
  }


}
