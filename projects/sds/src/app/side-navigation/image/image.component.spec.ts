import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IdPipe} from '../../shared/id/id.pipe';
import {ImageComponent} from './image.component';
import {UnitTestHelpers} from '../../../test-helpers/unit-test-helpers/unit-test-helpers';

interface ImageInputsOptional {
	alt?: string;
	maxHeight?: string;
	maxWidth?: string;
	idPrefix?: string;
	src?: string;
}

class ImageInputs {
	alt = '';
	maxHeight = '';
	maxWidth = '';
	idPrefix = '';
	src = '';
	constructor(imageInputsOptional?: ImageInputsOptional) {
		this.alt = imageInputsOptional?.alt ?? '';
		this.maxHeight = imageInputsOptional?.maxHeight ?? '';
		this.maxWidth = imageInputsOptional?.maxWidth ?? '';
		this.idPrefix = imageInputsOptional?.idPrefix ?? '';
		this.src = imageInputsOptional?.src ?? '';
	}
}

describe(`${ImageComponent.name}`, () => {
	let component: ImageComponent;
	let fixture: ComponentFixture<ImageComponent>;
	const idPipe = new IdPipe();
	const imgId = 'img';

	const imageBeforeEach = async (imageInputsOptional?: ImageInputsOptional): Promise<any> => {
		const {alt, maxHeight, maxWidth, idPrefix, src} = new ImageInputs(imageInputsOptional);
		await TestBed.configureTestingModule({
			declarations: [IdPipe, ImageComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ImageComponent);
		component = fixture.componentInstance;
		component.alt = alt;
		component.maxHeight = maxHeight;
		component.maxWidth = maxWidth;
		component.idPrefix = idPrefix;
		component.src = src;
		fixture.autoDetectChanges();
		return fixture.whenStable();
	};

	afterEach(() => {
		fixture?.destroy();
	});

	describe('all properties truthy', () => {
		beforeEach(async () => {
			await imageBeforeEach({
				alt: 'alternate text',
				maxHeight: '500px',
				maxWidth: 'none',
				idPrefix: 'content',
				src: 'http://www.image-src.com'
			});
		});

		it('should display image with attributes set correctly', () => {
			expect(
				UnitTestHelpers.getDebugElementById<ImageComponent>(fixture, idPipe.transform(component.idPrefix, [component.componentId, imgId]))
					.attributes
			).toEqual(
				expect.objectContaining({
					src: 'http://www.image-src.com',
					style: 'max-width: none; max-height: 500px;'
				})
			);
		});
	});

	describe('falsy alt & src', () => {
		beforeEach(async () => {
			await imageBeforeEach({
				alt: undefined,
				maxHeight: '500px',
				maxWidth: 'none',
				idPrefix: 'content',
				src: undefined
			});
		});

		it('should display image even when alt & src are both falsy', () => {
			expect(
				UnitTestHelpers.getDebugElementById<ImageComponent>(fixture, idPipe.transform(component.idPrefix, [component.componentId, imgId]))
			).toBeTruthy();
		});
	});

	describe('falsy alt', () => {
		beforeEach(async () => {
			await imageBeforeEach({
				alt: undefined,
				maxHeight: '500px',
				maxWidth: 'none',
				idPrefix: 'content',
				src: 'http://www.image-src.com'
			});
		});

		it('should display image when just alt is falsy', () => {
			expect(
				UnitTestHelpers.getDebugElementById<ImageComponent>(fixture, idPipe.transform(component.idPrefix, [component.componentId, imgId]))
			).toBeTruthy();
		});
	});

	describe('falsy src', () => {
		beforeEach(async () => {
			await imageBeforeEach({
				alt: 'alternate text',
				maxHeight: '500px',
				maxWidth: 'none',
				idPrefix: 'content',
				src: undefined
			});
		});

		it('should display image when just src is falsy', () => {
			expect(
				UnitTestHelpers.getDebugElementById<ImageComponent>(fixture, idPipe.transform(component.idPrefix, [component.componentId, imgId]))
			).toBeTruthy();
		});
	});
});
