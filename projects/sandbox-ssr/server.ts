import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine, type CommonEngineRenderOptions} from '@angular/ssr/node';
import express, {type Express, type Request} from 'express';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import bootstrap from './src/main.server';
const defaultPort = 3004;

export function run(): void {
	// because it conflicts with noPropertyAccessFromIndexSignature
	const port = process.env['PORT'] ?? defaultPort;
	buildServer().listen(port, () => {
		console.info(`Node Express server listening on http://localhost:${port}`);
	});
}

// The buildServer function is exported so that it can be used by serverless Functions.
export function buildServer(): Express {
	const serverDistFolder = dirname(fileURLToPath(import.meta.url));
	const browserDistFolder = resolve(serverDistFolder, '../browser');
	const indexHtml = join(serverDistFolder, 'index.server.html');
	const server = express();
	server.set('view engine', 'html');
	addStaticRoute(server, browserDistFolder); // eslint-disable-line @typescript-eslint/strict-void-return
	addAngularRoute(server, indexHtml, browserDistFolder); // eslint-disable-line @typescript-eslint/strict-void-return

	return server;
}

function addStaticRoute(server: Express, browserDistFolder: string): void {
	// eslint-disable-next-line @typescript-eslint/strict-void-return
	server.get('*.*', express.static(browserDistFolder, {maxAge: '1y'}));
}

function addAngularRoute(server: Express, indexHtml: string, browserDistFolder: string): void {
	const commonEngine = new CommonEngine();

	server.get('*', (req, res, next) => {
		commonEngine
			.render(buildRenderOptions(req, indexHtml, browserDistFolder))
			.then(html => res.send(html))
			.catch((err: unknown) => next(err));
	});
}

function buildRenderOptions(request: Request, indexHtml: string, browserDistFolder: string): CommonEngineRenderOptions {
	const {protocol, originalUrl, baseUrl, headers} = request;

	return {
		bootstrap,
		documentFilePath: indexHtml,
		url: `${protocol}://${headers.host}${originalUrl}`,
		publicPath: browserDistFolder,
		providers: [{provide: APP_BASE_HREF, useValue: baseUrl}],
	};
}

run();
