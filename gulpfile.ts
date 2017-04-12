(function () {
	//<editor-fold desc="Dependencies">
	let del = require('del'),
		exec = require('child_process').exec,
		spawn = require('cross-spawn'),
		webpack = require('webpack'),

		// Gulp & plugins:
		gulp = require('gulp'),
		autoprefixer = require('gulp-autoprefixer'),
		cleanCss = require('gulp-clean-css'),
		gutil = require('gulp-util'),
		header = require('gulp-header'),
		rename = require('gulp-rename'),
		tslint = require('gulp-tslint'),
		gulpFile = require('gulp-file'),
		sass = require('gulp-sass'),
		sassImportOnce = require('node-sass-import-once'),

		// Project-specific:
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
			sass: 'src/sass/',
			showcase: 'showcase/',
			publish: 'dist/'
		},

		// ObliqueUI custom tasks:
		//obliqueTasks = require('./index').tasks,
		//obliqueHtml = obliqueTasks.html,

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

	gulp.task('build', (done) => {
		runSequence('clean', 'lint', 'test', done);
	});

	gulp.task('lint', () => {
		return gulp.src([paths.src + '**/*.ts', paths.showcase + '**/*.ts'])
			.pipe(tslint(<any>{configuration: require('./tslint.json'), formatter: 'prose'}))
			.pipe(tslint.report({summarizeFailureOutput: true}));
	});

	gulp.task('test', (done) => {
		//TODO: start PhantomJS on Jenkins and Chrome locally
		exec(`"node_modules/.bin/karma" start ${__dirname}/karma.conf.js --single-run`, {maxBuffer: 1024 * 20000}, (err, stdout) => {
			gutil.log(stdout);
			if (err) {
				throw new Error('There are test failures:' + err);
			} else {
				done();
			}
		});
	});

	gulp.task('clean', () => {
		return del('dist/');
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
			'publish-clean',
			'publish-copy',
			'publish-css',
			'publish-compile',
			'publish-bundle',
			'publish-meta',
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

	gulp.task('publish-clean', () => {
		return del(paths.publish);
	});

	gulp.task('publish-copy', () => {
		return gulp.src([
			paths.sass + '**/*'
		], {base: paths.src})
		.pipe(gulp.dest(paths.publish));
	});

	gulp.task('publish-css', () => {
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
		.pipe(gulp.dest(paths.publish + 'css/'))
		.pipe(cleanCss({
			keepSpecialComments: 0
		}))
		.pipe(rename({
			suffix: '.min',
		}))
		.pipe(header(banner()))
		.pipe(gulp.dest(paths.publish + 'css/'));
	});

	gulp.task('publish-compile', (done) => {
		exec(`"./node_modules/.bin/ngc" -p "tsconfig.publish.json"`, (e) => {
			if (e) console.log(e);
			del('./dist/waste');
			done();
		}).stdout.on('data', (data) => {
			console.log(data);
		});
	});

	gulp.task('publish-bundle', (done) => {
		webpack(require('./webpack.publish.js'),
			webpackCallBack('webpack', done));
	});

	gulp.task('publish-meta', () => {
		let meta = require('./package.json');
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
			.pipe(gulp.dest(paths.publish));
	});

	// Publishes the module in the internal npm registry:
	gulp.task('publish-module', (callback) => {
		return spawn('npm', ['publish', paths.publish], {stdio: 'inherit'})
			.on('close', callback)
			.on('error', function () {
				console.log('[SPAWN] Error: ', arguments);
				callback('Unable to publish NPM module.');
			});
	});
	//</editor-fold>
})();
