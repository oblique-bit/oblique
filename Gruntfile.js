module.exports = function (grunt) {
	'use strict';

	// Required project configuration:
	var project = grunt.file.readJSON('project.json');

	// Optional build configuration:
	var paths = {
		src :       'src/',
		app:        'src/app/',
		states:     'src/app/states/',
		less:       'src/less/',
		pages:      'src/pages/',
		data:       'src/templates/data/',
		partials:   'src/templates/partials/',
		helpers:    'src/templates/helpers/',
		vendor:     'vendor/',
		staging:    '.tmp'
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
						env : project.dev
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

		/*
		 * grunt-contrib-jshint
		 *
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 *
		 * Validate files with JSHint, a tool that helps to detect errors and potential problems in your JavaScript code.
		 */
		jshint: {
			src: ['Gruntfile.js', '<%= paths.src %>**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		/*
		 * grunt-jscs
		 *
		 * https://github.com/jscs-dev/grunt-jscs
		 *
		 * Grunt task for JSCS, a *code style* linter for programmatically enforcing your style guide.
		 */
		jscs: {
			src: ['Gruntfile.js', '<%= paths.src %>**/*.js'],
			options: {
				config: '.jscsrc'
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
					cwd: 'vendor/oblique-ui/dist/',
					src: '**/*',
					dest: '<%= env.build.target %>vendor/oblique-ui/'
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
					dest: '<%= env.build.target %><%= paths.vendor %>',
					expand: true
				}]
			},
			'vendor-css': {
				files: [{
					cwd: '<%= paths.vendor %>',
					src: '<%= env.resources.vendor.css %>',
					dest: '<%= env.build.target %><%= paths.vendor %>',
					expand: true
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
				paths: '<%= paths%>',

				data: [
					'package.json',
					'<%= paths.data %>**/*.json'
				],
				layout: false, // Using `composable` layouts, see why here: https://github.com/assemble/assemble/issues/555
				layoutdir: '<%= paths.vendor %>oblique-ui/templates/layouts/',
				partials: [
					'<%= paths.vendor %>oblique-ui/templates/**/*.hbs',
					'<%= paths.partials %>**/*.hbs'
				],
				helpers: [
					'handlebars-helper-prettify',
					'<%= paths.vendor %>oblique-ui/templates/helpers/**/*.js',
					'<%= paths.helpers %>**/*.js'
				],

				// Layout placeholders override:
				'html-attrs': 'ng-controller="AppController as appController"',
				'ui-layout': "{{appController.layout}}",

				// App-specific configuration used by ObliqueUI layouts:
				app: {
					name: '<%= env.app.module %>',
					title: '<%= env.app.title %>',
					description: '<%= env.app.description %>',
					lang: '<%= env.app.defaults.locale %>',
					home: '<%= env.app.home %>',
					pages: '',
					vendor: {
						path: '<%= paths.vendor %>',
						obliqueui: {
							name: 'oblique-ui',
							title: 'ObliqueUI',
							path: 'oblique-ui/'
						}
					},

					// Theming:
					theme: {
						'has-transitions':      true,
						'has-tooltips':         true,
						'has-sticky-footer':    false
					},
					offsets: {
						intermediary: 160,
						final: 320
					}
				},

				// Prettify (https://github.com/jonschlinkert/grunt-prettify, https://github.com/helpers/handlebars-helper-prettify)
				prettify: {
					condense:               true,
					indent:                 1,
					"indent_char":          "	",  // Required for Markdown
					padcomments:            false,
					"indent_handlebars":    true,   // Format and indent {{#foo}}...{{/foo}}
					"indent_inner_html":    true    // Indent <head> and <body> sections
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
			config: {
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
				module: '<%= env.app.module %>.app-templates',
				base: '<%= paths.states %>'
			},
			views: {
				src: '<%= paths.app %>**/*.tpl.html',
				dest: '<%= env.build.target %>app/app-templates.js'
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
				files: ['<%= paths.app %>**/*.js', '<%= paths.app %>**/*.json'],
				tasks: [
					'config:<%= _currentEnv() %>',
					'jshint',
					'jscs',
					'copy:app',
					'html2js',
					'replace'
				]
			},
			assets: {
				options: {
					cwd: '<%= paths.src %>'
				},
				files: ['images/**/*', 'js/**/*', 'fonts/**/*'],
				tasks: [
					'config:<%= _currentEnv() %>',
					'copy:assets'
				]
			},
			'vendor-js': {
				options: {
					cwd: '<%= env.build.target %><%= paths.vendor %>'
				},
				files: '{<%= env.resources.vendor.js %>}',
				tasks: [
					'config:<%= _currentEnv() %>',
					'copy:vendor-js'
				]
			},
			'vendor-css': {
				options: {
					cwd: '<%= env.build.target %><%= paths.vendor %>'
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
					'<%= paths.partials %>**/*.hbs',
					'<%= paths.helpers %>**/*.js'
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
					'<%= env.build.target %>vendor/**/*'
				],
				tasks: [
					'config:<%= _currentEnv() %>',
					'assemble',
					'optimize'
				]
			},
			options: {
				livereload: true
			}
		},

		/*
		 * grunt-focus
		 *
		 * https://github.com/joeytrapp/grunt-focus
		 *
		 * Configure subsets of watch configs and focus your Grunt processes.
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
					port: 9000,
					base: '<%= env.build.target %>',
					hostname: 'localhost',
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
				options:{
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
	});

	// Build dependencies -------------------------------------------------------
	require('load-grunt-tasks')(grunt, {scope: "devDependencies"});
	grunt.loadNpmTasks('assemble');

	// Project tasks
	// ----------------------------------

	// Build:
	grunt.registerTask('build-dev', [
		'config:dev',
		'clean',
		'jshint',
		'jscs',
		'copy',
		'assemble',
		'less',
		'replace',
		'html2js'
	]);

	grunt.registerTask('build-prod', [
		'build-dev',
		'ngAnnotate',
		'optimize',
		'clean:staging'
		//'karma:unit',
	]);

	grunt.registerTask('watch-dev', [
		'config:dev',
		'focus:dev:dev'
	]);

	grunt.registerTask('watch-prod', [
		'config:prod',
		'focus:prod:prod'
	]);

	// Serve:
	grunt.registerTask('serve-dev', [
		'config:dev',
		'connect:local',
		'watch'
	]);

	grunt.registerTask('serve-prod', [
		'config:prod',
		'connect:local:keepalive',
		'watch::prod'
	]);

	// Run (build & serve):
	grunt.registerTask('run-dev', [
		'config:dev',
		'build-dev',
		'serve-dev'
		//'karma:unit'
	]);

	grunt.registerTask('run-prod', [
		'config:prod',
		'build-prod',
		'serve-prod'
		//'karma:unit'
	]);

	/**
	 * Optimizes resources for deployment.
	 */
	grunt.registerTask("optimize", [
		'useminPrepare',
		'concat',
		'cssmin',
		'uglify',
		'filerev',
		'usemin'
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
