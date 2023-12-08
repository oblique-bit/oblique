import {Injectable} from '@angular/core';
import {ObNotificationService} from '../../notification/notification.service';
import {ObEMimeTypes, ObEWildCardMimeTypes, ObIFileValidation, ObIFileValidationOptions} from '../file-upload.model';
import {ObAcceptAllPipe} from './accept-all.pipe';

@Injectable()
export class ObValidationService {
	private readonly areAllTypesAllowed = new ObAcceptAllPipe().transform;

	constructor(private readonly notification: ObNotificationService) {}

	public filterInvalidFiles(fileOptions: ObIFileValidationOptions): File[] {
		if (!fileOptions.accept) fileOptions.accept = ['*'];
		const dispatchedFiles: ObIFileValidation = this.dispatchFiles(fileOptions);

		if (fileOptions.multiple)
			this.notifyErrors('i18n.oblique.file-upload.error.overflow', {
				ignoredFiles: dispatchedFiles.overflowing,
				maxAmount: fileOptions.maxAmount
			});
		else this.notifyErrors('i18n.oblique.file-upload.error.single', {ignoredFiles: dispatchedFiles.overflowing});

		this.notifyErrors('i18n.oblique.file-upload.error.type', {
			ignoredFiles: dispatchedFiles.invalid,
			supportedTypes: fileOptions.accept.join(', ')
		});
		this.notifyErrors('i18n.oblique.file-upload.error.size', {ignoredFiles: dispatchedFiles.tooLarge, maxSize: fileOptions.maxSize});

		return dispatchedFiles.valid;
	}

	private dispatchFiles(fileOptions: ObIFileValidationOptions): ObIFileValidation {
		return fileOptions.files.reduce(
			(result, file, index) => {
				const size = file.size / 1024 / 1024;
				if ((index > 0 && !fileOptions.multiple) || (fileOptions.maxAmount > 0 && fileOptions.files.length > fileOptions.maxAmount)) {
					result.overflowing.push(file.name);
				} else if (!this.isFileTypeValid(file.name.toLowerCase(), fileOptions.accept)) {
					result.invalid.push(file.name);
				} else if (size > fileOptions.maxSize) {
					result.tooLarge.push(`${file.name} (${size.toFixed(2)} MB)`);
				} else {
					result.valid.push(file);
				}
				return result;
			},
			{valid: [], overflowing: [], invalid: [], tooLarge: []}
		);
	}

	private notifyErrors(message: string, parameters: {ignoredFiles: string[]; [key: string]: any}): void {
		if (parameters.ignoredFiles.length) {
			const params = {
				...parameters,
				ignoredFiles: parameters.ignoredFiles.join(', ')
			};
			this.notification.error({message, messageParams: params, title: 'i18n.oblique.file-upload.error.title'});
		}
	}

	private isFileTypeValid(filename: string, accept: string[]): boolean {
		return this.areAllTypesAllowed(accept) || this.hasValidMimeType(filename, accept) || this.hasValidExtension(filename, accept);
	}

	private hasValidMimeType(filename: string, accept: string[]): boolean {
		return accept.filter(type => type.includes('/')).some(type => this.isMimeTypeValid(filename, type.trim()));
	}

	private hasValidExtension(filename: string, accept: string[]): boolean {
		return accept.filter(type => !type.includes('/')).some(type => this.isExtensionValid(filename, type.trim()));
	}

	private isMimeTypeValid(filename: string, allowedFileType: string): boolean {
		const fileExtension = filename.split('.')[1];
		return allowedFileType.endsWith('*')
			? ObEWildCardMimeTypes[allowedFileType]?.includes(fileExtension)
			: ObEMimeTypes[allowedFileType]?.includes(fileExtension);
	}

	private isExtensionValid(filename: string, allowedFileType: string): boolean {
		return allowedFileType === `.${filename.split('.').pop()}`;
	}
}
