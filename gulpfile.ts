/**
 * TODO: remove this file as soon as the Angular CLI addon API has landed:
 * https://github.com/angular/angular-cli/issues/1656#issuecomment-239366723
 */
import {readFileSync} from 'fs';
import {join} from 'path';

//<editor-fold desc="Dependencies">
const del = require('del'),
	exec = require('child_process').exec,
	spawn = require('cross-spawn'),
	webpack = require('webpack'),

	// Gulp & plugins:
	gulp = require('gulp'),
	conventionalChangelog = require('gulp-conventional-changelog'),
	gutil = require('gulp-util'),
	gulpFile = require('gulp-file'),

	// Project-specific:
	pkg = require('./package.json'),
	paths = {
		src: 'src/',
		lib: 'src/lib/',
		sass: 'src/lib/sass/',
		dist: 'dist/'
	};
//</editor-fold>

//<editor-fold desc="Distribution tasks">
const distClean = () => {
	return del(paths.dist);
};

const distSources = () => {
	return gulp.src([
		paths.sass + '**/*'
	], {base: paths.lib}
	).pipe(
		gulp.dest(paths.dist)
	);
};

const distCompile = (callback) => {
	exec(`"./node_modules/.bin/ngc" -p "tsconfig.publish.json"`, (e) => {
		if (e) {
			console.log(e);
		}
		callback();
	}).stdout.on('data', (data) => {
		console.log(data);
	});
};
const distBundle = (callback) => {
	webpack(require('./webpack.publish.js'),
		webpackCallBack('webpack', callback)
	);
};

const distMeta = () => {
	const meta = reload('./package.json');
	const output = {};

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

	return gulp.src(
		'README.md'
	).pipe(
		gulpFile('package.json', JSON.stringify(output, null, 2))
	).pipe(
		gulp.dest(paths.dist)
	);
};

const distBuild = gulp.parallel(
	distSources,
	gulp.series(
		distCompile,
		distBundle
	),
	distMeta
);

const dist = gulp.series(
	distClean,
	distBuild
);
//</editor-fold>

//<editor-fold desc="Deployment tasks">
require('gulp-release-flows')({
	branch: 'HEAD:master'
}); // Imports 'build:release-*' tasks

const changelog = () => {
	return gulp.src(
		'CHANGELOG.md'
	).pipe(
		conventionalChangelog({
			// conventional-changelog options:
			preset: 'angular'
			//releaseCount: 0
		}, {
			// context options:
			linkCompare: false,
			repository: pkg.repository.path // Atlassian Stash-specific
		}, {
			// git-raw-commits options:
			from: '2.0.0',
			to: 'HEAD'
		}, {
			// conventional-commits-parser options
		}, {
			// conventional-changelog-writer options
			// transform: function (commit) {
			// 	console.log(commit);
			// 	return commit;
			// },
			headerPartial: readFileSync(join(__dirname, 'changelog-header.hbs'), 'utf-8')
		})
	).pipe(
		gulp.dest('./')
	);
};

const release = gulp.series(
	'build:bump-version',
	//'changelog',
	'build:commit-changes',
	'build:push-changes',
	'build:create-new-tag'
);

/**
 * Publishes the module in the specified npm registry.
 * @see package.json > publishConfig
 */
const npmPublish = (callback) => {
	return spawn(
		'npm',
		['publish', paths.dist],
		{stdio: 'inherit'}
	).on('close', callback)
	.on('error', function () {
		console.log('[SPAWN] Error: ', arguments);
		callback('Unable to publish NPM module.');
	});
};
//</editor-fold>

//<editor-fold desc="NPM link for dev only">
const npmLink = (callback) => {
	return spawn(
		'npm',
		['link', paths.dist],
		{stdio: 'inherit'}
	).on('close', callback)
	.on('error', function () {
		console.log('[SPAWN] Error: ', arguments);
		callback('Unable to execute NPM link');
	});
};

const watchLink = () => {
	gulp.watch(paths.src + '**/*', distBuild);
};

const devLink = gulp.series(
	distBuild,
	npmLink,
	watchLink
);
//</editor-fold>

//<editor-fold desc="Main tasks">
gulp.task(
	'dist',
	gulp.series(
		distClean,
		distBuild
	)
);

gulp.task(
	'default',
	gulp.series(
		dist
	)
);

/**
 * Releases & publishes the `oblique-reactive` module in the internal npm registry.
 */
gulp.task(
	'publish',
	gulp.series(
		release, // Note: this increments version number!
		dist,
		npmPublish
	)
);
//</editor-fold>

//<editor-fold desc="Secondary tasks">
gulp.task(
	'changelog',
	changelog
);

gulp.task(
	'dev-link',
	devLink
);
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

function reload(module) {
	// Uncache module:
	delete require.cache[require.resolve(module)];

	// Require module again:
	return require(module);
}
