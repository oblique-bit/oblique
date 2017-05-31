import {ProjectConfig} from './project.conf';

//<editor-fold desc="Dependencies">
let del = require('del'),
	exec = require('child_process').exec,
	path = require('path'),
	spawn = require('cross-spawn'),
	webpack = require('webpack'),

	// Gulp & plugins:
	gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCss = require('gulp-clean-css'),
	gutil = require('gulp-util'),
	hb = require('gulp-hb'),
	header = require('gulp-header'),
	rename = require('gulp-rename'),
	tslint = require('gulp-tslint'),
	gulpFile = require('gulp-file'),
	sass = require('gulp-sass'),
	sassImportOnce = require('node-sass-import-once'),

	// Project-specific:
	project = require('./project.conf'),
	pkg = require('./package.json'),
	banner = function () { // Lazy evaluation as interpolated values may have been updated between tasks!
		let lb = '\r';
		return `/*!${
			lb} * ${pkg.title} - v${pkg.version}${
			lb} * ${pkg.homepage}${
			lb} * Copyright (c) 2017 ${pkg.organization.name} (${pkg.organization.url})${
			lb} */${lb}${lb}`;
	},
	paths = {
		src: 'src/',
		lib: 'src/lib/',
		sass: 'src/lib/sass/',
		partials: 'src/lib/partials/',
		showcase: 'src/showcase/',
		dist: 'dist/'
	},

	// TODO: remove run-sequence when gulp 4 is out
	runSequence = require('run-sequence');
//</editor-fold>

function webpackCallBack(taskName, gulpDone) {
	return function (err, stats) {
		if (err) throw new gutil.PluginError(taskName, err);
		gutil.log(`[${taskName}]`, stats.toString());
		gulpDone();
	};
}

gulp.task('lint', () => {
	return gulp.src([
		paths.src + '**/*.ts'
	])
		.pipe(tslint(<any>{formatter: 'prose'}))
		.pipe(tslint.report({summarizeFailureOutput: true}));
});

// Remove as soon as the CLI addon API has landed.
gulp.task('build-templates', () => {
	return gulp
		.src([
			paths.showcase + '**/*.hbs',
			'!' + paths.showcase + 'partials/**/*.hbs'
		])
		.pipe(hb({
			partials: [
				'node_modules/oblique-ui/templates/layouts/**/*.hbs',
				'node_modules/oblique-ui/templates/partials/**/*.hbs',
				'src/lib/partials/*.hbs',
				paths.showcase + 'partials/*.hbs'
			],
			helpers: [
				'node_modules/handlebars-helpers/lib/**/*.js',
				'node_modules/handlebars-layouts/dist/handlebars-layouts.js',
				'node_modules/oblique-ui/templates/helpers/**/*.js',
				'node_modules/oblique-ui/templates/helpers/**/*.ts'
			],
			data: {
				app: ProjectConfig.app
			},
			parsePartialName: function (options, file) {
				return file.path.split(path.sep).pop().replace('.hbs', '');
			}
		}))
		.pipe(rename({extname: '.html'}))
		.pipe(gulp.dest(paths.showcase));
});

//<editor-fold desc="Deployment tasks">
require('gulp-release-flows')({
	branch: 'HEAD:master'
}); // Imports 'build:release-*' tasks

/*
 * Releases & publishes the `oblique-ui` module in the internal npm registry.
 */
gulp.task('publish', (callback) => {
	return runSequence(
		'release',
		'dist',
		'publish-module',
		callback
	);
});

gulp.task('release', (callback) => {
	return runSequence(
		'build:bump-version',
		//'changelog',
		'build',
		'build:commit-changes',
		'build:push-changes',
		'build:create-new-tag',
		callback
	);
});

//<editor-fold desc="Distribution tasks">
gulp.task('dist', (callback) => {
	return runSequence(
		'dist-clean',
		'dist-copy',
		'dist-css',
		'dist-compile',
		'dist-bundle',
		'dist-meta',
		callback
	);
});

gulp.task('dist-clean', () => {
	return del(paths.dist);
});

gulp.task('dist-copy', () => {
	return gulp.src([
		paths.sass + '**/*',
		paths.partials + '**/*'
	], {base: paths.lib})
		.pipe(gulp.dest(paths.dist));
});

gulp.task('dist-css', () => {
	return gulp.src([
		paths.sass + 'oblique-reactive.scss'
	])
	//.pipe(sourcemaps.init())
		.pipe(sass({
			importer: sassImportOnce,
			importOnce: {
				index: false,
				css: false
			}
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 11'],
		}))
		.pipe(header(banner()))
		//.pipe(sourcemaps.write(paths.dist.css + 'maps'))
		.pipe(gulp.dest(paths.dist + 'css/'))
		.pipe(cleanCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(header(banner()))
		.pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('dist-compile', (done) => {
	exec(`"./node_modules/.bin/ngc" -p "tsconfig.publish.json"`, (e) => {
		if (e) console.log(e);
		del('./dist/waste');
		done();
	}).stdout.on('data', (data) => {
		console.log(data);
	});
});

gulp.task('dist-bundle', (done) => {
	webpack(require('./webpack.publish.js'),
		webpackCallBack('webpack', done));
});

gulp.task('dist-meta', () => {
	let meta = reload('./package.json');
	let output = {};

	[
		'name', 'version', 'description', 'keywords',
		'author', 'contributors', 'homepage', 'repository',
		'license', 'bugs', 'publishConfig'
	].forEach(field => output[field] = meta[field]);

	output['main'] = 'bundles/oblique-reactive.js';
	output['module'] = 'index.js';
	output['typings'] = 'index.d.ts';

	output['peerDependencies'] = {};
	Object.keys(meta.dependencies).forEach((dependency) => {
		output['peerDependencies'][dependency] = meta.dependencies[dependency];
	});

	return gulp.src('README.md')
		.pipe(gulpFile('package.json', JSON.stringify(output, null, 2)))
		.pipe(gulp.dest(paths.dist));
});
//</editor-fold>

// Publishes the module in the internal npm registry:
gulp.task('publish-module', (callback) => {
	return spawn('npm', ['publish', paths.dist], {stdio: 'inherit'})
		.on('close', callback)
		.on('error', function () {
			console.log('[SPAWN] Error: ', arguments);
			callback('Unable to publish NPM module.');
		});
});
//</editor-fold>

function reload(module) {
	// Uncache module:
	delete require.cache[require.resolve(module)];

	// Require module again:
	return require(module);
}
