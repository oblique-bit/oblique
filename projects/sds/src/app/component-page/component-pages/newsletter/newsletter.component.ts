import {CommonModule} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ObButtonModule, ObErrorMessagesModule, ObFormFieldModule, ObNotificationModule, ObNotificationService} from '@oblique/oblique';
import {mergeMap, tap} from 'rxjs';
import {NewsletterService} from './newsletter.service';

@Component({
	selector: 'app-newsletter',
	templateUrl: './newsletter.component.html',
	styleUrls: ['./newsletter.component.scss'],
	imports: [
		CommonModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		ObFormFieldModule,
		ObErrorMessagesModule,
		ObButtonModule,
		ObNotificationModule
	]
})
export class NewsletterComponent implements OnInit {
	formGroup: FormGroup<{email: FormControl<string>}>;
	private readonly formBuilder = inject(FormBuilder);
	private readonly newsletterService = inject(NewsletterService);
	private readonly obNotificationService = inject(ObNotificationService);

	ngOnInit(): void {
		this.formGroup = this.formBuilder.group({
			email: ['', [Validators.email, Validators.required]]
		});
	}

	handleRequest(unsubscribe: boolean): void {
		let email: string = this.formGroup.get('email').value;
		let successMessage = 'You have successfully subscribed to our newsletter!';
		if (unsubscribe) {
			email += 'REMOVE';
			successMessage = 'You have successfully unsubscribed to our newsletter!';
		}
		this.sendRequest(email, successMessage);
	}

	sendRequest(email: string, successMessage: string): void {
		this.newsletterService
			.getNewsletterToken()
			.pipe(
				tap(result => (this.newsletterService.token = result.data.token)),
				mergeMap(() => this.newsletterService.addNewsletterEntry(email))
			)
			.subscribe({
				complete: () => this.obNotificationService.success({title: 'Success', message: successMessage}),
				error: (error: HttpErrorResponse) =>
					this.obNotificationService.error({title: 'Error', message: `Something went wrong!. Error: ${error?.message}`})
			});
	}
}
