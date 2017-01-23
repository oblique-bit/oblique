import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {ObliqueModule} from '../../src';
import {HomeComponent} from './home/home.component';

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
            {path: '', redirectTo: '/home', pathMatch: 'full'},
        ]),
        NgbModule.forRoot()
    ],
    providers: [
        {provide: 'notificationTimeout', useValue: 2000},
        {provide: 'spinnerMaxTimeout', useValue: 3000},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
