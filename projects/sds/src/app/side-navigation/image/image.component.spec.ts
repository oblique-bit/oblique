import {ComponentFixture, TestBed} from '@angular/core/testing';
import {IdPipe} from '../../shared/id/id.pipe';
import {ImageComponent} from './image.component';
import {UnitTestHelpers} from '../../../test-helpers/unit-test-helpers/unit-test-helpers';

interface ImageInputsOptional {
	alt?: string;
	height: number;
	width: number;
	idPrefix?: string;
	src: string;
}

class ImageInputs {
	alt = '';
	height = 0;
	width = 0;
	idPrefix = '';
	src = '';
	constructor(imageInputsOptional?: ImageInputsOptional) {
		this.alt = imageInputsOptional?.alt ?? '';
		this.height = imageInputsOptional?.height ?? 0;
		this.width = imageInputsOptional?.width ?? 0;
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
		const {alt, height, width, idPrefix, src} = new ImageInputs(imageInputsOptional);
		await TestBed.configureTestingModule({
			imports: [IdPipe, ImageComponent]
		}).compileComponents();

		fixture = TestBed.createComponent(ImageComponent);
		component = fixture.componentInstance;
		component.alt = alt;
		component.height = height;
		component.width = width;
		component.idPrefix = idPrefix;
		component.ngSrc = src;
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
				height: 500,
				width: 500,
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
					src: 'http://www.image-src.com'
				})
			);
		});
	});

	describe('falsy alt', () => {
		beforeEach(async () => {
			await imageBeforeEach({
				alt: undefined,
				height: 500,
				width: 500,
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
});
