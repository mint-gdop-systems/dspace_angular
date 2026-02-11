import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootModule } from '../../app/root.module';
import { HeaderComponent } from './app/header/header.component';
import { NavbarComponent } from './app/navbar/navbar.component';
import { HomeNewsComponent } from './app/home-page/home-news/home-news.component';
import { ContextHelpToggleComponent } from './app/header/context-help-toggle/context-help-toggle.component';


/**
 * Eager theme module for the FSC theme.
 */
@NgModule({
    imports: [
        CommonModule,
        RootModule,
        HeaderComponent,
        NavbarComponent,
        HomeNewsComponent,
        ContextHelpToggleComponent
    ]
})
export class EagerThemeModule {
}
