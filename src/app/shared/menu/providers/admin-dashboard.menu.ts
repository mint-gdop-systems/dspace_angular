/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */

import { Injectable } from '@angular/core';
import {
    combineLatest,
    map,
    Observable,
} from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { MenuItemType } from '../menu-item-type.model';
import {
    AbstractMenuProvider,
    PartialMenuSection,
} from '../menu-provider.model';

/**
 * Menu provider to create the "Admin Dashboard" menu section in the public navbar under Statistics.
 */
@Injectable({ providedIn: 'root' })
export class AdminDashboardMenuProvider extends AbstractMenuProvider {

    constructor(
        protected authorizationService: AuthorizationDataService,
    ) {
        super();
    }

    public getSections(): Observable<PartialMenuSection[]> {
        return combineLatest([
            this.authorizationService.isAuthorized(FeatureID.AdministratorOf),
        ]).pipe(
            map(([authorized]) => {
                return [
                    {
                        id: 'admin-dashboard',
                        visible: authorized,
                        model: {
                            type: MenuItemType.LINK,
                            text: 'menu.section.analytics',
                            link: '/statistics/admin-dashboard',
                        },
                        icon: 'chart-bar',
                    },
                ];
            }),
        );
    }
}
