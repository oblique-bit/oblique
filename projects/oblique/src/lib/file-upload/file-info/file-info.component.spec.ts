import {SelectionModel} from '@angular/cdk/collections';
import {CUSTOM_ELEMENTS_SCHEMA, EventEmitter, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateService} from '@ngx-translate/core';
import {Subject, of, throwError} from 'rxjs';
import {WINDOW} from '../../utilities';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObEUploadEventType, ObIFileDescription, ObIUploadEvent} from '../file-upload.model';
import {ObFileUploadService} from '../file-upload.service';
import {ObFileInfoComponent} from './file-info.component';

describe('ObFileInfoComponent', () => {
	let component: ObFileInfoComponent;
	let fixture: ComponentFixture<ObFileInfoComponent>;
	let uploadService: ObFileUploadService;

	const uploadComplete = new Subject<void>();
	const files = [{name: 'file.txt'}, {name: 'file.jpg'}, {name: 'file.pdf'}];

	beforeEach(async () => {
		const mockFileUpload = {
			uploadComplete$: uploadComplete.asObservable(),
			getUploadedFiles: () => of(files),
			delete: () => of()
		};
		await TestBed.configureTestingModule({
			imports: [MatTableModule, ObFileInfoComponent, ObMockTranslatePipe, NoopAnimationsModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
			providers: [
				{provide: ObFileUploadService, useValue: mockFileUpload},
				{provide: WINDOW, useValue: window},
				{provide: TranslateService, useClass: ObMockTranslateService}
			]
		}).compileComponents();
		uploadService = TestBed.inject(ObFileUploadService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ObFileInfoComponent);
		component = fixture.componentInstance;
		component.getUploadedFilesUrl = 'test-url';
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-file-info class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-file-info')).toBe(true);
	});

	it('should have a uploadEvent EventEmitter', () => {
		expect(component.uploadEvent instanceof EventEmitter).toBe(true);
	});

	it('should have a dataSource', () => {
		expect(component.dataSource instanceof MatTableDataSource).toBe(true);
	});

	it('should have a selection property', () => {
		expect(component.selection instanceof SelectionModel).toBe(true);
	});

	it('should have a COLUMN_SELECT property', () => {
		expect(component.COLUMN_SELECT).toBe('select');
	});

	it('should have a COLUMN_ACTION property', () => {
		expect(component.COLUMN_ACTION).toBe('action');
	});

	describe('mapFunction', () => {
		it('should return the given array', () => {
			expect(component.mapFunction(files)).toEqual(files);
		});
	});

	describe('with custom mapFunction', () => {
		beforeEach(() => {
			component.mapFunction = (filesToMap: ObIFileDescription[]) => filesToMap.map(file => ({...file, extension: file.name.split('.')[1]}));
			fixture.detectChanges();
		});

		describe('ngOnInit', () => {
			it('should set file on dataSource', () => {
				expect(component.dataSource.data.length).toBe(3);
			});
			it('should add extension to files', () => {
				expect(component.dataSource.data[0].extension).toBe('txt');
			});
			it('should populate fields array', () => {
				expect(component.fields).toEqual(['name', 'extension']);
			});

			it('should reload files on uploadComplete', () => {
				jest.spyOn(uploadService, 'getUploadedFiles');
				uploadComplete.next();
				expect(uploadService.getUploadedFiles).toHaveBeenCalled();
			});

			it.each([null, undefined, ''])("should not reload files on uploadComplete when there's no getUploadedFilesUrl (½s)", value => {
				component.getUploadedFilesUrl = value;
				jest.spyOn(uploadService, 'getUploadedFiles');
				uploadComplete.next();
				expect(uploadService.getUploadedFiles).not.toHaveBeenCalled();
			});

			describe('add new row while rows are selected', () => {
				beforeEach(() => {
					component.selection.select(component.dataSource.data[0]);
					jest.spyOn(component.selection, 'clear');
					jest.spyOn(component.selection, 'select');
					uploadComplete.next();
				});

				it('should clear the selection', () => {
					expect(component.selection.clear).toHaveBeenCalled();
				});

				it('should select the previously selected item', () => {
					expect(component.selection.select).toHaveBeenCalledWith(component.dataSource.data[0]);
				});

				it('should not change selection', () => {
					expect(component.selection.selected).toEqual([component.dataSource.data[0]]);
				});
			});

			describe('with erroneous back-end call', () => {
				let event: ObIUploadEvent;
				const errorMessage = new Error('Back-end error');

				beforeEach(done => {
					jest.spyOn(uploadService, 'getUploadedFiles').mockReturnValue(throwError(() => errorMessage));
					component.uploadEvent.subscribe(evt => {
						event = evt;
						done();
					});
					uploadComplete.next();
				});

				it('should emit an ERRORED event', () => {
					expect(event.type).toBe(ObEUploadEventType.ERRORED);
				});

				it('should emit an empty array', () => {
					expect(event.files).toEqual([]);
				});

				it('should emit the thrown error', () => {
					expect(event.error).toBe(errorMessage);
				});
			});

			describe('should populate displayedColumns array', () => {
				it('should have 3 columns without an deleteUrl', () => {
					expect(component.displayedColumns).toEqual(['select', 'name', 'extension']);
				});

				it('should have 4 columns with an deleteUrl', () => {
					component.deleteUrl = 'some/path';
					component.ngOnInit();
					fixture.detectChanges();
					expect(component.displayedColumns).toEqual(['select', 'name', 'extension', 'action']);
				});
			});

			describe('table', () => {
				describe('with data', () => {
					it('should not show an infobox', () => {
						const el = fixture.debugElement.query(By.css('ob-alert'));
						expect(el).toBeNull();
					});

					it('should have a table with data', () => {
						const el = fixture.debugElement.query(By.css('.ob-table tbody > tr'));
						expect(el).toBeDefined();
					});
				});

				describe('with no data', () => {
					beforeEach(() => {
						jest.spyOn(uploadService, 'getUploadedFiles').mockReturnValue(of([]));
						component.ngOnInit();
						fixture.detectChanges();
					});
					it('should show an infobox', () => {
						const el = fixture.debugElement.query(By.css('ob-alert'));
						expect(el).toBeDefined();
					});

					it('should have a table with no data', () => {
						const el = fixture.debugElement.query(By.css('.ob-table tbody > tr'));
						expect(el).toBeNull();
					});
				});
			});
		});

		describe('ngOnDestroy', () => {
			it('should not reload files on uploadComplete', () => {
				jest.spyOn(uploadService, 'getUploadedFiles');
				component.ngOnDestroy();
				uploadComplete.next();
				expect(uploadService.getUploadedFiles).not.toHaveBeenCalled();
			});
		});

		describe('selectOrUnselectAllItems', () => {
			it('should select all if not already', () => {
				component.selection.deselect(component.dataSource.data[0]);
				component.selectOrUnselectAllItems();
				expect(component.selection.selected.length).toBe(3);
			});

			it('should unselect all if all are selected', () => {
				component.dataSource.data.forEach(file => component.selection.select(file));
				component.selectOrUnselectAllItems();
				expect(component.selection.isEmpty()).toBe(true);
			});

			describe('should emit', () => {
				let event;
				beforeEach(done => {
					component.selection.clear();
					component.uploadEvent.subscribe(evt => {
						event = evt;
						done();
					});
					component.selectOrUnselectAllItems();
				});

				it('a "selected" event', () => {
					expect(event.type).toBe('selected');
				});

				it('selected file', () => {
					expect(event.files.length).toBe(3);
				});
			});
		});

		describe('toggle', () => {
			it('should select a row if unselected', () => {
				const file = component.dataSource.data[0];
				component.selection.deselect(file);
				component.toggle(file);
				expect(component.selection.selected.includes(file)).toBe(true);
			});

			it('should unselect a row if selected', () => {
				const file = component.dataSource[0];
				component.selection.select(file);
				component.toggle(file);
				expect(component.selection.selected.includes(file)).toBe(false);
			});
		});

		describe('delete', () => {
			it('should ask for confirmation', () => {
				component.deleteUrl = 'url';
				jest.spyOn(window, 'confirm');
				component.delete([files[0]]);
				expect(window.confirm).toHaveBeenCalled();
			});

			it('should do nothing if not confirmed', () => {
				component.deleteUrl = 'url';
				jest.spyOn(window, 'confirm').mockReturnValue(false);
				jest.spyOn(uploadService, 'delete');
				component.delete([files[0]]);
				expect(uploadService.delete).not.toHaveBeenCalled();
			});

			it('should do nothing if confirmed without deleteUrl', () => {
				component.deleteUrl = undefined;
				jest.spyOn(window, 'confirm').mockReturnValue(true);
				jest.spyOn(uploadService, 'delete').mockReturnValue(of());
				component.delete([files[0]]);
				expect(uploadService.delete).not.toHaveBeenCalled();
			});

			describe('with confirmed and deleteUrl', () => {
				beforeEach(() => {
					component.deleteUrl = 'url';
					jest.spyOn(window, 'confirm').mockReturnValue(true);
					jest.spyOn(uploadService, 'delete').mockReturnValue(of({}));
					component.selection.select(files[0]);
					component.selection.select(files[1]);
					component.delete([files[0]]);
				});

				it('should call delete ', () => {
					expect(uploadService.delete).toHaveBeenCalledWith('url', ['file.txt']);
				});

				it('should remove a file', () => {
					expect(component.dataSource.data.length).toBe(2);
				});

				it('should unselect the file', () => {
					expect(component.selection.isSelected(files[0])).toBe(false);
				});

				it('should not unselect the other file', () => {
					expect(component.selection.isSelected(files[1])).toBe(true);
				});
			});

			describe('with erroneous back-end call', () => {
				let event: ObIUploadEvent;
				const errorMessage = new Error('Back-end error');
				const deletedFile = files[0];

				beforeEach(done => {
					component.deleteUrl = 'url';
					jest.spyOn(window, 'confirm').mockReturnValue(true);
					jest.spyOn(uploadService, 'delete').mockReturnValue(throwError(() => errorMessage));
					component.uploadEvent.subscribe(evt => {
						event = evt;
						done();
					});
					component.delete([deletedFile]);
				});

				it('should emit an ERRORED event', () => {
					expect(event.type).toBe(ObEUploadEventType.ERRORED);
				});

				it('should emit an empty array', () => {
					expect(event.files).toEqual([deletedFile.name]);
				});

				it('should emit the thrown error', () => {
					expect(event.error).toBe(errorMessage);
				});
			});
		});
	});
});
