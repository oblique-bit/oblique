(function () {
	//<editor-fold desc="Dependencies">
	let del = require('del'),
		exec = require('child_process').exec,
		spawn = require('cross-spawn'),
		webpack = require('webpack'),

		// Gulp & plugins:
		gulp = require('gulp'),
		gutil = require('gulp-util'),
		tslint = require('gulp-tslint'),
		gulpFile = require('gulp-file'),

		// Project-specific:
		//pkg = require('./package.json'),
		paths = {
			src: 'src/**/*.ts',
			showcase: 'showcase/**/*.ts',
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
		return gulp.src([paths.src, paths.showcase])
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

		output['main'] = 'bundles/oblique2-reactive.js';
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
