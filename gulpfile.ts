import {ProjectConfig} from './project.conf';
import {readFileSync} from 'fs';
import {join} from 'path';

//<editor-fold desc="Dependencies">
let del = require('del'),
	exec = require('child_process').exec,
	path = require('path'),
	spawn = require('cross-spawn'),
	webpack = require('webpack'),

	// Gulp & plugins:
	gulp = require('gulp'),
	conventionalChangelog = require('gulp-conventional-changelog'),
	gutil = require('gulp-util'),
	hb = require('gulp-hb'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	gulpFile = require('gulp-file'),

	// Project-specific:
	pkg = require('./package.json'),
	paths = {
		src: 'src/',
		lib: 'src/lib/',
		sass: 'src/lib/sass/',
		showcase: 'src/showcase/',
		dist: 'dist/'
	},

	// TODO: remove run-sequence when gulp 4 is out
	runSequence = require('run-sequence');
//</editor-fold>

function webpackCallBack(taskName, gulpDone) {
	return function (err, stats) {
		if (err) {
			throw new gutil.PluginError(taskName, err);
		}
		gutil.log(`[${taskName}]`, stats.toString());
		gulpDone();
	};
}

// Remove as soon as the CLI addon API has landed.
gulp.task('build-templates', () => {
	return gulp
		.src([
			paths.showcase + '**/*.hbs'
		])
		.pipe(hb({
			partials: [
				'node_modules/oblique-ui/templates/layouts/**/*.hbs',
				'node_modules/oblique-ui/templates/partials/**/*.hbs'
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
		'build:commit-changes',
		'build:push-changes',
		'build:create-new-tag',
		callback
	);
});

gulp.task('changelog', function () {
	return gulp.src('CHANGELOG.md')
		.pipe(conventionalChangelog({
			// conventional-changelog options:
			preset: 'angular'
			//releaseCount: 0
		}, {
			// context options:
			linkCompare: false,
			repository: pkg.repository.path // Atlassian Stash-specific
		}, {
			// git-raw-commits options:
			//from: '0.0.0'
			//to: 'HEAD'
		}, {
			// conventional-commits-parser options
		}, {
			// conventional-changelog-writer options
			// transform: function (commit) {
			// 	console.log(commit);
			// 	return commit;
			// },
			headerPartial: readFileSync(join(__dirname, 'changelog-header.hbs'), 'utf-8')
		}))
		.pipe(gulp.dest('./'));
});

//<editor-fold desc="Distribution tasks">
gulp.task('dist', (callback) => {
	return runSequence(
		'dist-clean',
		'dist-build',
		callback
	);
});

gulp.task('dist-build', (callback) => {
	return runSequence(
		'dist-copy',
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
		paths.sass + '**/*'
	], {base: paths.lib})
		.pipe(gulp.dest(paths.dist));
});

gulp.task('dist-compile', (done) => {
	exec(`"./node_modules/.bin/ngc" -p "tsconfig.publish.json"`, (e) => {
		if (e) {
			console.log(e);
		}
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

//<editor-fold desc="Showcase tasks">
gulp.task('showcase-build-cleanup', (callback) => {
	// Move `index.html` to target root folder and update resources paths accordingly:
	return gulp.src('./target/showcase/index.html')
		.pipe(replace(/\.\.\//g, './'))
		.pipe(gulp.dest('./target/'));
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

//<editor-fold desc="NPM link for dev only">
gulp.task('dev-link', (callback) => {
	return runSequence(
		'dist-build',
		'npm-link',
		'watch-link',
		callback
	);
});

gulp.task('npm-link', (callback) => {
	return spawn('npm', ['link', paths.dist], {stdio: 'inherit'})
		.on('close', callback)
		.on('error', function () {
			console.log('[SPAWN] Error: ', arguments);
			callback('Unable to execute NPM link')
		});
});

gulp.task('watch-link', () => {
	gulp.watch(paths.src + '**/*', ['dist-build']);
});
//</editor-fold>

function reload(module) {
	// Uncache module:
	delete require.cache[require.resolve(module)];

	// Require module again:
	return require(module);
}
