import {APP_BASE_HREF} from '@angular/common';
import {CommonEngine, CommonEngineRenderOptions} from '@angular/ssr';
import express, {Express, Request} from 'express';
import {fileURLToPath} from 'node:url';
import {dirname, join, resolve} from 'node:path';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export class App {
	private static readonly defaultPort = 3004;

	static run(): void {
		// because it conflicts with noPropertyAccessFromIndexSignature
		const port = process.env['PORT'] ?? App.defaultPort;
		App.buildServer().listen(port, () => {
			console.info(`Node Express server listening on http://localhost:${port}`);
		});
	}

	static buildServer(): Express {
		const serverDistFolder = dirname(fileURLToPath(import.meta.url));
		const browserDistFolder = resolve(serverDistFolder, '../browser');
		const indexHtml = join(serverDistFolder, 'index.server.html');
		const server = express();
		server.set('view engine', 'html');
		App.addStaticRoute(server, browserDistFolder);
		App.addAngularRoute(server, indexHtml, browserDistFolder);

		return server;
	}

	private static addStaticRoute(server: Express, browserDistFolder: string): void {
		server.get('*.*', express.static(browserDistFolder, {maxAge: '1y'}));
	}

	private static addAngularRoute(server: Express, indexHtml: string, browserDistFolder: string): void {
		const commonEngine = new CommonEngine();

		server.get('*', (req, res, next) => {
			commonEngine
				.render(App.buildRenderOptions(req, indexHtml, browserDistFolder))
				.then(html => res.send(html))
				.catch(err => next(err));
		});
	}

	private static buildRenderOptions(request: Request, indexHtml: string, browserDistFolder: string): CommonEngineRenderOptions {
		const {protocol, originalUrl, baseUrl, headers} = request;

		return {
			bootstrap,
			documentFilePath: indexHtml,
			url: `${protocol}://${headers.host}${originalUrl}`,
			publicPath: browserDistFolder,
			providers: [{provide: APP_BASE_HREF, useValue: baseUrl}]
		};
	}
}

App.run();
