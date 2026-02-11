import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootModule } from '../../app/root.module';
import { HomePageComponent } from './app/home-page/home-page.component';
import { ItemListPreviewComponent } from './app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { AdminDashboardPageComponent } from './app/admin/admin-dashboard-page/admin-dashboard-page.component';
import { UserDashboardComponent } from './app/admin/admin-dashboard-page/user-dashboard/user-dashboard.component';

/**
 * Lazy theme module for the FSC theme.
 */
@NgModule({
    imports: [
        CommonModule,
        RootModule,
        HomePageComponent,
        ItemListPreviewComponent,
        AdminDashboardPageComponent,
        UserDashboardComponent
    ]
})
export class LazyThemeModule {
}
