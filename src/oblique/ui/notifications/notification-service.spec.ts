import {NotificationService} from './notification-service';

//Sample test
describe('NotificationService', () => {
    let service:NotificationService;

    //Needs to import this, because otherwise it makes problems with decorators
    beforeEach(angular.mock.module('__MODULE__'));

    beforeEach(inject(($timeout) => {
        service = new NotificationService($timeout, {
            timeout: 100
        });
    }));

    it('should remove all notifications on clear', () => {
        service.info('FUU');
        service.error('BAR');
        service.warn('BAZ');

        expect(service.notifications.length).toBe(3);

        service.clear();

        expect(service.notifications.length).toBe(0);
    });

});