//<editor-fold desc="Dependencies">
var del = require('del'),
	fs = require('fs'),

	// Gulp & plugins:
	gulp = require('gulp'),
	addsrc = require('gulp-add-src'),
	autoprefixer = require('gulp-autoprefixer'),
	batch = require('gulp-batch'),
	changed = require('gulp-changed'),
	concat = require('gulp-concat'),
	connect = require('gulp-connect'),
	debug = require('gulp-debug'),
	declare = require('gulp-declare'),
	jscs = require('gulp-jscs'),
	jshint = require('gulp-jshint'),
	insert = require('gulp-insert'),
	less = require('gulp-less'),
	minifyCss = require('gulp-minify-css'),
	minifyHtml = require('gulp-minify-html'),
	ngAnnotate = require('gulp-ng-annotate'),
	ngHtml2js = require('gulp-ng-html2js'),
	plumber = require('gulp-plumber'),
	replace = require('gulp-replace'),
	rev = require('gulp-rev'),
	stylish = require('gulp-jscs-stylish'),
	uglify = require('gulp-uglify'),
	watch = require('gulp-watch'),
	wrap = require('gulp-wrap'),

	// Test:
	Server = require('karma').Server,

	// FIXME: remove when https://github.com/gulpjs/gulp/tree/4.0
	runSequence = require('run-sequence');
//</editor-fold>

//<editor-fold desc="Project configuration">
var project = require('./project.conf.js'),
	paths = {
		src: 'src/',
		app: 'src/app/',
		states: 'src/app/states/',
		less: 'src/less/',
		pages: 'src/pages/',
		partials: 'src/partials/',
		vendor: 'vendor/',
		staging: '.tmp/' // TODO
	};
//</editor-fold>

//<editor-fold desc="Main tasks">
gulp.task('default', ['run-dev']);

gulp.task('run-dev', function (done) {
	return runSequence(
		'build-dev',
		'serve-dev'
	);
});

gulp.task('build-dev', [
		'build-all'
		//'test', // TODO
	]
);

gulp.task('build-prod', [
	'build-all',
	'test',
	'optimize'
]);

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

//</editor-fold>


/* ////  ************************************************************


/*
 * clean
 *
 * Deletes generate files and folders.
 *
 * Plugins:
 *  - `del`: https://github.com/sindresorhus/del
 *
 */
gulp.task('clean', function () {
	return del(
		[project.build.target + '/**', paths.staging + '/**'],
		{force: false}
	);
});

//<editor-fold desc="Copy">
gulp.task('copy', [
	'copy-assets',
	'copy-vendor-js',
	'copy-vendor-css',
	'copy-app-json',
	'copy-oblique'
]);

gulp.task('copy-vendor-js', function () {
	return gulp.src(
		project.resources.vendor.js,
		{cwd: paths.vendor, base: paths.vendor}
	).pipe(gulp.dest(project.build.target + paths.vendor));
});

gulp.task('copy-vendor-css', function () {
	return gulp.src(
		project.resources.vendor.css,
		{
			cwd: paths.vendor,
			base: paths.vendor
		}
	).pipe(gulp.dest(project.build.target + paths.vendor));
});

gulp.task('copy-assets', function () {
	return gulp.src(
		[
			'images/**/*',
			'js/**/*',
			'fonts/**/*'
		],
		{
			cwd: paths.src,
			base: paths.src
		}
	).pipe(gulp.dest(project.build.target));
});

gulp.task('copy-app-json', function () {
	return gulp.src(
		['**/*.json'],
		{
			cwd: paths.app,
			base: paths.app
		}
	).pipe(gulp.dest(project.build.target + 'app/'));
});

gulp.task('copy-oblique', function () {
	return gulp.src(
		['**/*'],
		{
			cwd: paths.vendor + 'oblique-ui/dist/',
			base: paths.vendor + 'oblique-ui/dist/'
		}
	).pipe(gulp.dest(project.build.target + 'vendor/oblique-ui/'));
});
//</editor-fold>

//<editor-fold desc="Build">
/*
 * build-styles
 *
 * Generates CSS files.
 *
 * Plugins:
 *  - `less`: https://github.com/plus3network/gulp-less
 *
 */
gulp.task('build-styles', function () {
	return gulp.src(paths.less + 'main.less')
		.pipe(less({paths: paths.less}))
		.pipe(gulp.dest(project.build.target + 'css/'))
});

/*
 * build-scripts
 *
 * Generates JS resources.
 *
 * Plugins:
 *  - `gulp-jshint`: https://github.com/spalger/gulp-jshint
 *  - `jshint-stylish`: https://github.com/sindresorhus/jshint-stylish
 *  - `gulp-jscs`: https://github.com/jscs-dev/gulp-jscs
 *  - `gulp-replace`: https://github.com/lazd/gulp-replace
 *
 */
gulp.task('build-scripts', function () {
	return gulp.src(
			project.resources.app,
			{cwd: paths.src, base: paths.app}
		)
		.pipe(addsrc(paths.app + '**/*.spec.js'))
		//.pipe(debug())
		.pipe(jshint())
		.pipe(jscs())
		.pipe(stylish.combineWithHintResults())
		.pipe(jshint.reporter('jshint-stylish'))
		//.pipe(jshint.reporter('fail')).on('error', errorHandler)
		.pipe(replace("__MODULE__", project.app.module))
		.pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
		.pipe(gulp.dest(project.build.target + 'app/'));
});

/*
 * build-templates
 *
 * Converts AngularJS templates to JavaScript and concatenates them in a single file.
 *
 * Plugins:
 *  - `gulp-ng-html2js`: https://github.com/marklagendijk/gulp-ng-html2js
 *  - `concat`: https://github.com/wearefractal/gulp-concat
 */
gulp.task('build-templates', function () {
	var moduleName = project.app.module + '.app-templates';
	var sources = paths.src + '**/*.tpl.html';
	return gulp.src(sources)
		//.pipe(watch(sources))
		.pipe(minifyHtml({
			empty: true,
			spare: true,
			quotes: true
		}))
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
 * build-html
 *
 * Generates HTML pages.
 *
 * NOTE: legacy Assemble support through Grunt!
 * TODO: refactor when HTML composition has been migrated to new technology [TBD]
 *
 * Plugins:
 *  - `grunt-assemble`: https://github.com/assemble/grunt-assemble
 */
gulp.task('build-html', function (done) {
	require('gulp-grunt')(gulp, {verbose: false});
	// NOTE: Grunt tasks are prefixed with 'grunt-'!
	gulp.start('grunt-assemble'); // DO NOT return here as it breaks the stream!
	done();
});
//</editor-fold>

//<editor-fold desc="Optimize">
gulp.task('optimize', [
	'optimize-vendor-css',
	'optimize-vendor-js',
	'optimize-app'
]);

gulp.task('optimize-vendor-css', function () {
	return gulp.src(project.resources.vendor.css, {cwd: project.build.target + 'vendor/'})
		.pipe(addsrc(project.build.target + 'css/*.css'))
		.pipe(concat('vendors.min.css'))
		.pipe(minifyCss({
			// TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
			//    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
			compatibility: 'ie8',
			keepSpecialComments: '*',
			advanced: false
		}))
		.pipe(rev())
		//'usemin'
		.pipe(gulp.dest(project.build.target + 'min/'));
});

gulp.task('optimize-app', function () {
	return gulp.src(project.resources.app, {cwd: project.build.target})
		.pipe(ngAnnotate())
		.pipe(concat(project.app.module + '.min.js'))
		.pipe(uglify())
		.pipe(rev())
		//'usemin'
		.pipe(gulp.dest(project.build.target + 'min/'));
});

gulp.task('optimize-vendor-js', function () {
	return gulp.src('vendor/**/*.js', {cwd: project.build.target})
		.pipe(concat('vendors.min.js'))
		.pipe(uglify())
		.pipe(rev())
		//'usemin'
		.pipe(gulp.dest(project.build.target + 'min/'));
});
//</editor-fold>

//<editor-fold desc="Test">
gulp.task('test', ['build-all'], function (done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		logLevel: 'info',
		singleRun: true
	}).start(), function () {
		done();
	};
});
//</editor-fold>

//<editor-fold desc="Serve">
gulp.task('serve-dev', [
	'connect-web',
	'watch'
]);

gulp.task('connect-web', function () {
	return connect.server({
		port: project.app.web.port, // Port used to deploy the client
		host: project.app.web.hostname,
		root: project.build.target,
		livereload: true
	});
});

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

	// FIXME: LiveReload may be executed twice (https://github.com/AveVlad/gulp-connect/issues/123)
	return gulp.src(project.build.target + '**/*')
		.pipe(watch(project.build.target + '**/*'))
		.pipe(connect.reload());
});
//</editor-fold>

function errorHandler(error) {
	console.log(error.toString());
	this.emit('end');
}
