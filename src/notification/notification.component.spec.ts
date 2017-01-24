/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {NotificationComponent} from './notification.component';
import {NotificationService} from './notification.service';
import {Notification, NotificationTypes} from './notification';
import {MockTranslatePipe} from '../testhelpers/mock-translate.pipe';

//TODO: needs more tests
describe('NotificationComponent', () => {
    let component: NotificationComponent;
    let fixture: ComponentFixture<NotificationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NotificationComponent, MockTranslatePipe],
            imports: [CommonModule],
            providers: [{provide: NotificationService, useValue: {notifications: []}}]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('should show messages', () => {

        let message = 'message';
        let title = 'title';
        let mockNotificationService;
        let htmlNotifications;

        beforeEach(() => {
            mockNotificationService = fixture.debugElement.injector.get(NotificationService);
            mockNotificationService.notifications.push(new Notification(1, NotificationTypes.DEFAULT, message, title, false));
            mockNotificationService.notifications.push(new Notification(2, NotificationTypes.INFO, message, title, false));
            fixture.detectChanges();

            //grabs all alerts of the components template
            htmlNotifications = fixture.debugElement.queryAll(By.css('.alert'));
        });

        it('', () => {
            expect(htmlNotifications.length).toBe(2);
        });

        it('with matching css classes', () => {
            expect(htmlNotifications[0].classes).toEqual(jasmine.objectContaining({alert: true}));
            expect(htmlNotifications[0].classes).not.toEqual(jasmine.objectContaining({'alert-info': true}));
        });
    });
});
