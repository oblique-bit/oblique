
module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './dist/bundles/oblique2-reactive.js',
        library: 'oblique2-reactive',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',

    externals: [
        {
            '@angular/core': ngExternal('core'),
            '@angular/common': ngExternal('common'),
            '@angular/forms': ngExternal('forms')
        },
        rxjsExternal
    ],
    resolve: {
        extensions: ['.ts']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                //exclude: /node_modules/,
                loader: ['ts-loader', 'angular2-template-loader?keepUrl=true'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.(html|css)$/,
                loader: 'raw-loader',
                exclude: /\.async\.(html|css)$/
            },
        ]
    }
};

function ngExternal(ns) {
    var ng2Ns = '@angular/' + ns;
    return {root: ['ng', ns], commonjs: ng2Ns, commonjs2: ng2Ns, amd: ng2Ns};
}

function rxjsExternal(context, request, cb) {
    if (/^rxjs\/add\/observable\//.test(request)) {
        return cb(null, {root: ['Rx', 'Observable'], commonjs: request, commonjs2: request, amd: request});
    } else if (/^rxjs\/add\/operator\//.test(request)) {
        return cb(null, {root: ['Rx', 'Observable', 'prototype'], commonjs: request, commonjs2: request, amd: request});
    } else if (/^rxjs\//.test(request)) {
        return cb(null, {root: ['Rx'], commonjs: request, commonjs2: request, amd: request});
    }
    cb();
}