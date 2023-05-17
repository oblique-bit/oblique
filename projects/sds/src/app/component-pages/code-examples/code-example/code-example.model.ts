export class CodeExample {
	html = '';
	scss = '';
	ts = '';

	constructor(codeExample?: {html?: string; scss?: string; ts?: string}) {
		this.html = codeExample?.html ?? '';
		this.scss = codeExample?.scss ?? '';
		this.ts = codeExample?.ts ?? '';
	}
}
