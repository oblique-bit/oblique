/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {NotificationService} from './notification.service';
import {NotificationTypes} from './notification';

//TODO: implement tests for NotificationService
describe('NotificationService', () => {
    let notificationService: NotificationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NotificationService]
        });
    });

    beforeEach(inject([NotificationService], (service: NotificationService) => {
        notificationService = service;
    }));

    it('should save notification in array', () => {
        notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);
        expect(notificationService.notifications.length).toBe(1);
    });

    it('.clear() should remove all notification', () => {
        notificationService.add(NotificationTypes.DEFAULT, 'message', 'title', true);
        notificationService.add(NotificationTypes.ERROR, 'message', 'title', false);

        notificationService.clear();

        expect(notificationService.notifications.length).toBe(0);
    });

    describe('.error() should call add', () => {
        beforeEach(() => {
            spyOn(notificationService, 'add');
        });


        it('with NotificationTypes.ERROR', () => {
            notificationService.error('message', 'title');

            expect(notificationService.add).toHaveBeenCalledWith(NotificationTypes.ERROR, jasmine.any(String), jasmine.any(String), jasmine.any(Boolean));
        });

        it('with sticky', () => {
            notificationService.error('message', 'title');

            expect(notificationService.add).toHaveBeenCalledWith(jasmine.any(Object), jasmine.any(String), jasmine.any(String), true);
        });

    });

    //TODO: more tests
});
