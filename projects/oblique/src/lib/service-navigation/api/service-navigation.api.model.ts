import {ObLoginState, ObServiceNavigationApplicationStatus} from '../service-navigation.model';

export interface ObIServiceNavigationResponse<T> {
	statusCode: number;
	success: boolean;
	data: T;
}

export interface ObIServiceNavigationConfig {
	allServices: ObIPamsRequestUrl;
	inboxMail: ObIPamsRequestUrl;
	login: ObIPamsRequestUrl;
	logout: ObIPamsRequestUrl;
	polling: ObIPamsRequestUrl;
	pollingInterval: number;
	pollingNotificationsInterval: number;
	profile: ObIPamsRequestUrl;
	rights: ObIPamsRequestUrl;
	settings: ObIPamsRequestUrl;
}

interface ObIPamsRequestUrl {
	url: string;
	params: string;
	method: 'GET' | 'POST' | '';
}

export interface ObIServiceNavigationState {
	favoriteApps: ObIServiceNavigationRawApplication[];
	lastUsedApps: ObIServiceNavigationRawApplication[];
	loginState: ObLoginState;
	messageCount: number;
	profile: ObIProfileState;
}

export interface ObIServiceNavigationRawApplication {
	appID: number;
	childAppID: number;
	accessOK: boolean;
	online: boolean;
}

export interface ObIServiceNavigationApplicationInfo {
	applicationID: number;
	image: string;
	lastModificationDate: string;
	name: ObIServiceNavigationTranslation;
	url: string;
}

export interface ObIServiceNavigationApplicationParsedInfo {
	image: string;
	name: ObIServiceNavigationTranslation;
	url: string;
	status: ObServiceNavigationApplicationStatus;
}

export interface ObIServiceNavigationTranslation {
	de: string;
	en: string;
	fr: string;
	it: string;
}

export interface ObIServiceNavigationApplicationIdentifier {
	applicationID: number;
	childApplicationID: number;
}

export interface ObIProfileState {
	avatarID: number;
	fullname: string;
}
