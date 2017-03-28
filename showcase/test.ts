// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

//TODO: Polyfill for PhantomJS, remove if https://github.com/ariya/phantomjs/issues/11289 is fixed
(function (window) {
    try {
        new CustomEvent('test');
    } catch (e) {
        return false; // No need to polyfill
    }

    // Polyfills DOM4 CustomEvent
    function MouseEvent(eventType, params) {
        params = params || {
                bubbles: false,
                cancelable: false,
                ctrlKey: false,
                altKey: false,
                shiftKey: false
        };
        var mouseEvent = document.createEvent('MouseEvent');
        mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, params.ctrlKey, params.altKey, params.shiftKey, false, 0, null);

        return mouseEvent;
    }

    MouseEvent.prototype = Event.prototype;

    window['MouseEvent'] = MouseEvent;
})(window);

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {/**/};

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);
// Then we find all the tests.
//TODO: Refactor this
const srcContext = require.context('../src', true, /\.spec\.ts$/);

// And load the modules.
srcContext.keys().map(srcContext);

const showcaseContext = require.context('./', true, /\.spec\.ts$/);
showcaseContext.keys().map(showcaseContext);

// Finally, start Karma to run the tests.
__karma__.start();
