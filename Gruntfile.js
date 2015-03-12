module.exports = function (grunt) {
	'use strict';

	// Required project configuration:
	var project = grunt.file.readJSON('project.json');

	// Optional build options:
	var paths = {
		src :       'src/',
		app:        'src/app/',
		states:     'src/app/states/',
		less:       'src/less/',
		pages:      'src/pages/',
		data:       'src/templates/data/',
		partials:   'src/templates/partials/',
		helpers:    'src/templates/helpers/',
		vendor:     'vendor/'
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
							name:   'oblique-ui',
							title:  'ObliqueUI',
							path:   'oblique-ui/'
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
		 * grunt-autoprefixer
		 *
		 * https://github.com/nDmitry/grunt-autoprefixer
		 *
		 * Autoprefixer parses CSS and adds vendor-prefixed CSS properties
		 */
		autoprefixer: {
			options: {
				browsers: ['> 1%', 'last 2 versions', 'ie >= 9']
			},
			css: {
				src: '<%= env.build.target  %>css/main.css',
				dest: '<%= env.build.target  %>css/main.css'
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
			project: ['<%= env.build.target %>']

			// TODO: check this
			//tmp: [
			//	'.tmp',
			//	'<%= env.build.target %>js/app/**',
			//	'<%= env.build.target %>js/config.*.js',
			//	'<%= env.build.target %>js/templatesModule.*.js',
			//	'<%= env.build.target %>vendor/**/*',
			//	'!<%= env.build.target %>vendor/oblique-ui/**'
			//]
		},

		/*
		 * grunt-contrib-connect
		 *
		 * https://github.com/gruntjs/grunt-contrib-connect
		 *
		 * Start a connect web server
		 */
		connect: {
			local: {
				options: {
					port: 9000,
					base: '<%= env.build.target %>',
					hostname: 'localhost',
					index: '<%= env.app.home %>',
					middleware: function (connect, options) {
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

						// Serve static files.
						options.base.forEach(function (base) {
							middlewares.push(connect.static(base));
						});

						return middlewares;
					}
				},

				// TODO: check/remove this
				proxies: [
					{
						context: '/api',
						host: 'localhost',
						port: 8080,
						rewrite: {
							'/api': '/api'
						}
					}
				]
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
					src: ['images/**/*'],
					dest: '<%= env.build.target %>',
					expand: true
				}]
			},
			'vendor-js': {
				files: [{
					cwd: '<%= paths.vendor %>',
					src: '<%= env.resources.vendor.js %>',
					dest: '<%= env.build.target %><%= paths.vendor %>',
					expand: true,
					flatten: false/*,
					rename: function (dest, src) {
						return dest + '/' + normalizeResourcePath(src);
					}*/
				}]
			},
			'vendor-css': {
				files: [{
					cwd: '<%= paths.vendor %>',
					src: '<%= env.resources.vendor.css %>',
					dest: '<%= env.build.target %><%= paths.vendor %>',
					expand: true,
					flatten: false
				}]
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
		 * grunt-contrib-jshint
		 *
		 * https://github.com/gruntjs/grunt-contrib-jshint
		 *
		 * Validate files with JSHint
		 */
		jshint: {
			src: ['Gruntfile.js', 'src/**/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		/*
		 * grunt-jscs
		 *
		 * https://github.com/jscs-dev/grunt-jscs
		 *
		 * Grunt task for JSCS
		 */
		jscs: {
			src: ['Gruntfile.js', 'src/**/*.js'],
			options: {
				config: '.jscsrc'
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
						src: 'js/app/**/*.js',
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
			html: '<%= env.build.target %>index.html',
			options: {
				dest: '<%= env.build.target %>',
				staging: '.tmp',
				flow: {
					steps: {
						vendorjs: ['concat'],
						vendorjs_ie8: ['concat'],
						js: ['concat', 'uglifyjs'],
						css: ['concat', 'cssmin']
					},
					post: {}
				}
			}
		},



		usemin: {
			html: '<%= env.build.target %>index.html',
			options: {
				assetsDirs: ['<%= env.build.target %>'],
				blockReplacements: {
					vendorjs: function (block) {
						return '<script src="' + block.dest + '"></script>';
					},
					vendorjs_ie8: function (block) {
						return '<script src="' + block.dest + '"></script>';
					}
				}
			}
		},


		filerev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			js: {
				src: '<%= env.build.target %>js/<%= env.app.module %>.min.js'
			},
			styles: {
				src: '<%= env.build.target %>css/*.*'
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
				files: ['project.json', 'Gruntfile.js'],
				tasks: [
					'config:<%= currentEnv() %>',
					'build-<%= currentEnv() %>'
				]
			},
			app: {
				files: ['<%= paths.app %>**/*.js', '<%= paths.app %>**/*.json'],
				tasks: [
					'config:<%= currentEnv() %>',
					'jscs',
					'jshint',
					'copy:app',
					'html2js:views',
					'replace:config'
				]
			},
			assets: {
				files: ['<%= paths.src %>images/**/*'],
				tasks: [
					'config:<%= currentEnv() %>',
					'copy:assets'
				]
			},
			vendor: {
				options: {
					cwd: '<%= env.build.target %><%= paths.vendor %>'
				},
				files: '{<%= env.resources.vendor %>}',
				tasks: [
					'config:<%= currentEnv() %>',
					'copy:vendor-js',
					'copy:vendor-css'
				]
			},
			less: {
				files: ['<%= paths.less %>**/*.less'],
				tasks: [
					'config:<%= currentEnv() %>',
					'less:css',
					'autoprefixer:css'
				]
			},
			pages: {
				files: ['<%= paths.pages %>**/*.hbs', '<%= paths.partials %>**/*.hbs', '<%= paths.helpers %>**/*.js'],
				tasks: [
					'config:<%= currentEnv() %>',
					'assemble:pages'
				]
			},
			views: {
				files: ['<%= paths.app %>**/*.tpl.html'],
				tasks: [
					'config:<%= currentEnv() %>',
					'html2js:views'
				]
			},
			options: {
				livereload: true
			}
		},

		currentEnv: function() {
			return grunt.task.current.args[0] || "dev";
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
		'jscs',
		'jshint',
		'copy:oblique',
		'copy:app',
		'copy:assets',
		'copy:vendor-js',
		'assemble:pages',
		'less:css',
		'replace:config',
		'autoprefixer:css',
		'html2js:views',
		'ngAnnotate:app'
		//'karma:unit'
	]);

	grunt.registerTask('build-prod', [
		'config:prod',
		'clean',
		'jscs',
		'jshint',
		'copy:oblique',
		'copy:app',
		'copy:assets',
		'copy:vendor-js',
		'assemble:pages',
		'less:css',
		'replace:config',
		'autoprefixer:css',
		'html2js:views',
		'ngAnnotate:app',
		//'karma:unit',
		'useminPrepare',
		'concat:generated',
		'cssmin:generated',
		'uglify:generated',
		'filerev',
		'usemin'
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
	]);

	grunt.registerTask('run-prod', [
		'config:prod',
		'build-prod',
		'serve-prod'
	]);

	// Default:
	grunt.registerTask('default', ['run-dev']);

	// Template-only tasks
	// ----------------------------------

	// Release (see https://github.com/vojtajina/grunt-bump#usage-examples):
	grunt.registerTask("release", function(target) {
		grunt.task.run([
			"bump-only:" + (target || "patch"),
			"bump-commit"
		]);
	});
};
