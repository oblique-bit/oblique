(function () {
    //<editor-fold desc="Dependencies">
    let del = require('del'),
        merge = require('merge2'),
        spawn = require('cross-spawn'),

        // Gulp & plugins:
        gulp = require('gulp'),
        gutil = require('gulp-util'),
        concat = require('gulp-concat'),
        connect = require('gulp-connect'),
        proxy = require('http-proxy-middleware'),
        cssnano = require('gulp-cssnano'),
        debug = require('gulp-debug'),
        declare = require('gulp-declare'),
        file = require('gulp-file'),
        htmlmin = require('gulp-htmlmin'),
        insert = require('gulp-insert'),
        less = require('gulp-less'),
        ngAnnotate = require('gulp-ng-annotate'),
        ngHtml2js = require('gulp-ng-html2js'),
        nodemon = require('gulp-nodemon'),
        open = require('gulp-open'),
        rename = require('gulp-rename'),
        replace = require('gulp-replace'),
        rev = require('gulp-rev'),
        source = require('vinyl-source-stream'),
        ts = require('gulp-typescript'),
        tslint = require("gulp-tslint"),
        uglify = require('gulp-uglify'),
        usemin = require('gulp-usemin'),
        watch = require('gulp-watch'),
        webpack = require('webpack'),

        // Project-specific:
        pkg = require('./package.json'),
        project = require('./project.conf.ts'),
        paths = {
            src: 'src/',
            modules: 'node_modules/',
            min: project.build.target + 'min/',
            staging: project.build.target + '.tmp/',
            publish: project.build.target + '.publish/',

            // Showcase paths:
            showcase: 'showcase/',
            app: 'showcase/app/',
            states: 'showcase/app/states/',
            less: 'showcase/less/',
            pages: 'showcase/pages/',
            partials: 'showcase/partials/',
            vendor: project.build.target + 'vendor/'
        },

        // ObliqueUI custom tasks:
        obliqueTasks = require('oblique-ui').tasks,
        obliqueHtml = obliqueTasks.html,
        obliqueModulePackage = obliqueTasks.modulePackage,

        // Test:
        karmaServer = require('karma').Server,

        production = false,
        tsProject = ts.createProject('tsconfig.json'),

        // FIXME: remove when https://github.com/gulpjs/gulp/tree/4.0 is out!
        runSequence = require('run-sequence');
    //</editor-fold>

    //<editor-fold desc="Main tasks">
    gulp.task('default', ['run-dev']);

    //<editor-fold desc="Dev tasks">
    gulp.task('run-dev', function () {
        return runSequence(
            'build-dev',
            'serve'
        );
    });

    gulp.task('build-dev', function (done) {
        return runSequence(
            'build',
            'copy-vendor-dev',
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
        production = true;
        return runSequence(
            'build-dev',
            'optimize',
            'clean-prod',
            done
        );
    });

    gulp.task('clean-prod', function (done) {
        production = true;
        return del(
            [
                paths.staging,
                project.build.target + 'app/*',
                '!' + project.build.target + 'app/i18n',
                '!' + project.build.target + 'app/i18n/*.json'
            ],
            {force: false}
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
        'copy-vendor-js',
        'copy-vendor-css',
        'copy-oblique-ui',

        'showcase-copy-json',
        'showcase-copy-assets',
    ]);

    /*
     * copy-assets: copies showcase assets to output folder.
     *
     * Plugins: [NONE]
     */
    gulp.task('showcase-copy-assets', function () {
        return gulp.src(
            [
                'images/**/*',
                'js/**/*',
                'fonts/**/*'
            ],
            {cwd: paths.showcase, base: paths.showcase}
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
            {cwd: paths.modules, base: paths.modules}
        ).pipe(gulp.dest(paths.vendor));
    });

    /*
     * copy-vendor-dev: copies required DEV vendor scripts to output folder.
     *
     * Plugins: [NONE]
     */
    gulp.task('copy-vendor-dev', function () {
        return gulp.src(
            project.resources.vendor.dev,
            {cwd: paths.modules, base: paths.modules}
        ).pipe(gulp.dest(paths.vendor));
    });

    /*
     * copy-vendor-css: copies required vendor styles to output folder.
     *
     * Plugins: [NONE]
     */
    gulp.task('copy-vendor-css', function () {
        return gulp.src(
            project.resources.vendor.css,
            {cwd: paths.modules, base: paths.modules}
        ).pipe(gulp.dest(paths.vendor));
    });

    /*
     * copy-app-json: copies showcase JSON resources to output folder.
     *
     * Plugins: [NONE]
     */
    gulp.task('showcase-copy-json', function () {
        return gulp.src(
            ['**/*.json'],
            {cwd: paths.app, base: paths.app}
        ).pipe(gulp.dest(project.build.target + 'app/'));
    });

    /*
     * copy-oblique-ui: copies ObliqueUI distribution to output folder.
     *
     * Plugins: [NONE]
     */
    gulp.task('copy-oblique-ui', function () {
        var path = paths.modules + 'oblique-ui/dist/';
        return gulp.src(
            ['**/*'],
            {cwd: path, base: path}
        ).pipe(gulp.dest(paths.vendor + 'oblique-ui/'));
    });

    /*
     * copy-ts-publish: copies compiled ts into publish folder.
     *
     * Plugins: [NONE]
     */
    gulp.task('copy-ts-publish', function () {
        var path = paths.staging + 'src/';
        return gulp.src(
            ['**/*'],
            {cwd: path, base: path}
        ).pipe(gulp.dest(paths.publish + ''));
    });
    //</editor-fold>

    //<editor-fold desc="Build">
    gulp.task('build', function (done) {
        return runSequence(
            'clean',
            'copy',
            'tslint',
            'build-sources', // Builds showcase sources as well!
            [
                'showcase-build-styles',
                'showcase-build-html'
            ],
            done
        );
    });

    /**
     * build-sources: compiles TypeScript sources to output folder.
     *
     * Plugins:
     * - `gulp-typescript`: https://github.com/ivogabe/gulp-typescript
     * - `gulp-tslint`: https://github.com/panuhorsmalahti/gulp-tslint
     * - `gulp-replace`: https://github.com/lazd/gulp-replace
     */
    gulp.task('build-sources', function (done) {
        // NOTE: TS compilation relies on `tsconfig.json` used by TSC
        // which compiles *all* project sources!

        return runSequence(
            // 1. Compile sources to staging folder:
            'build-sources-compile',

            // 2. Build the templates module
            'build-templates',
            'showcase-build-templates',

            // 3. Copy compiled files to the correct output folders:
            'build-sources-copy',

            done
        );
    });

    gulp.task('build-sources-compile', function () {
        return tsProject.src()
            .pipe(tsProject())
            .pipe(replace("__MODULE__", project.app.module))
            .pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
            .pipe(gulp.dest(paths.staging));
    });

    gulp.task('tslint', () => {
        return gulp.src([
            paths.showcase + '**/*.ts',
            paths.src + '**.*.ts'
        ]).pipe(tslint(<any>{
                formatter: "verbose"
            })
        )
            .pipe(tslint.report())
    });

    gulp.task('build-sources-copy', function () {
        let copyCore = gulp.src(
            paths.staging + paths.src + '**/*.js',
            {base: paths.staging + paths.src}
        ).pipe(gulp.dest(paths.vendor + 'oblique-reactive'));

        let copyShowcase = gulp.src(
            paths.staging + paths.showcase + '**/*.js',
            {base: paths.staging + paths.showcase}
        ).pipe(gulp.dest(project.build.target));

        return merge([copyCore, copyShowcase]);
    });

    /**
     * build-templates: converts AngularJS templates to JavaScript and
     * concatenates them in a single file.
     *
     * Plugins:
     *  - `gulp-ng-html2js`: https://github.com/marklagendijk/gulp-ng-html2js
     *  - `concat`: https://github.com/wearefractal/gulp-concat
     */
    gulp.task('build-templates', function () {
        var moduleName = 'oblique-reactive' + '.app-templates'; // FIXME 1.3.0
        return gulp.src(paths.src + '**/*.tpl.html')
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(ngHtml2js({
                moduleName: moduleName,
                declareModule: false,
                prefix: ''
            }))
            .pipe(concat("oblique-reactive-templates.js"))
            .pipe(insert.prepend(
                "exports.templateModuleName = '" + moduleName + "';\n\n" // FIXME 1.3.0
                + "angular.module('" + moduleName + "', []);\n\n"
            ))
            .pipe(gulp.dest(paths.staging + paths.src));
    });

    /*
     * showcase-build-styles: generates CSS files from Less resources
     *
     * Plugins:
     *  - `less`: https://github.com/plus3network/gulp-less
     */
    gulp.task('showcase-build-styles', function () {
        return gulp.src(paths.less + 'main.less')
            .pipe(less({paths: paths.less}))
            .pipe(gulp.dest(project.build.target + 'css/'))
    });

    /**
     * showcase-build-templates: converts AngularJS templates to JavaScript and
     * concatenates them in a single file.
     *
     * Plugins:
     *  - `gulp-ng-html2js`: https://github.com/marklagendijk/gulp-ng-html2js
     *  - `concat`: https://github.com/wearefractal/gulp-concat
     */
    gulp.task('showcase-build-templates', function () {
        var moduleName = '__MODULE__.app-templates';
        return gulp.src(paths.showcase + '**/*.tpl.html')
            .pipe(htmlmin({collapseWhitespace: true}))
            .pipe(ngHtml2js({
                moduleName: moduleName,
                declareModule: false,
                prefix: ''
            }))
            .pipe(concat("app-templates.js"))
            .pipe(insert.prepend(
                "angular.module('" + moduleName + "', []);\n\n"
            ))
            .pipe(replace("__MODULE__", project.app.module))
            .pipe(replace("'__CONFIG__'", JSON.stringify(project.app)))
            .pipe(gulp.dest(paths.staging + paths.showcase + 'app/'));
    });

    /**
     * showcase-build-html: composes HTML pages from Handlebars resources
     *
     * Plugins:
     *  - `oblique-html`: oblique-ui/tasks/oblique-html
     */
    gulp.task('showcase-build-html', () => {
        return gulp
            .src(paths.pages + 'index.hbs')
            .pipe(obliqueHtml({
                data: {
                    project: project, // TODO refactor this

                    dev: !production,
                    // ObliqueUI-specific:
                    app: project.app,

                    // Layout placeholders override:
                    'html-attrs': 'ng-controller="appController as appController"'
                },
                partials: [
                    paths.partials + '**/*.hbs',
                ]
            }, paths))
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
    gulp.task('optimize', ['bundle-showcase', 'clean-min'], function () {
        return gulp.src(project.build.target + 'index.html')
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
     * TODO: should this be runnable alone?
     *
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
     * TODO: ReverseProxy
     *
     * Plugins: [NONE]
     */
    gulp.task('serve', [
        'serve-connect',
        'serve-open',
        'watch'
    ]);

    /**
     * serve-connect: launches a local web server for serving app resources
     *
     * Plugins:
     *  - `connect`: https://github.com/avevlad/gulp-connect
     */
    gulp.task('serve-connect', function () {
        return connect.server({
            port: 9000, // Port used to deploy the client
            host: 'localhost',
            root: project.build.target,
            livereload: true,
            middleware: function(connect, opt) {
                return [
                    proxy('/' + project.app.api.path, {
                        target: `http://localhost:${project.app.api.port}`,
                        changeOrigin:true
                    })
                ]
            }
        });
    });

    /**
     * serve-open: opens the default Internet browser
     *
     * Plugins:
     *  - `open`: https://github.com/stevelacy/gulp-open
     */
    gulp.task('serve-open', () => {
        return gulp.src(project.build.target + 'index.html')
            .pipe(open({uri: 'http://localhost:9000'}));
    });

    /*
     * serve-dummy: launches a local web server for serving a *dummy* API
     *
     * Plugins:
     *  - `nodemon`: https://github.com/JacksonGariety/gulp-nodemon
     */
    //TODO: mongodb-prebuilt not installable -> not testable
    gulp.task('serve-dummy', function () {
        return nodemon({
            script: 'server/server.js',
            ext: 'js json'
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
        //TODO: check this
        gulp.watch(project.resources.vendor.js, {cwd: paths.vendor}, () => runSequence('copy-vendor-js', 'reload'));
        gulp.watch(project.resources.vendor.css, {cwd: paths.vendor}, () => runSequence('copy-vendor-css', 'reload'));
        gulp.watch('**/*', {cwd: paths.vendor + 'oblique-ui/dist/'}, () => runSequence('copy-oblique-ui', 'reload'));
        gulp.watch('**/*.ts', {cwd: paths.src}, () => runSequence('build-sources', 'reload'));

        // Showcase:
        gulp.watch(project.resources.assets, {cwd: paths.showcase}, () => runSequence('showcase-copy-assets', 'reload'));
        gulp.watch('**/*.json', {cwd: paths.showcase}, () => runSequence('showcase-copy-json', 'reload'));
        gulp.watch('**/*.ts', {cwd: paths.showcase}, () => runSequence('build-sources', 'reload'));
        gulp.watch('**/*.less', {cwd: paths.less}, () => runSequence('showcase-build-styles', 'reload'));
        gulp.watch('**/*.tpl.html', {cwd: paths.showcase}, () => runSequence(['build-templates', 'showcase-build-templates'], 'reload'));
        gulp.watch([paths.pages + '**/*.hbs', paths.partials + '**/*.hbs'], () => runSequence('showcase-build-html', 'reload'));
    });

    // FIXME: LiveReload will reload every file
    gulp.task('reload', () => {
        gulp.src(project.build.target + '**/**')
            .pipe(connect.reload());
    });
    //</editor-fold>

    //<editor-fold desc="Deployment tasks">
    require('gulp-release-flows')( // Imports 'build:release-*' tasks
        gulp,
        {branch: 'develop'} // FIXME: remove when ready!
    );

    /*
     * Releases & publishes the `oblique-ui` module in the internal npm registry.
     */
    gulp.task('publish', (callback) => {
        production = true;
        runSequence(
            //'release',
            'publish-clean',
            'tslint',
            'publish-ts',
            'build-templates',
            'copy-ts-publish',
            'bundle-oblique',
            'publish-package',
            'publish-module',
            callback
        );
    });

    gulp.task('release', (callback) => {
        runSequence(
            'build:bump-version',
            'release-replace',
            'build:changelog',
            'build',
            'build:commit-changes',
            'build:push-changes',
            'build:create-new-tag',
            callback
        );
    });

    gulp.task('release-replace', () => {
        // Reload pkg info:
        pkg = reload('./package.json');
        return gulp.src('readme.md')
            .pipe(replace(/v[0-9]+\.[0-9]+\.[0-9]+(?:\.[0-9]+)?(?:-\w+)*(?:\.[0-9]+)?/g, 'v' + pkg.version))
            .pipe(gulp.dest('.'));
    });

    gulp.task('publish-clean', () => {
        return del(paths.publish);
    });

    gulp.task('publish-ts', () => {
        let tsProject = ts.createProject('tsconfig.publish.json');
        return tsProject.src()
            .pipe(tsProject())
            .pipe(gulp.dest(paths.staging + 'src/'));
    });

    // Builds the module for publishing:
    gulp.task('publish-build', () => {
        return gulp.src([
            paths.src + '**/*',
        ], {base: './src'})
            .pipe(gulp.dest(paths.publish));
    });

    // Generates a custom `package.json` for publishing:
    gulp.task('publish-package', () => {
        var pkgJson = require('./package.json');
        var targetPkgJson = {
            peerDependencies: {}
        };

        [
            'name', 'title', 'version', 'description',
            'keywords', 'author', 'contributors', 'organization',
            'repository', 'license', 'bugs', 'homepage', 'publishConfig'
        ].forEach(field => targetPkgJson[field] = pkgJson[field]);

        targetPkgJson['main'] = 'bundles/oblique-reactive.js';
        targetPkgJson['module'] = 'oblique-reactive.js';
        targetPkgJson['typings'] = 'oblique-reactive.d.ts';

        Object.keys(pkgJson.dependencies).forEach(function(dependency) {
            targetPkgJson.peerDependencies[dependency] = pkgJson.dependencies[dependency];
        });

        return gulp.src('README.md')
            .pipe(file('package.json', JSON.stringify(targetPkgJson, null, 2)))
            .pipe(gulp.dest(paths.publish));
    });

    // Publishes the module in the internal npm registry:
    gulp.task('publish-module', (callback) => {
        return spawn('npm', ['publish', paths.publish], {stdio: 'inherit'})
            .on('close', callback)
            .on('error', function () {
                console.log('[SPAWN] Error: ', arguments);
                callback('Unable to publish NPM module.')
            });
    });
    //</editor-fold>

    //<editor-fold desc="Bundling tasks">

    /**
     * Bundles oblique-reactive into an umd-bundle
     */
    gulp.task('bundle-oblique', (cb) => {
        webpack(
            {
                entry: './target/.tmp/src/oblique-reactive.js',
                output: {filename: paths.publish + 'bundles/oblique-reactive.js', library: 'obliqueReactive', libraryTarget: 'umd'},
                devtool: 'source-map',
                module: {
                    loaders: [
                        {test: /\.js$/, loaders: ['ng-annotate']},
                    ]
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({minimize: true})
                ]
            },
            webpackCallBack('webpack', cb));
    });

    /**
     * Bundles the showcase and oblique-reactive together into one bundle
     */
    gulp.task('bundle-showcase', (cb) => {
        webpack(
            {
                resolve: {
                    extensions: ['', '.webpack.js', '.ts', '.js'],
                    modulesDirectories: [
                        './node_modules'
                    ],
                    alias: {
                        'oblique-reactive/oblique-reactive': __dirname + '/target/.tmp/src/oblique-reactive.js'
                    }
                },
                entry: './target/app/app-module.js',
                output: {filename: project.build.target + 'app/bundles/app.js'}
            },
            webpackCallBack('webpack', cb));
    });
    //</editor-fold>

    function reload(module) {
        // Require module again:

        // Uncache module:
        delete require.cache[require.resolve(module)];
        return require(module);
    }

    function webpackCallBack(taskName, gulpDone) {
        return function (err, stats) {
            if (err) throw new gutil.PluginError(taskName, err);
            gutil.log(`[${taskName}]`, stats.toString());
            gulpDone();
        }
    }

})();