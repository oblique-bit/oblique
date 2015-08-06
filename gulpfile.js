var gulp = require('gulp'),
    debug = require('gulp-debug'),
    plumber = require('gulp-plumber'),
    addsrc = require('gulp-add-src'),
    fs = require('fs'),
    assemble = require('assemble'),
    push = require('assemble-push'),
    ngHtml2Js = require("gulp-ng-html2js"),
    html2js = require('gulp-html2js'),
    runSequence = require('run-sequence'),
    gulpAssemble = require('gulp-assemble'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    jshint = require('gulp-jshint'),
    stylish = require('gulp-jscs-stylish'),
    jscs = require('gulp-jscs'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    hb = require('gulp-hb'),
    handlebars = require('gulp-handlebars'),
    wrap = require('gulp-wrap'),
    rev = require('gulp-rev'),
    declare = require('gulp-declare'),
    autoprefixer = require('gulp-autoprefixer'),
    Server = require('karma').Server,
    annotate = require('gulp-ng-annotate'),
    changed = require('gulp-changed'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    ngAnnotate = require('gulp-ng-annotate'),
    batch = require('gulp-batch'),
    project = JSON.parse(fs.readFileSync('./project.json')),
    env = project.common,
    paths = {
        src: 'src/',
        app: 'src/app/',
        states: 'src/app/states/',
        core: 'src/app/core/',
        controllers: 'src/app/core/controllers/',
        less: 'src/less/',
        pages: 'src/pages/',
        data: 'src/templates/data/',
        partials: 'src/templates/partials/',
        helpers: 'src/templates/helpers/',
        vendor: 'vendor/'
    };

gulp.task('default', ['run-dev']);

gulp.task('build-all', function () {
    runSequence('clean', ['copy-all-static', 'build-scripts', 'html2js', 'build-styles', 'assemble']);
});

gulp.task('build-dev', ['build-all', 'test']);

gulp.task('build-prod',['build-all', 'test', 'optimize']);

gulp.task('clean', function () {
    return gulp.src(env.build.target, {read: false}).pipe(clean({force: false}));
});

gulp.task('build-styles', function () {
    gulp.src(paths.less + 'main.less')
        .pipe(less({paths: paths.less}))
        .pipe(gulp.dest(env.build.target + 'css/'))
});

gulp.task('build-scripts', function () {
    gulp.src(env.resources.app, {cwd: paths.src, base: paths.app})
        .pipe(addsrc(paths.app + '**/*.spec.js'))
        //.pipe(debug())
        .pipe(jshint())
        .pipe(jscs())
        .pipe(stylish.combineWithHintResults())
        .pipe(jshint.reporter('jshint-stylish'))
        //.pipe(jshint.reporter('fail')).on('error', errorHandler)
        .pipe(replace("__MODULE__", env.app.module))
        .pipe(replace("'__CONFIG__'", JSON.stringify(env.app)))
        .pipe(gulp.dest(env.build.target + 'app/'));
});

gulp.task('optimize', ['optimize-vendor-css', 'optimize-vendor-js', 'optimize-app']);

gulp.task('optimize-vendor-css', function () {
    gulp.src(env.resources.vendor.css, {cwd: env.build.target + 'vendor/'})
        .pipe(addsrc(env.build.target + 'css/*.css'))
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
        .pipe(gulp.dest(env.build.target + 'min/'));
});

gulp.task('optimize-app', function () {
    gulp.src(env.resources.app, {cwd: env.build.target})
        .pipe(ngAnnotate())
        .pipe(concat(env.app.module + '.min.js'))
        .pipe(uglify())
        .pipe(rev())
        //'usemin'
        .pipe(gulp.dest(env.build.target + 'min/'));
});

gulp.task('optimize-vendor-js', function () {
    gulp.src('vendor/**/*.js', {cwd: env.build.target})
        .pipe(concat('vendors.min.js'))
        .pipe(uglify())
        .pipe(rev())
        //'usemin'
        .pipe(gulp.dest(env.build.target + 'min/'));
});

gulp.task('test', ['build-all'], function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        logLevel: 'info',
        singleRun: true
    }).start(), function () {
        done();
    };
});

gulp.task('html2js', function (done) {
    gulp.src(paths.app + '**/*.tpl.html')
        .pipe(ngHtml2Js({
            moduleName: env.app.module + '.app-templates',
            base: paths.states
        }))
        .pipe(concat("app-templates.js"))
        .pipe(gulp.dest(env.build.target + 'app'));
});

gulp.task('copy-all-static', ['copy-vendor-js', 'copy-vendor-css', 'copy-assets', 'copy-app-json', 'copy-oblique']);


gulp.task('copy-vendor-js', function () {
    gulp.src(env.resources.vendor.js, {cwd: paths.vendor, base: paths.vendor})
        .pipe(gulp.dest(env.build.target + paths.vendor));
});

gulp.task('copy-vendor-css', function () {
    gulp.src(env.resources.vendor.css, {cwd: paths.vendor, base: paths.vendor})
        .pipe(gulp.dest(env.build.target + paths.vendor));
});

gulp.task('copy-assets', function () {
    gulp.src(['images/**/*', 'js/**/*', 'fonts/**/*'], {cwd: paths.src, base: paths.src})
        .pipe(gulp.dest(env.build.target));
});

gulp.task('copy-app-json', function () {
    gulp.src(['**/*.json'], {cwd: paths.app, base: paths.app})
        .pipe(gulp.dest(env.build.target + 'app/'));
});

gulp.task('copy-oblique', function () {
    gulp.src(['**/*'], {cwd: paths.vendor + 'oblique-ui/dist/', base: paths.vendor + 'oblique-ui/dist/'})
        .pipe(gulp.dest(env.build.target + 'vendor/oblique-ui/'));
});

gulp.task('assemble', function () {
    gulp.src(paths.partials + '**/*.hbs')
        .pipe(debug({title: 'debug:'}))
        //.pipe(gulpAssemble(assemble))
        .pipe(concat('index.html'))
        .pipe(gulp.dest(env.build.target));
});

gulp.task('handlebars1', function () {
    gulp.src(paths.partials + '**/*.hbs')
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'MyApp.templates',
            noRedeclare: true, // Avoid duplicate declarations
        }))
        .pipe(concat('app-templates.js'))
        .pipe(env.build.target);
});

gulp.task('handlebars2', function () {
    gulp.src(paths.app + '**/*.html')
        //.pipe(plumber())
        .pipe(hb({
            data: [
                paths.app + 'i18n/**/*.json'
            ],
            helpers: [
                paths.helpers + '**/*.js',
                paths.vendor + 'oblique-ui/templates/helpers/**/*.js'
            ],
            partials: [
                paths.partials + '**/*.hbs',
                paths.vendor + 'oblique-ui/templates/**/*.hbs'
            ]
        }))
        .pipe(env.build.target + 'index.html');
});

gulp.task('watch', function () {
    watch('**/*.js', batch(function (events, done) {
        gulp.start('build-all', done);
    }));
});

gulp.task('connect', function () {
    connect.server({
        port: env.app.api.port, // Port used to deploy the client
        host: 'localhost',
        //base: '<%= env.build.target %>',
        //hostname: '<%= env.app.api.hostname %>',
        //index: '<%= env.app.home %>',

        root: env.build.target,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch([paths.src + '*.*']);
});

gulp.task('run-dev', ['connect', 'watch']);

function errorHandler(error) {
    console.log(error.toString());
    this.emit('end');
}

var glob = require('glob');
gulp.task('generate-html', function (done) {
    assemble.create('product', {isRenderable: true}, function (pattern) {
        var files = glob.sync(pattern);
        if (files.length === 0) {
            console.log('Warning: No input files for pattern: ' + pattern);
            return {};
        }

        var templates = _.reduce(files, function (acc, file) {
            console.log('Reading', log.format(file));

            var json;
            try {
                var content = fs.readFileSync(file, 'utf8');
                json = JSON.parse(content);
            }
            catch (err) {
                console.log('Warning:', 'Could not parse JSON of: ' + file);
                return acc; // TODO: throw err;
            }

            var template = {
                path: file,
                data: json,
                content: 'dummy content to have the template pass validation'
            };

            acc[file] = template;

            return acc;
        }, {});

        return templates;
    });

    assemble.layouts('src/**/*.hbs');
    assemble.option('layout', 'product');
    assemble.products('src/**/*.json');

    assemble.task('default', function () {
        return push('products')
            .pipe(rename({
                extname: '.html'
            }))
            .pipe(tap(function (file) {
                console.log(log.format(file));
            }))
            .pipe(assemble.dest('dist'))
            .pipe(count('Generated ## product HTML pages'));
    });

    assemble.run(['default'], done);
});