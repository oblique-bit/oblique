import {NotificationService} from './notification-service';

//Sample test
describe('NotificationService', () => {
    let service:NotificationService;

    beforeEach(angular.mock.module('__MODULE__'));

    beforeEach(inject(($timeout) => {
        service = new NotificationService($timeout, {
            timeout: 100
        });
        console.log(service);
    }));

    it('should remove all Notifications on clear', () => {
        console.log(service);

        service.info('FUU');
        service.error('BAR');
        service.warn('BAZ');

        expect(service.notifications.length).toBe(3);

        service.clear();

        expect(service.notifications.length).toBe(0);
    });

});