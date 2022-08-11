export interface ObIServiceNavigationResponse {
	statusCode: number;
	success: boolean;
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
