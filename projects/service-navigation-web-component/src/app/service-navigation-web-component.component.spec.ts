import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObServiceNavigationWebComponentComponent} from './service-navigation-web-component.component';
import {TranslateModule} from '@ngx-translate/core';
import {SimpleChange, SimpleChanges} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {By} from '@angular/platform-browser';
import {ObServiceNavigationComponent, multiTranslateLoader} from '@oblique/oblique';
import {appVersion} from './version';

function defaultChangesValues(): SimpleChanges {
	return {environment: new SimpleChange(undefined, 'DEV', undefined)};
}

describe(ObServiceNavigationWebComponentComponent.name, () => {
	let fixture: ComponentFixture<ObServiceNavigationWebComponentComponent>;
	let component: ObServiceNavigationWebComponentComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ObServiceNavigationWebComponentComponent, TranslateModule.forRoot(multiTranslateLoader())],
			providers: [{provide: HttpClient, useValue: {}}]
		}).compileComponents();

		fixture = TestBed.createComponent(ObServiceNavigationWebComponentComponent);
		component = fixture.componentInstance;
	});

	it('should have an ob-version attribute whose value is the current Oblique version number', () => {
		expect(fixture.debugElement.nativeElement.getAttribute('ob-version')).toBe(appVersion);
	});

	describe('environment', () => {
		describe('invalid', () => {
			it("should fail when we give a value that doesn't exist in ObEPamsEnvironment", () => {
				component.environment = 'invalid' as 'PROD';
				component.languageList = 'en';
				const func = (): void => component.ngOnInit();
				expect(func).toThrow('An environment has to be provided');
			});
		});

		describe('parsing', () => {
			it.each([
				{environmentName: 'DEV', environmentCode: '-d'},
				{environmentName: 'TEST', environmentCode: '-t'},
				{environmentName: 'REF', environmentCode: '-r'},
				{environmentName: 'ABN', environmentCode: '-a'},
				{environmentName: 'PROD', environmentCode: ''}
			])(
				'should return $environmentCode according to the key $environmentName from the enum ObEPamsEnvironment',
				({environmentName, environmentCode}) => {
					component.environment = environmentName as 'PROD';
					component.languageList = 'en';
					component.ngOnInit();
					fixture.detectChanges();
					expect(component.environmentParsed).toBe(environmentCode);
				}
			);
		});

		it.each(['DEV', 'TEST', 'REF', 'ABN', 'PROD'])('should embed service-navigation', environment => {
			component.environment = environment as 'DEV' | 'TEST' | 'REF' | 'ABN' | 'PROD';
			component.languageList = 'en';
			fixture.detectChanges();
			const serviceNavigation = fixture.debugElement.query(By.directive(ObServiceNavigationComponent));
			expect(serviceNavigation).toBeTruthy();
		});
	});

	describe('languageList', () => {
		it("should throw an error when it's empty", () => {
			component.environment = 'DEV';
			const func = (): void => component.ngOnInit();
			expect(func).toThrow(
				'"language-list" expects a comma separated list of ISO 639-1 languages (e.g. en,fr,de) but received "undefined"'
			);
		});

		it("should throw an error when it's empty", () => {
			component.environment = 'DEV';
			component.languageList = 'en, fr';
			const func = (): void => component.ngOnInit();
			expect(func).toThrow('"language-list" expects a comma separated list of ISO 639-1 languages (e.g. en,fr,de) but received "en, fr"');
		});
	});

	describe('contact parsing', () => {
		describe('stringify object', () => {
			it('should return the object as a real object', () => {
				const contact = {tel: '+41 99 999 99 99'};
				component.ngOnChanges({
					...defaultChangesValues(),
					infoContact: new SimpleChange(null, JSON.stringify(contact), true)
				});
				expect(component.infoContactParsed).toEqual(contact);
			});
		});
	});

	describe('profile links parsing', () => {
		describe('undefined', () => {
			it('should return empty array []', () => {
				component.ngOnChanges({
					...defaultChangesValues(),
					profileLinks: new SimpleChange(null, undefined, true)
				});
				expect(component.profileLinksParsed).toEqual([]);
			});
		});

		describe('stringify object', () => {
			it('should return the object as a real object', () => {
				const links = [
					{fr: 'Lien de profile 1', en: 'Profile link 1', links: {fr: 'https://fr.profile.com', en: 'https://en.profile.com'}},
					{fr: 'Lien de profile 2', en: 'Profile link 2', link: 'https://profile.com'}
				];
				const expectedParsedLinks = [
					{
						label: 'profile-link.0.label',
						url: 'profile-link.0.url'
					},
					{
						label: 'profile-link.1.label',
						url: 'profile-link.1.url'
					}
				];
				component.ngOnChanges({
					...defaultChangesValues(),
					profileLinks: new SimpleChange(null, JSON.stringify(links), true)
				});
				expect(component.profileLinksParsed).toEqual(expectedParsedLinks);
			});
		});
	});

	describe('links parsing', () => {
		describe('undefined', () => {
			it('should return empty array []', () => {
				component.ngOnChanges({
					...defaultChangesValues(),
					infoLinks: new SimpleChange(null, undefined, true)
				});
				expect(component.infoLinksParsed).toEqual([]);
			});
		});

		describe('stringify object', () => {
			it('should return the object as a real object', () => {
				const links = [{fr: 'Lien de contact', en: 'Contact link', links: {fr: 'https://fr.contact.com', en: 'https://en.contact.com'}}];

				const expectedParsedLinks = [
					{
						label: 'info-link.0.label',
						url: 'info-link.0.url'
					}
				];
				component.ngOnChanges({
					...defaultChangesValues(),
					infoLinks: new SimpleChange(null, JSON.stringify(links), true)
				});
				expect(component.infoLinksParsed).toEqual(expectedParsedLinks);
			});
		});
	});

	describe('custom buttons ', () => {
		describe('parse', () => {
			describe('undefined', () => {
				it('should return empty array []', () => {
					component.ngOnChanges({...defaultChangesValues(), customButtons: new SimpleChange(null, undefined, true)});
					expect(component.customButtonsParsed).toEqual([]);
				});
			});

			describe('stringify object', () => {
				let buttons: HTMLElement[];
				beforeEach(() => {
					const customButtonsObject = [{obliqueIconName: 'smile', badge: '1'}, {obliqueIconName: 'calendar'}];
					component.environment = 'DEV';
					component.languageList = 'en';
					component.ngOnChanges({
						...defaultChangesValues(),
						customButtons: new SimpleChange(null, JSON.stringify(customButtonsObject), true)
					});
					fixture.detectChanges();
					buttons = fixture.nativeElement.querySelectorAll('.ob-service-navigation-custom-control > button') as HTMLElement[];
				});

				it('should make two buttons visible in the dom', () => {
					expect(buttons).toHaveLength(2);
				});

				describe('first button', () => {
					it('should have smile icon', () => {
						expect(buttons[0].innerHTML).toContain('smile');
					});

					it('should have badge set to 1', () => {
						const badge = buttons[0].querySelector('.mat-badge-content');
						expect(badge.innerHTML).toContain('1');
					});

					describe('clicked event', () => {
						it('should emit smile with the buttonClickedEmitter', () => {
							let clickEvent: string;
							component.buttonClickedEmitter.subscribe(event => {
								clickEvent = event;
							});
							buttons[0].click();
							expect(clickEvent).toBe('smile');
						});
					});
				});

				describe('second button', () => {
					it('should have calendar icon', () => {
						expect(buttons[1].innerHTML).toContain('calendar');
					});

					it('should have badge set to 1', () => {
						const badge = buttons[1].querySelector('.mat-badge-content');
						expect(badge).toBeNull();
					});

					describe('clicked event', () => {
						it('should emit smile with the buttonClickedEmitter', () => {
							let clickEvent: string;
							component.buttonClickedEmitter.subscribe(event => {
								clickEvent = event;
							});
							buttons[1].click();
							expect(clickEvent).toBe('calendar');
						});
					});
				});
			});
		});
	});
});
