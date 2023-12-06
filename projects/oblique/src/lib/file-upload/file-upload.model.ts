import {HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {Subscription} from 'rxjs';

export interface ObIFileList {
	fileCount: number;
	files: ObIFile[];
}

export interface ObIFile {
	index: number;
	name?: string;
	completed: boolean;
	progress: number;
	hasError: boolean;
	binary: File | File[];
	subscription: Subscription;
}

export interface ObIFileDescription {
	name: string;

	[key: string]: any;
}

export interface ObIUploadEvent {
	type: ObEUploadEventType;
	files: File[] | string[];
	error?: HttpErrorResponse;
}

export enum ObEUploadEventType {
	CHOSEN = 'chosen',
	UPLOADED = 'uploaded',
	SELECTED = 'selected',
	DELETED = 'deleted',
	CANCELED = 'canceled',
	ERRORED = 'errored'
}

export interface ObIFileValidationOptions {
	files: File[];
	accept: string[];
	maxSize: number;
	maxAmount: number;
	multiple: boolean;
}

export interface ObIFileValidation {
	valid: File[];
	overflowing: string[];
	invalid: string[];
	tooLarge: string[];
}

export type ObTEventType = HttpEventType.UploadProgress | HttpEventType.Response | HttpEventType.User;

export type ObTSelectionStatus = 'none' | 'some' | 'all';

export enum ObEWildCardMimeTypes {
	'application/*' = 'bin|exe|oda|pdf|ai|ps|eps|rtf|mif|fm|gtar|shar|tar|hqx',
	'audio/*' = 'au|snd|aif|aiff|aifc|wav|',
	'image/*' = 'jpeg|jpg|jpe|tiff|tif|rgb|xbm|xpm|xwd|png|gif|bmp|svg|webp',
	'text/*' = 'htm|html|txt|rtx|tsv|etx|',
	'video/*' = 'mpeg|mpg|mpe|qt|mov|avi|movie|viv|',
	'magnus-internal/*' = 'cgi|exe|bat|jsp|map|shtml',
	'application/msword/*' = 'doc|dot|dotm',
	'application/msexcel/*' = 'xls|xla'
}

export enum ObEMimeTypes {
	'application/octet-stream' = 'bin|exe',
	'application/oda' = 'oda',
	'application/pdf' = 'pdf',
	'application/postscript' = 'ai|ps|eps',
	'application/rtf' = 'rtf',
	'application/x-mif' = 'rtf|mif|fm',
	'application/x-gtar' = 'gtar',
	'application/x-shar' = 'shar',
	'application/x-tar' = 'tar',
	'application/mac-binhex40' = 'hqx',
	'audio/basic' = 'au|snd',
	'audio/x-aiff' = 'aif|aiff|aifc',
	'audio/x-wav' = 'wav',
	'image/gif' = 'gif',
	'image/ief' = 'gif|ief',
	'image/jpeg' = 'jpeg|jpg|jpe',
	'image/tiff' = 'tiff|tif',
	'image/x-rgb' = 'rgb',
	'image/x-xbitmap' = 'xbm',
	'image/x-xpixmap' = 'xpm',
	'image/x-xwindowdump' = 'xwd',
	'text/html' = 'htm|html',
	'text/plain' = 'txt',
	'text/richtext' = 'rtx',
	'application/mspowerpoint' = 'ppt|ppz|pps|pot|',
	'application/msword' = 'doc|dot',
	'application/msexcel' = 'xls|xla',
	'vnd.openxmlformats-officedocument.wordprocessingml.document' = 'docx|dotm',
	'vnd.openxmlformats-officedocument.spreadsheetml.sheet' = 'xlsx|xlsxm',
	'application/json' = 'json',
	'text/tab-separated-values' = 'tsv',
	'text/x-setext' = 'etx',
	'video/mpeg' = 'mpeg|mpg|mpe',
	'video/quicktime' = 'qt|mov',
	'video/x-msvideo' = 'avi',
	'magnus-internal/imagemap' = 'map',
	'magnus-internal/parsed-html' = 'shtml',
	'magnus-internal/cgi' = 'cgi',
	'magnus-internal/jsp' = 'exe|bat'
}
