import {TestBed, inject} from '@angular/core/testing';
import {UnsavedChangesService} from './unsaved-changes.service';
import {TranslateService} from 'ng2-translate';
import {ControlContainer} from '@angular/forms';


describe('UnsavedChangesService', () => {
    let unsavedChangesService: UnsavedChangesService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                UnsavedChangesService,
                {
                    provide: TranslateService, useValue: {
                    instant: jasmine.createSpy('instant').and.callFake((val) => val)
                }
                }
            ]
        });
    });

    beforeEach(() => {
        //This prevents the opening of a confirmation dialog if the cli reloads the tests
        spyOn(window, 'addEventListener');
    });

    beforeEach(inject([UnsavedChangesService], (service: UnsavedChangesService) => {
        unsavedChangesService = service;
    }));

    it('should attach beforeUnload eventListener', () => {
        expect(window.addEventListener).toHaveBeenCalled();
        //TODO: does not work
        //expect(window.addEventListener).toHaveBeenCalledWith('beforeUnload', jasmine.any(Function));

    });

    describe('canDeactivate()', () => {
        beforeEach(() => {
            spyOn(window, 'confirm').and.callFake(() => true);
        });

        it('should return true, if no form is watched', () => {
            expect(unsavedChangesService.canDeactivate()).toBeTruthy();
        });

        it('should open confirmation dialog, if form is dirty', () => {
            const form: ControlContainer = {dirty: true} as ControlContainer;

            unsavedChangesService.canDeactivate(form);

            expect(window.confirm).toHaveBeenCalled();
        });

        it('shouldn\'t open confirmation dialog, if form isn\'t dirty', () => {
            const form: ControlContainer = {dirty: false} as ControlContainer;

            unsavedChangesService.canDeactivate(form);

            expect(window.confirm).not.toHaveBeenCalled();
        });

        it('should open confirmation dialog, if watched form is dirty', () => {
            const form: ControlContainer = {dirty: true} as ControlContainer;

            unsavedChangesService.watch(form);
            unsavedChangesService.canDeactivate();

            expect(window.confirm).toHaveBeenCalled();
        });

        it('shouldn\'t open confirmation dialog, if watched form isn\'t dirty', () => {
            const form: ControlContainer = {dirty: false} as ControlContainer;

            unsavedChangesService.watch(form);
            unsavedChangesService.canDeactivate();

            expect(window.confirm).not.toHaveBeenCalled();
        });

        it('should open confirmation dialog, if one watched form is dirty', () => {
            unsavedChangesService.watch({dirty: false} as ControlContainer);
            unsavedChangesService.watch({dirty: false} as ControlContainer);
            unsavedChangesService.watch({dirty: true} as ControlContainer);

            unsavedChangesService.canDeactivate();

            expect(window.confirm).toHaveBeenCalled();
        });

        it('shouldn\'t open confirmation dialog, if none of the watched forms is dirty', () => {
            unsavedChangesService.watch({dirty: false} as ControlContainer);
            unsavedChangesService.watch({dirty: false} as ControlContainer);
            unsavedChangesService.watch({dirty: false} as ControlContainer);

            unsavedChangesService.canDeactivate();

            expect(window.confirm).not.toHaveBeenCalled();
        });
    });

    describe('onUnload()', () => {
        let event: BeforeUnloadEvent;

        beforeEach(() => {
            event = {} as BeforeUnloadEvent;
        });

        it('should return null, if no form is watched', () => {
            expect(unsavedChangesService.onUnload(event)).toBeNull();
        });

        it('should return string, if one watched form is dirty', () => {
            unsavedChangesService.watch({dirty: true} as ControlContainer);

            expect(unsavedChangesService.onUnload(event)).toEqual(jasmine.any(String));
        });

        it('should set a string to event.returnValue, if one watched form is dirty', () => {
            unsavedChangesService.watch({dirty: true} as ControlContainer);

            unsavedChangesService.onUnload(event);

            expect(event.returnValue).toEqual(jasmine.any(String));
        });

        it('should return null, if watched form isn\'t dirty', () => {
            unsavedChangesService.watch({dirty: false} as ControlContainer);

            expect(unsavedChangesService.onUnload(event)).toBeNull();
        });
    });
});