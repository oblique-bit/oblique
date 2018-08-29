/**
 * TODO: remove this file as soon as the Angular CLI addon API has landed:
 * https://github.com/angular/angular-cli/issues/1656#issuecomment-239366723
 */
import {readFileSync} from 'fs';
import {join} from 'path';

//<editor-fold desc="Dependencies">
const del = require('del'),
	exec = require('child_process').exec,
	webpack = require('webpack'),
	fs = require('fs'),

	// Gulp & plugins:
	gulp = require('gulp'),
	git = require('gulp-git'),
	gutil = require('gulp-util'),
	gulpFile = require('gulp-file'),

	// Project-specific:
	pkg = require('./package.json'),
	paths = {
		src: 'src/',
		lib: 'src/lib/',
		dist: 'dist/'
	};
//</editor-fold>

//<editor-fold desc="Distribution tasks">
const distClean = () => {
	return del(paths.dist);
};

const distCleanup = () => {
	return del(paths.dist + 'dist');
};

const distSources = () => {
	return gulp.src([
			'node_modules/oblique-ui/css/**/*',
			'node_modules/oblique-ui/scss/**/*',
			'node_modules/oblique-ui/fonts/**/*',
			'node_modules/oblique-ui/images/**/*'
	], {base: 'node_modules/oblique-ui'}
	).pipe(
		gulp.dest(paths.dist + 'styles')
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
		'README.md',
		'CHANGELOG.md'
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
		distBundle,
		distCleanup
	),
	distMeta
);

const dist = gulp.series(
	distClean,
	distBuild
);

const commit = () => {
	return gulp.src('.')
		.pipe(git.add())
		.pipe(git.commit('chore(version): release version ' + getPackageJsonVersion()));
};
const push = (cb) => {
	return git.push('origin', 'master', cb);
};
//</editor-fold>


//<editor-fold desc="Build-watch for dev only">

const watchBuild = () => {
	gulp.watch(paths.src + '**/*', distBuild);
};

const buildAndWatch = gulp.series(
	distBuild,
	watchBuild
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
		commit,
		push
	)
);
//</editor-fold>

//<editor-fold desc="Secondary tasks">
gulp.task(
	'dev-watch',
	buildAndWatch
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



function getPackageJsonVersion() {
	// We parse the json file instead of using require because require caches
	// multiple calls so the version number won't be updated
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}
