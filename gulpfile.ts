//<editor-fold desc="Dependencies">
var del = require('del'),
	fs = require('fs'),

	// Gulp & plugins:
	gulp = require('gulp'),
	addsrc = require('gulp-add-src'),
	batch = require('gulp-batch'),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	cssnano = require('gulp-cssnano'),
	debug = require('gulp-debug'),
	declare = require('gulp-declare'),
	htmlmin = require('gulp-htmlmin'),
	insert = require('gulp-insert'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	less = require('gulp-less'),
	ngAnnotate = require('gulp-ng-annotate'),
	ngHtml2js = require('gulp-ng-html2js'),
	nodemon = require('gulp-nodemon'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	rev = require('gulp-rev'),
	stylish = require('gulp-jscs-stylish'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	watch = require('gulp-watch'),
	wrap = require('gulp-wrap'),

	// ObliqueUI custom tasks:
	obliqueHtml = require('./vendor/oblique-ui/tasks/oblique-html'),

	// Test:
	karmaServer = require('karma').Server,

	// FIXME: remove when https://github.com/gulpjs/gulp/tree/4.0 is out!
	runSequence = require('run-sequence');
//</editor-fold>

//<editor-fold desc="Project configuration">
var project = require('./project.conf.ts'),
	paths = {
		src: 'src/',
		app: 'src/app/',
		states: 'src/app/states/',
		less: 'src/less/',
		pages: 'src/pages/',
		partials: 'src/partials/',
		vendor: 'vendor/',
		min: project.build.target + 'min/'
	};
//</editor-fold>

//<editor-fold desc="Main tasks">
gulp.task('default', ['run-dev']);

//<editor-fold desc="Dev tasks">
gulp.task('run-dev', function (done) {
	return runSequence(
		'build-dev',
		'serve'
	);
});

gulp.task('build-dev', function (done) {
	return runSequence(
		'build-all',
		'test',
		done
	);
});
//</editor-fold>

//<editor-fold desc="Prod tasks">
gulp.task('run-prod', function (done) {
	return runSequence(
		'build-prod',
		'serve'
	);
});

gulp.task('build-prod', function (done) {
	return runSequence(
		'build-dev',
		'optimize',
		done
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
gulp.task('clean', function () {
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
gulp.task('clean-min', function () {
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
	'copy-assets',
	'copy-vendor-js',
	'copy-vendor-css',
	'copy-app-json',
	'copy-oblique'
]);


/*
 * copy-assets: copies application assets to output folder.
 *
 * Plugins: [NONE]
 */
gulp.task('copy-assets', function () {
	return gulp.src(
		[
			'images/**/*',
			'js/**/*',
			'fonts/**/*'
		],
		{cwd: paths.src, base: paths.src}
	).pipe(gulp.dest(project.build.target));
});

/*
 * copy-vendor-js: copies required vendor scripts to output folder.
 *
 * Plugins: [NONE]
 */
gulp.task('copy-vendor-js', function () {
	return gulp.src(
		project.resources.vendor.js,
		{cwd: paths.vendor, base: paths.vendor}
	).pipe(gulp.dest(project.build.target + paths.vendor));
});

/*
 * copy-vendor-css: copies required vendor styles to output folder.
 *
 * Plugins: [NONE]
 */
gulp.task('copy-vendor-css', function () {
	return gulp.src(
		project.resources.vendor.css,
		{cwd: paths.vendor, base: paths.vendor}
	).pipe(gulp.dest(project.build.target + paths.vendor));
});

/*
 * copy-app-json: copies application JSON resources to output folder.
 *
 * Plugins: [NONE]
 */
gulp.task('copy-app-json', function () {
	return gulp.src(
		['**/*.json'],
		{cwd: paths.app, base: paths.app}
	).pipe(gulp.dest(project.build.target + 'app/'));
});

/*
 * copy-oblique: copies ObliqueUI distribution to output folder.
 *
 * Plugins: [NONE]
 */
gulp.task('copy-oblique', function () {
	var path = paths.vendor + 'oblique-ui/dist/';
	return gulp.src(
		['**/*'],
		{cwd: path, base: path}
	).pipe(gulp.dest(project.build.target + 'vendor/oblique-ui/'));
});
//</editor-fold>

//<editor-fold desc="Build">
gulp.task('build-all', function (done) {
	return runSequence(
		'clean',
		[
			'copy',
			'build-styles',
			'build-scripts',
			'build-templates',
			'build-html'
		],
		done
	);
});

/*
 * build-styles: generates CSS files from Less resources
 *
 * Plugins:
 *  - `less`: https://github.com/plus3network/gulp-less
 */
gulp.task('build-styles', function () {
	return gulp.src(paths.less + 'main.less')
		.pipe(less({paths: paths.less}))
		.pipe(gulp.dest(project.build.target + 'css/'))
});

/*
 * build-scripts: performs code quality checks, generates JS files and replaces
 * project-specific string placeholders.
 *
 * Plugins:
 *  - `gulp-jshint`: https://github.com/spalger/gulp-jshint
 *  - `jshint-stylish`: https://github.com/sindresorhus/jshint-stylish
 *  - `gulp-jscs`: https://github.com/jscs-dev/gulp-jscs
 *  - `gulp-replace`: https://github.com/lazd/gulp-replace
 */
gulp.task('build-scripts', function () {
	return gulp.src(
			project.resources.app,
			{cwd: paths.src, base: paths.app}
		)
		.pipe(addsrc(paths.app + '**/*.spec.js'))
		.pipe(jshint())
		.pipe(jscs())
		.pipe(stylish.combineWithHintResults())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(replace("__MODULE__", project.app.name))
		.pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
		.pipe(gulp.dest(project.build.target + 'app/'));
});

/*
 * build-templates: converts AngularJS templates to JavaScript and
 * concatenates them in a single file.
 *
 * Plugins:
 *  - `gulp-ng-html2js`: https://github.com/marklagendijk/gulp-ng-html2js
 *  - `concat`: https://github.com/wearefractal/gulp-concat
 */
gulp.task('build-templates', function () {
	var moduleName = project.app.name + '.app-templates';
	var sources = paths.src + '**/*.tpl.html';
	return gulp.src(sources)
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(ngHtml2js({
			moduleName: moduleName,
			declareModule: false,
			prefix: ''
		}))
		.pipe(concat("app-templates.js"))
		.pipe(insert.prepend("angular.module('" + moduleName + "', []);"))
		.pipe(gulp.dest(project.build.target + 'app'));
});

/*
 * build-html: composes HTML pages from Handlebars resources
 *
 * Plugins:
 *  - `oblique-html`: oblique-ui/tasks/oblique-html
 */
gulp.task('build-html', () => {
	return gulp
		.src(paths.pages + 'index.hbs')
		.pipe(obliqueHtml({
			data: {
				paths: paths,

				// ObliqueUI-specific:
				app: project.app,
				env: project, // TODO refactor this

				// Layout placeholders override:
				'html-attrs': 'ng-controller="AppController as appController"'
			},
			partials: [
				paths.partials + '**/*.hbs',
			]
		}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest(project.build.target));
});
//</editor-fold>

//<editor-fold desc="Optimize">
/*
 * optimize: minifies, uglifies and revisions generated resources for release packaging
 *
 * Plugins:
 *  - `gulp-usemin`: https://github.com/zont/gulp-usemin
 *  - `gulp-cssnano`: https://github.com/ben-eb/gulp-cssnano
 *  - `gulp-uglify`: https://github.com/terinjokes/gulp-uglify
 *  - `gulp-rev`: https://github.com/sindresorhus/gulp-rev
 */
gulp.task('optimize', ['clean-min'], function (done) {
	return gulp.src(project.build.target + "index.html")
		.pipe(usemin({
			css: [cssnano(), rev()],
			jsvendors: [ngAnnotate(), uglify(), rev()],
			jsapp: [ngAnnotate(), uglify(), rev()]
		}))
		.pipe(gulp.dest(project.build.target));
});
//</editor-fold>

//<editor-fold desc="Test">
/*
 * test: launches Karma tests
 *
 * Plugins:
 *  - `karma`: https://github.com/karma-runner/karma
 */
gulp.task('test', function (done) {
	new karmaServer({
		configFile: __dirname + '/karma.conf.js',
		logLevel: 'info',
		singleRun: true
	}, done).start();
});
//</editor-fold>

//<editor-fold desc="Serve">
/*
 * serve: launches a local web server for serving resources and starts listening for file changes
 *
 * Plugins: [NONE]
 */
gulp.task('serve', [
	'connect-web',
	'watch'
]);

/*
 * connect-web: launches a local web server for serving app resources
 *
 * Plugins:
 *  - `connect`: https://github.com/avevlad/gulp-connect
 */
gulp.task('connect-web', function () {
	return connect.server({
		port: project.app.web.port, // Port used to deploy the client
		host: project.app.web.hostname,
		root: project.build.target,
		livereload: true
	});
});

/*
 * connect-web: launches a local web server for serving a *dummy* API
 *
 * Plugins:
 *  - `nodemon`: https://github.com/JacksonGariety/gulp-nodemon
 */
gulp.task('connect-dummy', function () {
	return nodemon({
		script: 'server/server.js',
		ext: 'js json',
		env: {
			PORT: project.app.api.port,
			PORT_CLIENT: project.app.web.port
		}
	});
});

/*
 * watch: starts listening for file changes and reloads running web server
 *
 * Plugins:
 * - `watch`: https://github.com/floatdrop/gulp-watch
 * - `connect`: https://github.com/avevlad/gulp-connect
 */
gulp.task('watch', function () {
	gulp.watch(project.resources.assets, {cwd: paths.src}, ['copy-assets']);
	gulp.watch(project.resources.vendor.js, {cwd: paths.vendor}, ['copy-vendor-js']);
	gulp.watch(project.resources.vendor.css, {cwd: paths.vendor}, ['copy-vendor-css']);
	gulp.watch('**/*.json', {cwd: paths.src}, ['copy-app-json']);
	gulp.watch('**/*', {cwd: paths.vendor + 'oblique-ui/dist/'}, ['copy-oblique']);
	gulp.watch('**/*.less', {cwd: paths.less}, ['build-styles']);
	gulp.watch('**/*.js', {cwd: paths.src}, ['build-scripts']);
	gulp.watch('**/*.tpl.html', {cwd: paths.src}, ['build-templates']);
	gulp.watch([paths.pages + '**/*.hbs', paths.partials + '**/*.hbs'], ['build-html']);

	// FIXME: LiveReload may be triggered multiple times (https://github.com/AveVlad/gulp-connect/issues/123)
	return watch(project.build.target + '**/*')
		.pipe(connect.reload())
});
//</editor-fold>
