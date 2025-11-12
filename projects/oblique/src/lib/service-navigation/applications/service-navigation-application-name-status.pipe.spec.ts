import {TestBed} from '@angular/core/testing';
import {ObIServiceNavigationApplication, ObServiceNavigationApplicationStatus} from '../service-navigation.model';
import {ObServiceNavigationApplicationNameStatusPipe} from './service-navigation-application-name-status.pipe';
import {TranslateModule} from '@ngx-translate/core';

describe('ObServiceNavigationApplicationNameStatusPipe', () => {
	let pipe: ObServiceNavigationApplicationNameStatusPipe;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [TranslateModule.forRoot()],
			providers: [ObServiceNavigationApplicationNameStatusPipe],
		});

		pipe = TestBed.inject(ObServiceNavigationApplicationNameStatusPipe);
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	const applicationName = 'Test Application';
	describe('transform', () => {
		it.each([
			{
				input: {name: applicationName, status: 'online'} as ObIServiceNavigationApplication,
				output: applicationName,
			},
			{
				input: {name: applicationName, status: 'offline'} as ObIServiceNavigationApplication,
				output: `${applicationName} - i18n.oblique.service-navigation.applications.status.offline`,
			},
			{
				input: {name: applicationName, status: 'inaccessible'} as ObIServiceNavigationApplication,
				output: `${applicationName} - i18n.oblique.service-navigation.applications.status.inaccessible`,
			},
		])('should return "$output" with "$input" as input', ({input, output}) => {
			expect(pipe.transform(input)).toBe(output);
		});

		it('should trow an error with an illegal input', () => {
			expect(() =>
				pipe.transform({
					name: applicationName,
					status: 'random' as ObServiceNavigationApplicationStatus,
				} as ObIServiceNavigationApplication)
			).toThrow('Illegal status: random');
		});
	});
});
