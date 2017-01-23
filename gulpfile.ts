let gulp = require('gulp'),
    del = require('del'),
    gutil = require('gulp-util'),
    tslint = require('gulp-tslint'),
    exec = require('child_process').exec,
    runSequence = require('run-sequence'),
    gulpFile = require('gulp-file'),
    webpack = require('webpack');

let PATHS = {
    src: 'src/**/*.ts',
    showcase: 'showcase/**/*.ts'
};

function webpackCallBack(taskName, gulpDone) {
    return function(err, stats) {
        if (err) throw new gutil.PluginError(taskName, err);
        gutil.log(`[${taskName}]`, stats.toString());
        gulpDone();
    }
}

gulp.task('lint', () => {
    return gulp.src([PATHS.src, PATHS.showcase])
        .pipe(tslint(<any>{configuration: require('./tslint.json'), formatter: 'prose'}))
        .pipe(tslint.report({summarizeFailureOutput: true}));
});

gulp.task('test', (done) => {
    exec(`"node_modules/.bin/karma" start ${__dirname}/karma.conf.js --single-run`, (err, stdout) => {
        gutil.log(stdout);
        if (err) {
            throw new Error('There are test failures:' + err);
        }
        else {
            done();
        }
    });
});

gulp.task('clean:build', () => {
    return del('dist/');
});

gulp.task('ngc', (done) => {
    exec(`./node_modules/.bin/ngc -p ./tsconfig.publish.json`, (e) => {
        if (e) console.log(e);
        del('./dist/waste');
        done();
    }).stdout.on('data', (data) => {
        console.log(data);
    });
});

gulp.task('umd', (done) => {
    webpack(require('./webpack.publish.js'),
        webpackCallBack('webpack', done));
});

gulp.task('npm', () => {
    let pkgJson = require('./package.json');
    let targetPkgJson = {};
    let fieldsToCopy = ['version', 'description', 'keywords', 'author', 'repository', 'license', 'bugs', 'homepage', 'publishConfig'];

    targetPkgJson['name'] = 'oblique2-reactive';

    fieldsToCopy.forEach(field  => targetPkgJson[field] = pkgJson[field]);

    targetPkgJson['main'] = 'bundles/oblique2-reactive.js';
    targetPkgJson['module'] = 'index.js';
    targetPkgJson['typings'] = 'index.d.ts';

    targetPkgJson['peerDependencies'] = {};
    Object.keys(pkgJson.dependencies).forEach((dependency) => {
        targetPkgJson['peerDependencies'][dependency] = pkgJson.dependencies[dependency];
    });

    return gulp.src('README.md')
        .pipe(gulpFile('package.json', JSON.stringify(targetPkgJson, null, 2)))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (done) => {
    runSequence('lint', 'test', 'clean:build', 'ngc', 'umd', 'npm', done);
});

