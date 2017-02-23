import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

import {AppComponent} from './app.component';
import {ObliqueModule} from '../../src';
import {HomeComponent} from './home/home.component';
import {SamplesModule} from './samples/samples.module';
import {NavigableComponent} from './samples/navigable/navigable.component';
import {SchemaValidationComponent} from './samples/schema-validation/schema-validation.component';
import {UnsavedChangesGuard} from '../../src/unsaved-changes/unsaved-changes.guard';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        ObliqueModule.forRoot(),
        RouterModule.forRoot([
            //TODO: Routing config and links in master layout
            {path: 'home', component: HomeComponent},
            {path: 'navigable', component: NavigableComponent},
            {path: 'schema-validation', component: SchemaValidationComponent, canDeactivate: [UnsavedChangesGuard]},
            {path: '', redirectTo: '/schema-validation', pathMatch: 'full'},
        ]),
        NgbModule.forRoot(),
        TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [Http]
        }),
        SamplesModule
    ],
    providers: [
        {provide: 'notificationTimeout', useValue: 2000},
        {provide: 'spinnerMaxTimeout', useValue: 3000},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}