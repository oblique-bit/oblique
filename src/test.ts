// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import {TestBed} from '@angular/core/testing';
import {
	BrowserDynamicTestingModule,
	platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NavigableDirective} from './lib/ng/navigable/navigable.directive';

// TODO: Polyfill for PhantomJS, remove when https://github.com/ariya/phantomjs/issues/11289
(function (window) {
	try {
		new CustomEvent('test'); // tslint:disable-line
	} catch (e) {
		return false; // No need to polyfill
	}

	// Polyfills DOM4 CustomEvent
	function MouseEvent(eventType, params) {
		params = Object.assign({
			bubbles: true,
			cancelable: false,
			ctrlKey: false,
			altKey: false,
			shiftKey: false
		}, params);
		const mouseEvent = document.createEvent('MouseEvent');
		mouseEvent.initMouseEvent(
			eventType,
			params.bubbles,
			params.cancelable,
			window,
			0, 0, 0, 0, 0,
			params.ctrlKey,
			params.altKey,
			params.shiftKey,
			false, 0, null
		);

		return mouseEvent;
	}

	MouseEvent.prototype = Event.prototype;
	window['MouseEvent'] = MouseEvent;
})(window);

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {/**/
};

// First, initialize the Angular testing environment.
TestBed.initTestEnvironment(
	[
		BrowserDynamicTestingModule,
		NoopAnimationsModule
	],
	platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);

// And load the modules.
context.keys().map(context);

// Finally, start Karma to run the tests.
__karma__.start();
