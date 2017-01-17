/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpinnerService } from './spinner.service';

//TODO: implement tests for NotificationService
describe('SpinnerService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SpinnerService]
        });
    });

    it('should ...', inject([SpinnerService], (service: SpinnerService) => {
        expect(service).toBeTruthy();
    }));
});
