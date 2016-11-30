(() => {
	//<editor-fold desc="Dependencies">
	let del = require('del'),
		merge = require('merge2'),
		spawn = require('cross-spawn'),

		// Gulp & plugins:
		gulp = require('gulp'),
		gutil = require('gulp-util'),
		concat = require('gulp-concat'),
		connect = require('gulp-connect'),
		proxy = require('http-proxy-middleware'),
		cssnano = require('gulp-cssnano'),
		debug = require('gulp-debug'),
		declare = require('gulp-declare'),
		file = require('gulp-file'),
		htmlmin = require('gulp-htmlmin'),
		insert = require('gulp-insert'),
		less = require('gulp-less'),
		ngAnnotate = require('gulp-ng-annotate'),
		ngHtml2js = require('gulp-ng-html2js'),
		nodemon = require('gulp-nodemon'),
		open = require('gulp-open'),
		rename = require('gulp-rename'),
		replace = require('gulp-replace'),
		rev = require('gulp-rev'),
		source = require('vinyl-source-stream'),
		sourcemaps = require('gulp-sourcemaps'),
		ts = require('gulp-typescript'),
		tslint = require("gulp-tslint"),
		uglify = require('gulp-uglify'),
		usemin = require('gulp-usemin'),
		watch = require('gulp-watch'),
		webpack = require('webpack'),

		// Project-specific:
		pkg = require('./package.json'),
		project = require('./project.conf.ts'),
		paths = {
			src: 'src/',
			modules: 'node_modules/',
			typings: 'typings/',
			min: project.build.target + 'min/',
			staging: project.build.target + '.tmp/',
			publish: project.build.target + '.publish/',

			// Showcase paths:
			showcase: 'showcase/ui/',
			app: 'showcase/ui/app/',
			states: 'showcase/ui/app/states/',
			less: 'showcase/ui/less/',
			pages: 'showcase/ui/pages/',
			partials: 'showcase/ui/partials/',
			server: 'showcase/server/',

			// Target:
			target: {
				ui: project.build.target + 'ui/',
				vendor: project.build.target + 'ui/vendor/',
				server: project.build.target + 'server/',
			}
		},

		// ObliqueUI custom tasks:
		obliqueTasks = require('oblique-ui').tasks,
		obliqueHtml = obliqueTasks.html,
		obliqueModulePackage = obliqueTasks.modulePackage,

		// Test:
		karmaServer = require('karma').Server,

		production = false,

		// FIXME: remove when https://github.com/gulpjs/gulp/tree/4.0 is out!
		runSequence = require('run-sequence');
	//</editor-fold>

	//<editor-fold desc="Main tasks">
	gulp.task('default', ['run-dev']);

	//<editor-fold desc="Dev tasks">
	gulp.task('run-dev', () =>{
		return runSequence(
			'build-dev',
			'serve-dev'
		);
	});

	gulp.task('run-dev-showcase', () => {
		return runSequence(
			'build-dev',
			['serve-dev', 'showcase-serve']
		);
	});

	gulp.task('build-dev', (done) => {
		return runSequence(
			'build',
			'copy-vendor-dev',
			'test',
			done
		);
	});
	//</editor-fold>

	//<editor-fold desc="Prod tasks">
	gulp.task('run-prod', () => {
		return runSequence(
			'build-prod',
			'serve-prod'
		);
	});

	gulp.task('build-prod', (done) => {
		production = true;
		return runSequence(
			'build-dev',
			'optimize',
			'clean-prod',
			done
		);
	});

	gulp.task('clean-prod', () => {
		production = true;
		return del(
			[
				paths.staging,
				paths.target.ui + 'app/*',
				'!' + paths.target.ui + 'app/i18n',
				'!' + paths.target.ui + 'app/i18n/*.json'
			],
			{force: false}
		);
	});
	//</editor-fold>
	//</editor-fold>

	//<editor-fold desc="Clean">
	/*
	 * clean: deletes generated files and folders from output folder.
	 *
	 * Plugins:
	 *  - `del`: https://github.com/sindresorhus/del
	 */
	gulp.task('clean', () => {
		return del(
			[project.build.target + '/**'],
			{force: false}
		);
	});

	/*
	 * clean-min: deletes minified resources from output folder.
	 *
	 * Plugins:
	 *  - `del`: https://github.com/sindresorhus/del
	 */
	gulp.task('clean-min', () => {
		return del(
			paths.min,
			{force: false}
		);
	});
	//</editor-fold>

	//<editor-fold desc="Copy">
	/*
	 * copy: copies required resources to output folder.
	 */
	gulp.task('copy', [
		'copy-vendor-js',
		'copy-vendor-css',
		'copy-oblique-ui'
	]);

	/*
	 * copy-vendor-js: copies required vendor scripts to output folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('copy-vendor-js', () => {
		return gulp.src(
			project.resources.vendor.js,
			{cwd: paths.modules, base: paths.modules}
		).pipe(gulp.dest(paths.target.vendor));
	});

	/**
	 * copy-vendor-dev: copies required DEV vendor scripts to output folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('copy-vendor-dev', () => {
		return gulp.src(
			project.resources.vendor.dev,
			{cwd: paths.modules, base: paths.modules}
		).pipe(gulp.dest(paths.target.vendor));
	});

	/**
	 * copy-vendor-css: copies required vendor styles to output folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('copy-vendor-css', () => {
		return gulp.src(
			project.resources.vendor.css,
			{cwd: paths.modules, base: paths.modules}
		).pipe(gulp.dest(paths.target.vendor));
	});

	/**
	 * copy-oblique-ui: copies ObliqueUI distribution to output folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('copy-oblique-ui', () => {
		let path = paths.modules + 'oblique-ui/dist/';
		return gulp.src(
			['**/*'],
			{cwd: path, base: path}
		).pipe(gulp.dest(paths.target.vendor + 'oblique-ui/'));
	});

	/**
	 * copy-ts-publish: copies compiled ts into publish folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('copy-ts-publish', () => {
		let path = paths.staging + 'src/';
		return gulp.src(
			['**/*'],
			{cwd: path, base: path}
		).pipe(gulp.dest(paths.publish + ''));
	});
	//</editor-fold>

	//<editor-fold desc="Build">
	gulp.task('build', (done) => {
		return runSequence(
			'clean',
			'copy',
			'build-sources', 	// only ObliqueReactive (src/)
			'showcase',
			done
		);
	});

	/**
	 * build-sources: compiles TypeScript sources to output folder.
	 *
	 * Plugins:
	 * - `gulp-typescript`: https://github.com/ivogabe/gulp-typescript
	 * - `gulp-tslint`: https://github.com/panuhorsmalahti/gulp-tslint
	 * - `gulp-replace`: https://github.com/lazd/gulp-replace
	 */
	gulp.task('build-sources', (done) => {
		return runSequence(
			// 0. Lint sources:
			'build-tslint',

			// 1. Compile sources to staging folder:
			'build-sources-compile',

			// 2. Build the templates module
			'build-templates',

			// 3. Copy compiled files to the correct output folders:
			'build-sources-copy',

			done
		);
	});

	gulp.task('build-tslint', () => {
		return gulp.src([
			paths.src + '**.*.ts'
		]).pipe(tslint(<any>{
			formatter: "verbose"
		}))
			.pipe(tslint.report())
	});

	gulp.task('build-sources-compile', () => {
		let tsProject = ts.createProject('tsconfig.json');
		return gulp.src([
			paths.src + '**/*.ts',
			paths.typings + '**/*.d.ts'
		])
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.pipe(replace("__MODULE__", project.app.module))
			.pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.staging + paths.src));
	});

	gulp.task('showcase-build-sources-compile', () => {
		let tsProject = ts.createProject('tsconfig.showcase.json');
		return gulp.src([
			paths.showcase + '**/*.ts'
		])
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.pipe(replace("__MODULE__", project.app.module))
			.pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
			.pipe(sourcemaps.write())
			.pipe(gulp.dest(paths.staging + paths.showcase));
	});

	gulp.task('build-sources-copy', () => {
		return gulp.src(
			paths.staging + paths.src + '**/*.js',
			{base: paths.staging + paths.src}
		).pipe(gulp.dest(paths.target.vendor + 'oblique-reactive'));
	});

	/**
	 * build-templates: converts AngularJS templates to JavaScript and
	 * concatenates them in a single file.
	 *
	 * Plugins:
	 *  - `gulp-ng-html2js`: https://github.com/marklagendijk/gulp-ng-html2js
	 *  - `concat`: https://github.com/wearefractal/gulp-concat
	 */
	gulp.task('build-templates', () => {
		let moduleName = 'oblique-reactive' + '.app-templates'; // FIXME 1.3.0
		return gulp.src(paths.src + '**/*.tpl.html')
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(ngHtml2js({
				moduleName: moduleName,
				declareModule: false,
				prefix: ''
			}))
			.pipe(concat("oblique-reactive-templates.js"))
			.pipe(insert.prepend(
				"angular.module('" + moduleName + "', []);\n\n"
			))
			.pipe(gulp.dest(paths.staging + paths.src));
	});
	//</editor-fold>

	//<editor-fold desc="Optimize">
	/**
	 * optimize: minifies, uglifies and revisions generated resources for release packaging
	 *
	 * Plugins:
	 *  - `gulp-usemin`: https://github.com/zont/gulp-usemin
	 *  - `gulp-cssnano`: https://github.com/ben-eb/gulp-cssnano
	 *  - `gulp-uglify`: https://github.com/terinjokes/gulp-uglify
	 *  - `gulp-rev`: https://github.com/sindresorhus/gulp-rev
	 */
	gulp.task('optimize', ['bundle-showcase', 'clean-min'], () => {
		return gulp.src(paths.target.ui + 'index.html')
			.pipe(usemin({
				css: [cssnano(), rev()],
				jsvendors: [ngAnnotate(), uglify(), rev()],
				jsapp: [ngAnnotate(), uglify(), rev()]
			}))
			.pipe(gulp.dest(paths.target.ui));
	});
	//</editor-fold>

	//<editor-fold desc="Test">
	/**
	 * TODO: should this be runnable alone?
	 *
	 * test: launches Karma tests
	 *
	 * Plugins:
	 *  - `karma`: https://github.com/karma-runner/karma
	 */
	gulp.task('test', (done) => {
		new karmaServer({
			configFile: __dirname + '/karma.conf.js',
			logLevel: 'info',
			singleRun: true
		}, done).start();
	});
	//</editor-fold>

	//<editor-fold desc="Serve">
	/**
	 * serve: launches a local web server for serving resources and starts listening for file changes
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('serve-dev', [
		'serve-prod',
		'watch'
	]);

	gulp.task('serve-prod', [
		'serve-connect',
		'serve-open'
	]);

	/**
	 * serve-connect: launches a local web server for serving app resources
	 *
	 * Plugins:
	 *  - `connect`: https://github.com/avevlad/gulp-connect
	 */
	gulp.task('serve-connect', () => {
		return connect.server({
			port: 9000, // Port used to deploy the client
			host: 'localhost',
			root: paths.target.ui,
			livereload: true,
			middleware: (connect, opt) => {
				return [
					proxy('/' + project.app.api.path, {
						target: `http://localhost:${project.app.api.port}`,
						changeOrigin: true
					})
				]
			}
		});
	});

	/**
	 * serve-open: opens the default Internet browser
	 *
	 * Plugins:
	 *  - `open`: https://github.com/stevelacy/gulp-open
	 */
	gulp.task('serve-open', () => {
		return gulp.src(paths.target.ui + 'index.html')
			.pipe(open({uri: 'http://localhost:9000'}));
	});

	/**
	 * watch: starts listening for file changes and reloads running web server
	 *
	 * Plugins:
	 * - `watch`: https://github.com/floatdrop/gulp-watch
	 * - `connect`: https://github.com/avevlad/gulp-connect
	 */
	gulp.task('watch', () => {
		//TODO: check this
		gulp.watch(project.resources.vendor.js, {cwd: paths.target.vendor}, () => runSequence('copy-vendor-js', 'reload'));
		gulp.watch(project.resources.vendor.css, {cwd: paths.target.vendor}, () => runSequence('copy-vendor-css', 'reload'));
		gulp.watch('**/*', {cwd: paths.target.vendor + 'oblique-ui/dist/'}, () => runSequence('copy-oblique-ui', 'reload'));
		gulp.watch('**/*.ts', {cwd: paths.src}, () => runSequence('build-sources', 'reload'));
		gulp.watch('**/*.tpl.html', {cwd: paths.src}, () => runSequence('build-templates', 'build-sources-copy', 'reload'));

		// Showcase:
		gulp.watch(project.resources.assets, {cwd: paths.showcase}, () => runSequence('showcase-copy-ui', 'reload'));
		gulp.watch('**/*.json', {cwd: paths.showcase}, () => runSequence('showcase-copy-ui', 'reload'));
		gulp.watch('**/*.ts', {cwd: paths.showcase}, () => runSequence('showcase-build-sources', 'reload'));
		gulp.watch('**/*.less', {cwd: paths.less}, () => runSequence('showcase-build-styles', 'reload'));
		gulp.watch('**/*.tpl.html', {cwd: paths.showcase}, () => runSequence('showcase-build-templates', 'reload'));
		gulp.watch([paths.pages + '**/*.hbs', paths.partials + '**/*.hbs'], () => runSequence('showcase-build-html', 'reload'));

		gulp.watch('**/*.json', {cwd: paths.server}, () => runSequence('showcase-copy-server', 'reload'));
		gulp.watch('**/*.ts', {cwd: paths.server}, () => runSequence('showcase-build-sources', 'reload'));
	});

	// FIXME: LiveReload will reload every file
	gulp.task('reload', () => {
		gulp.src(paths.target.ui + '**/**')
			.pipe(connect.reload());
	});
	//</editor-fold>

	//<editor-fold desc="Showcase">
	gulp.task('showcase', (done) => {
		return runSequence(
			'showcase-build',
			'showcase-copy',
			done
		);
	});

	gulp.task('showcase-build', (done) => {
		return runSequence(
			'showcase-build-sources',
			'showcase-build-styles',
			'showcase-build-html',
			done
		);
	});

	/**
	 * showcase-build-sources: compiles TypeScript sources from showcase to output folder.
	 *
	 * Plugins:
	 * - `gulp-typescript`: https://github.com/ivogabe/gulp-typescript
	 * - `gulp-tslint`: https://github.com/panuhorsmalahti/gulp-tslint
	 * - `gulp-replace`: https://github.com/lazd/gulp-replace
	 */
	gulp.task('showcase-build-sources', (done) => {
		return runSequence(
			// 0. Lint sources:
			'showcase-build-tslint',

			// 1. Compile sources to staging folder:
			'showcase-build-sources-compile',

			// 2. Copy compiled files to the correct output folders:
			'showcase-build-sources-copy',

			// 3. Build the templates module
			'showcase-build-templates',

			done
		);
	});

	gulp.task('showcase-build-tslint', () => {
		return gulp.src([
			paths.server + '**/*.ts',
			paths.showcase + '**/*.ts'
		]).pipe(tslint(<any>{
			formatter: "verbose"
		}))
		.pipe(tslint.report())
	});

	/**
	 * showcase-build-templates: converts AngularJS templates to JavaScript and
	 * concatenates them in a single file.
	 *
	 * Plugins:
	 *  - `gulp-ng-html2js`: https://github.com/marklagendijk/gulp-ng-html2js
	 *  - `concat`: https://github.com/wearefractal/gulp-concat
	 */
	gulp.task('showcase-build-templates', () => {
		let moduleName = '__MODULE__.app-templates';
		return gulp.src(paths.showcase + '**/*.tpl.html')
			.pipe(htmlmin({collapseWhitespace: true}))
			.pipe(ngHtml2js({
				moduleName: moduleName,
				declareModule: false,
				prefix: ''
			}))
			.pipe(concat("app-templates.js"))
			.pipe(insert.prepend(
				"angular.module('" + moduleName + "', []);\n\n"
			))
			.pipe(replace("__MODULE__", project.app.module))
			.pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
			.pipe(gulp.dest(paths.target.ui + 'app/'));
	});


	gulp.task('showcase-build-sources-copy', () => {
		let showcaseSources = gulp.src(
			paths.staging + paths.showcase + '**/*.js',
			{base: paths.staging + paths.showcase}
		).pipe(gulp.dest(paths.target.ui));

		let serverSources = gulp.src(
			paths.staging + paths.server + '**/*.js',
			{base: paths.staging + paths.server}
		).pipe(gulp.dest(paths.target.server));

		return merge([showcaseSources, serverSources]);
	});

	/**
	 * showcase-build-styles: generates CSS files from Less resources
	 *
	 * Plugins:
	 *  - `less`: https://github.com/plus3network/gulp-less
	 */
	gulp.task('showcase-build-styles', () => {
		return gulp.src(paths.less + 'main.less')
			.pipe(less({paths: paths.less}))
			.pipe(gulp.dest(paths.target.ui + 'css/'))
	});

	/**
	 * showcase-build-html: composes HTML pages from Handlebars resources
	 *
	 * Plugins:
	 *  - `oblique-html`: oblique-ui/tasks/oblique-html
	 */
	gulp.task('showcase-build-html', () => {
		return gulp
			.src(paths.pages + 'index.hbs')
			.pipe(obliqueHtml({
				data: {
					__ENV__: production ? "PROD" : "DEV",
					project: project, // TODO refactor this

					// ObliqueUI-specific:
					app: project.app,

					// Layout placeholders override:
					'html-attrs': 'ng-controller="appController as appController"'
				},
				partials: [
					paths.partials + '**/*.hbs',
				]
			}))
			.pipe(rename({extname: '.html'}))
			.pipe(gulp.dest(paths.target.ui));
	});


	gulp.task('showcase-copy', [
		'showcase-copy-ui',
		'showcase-copy-server'
	]);

	/**
	 * showcase-copy-ui: copies showcase UI resources to output folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('showcase-copy-ui', () => {
		return gulp.src(
			[
				'app/**/*.json',
				'images/**/*',
				'js/**/*',
				'fonts/**/*'
			],
			{cwd: paths.showcase, base: paths.showcase}
		).pipe(gulp.dest(paths.target.ui));
	});

	/**
	 * showcase-copy-server: copies showcase server resources to output folder.
	 *
	 * Plugins: [NONE]
	 */
	gulp.task('showcase-copy-server', () => {
		return gulp.src(
			paths.server + '**/*.json',
			{base: paths.server}
		).pipe(gulp.dest(paths.target.server));
	});

	/**
	 * showcase-serve: launches a local web server for serving a *dummy* API
	 *
	 * Plugins:
	 *  - `nodemon`: https://github.com/JacksonGariety/gulp-nodemon
	 */
	gulp.task('showcase-serve', () => {
		return nodemon({
			script: paths.target.server + 'server.js',
			ext: 'js json'
		});
	});
	//</editor-fold>

	//<editor-fold desc="Deployment tasks">
	require('gulp-release-flows')(gulp); // Imports 'build:release-*' tasks

	/*
	 * Releases & publishes the `oblique-ui` module in the internal npm registry.
	 */
	gulp.task('publish', (callback) => {
		production = true;
		runSequence(
			'release',
			'publish-clean',
			'build-tslint',
			'build-sources-compile',
			'build-templates',
			'copy-ts-publish',
			'bundle-oblique',
			'publish-package',
			'publish-module',
			callback
		);
	});

	gulp.task('release', (callback) => {
		runSequence(
			'build:bump-version',
			'release-replace',
			'build:changelog',
			'build',
			'build:commit-changes',
			'build:push-changes',
			'build:create-new-tag',
			callback
		);
	});

	gulp.task('release-replace', () => {
		// Reload pkg info:
		pkg = reload('./package.json');
		return gulp.src('readme.md')
			.pipe(replace(/v[0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)?(?:-\w+)*(?:\.[0-9]+)?/g, 'v' + pkg.version))
			.pipe(gulp.dest('.'));
	});

	gulp.task('publish-clean', () => {
		return del(paths.publish);
	});

	// Builds the module for publishing:
	gulp.task('publish-build', () => {
		return gulp.src([
			paths.src + '**/*',
		], {base: './src'})
		.pipe(gulp.dest(paths.publish));
	});

	// Generates a custom `package.json` for publishing:
	gulp.task('publish-package', () => {
		let pkg = require('./package.json');
		let output = {
			peerDependencies: {}
		};

		[
			'name', 'title', 'version', 'description',
			'keywords', 'author', 'contributors', 'organization',
			'repository', 'license', 'bugs', 'homepage', 'publishConfig'
		].forEach(field => output[field] = pkg[field]);

		output['main'] = 'bundles/oblique-reactive.js';
		output['module'] = 'oblique-reactive.js';
		output['typings'] = 'oblique-reactive.d.ts';

		Object.keys(pkg.dependencies).forEach((dependency) => {
			output.peerDependencies[dependency] = pkg.dependencies[dependency];
		});

		return gulp.src('README.md')
			.pipe(file('package.json', JSON.stringify(output, null, 2)))
			.pipe(gulp.dest(paths.publish));
	});

	// Publishes the module in the internal npm registry:
	gulp.task('publish-module', (callback) => {
		return spawn('npm', ['publish', paths.publish], {stdio: 'inherit'})
			.on('close', callback)
			.on('error', function () {
				console.log('[SPAWN] Error: ', arguments);
				callback('Unable to publish NPM module.')
			});
	});
	//</editor-fold>

	//<editor-fold desc="Bundling tasks">
	/**
	 * Bundles oblique-reactive into an umd-bundle
	 */
	gulp.task('bundle-oblique', (cb) => {
		webpack(
			{
				entry: `./${paths.staging}src/oblique-reactive.js`,
				output: {
					filename: paths.publish + 'bundles/oblique-reactive.js',
					library: 'obliqueReactive',
					libraryTarget: 'umd'
				},
				devtool: 'source-map',
				module: {
					loaders: [
						{test: /\.js$/, loaders: ['ng-annotate']},
					]
				},
				plugins: [
					new webpack.optimize.UglifyJsPlugin({minimize: true})
				]
			},
			webpackCallBack('webpack', cb));
	});

	/**
	 * Bundles the showcase and oblique-reactive together into one bundle
	 */
	gulp.task('bundle-showcase', (cb) => {
		webpack(
			{
				resolve: {
					extensions: ['', '.webpack.js', '.ts', '.js'],
					modulesDirectories: [
						'./node_modules'
					],
					alias: {
						'oblique-reactive/oblique-reactive': __dirname + '/target/.tmp/src/oblique-reactive.js'
					}
				},
				entry: `./${paths.target.ui}app/app-module.js`,
				output: {filename: paths.target.ui + 'app/bundles/app.js'}
			},
			webpackCallBack('webpack', cb));
	});
	//</editor-fold>

	function reload(module) {
		// Uncache module:
		delete require.cache[require.resolve(module)];

		// Require module again:
		return require(module);
	}

	function webpackCallBack(taskName, gulpDone) {
		return (err, stats) => {
			if (err) throw new gutil.PluginError(taskName, err);
			gutil.log(`[${taskName}]`, stats.toString());
			gulpDone();
		}
	}

})();