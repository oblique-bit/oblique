module.exports = function (grunt) {
    'use strict';

    // Required project configuration:
    var project = require('./project.conf.js');

    // Optional build configuration:
    var paths = {
        oblique: 'src/',
        src: 'showcase/',
        app: 'showcase/app/',
        states: 'showcase/app/states/',
        less: 'showcase/less/',
        pages: 'showcase/pages/',
        partials: 'showcase/partials/',
        testResources: 'testResources/',
        vendor: 'node_modules/',
        targetVendor: 'vendor/',
        staging: '.tmp'
    };

    // Grunt init
    grunt.initConfig({

            // Metadata -----------------------------------------------------------------

            // Package configuration
            pkg: grunt.file.readJSON('package.json'),

            // Make project paths available to grunt:
            paths: paths,

            // Tasks --------------------------------------------------------------------

            /*
             * grunt-config
             *
             * https://github.com/almeidap/grunt-config
             *
             * Environment configuration
             */
            config: {

                // Default & shared environment variables (may be overrided by other jobs through `options.variables`)
                options: {
                    variables: {
                        env: project.common
                    }
                },
                dev: {
                    options: {
                        variables: {
                            env: project.dev
                        }
                    }
                },
                'prod-local': {
                    options: {
                        variables: {
                            env: project['prod-local']
                        }
                    }
                },
                prod: {
                    options: {
                        variables: {
                            env: project.prod
                        }
                    }
                }
            },

            /*
             * grunt-contrib-clean
             *
             * https://github.com/gruntjs/grunt-contrib-clean
             *
             * Clean files and folders.
             */
            clean: {
                options: {
                    force: true
                },
                build: ['<%= env.build.target %>'],
                staging: ['<%= paths.staging %>']
            },

            exec: {
                tsc: 'tsc' //TODO: remove this as soon as this is fixed: https://github.com/TypeStrong/grunt-ts/issues/339
            },

            ts: {
                options: {
                    fast: 'never'
                },
                oblique: {
                    tsconfig: 'tsconfig.publish.json'
                },
                showcase: {
                    tsconfig: true
                }
            },
            tslint: {
                options: {
                    configuration: "tslint.json"
                },
                files: {
                    src: [
                        "<%= paths.app %>**/*.ts"
                    ]
                }
            },
            browserify: {
                app: {
                    src: '<%= env.build.target %>app/app-module.js',
                    dest: '<%= env.build.target %>app/bundles/app.js'
                },
                oblique: {
                    src: 'dist/oblique-module.js',
                    dest: 'dist/bundles/oblique-reactive.js'
                }
            },

            /*
             * grunt-contrib-copy
             *
             * https://github.com/gruntjs/grunt-contrib-copy
             *
             * Copy files and folders
             */
            copy: {
                oblique: {
                    files: [{
                        expand: true,
                        cwd: '<%= paths.vendor %>oblique-ui/dist/',
                        src: '**/*',
                        dest: '<%= env.build.target %><%= paths.targetVendor %>oblique-ui/'
                    }]
                },
                app: {
                    files: [{
                        cwd: '<%= paths.app %>',
                        src: ['**/*.js', '**/*.json'],
                        dest: '<%= env.build.target %>app/',
                        expand: true
                    }]
                },
                assets: {
                    files: [{
                        cwd: '<%= paths.src %>',
                        src: ['images/**/*', 'js/**/*', 'fonts/**/*'],
                        dest: '<%= env.build.target %>',
                        expand: true
                    }]
                },
                'vendor-js': {
                    files: [{
                        cwd: '<%= paths.vendor %>',
                        src: '<%= env.resources.vendor.js %>',
                        dest: '<%= env.build.target %><%= paths.targetVendor %>',
                        expand: true
                    }]
                },
                'vendor-css': {
                    files: [{
                        cwd: '<%= paths.vendor %>',
                        src: '<%= env.resources.vendor.css %>',
                        dest: '<%= env.build.target %><%= paths.targetVendor %>',
                        expand: true
                    }]
                },
                'vendor-assets': {
                    files: [{
                        cwd: '<%= paths.vendor %>',
                        src: '<%= env.resources.vendor.assets %>',
                        dest: '<%= env.build.target %><%= paths.targetVendor %>',
                        expand: true,
                        flatten: false
                    }]
                },
                'testResources': {
                    files: [{
                        cwd: '<%= paths.vendor %>',
                        src: '<%= env.resources.vendor.testResources %>',
                        dest: '<%= env.build.target %><%= paths.testResources %>',
                        expand: true
                    }]
                },
                'system-js': {
                    files: [{
                        cwd: '<%= paths.vendor %>',
                        src: [
                            'systemjs/dist/system.js',
                            'systemjs/dist/system-polyfills.js'
                        ],
                        dest: '<%= env.build.target %><%= paths.targetVendor %>',
                        expand: true
                    }]
                },
                'package.json': {
                    files: [{
                        expand: true,
                        src: 'package.publish.json',
                        dest: 'dist/',
                        rename: function(dest, src) {
                            return dest + '/package.json';
                        }
                    }]
                }
            },

            /*
             * assemble
             *
             * https://github.com/assemble/assemble
             *
             * Static site generator
             */
            assemble: {
                options: {
                    flatten: false,

                    assets: '<%= env.build.target %>',
                    env: '<%= env %>',
                    paths: '<%= paths %>',

                    data: [
                        'package.json'
                    ],
                    layout: false, // Using `composable` layouts, see why here: https://github.com/assemble/assemble/issues/555
                    layoutdir: '<%= paths.vendor %>oblique-ui/templates/layouts/',
                    partials: [
                        '<%= paths.vendor %>oblique-ui/templates/**/*.hbs',
                        '<%= paths.partials %>**/*.hbs'
                    ],
                    helpers: [
                        '<%= paths.vendor %>oblique-ui/templates/helpers/**/*.js'
                    ],

                    // Layout placeholders override:
                    'html-attrs': 'ng-controller="appController as appController"',

                    // App-specific configuration used by ObliqueUI layouts:
                    app: {
                        name: '<%= env.app.module %>',
                        title: '<%= env.app.title %>',
                        description: '<%= env.app.description %>',
                        lang: '<%= env.app.defaults.locale %>',
                        home: '<%= env.app.home %>',
                        organization: {
                            name: 'Federal Office of Information Technology, Systems and Telecommunication FOITT',
                            url: 'http://www.bit.admin.ch',
                            email: 'info@bit.admin.ch',
                            contact: false
                        },

                        // Available locales:
                        locales: '<%= env.app.locales %>',

                        // Theming:
                        theme: {
                            tooltips: true,
                            application: {
                                fixed: true
                            },
                            header: {
                                transitions: true
                                //variant:  "application-header-sm"
                            }
                        },

                        // References:
                        pages: '',
                        vendor: {
                            path: '<%= paths.targetVendor %>',
                            obliqueui: {
                                name: 'oblique-ui',
                                title: 'ObliqueUI',
                                path: 'oblique-ui/'
                            }
                        }
                    }
                },
                pages: {
                    files: [
                        {
                            expand: true,
                            cwd: '<%= paths.pages %>',
                            src: '**/*.hbs',
                            dest: '<%= env.build.target %>'
                        }
                    ]
                }
            },

            /*
             * grunt-contrib-less
             *
             * https://github.com/gruntjs/grunt-contrib-less
             *
             * Compile LESS files to CSS
             */
            less: {
                css: {
                    options: {
                        cleancss: false
                    },
                    files: [{
                        src: '<%= paths.less %>main.less',
                        dest: '<%= env.build.target %>css/main.css'
                    }]
                }
            },

            /*
             * grunt-text-replace
             *
             * https://github.com/yoniholmes/grunt-text-replace
             */
            replace: {
                showcase: {
                    src: '<%= env.build.target%>/app/**/*.js',
                    overwrite: true,
                    replacements: [
                        {
                            from: "__MODULE__",
                            to: '<%= env.app.module %>'
                        },
                        {
                            from: "'__CONFIG__'",
                            to: '<%= JSON.stringify(env.app) %>'
                        },
                        {
                            from: "__TEMPLATE_MODULE__",
                            to: '<%= env.app.module %>.app-templates'
                        }
                    ]
                },
                oblique: {
                    src: '<%= env.build.target%>/oblique-reactive/**/*.js',
                    overwrite: true,
                    replacements: [
                        {
                            from: "__TEMPLATE_MODULE__",
                            to: 'oblique-reactive.app-templates'
                        }
                    ]
                }
            },

            /*
             * html2js
             *
             * https://github.com/karlgoldstein/grunt-html2js
             *
             * Converts AngularJS templates to JavaScript
             */
            html2js: {
                options: {
                    amd: true,
                    amdPrefixString: 'exports.templateModuleName = \'__TEMPLATE_MODULE__\';\n',
                    amdSuffixString: ''
                },
                showcase: {
                    module: '<%= env.app.module %>.app-templates',
                    //base: '<%= paths.states %>', //This isn't working
                    src: '<%= paths.app %>**/*.tpl.html',
                    dest: '<%= env.build.target %>app/app-templates.js'
                },
                oblique: {
                    module: 'oblique-reactive.app-templates',
                    //base: '<%= paths.oblique %>',
                    src: '<%= paths.oblique %>**/*.tpl.html',
                    dest: '<%= env.build.target %>oblique-reactive/oblique-reactive-templates.js'
                }
            },

            /*
             * grunt-ng-annotate
             *
             * https://github.com/mzgol/grunt-ng-annotate
             *
             * Grunt plugin to add, remove and rebuild AngularJS dependency injection annotations. Based on ng-annotate.
             */
            ngAnnotate: {
                app: {
                    files: [
                        {
                            cwd: '<%= env.build.target %>',
                            src: ['app/**/*.js'],
                            dest: '<%= env.build.target %>',
                            expand: true
                        }
                    ]
                }
            },

            /*
             * grunt-usemin
             *
             * https://github.com/yeoman/grunt-usemin
             *
             * Replaces references from non-optimized scripts, stylesheets and other assets to their optimized version within a set of HTML files (or any templates/views).
             */
            useminPrepare: {
                options: {
                    dest: '<%= env.build.target %>'
                },
                html: {
                    src: '<%= env.build.target %>index.html'
                }
            },

            /*
             * grunt-filerev
             *
             * https://github.com/yeoman/grunt-filerev
             *
             * Static asset revisioning through file content hash.
             */
            filerev: {
                options: {
                    encoding: 'utf8',
                    algorithm: 'md5',
                    length: 8
                },
                min: {
                    src: '<%= env.build.target %>min/**/*'
                }
            },

            /*
             * grunt-usemin
             *
             * https://github.com/yeoman/grunt-usemin
             *
             * Replaces references to non-optimized scripts or stylesheets into a set of HTML files (or any templates/views).
             */
            usemin: {
                html: '<%= env.build.target %>index.html',
                options: {
                    assetsDirs: ['<%= env.build.target %>']
                }
            },

            /*
             * grunt-karma
             *
             * https://github.com/karma-runner/grunt-karma
             *
             * Grunt plugin for Karma test runner
             */
            karma: {
                unit: {
                    configFile: 'karma.conf.js',
                    logLevel: 'info',
                    singleRun: true
                }
            },

            /*
             * grunt-contrib-watch
             *
             * https://github.com/gruntjs/grunt-contrib-watch
             *
             * Run predefined tasks whenever watched file patterns are added, changed or deleted
             */
            watch: {
                options: {
                    livereload: true,
                    spawn: false
                },
                project: {
                    files: [
                        'project.json',
                        'Gruntfile.js'
                    ],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'build-<%= _currentEnv() %>'
                    ]
                },
                app: {
                    files: [
                        '<%= paths.app %>**/*.js',
                        '<%= paths.app %>**/*.ts',
                        '<%= paths.app %>**/*.json'
                    ],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'tslint',
                        'exec:tsc',
                        'copy:app',
                        'html2js',
                        'replace'
                    ]
                },
                assets: {
                    options: {
                        cwd: '<%= paths.src %>'
                    },
                    files: [
                        'images/**/*',
                        'js/**/*',
                        'fonts/**/*'
                    ],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'copy:assets'
                    ]
                },
                'vendor-js': {
                    options: {
                        cwd: '<%= paths.vendor %>'
                    },
                    files: '{<%= env.resources.vendor.js %>}',
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'copy:vendor-js'
                    ]
                },
                'vendor-css': {
                    options: {
                        cwd: '<%= paths.vendor %>'
                    },
                    files: '{<%= env.resources.vendor.css %>}',
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'copy:vendor-css'
                    ]
                },
                less: {
                    files: ['<%= paths.less %>**/*.less'],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'less'
                    ]
                },
                pages: {
                    files: [
                        '<%= paths.pages %>**/*.hbs',
                        '<%= paths.partials %>**/*.hbs'
                    ],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'assemble'
                    ]
                },
                views: {
                    files: ['<%= paths.app %>**/*.tpl.html'],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'html2js'
                    ]
                },
                prod: {
                    files: [
                        '<%= env.build.target %>app/**/*',
                        '<%= env.build.target %>js/**/*',
                        '<%= env.build.target %>css/**/*',
                        '<%= env.build.target %><%= paths.targetVendor %>**/*'
                    ],
                    tasks: [
                        'config:<%= _currentEnv() %>',
                        'assemble',
                        'optimize'
                    ]
                }
            },

            /*
             * grunt-focus
             *
             * https://github.com/joeytrapp/grunt-focus
             *
             * Configure subsets of `watch` configs and focus your Grunt processes.
             */
            focus: {
                dev: {
                    exclude: ['prod']
                },
                prod: {}
            },

            /*
             * grunt-contrib-connect
             *
             * https://github.com/gruntjs/grunt-contrib-connect
             *
             * Start a connect web server.
             */
            connect: {
                local: {
                    options: {
                        port: 9000, // Port used to deploy the client
                        base: '<%= env.build.target %>',
                        hostname: '<%= env.app.api.hostname %>',
                        index: '<%= env.app.home %>'
                    }
                }
            },

            /*
             * grunt-nodemon
             *
             * https://github.com/ChrisWren/grunt-nodemon
             *
             * Monitor for any changes in your node.js application and automatically restart the server - perfect for development
             * http://nodemon.io/
             */
            nodemon: {
                dummy: {
                    script: 'server/server.js',
                    options: {
                        nodeArgs: ['--debug'],
                        env: {
                            //PORT: '9001'
                        },
                        watch: ['server/']
                    }
                }
            },

            /*
             * grunt-bump
             *
             * https://github.com/vojtajina/grunt-bump
             *
             * Bump package version, create tag, commit, push & more.
             */
            bump: {
                options: {
                    files: ["package.json", "bower.json"],
                    updateConfigs: ["pkg"],
                    commit: true,
                    commitMessage: "Release v%VERSION%",
                    commitFiles: ["."],
                    createTag: true,
                    tagName: "v%VERSION%",
                    tagMessage: "Version v%VERSION%",
                    push: true,
                    pushTo: "origin",
                    gitDescribeOptions: "--tags --always --abbrev=1 --dirty=-d"
                }
            },

            /*
             * Retrieves the current environment name.
             */
            _currentEnv: function () {
                var args = grunt.task.current.args || [];
                return args.length > 1 ? args[1] : "dev"; // Args extracted as <task>[:<target>[:<param>]*]
            }
        }
    )
    ;

    // Build dependencies -------------------------------------------------------
    require('load-grunt-tasks')(grunt, {scope: "devDependencies"});
    grunt.loadNpmTasks('assemble');

    // Project tasks
    // ----------------------------------

    // Build:
    grunt.registerTask('build', [
        'clean',
        'tslint',
        'ts:oblique',
        'exec:tsc',
        'copy',
        'assemble',
        'less',
        'html2js',
        'replace',
        'karma:unit'
    ]);

    grunt.registerTask('build-dev', [
        'config:dev',
        'build'
    ]);

    grunt.registerTask('build-prod', [
        'config:prod',
        'build',
        'optimize'
    ]);

    // Run (build & serve):
    grunt.registerTask('run-dev', [
        'build-dev',
        'configureProxies:local',
        'connect:local',
        'focus:dev:dev'
    ]);

    grunt.registerTask('run-prod-local', [
        'config:prod-local', // workaround for proxy because of cors
        'build',
        'optimize',
        'configureProxies:local',
        'connect:local:keepalive',
        'focus:prod:prod'
    ]);

    grunt.registerTask('run-prod', [
        'build-prod',
        'configureProxies:local',
        'connect:local:keepalive',
        'focus:prod:prod'
    ]);

    /**
     * Optimizes resources for deployment.
     */
    grunt.registerTask("optimize", [
        'browserify',
        'ngAnnotate',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'filerev',
        'usemin',
        'clean:staging'
    ]);

    // Template-only tasks (remove if necessary)
    // ----------------------------------

    // Release (see https://github.com/vojtajina/grunt-bump#usage-examples):
    grunt.registerTask("release", function (target) {
        grunt.task.run([
            "bump-only:" + (target || "patch"),
            "bump-commit"
        ]);
    });

    // Main task aliases
    // ----------------------------------

    // Default:
    grunt.registerTask('default', ['run-dev']);

    // Test-only tasks
    // ----------------------------------
    grunt.registerTask('dummy-server', ['nodemon']);
};
