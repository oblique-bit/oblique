const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');

const {NoEmitOnErrorsPlugin, LoaderOptionsPlugin} = require('webpack');
const {GlobCopyWebpackPlugin, BaseHrefWebpackPlugin} = require('@angular/cli/plugins/webpack');
const {CommonsChunkPlugin} = require('webpack').optimize;
const {AotPlugin} = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "styles", "vendor", "main"];
const baseHref = "";
const deployUrl = "";
const PORT = 9000;

module.exports = {
    "devtool": "source-map",
    "resolve": {
        "extensions": [
            ".ts",
            ".js"
        ],
        "modules": [
           // "./node_modules",
	    nodeModules
        ],
        "alias": {
            "jquery": "jquery/src/jquery"
        }
    },
    "resolveLoader": {
        "modules": [
            "./node_modules"
        ]
    },
    "entry": {
        "main": [
            "./showcase/main.ts"
        ],
        "polyfills": [
            "./showcase/polyfills.ts"
        ],
        "styles": [
            "./node_modules/oblique-ui/dist/css/oblique-ui.css",
            "./showcase/sass/styles.scss"
        ],
        "vendor": [
            "./node_modules/bootstrap/dist/js/bootstrap.js",
            "./node_modules/waypoints/lib/jquery.waypoints.js", // FIXME: decouple ObliqueUI from Waypoints
            "./node_modules/oblique-ui/dist/js/oblique-ui.js"
            //"./node_modules/oblique-ui/dist/js/oblique-ui.bundle.js" // FIXME: using ObliqueUI JS bundle will import jQuery twice
        ]
    },
    "output": {
        "path": path.join(process.cwd(), "target"),
        "filename": "[name].bundle.js",
        "chunkFilename": "[id].chunk.js"
    },
    "module": {
        "rules": [
            {
                "enforce": "pre",
                "test": /\.js$/,
                "loader": "source-map-loader",
                "exclude": [
                    /\/node_modules\//
                ]
            },
            {
                "test": /\.json$/,
                "loader": "json-loader"
            },
            {
                "test": /\.html$/,
                "loader": "raw-loader"
            },
            {
                "test": /\.(eot|svg)$/,
                "loader": "file-loader?name=[name].[hash:20].[ext]"
            },
            {
                "test": /\.(jpg|png|gif|otf|ttf|woff|woff2|cur|ani)$/,
                "loader": "url-loader?name=[name].[hash:20].[ext]&limit=10000"
            },
            {
                "exclude": [
                    path.join(process.cwd(), "node_modules/oblique-ui/dist/css/oblique-ui.css"),
                    path.join(process.cwd(), "showcase/sass/styles.scss")
                ],
                "test": /\.css$/,
                "loaders": [
                    "exports-loader?module.exports.toString()",
                    "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
                    "postcss-loader"
                ]
            },
            {
                "exclude": [
                    path.join(process.cwd(), "node_modules/oblique-ui/dist/css/oblique-ui.css"),
                    path.join(process.cwd(), "showcase/sass/styles.scss")
                ],
                "test": /\.scss$|\.sass$/,
                "loaders": [
                    "exports-loader?module.exports.toString()",
                    "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                "include": [
                    path.join(process.cwd(), "node_modules/oblique-ui/dist/css/oblique-ui.css"),
                    path.join(process.cwd(), "showcase/sass/styles.scss")
                ],
                "test": /\.css$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
                        "postcss-loader"
                    ],
                    "fallback": "style-loader",
                    "publicPath": ""
                })
            },
            {
                "include": [
                    path.join(process.cwd(), "node_modules/oblique-ui/dist/css/oblique-ui.css"),
                    path.join(process.cwd(), "showcase/sass/styles.scss")
                ],
                "test": /\.scss$|\.sass$/,
                "loaders": ExtractTextPlugin.extract({
                    "use": [
                        "css-loader?{\"sourceMap\":false,\"importLoaders\":1}",
                        "postcss-loader",
                        "sass-loader"
                    ],
                    "fallback": "style-loader",
                    "publicPath": ""
                })
            },
            {
                "test": /\.ts$/,
                "loader": "@ngtools/webpack"
            },
            // Custom loaders:
            {
                "test": /\.hbs$/,
                "loader": {
                    "loader": "handlebars-compile-loader",
                    "options": {
                        partials: [
                            'node_modules/oblique-ui/templates/layouts/**/*.hbs',
                            'node_modules/oblique-ui/templates/partials/**/*.hbs',
                            'showcase/partials/*.hbs'
                        ],
                        helpers: [
                            'node_modules/handlebars-helpers/lib/**/*.js',
                            'node_modules/handlebars-layouts/dist/handlebars-layouts.js',
                            'node_modules/oblique-ui/templates/helpers/**/*.js',
                            'node_modules/oblique-ui/templates/helpers/**/*.ts'
                        ],
                        data: {
                            app: {
                                version: 'vTODO',
                                name: 'oblique-ui',
                                title: 'ObliqueUI',
                                description: 'TODO',
                                home: 'index.html',
                                lang: 'en',
                                organization: {
                                    name: 'Federal Office of Information Technology, Systems and Telecommunication FOITT',
                                    url: 'http://www.bit.admin.ch',
                                    email: 'info@bit.admin.ch',
                                    contact: false
                                },
                                theme: {
                                    tooltips: true,
                                    application: {
                                        fixed: false
                                    },
                                    header: {
                                        transitions: true
                                    },
                                    navigation: {
                                        scrollable: true
                                    }
                                },
                                vendor: {
                                    path: 'assets/',
                                    obliqueui: {
                                        name: 'oblique-ui',
                                        title: 'ObliqueUI',
                                        path: 'oblique-ui/'
                                    }
                                }
                            }
                        },
                        parsePartialName: function (options, file) {
                            return file.path.split(path.sep).pop().replace('.hbs', '');
                        }
                    }
                }
            }
        ]
    },
    "plugins": [
        new NoEmitOnErrorsPlugin(),
        new GlobCopyWebpackPlugin({
            "patterns": [
                "assets"
            ],
            "globOptions": {
                "cwd": "./showcase",
                "dot": true,
                "ignore": "**/.gitkeep"
            }
        }),
        new ProgressPlugin(),
        new HtmlWebpackPlugin({
            "template": "./showcase/index.hbs",
            //"filename": "./index.html",
            "hash": false,
            "inject": true,
            "compile": true,
            "favicon": './node_modules/oblique-ui/dist/images/favicon.png',
            "minify": false,
            "cache": true,
            "showErrors": true,
            "chunks": "all",
            "excludeChunks": [],
            "title": "Webpack App",
            "xhtml": true,
            "chunksSortMode": function sort(left, right) {
                let leftIndex = entryPoints.indexOf(left.names[0]);
                let rightindex = entryPoints.indexOf(right.names[0]);
                if (leftIndex > rightindex) {
                    return 1;
                }
                else if (leftIndex < rightindex) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        }),
        new BaseHrefWebpackPlugin({}),
        new CommonsChunkPlugin({
            "name": "inline",
            "minChunks": null
        }),
        new CommonsChunkPlugin({
            "name": "vendor",
            "minChunks": (module) => module.resource && (module.resource.startsWith(nodeModules) || !module.resource.startsWith(process.cwd())),
            "chunks": [
                "main"
            ]
        }),
        new ExtractTextPlugin({
            "filename": "[name].bundle.css",
            "disable": true
        }),
        new LoaderOptionsPlugin({
            "sourceMap": false,
            "options": {
                //TODO: We can probably remove this, we do not use postcss
                "postcss": [
                    autoprefixer(),
                    postcssUrl({
                        "url": (URL) => {
                            // Only convert root relative URLs, which CSS-Loader won't process into require().
                            if (!URL.startsWith('/') || URL.startsWith('//')) {
                                return URL;
                            }
                            if (deployUrl.match(/:\/\//)) {
                                // If deployUrl contains a scheme, ignore baseHref use deployUrl as is.
                                return `${deployUrl.replace(/\/$/, '')}${URL}`;
                            }
                            else {
                                // Join together base-href, deploy-url and the original URL.
                                // Also dedupe multiple slashes into single ones.
                                return `/${baseHref}/${deployUrl}/${URL}`.replace(/\/\/+/g, '/');
                            }
                        }
                    })
                ],
                "sassLoader": {
                    "sourceMap": false,
                    "includePaths": []
                },
                "lessLoader": {
                    "sourceMap": false
                },
                "context": ""
            }
        }),
        new AotPlugin({
            "mainPath": "main.ts",
            "hostReplacementPaths": {
                "environments/environment.ts": "environments/environment.ts"
            },
            "exclude": [],
            "tsConfigPath": "showcase/tsconfig.app.json",
            "skipCodeGeneration": true
        }),
        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Tether: "tether" // For Bootstrap tooltips
        }),
        new TransferWebpackPlugin([{
            from: 'node_modules/oblique-ui/dist/images/',
            to:    'assets/oblique-ui/images'
        }], __dirname),
        new OpenBrowserPlugin({ url: 'http://localhost:' + PORT })
    ],
    "node": {
        "fs": "empty",
        "global": true,
        "crypto": "empty",
        "tls": "empty",
        "net": "empty",
        "process": true,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    },
    devServer: {
        port: PORT,
        historyApiFallback: true
    }
};
