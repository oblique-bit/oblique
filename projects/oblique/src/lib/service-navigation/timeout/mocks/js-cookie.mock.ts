const fakeCookies = {};
function setCookie(name: string, value: string, options?: Cookies.CookieAttributes): string | undefined {
	fakeCookies[name] = {value, options};
	return undefined;
}

function getCookieDetails(name: string): {value: string; options: Cookies.CookieAttributes} | undefined {
	return fakeCookies[name];
}

function removeCookie(name: string): void {
	delete fakeCookies[name];
}

export const CookiesMock = {
	getDetails: getCookieDetails,
	set: setCookie,
	remove: removeCookie
};
