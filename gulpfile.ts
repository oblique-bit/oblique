const fs = require('fs'),
	gulp = require('gulp'),
	git = require('gulp-git'),
	gulpFile = require('gulp-file'),
	header = require('gulp-header'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	merge = require('merge-stream'),
	sass = require('node-sass'),
	del = require('del'),
	path = require('path'),
	paths = {
		dist: './dist/oblique/'
	},
	banner = function (pkg) {
		return '/*! \r * ' + pkg.title + ' - v' + pkg.version
			+ '\r * ' + pkg.homepage
			+ '\r * Copyright (c) ' + new Date().getFullYear() + ' ' + pkg.organization.name + ' (' + pkg.organization.url + ')'
			+ '\r */\n';
	};


const distStyles = () =>
	gulp.src(['projects/oblique/src/styles/**/*'])
		.pipe(gulp.dest(paths.dist + 'styles'));

const distMaterialCss = (done) => transpile('material', 'themes', done);
const distBootstrapCss = (done) => transpile('bootstrap', 'themes', done);
const distCoreCss = (done) => transpile('core', '', done);
const distUtilCss = (done) => transpile('utilities', '', done);
const distCompatCss = (done) => transpile('compat', '', done);
const distComponentsCss = (done) => transpileComponents(['projects', 'oblique', 'src', 'lib'], done);

const distTestHelpers = () => gulp.src(['test_helpers/*']).pipe(gulp.dest(paths.dist + 'test_helpers'));

const distMeta = () => {
	const meta = reload('./package.json');
	const output = require(paths.dist + 'package.json');

	['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs', 'publishConfig']
		.forEach(field => output[field] = meta[field]);
	['main', 'module', 'es2015', 'esm5', 'esm2015', 'fesm5', 'fesm2015', 'typings', 'metadata']
		.forEach(field => output[field] = output[field].replace('oblique-oblique', 'oblique'));
	output['scripts'] = {postinstall: 'node copy.js'};

	return gulp.src(['README.md', 'CHANGELOG.md', 'copy.js'])
		.pipe(gulpFile('package.json', JSON.stringify(output, null, 2)))
		.pipe(gulp.dest(paths.dist));
};

const distBundle = () => {
	const meta = reload('./package.json');
	return gulp.src(paths.dist + 'bundles/oblique.umd.js')
		.pipe(header(banner(meta)))
		.pipe(gulp.dest(paths.dist + 'bundles'));
};

const distCss = () => {
	const meta = reload('./package.json');
	return gulp.src(paths.dist + 'styles/css/*')
		.pipe(header(banner(meta)))
		.pipe(replace('~@fortawesome/fontawesome-free/webfonts', '~@oblique/oblique/styles/fonts'))
		.pipe(gulp.dest(paths.dist + 'styles/css'));
};

const distFonts = () => {
	return gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*', './node_modules/font-awesome/fonts/*'])
		.pipe(gulp.dest(paths.dist + 'styles/fonts'));
};

const distFontAwesome = () => {
	return gulp.src('./node_modules/@fortawesome/fontawesome-free/scss/*')
		.pipe(gulp.dest(paths.dist + 'styles/scss/fontawesome'));
};

const distScss = () =>
	gulp.src(paths.dist + 'styles/scss/**/*.scss')
		.pipe(replace('~@fortawesome/fontawesome-free/webfonts', '~@oblique/oblique/styles/fonts'))
		.pipe(replace('~@fortawesome/fontawesome-free/scss/', '~@oblique/oblique/styles/scss/fontawesome/'))
		.pipe(gulp.dest(paths.dist + 'styles/scss'));

const distDocs = () => {
	return gulp.src(['./projects/oblique/src/lib/**/*.description.html', './projects/oblique/src/lib/**/*.api.json'])
		.pipe(gulp.dest(paths.dist + 'lib'));
};

const commit = () => gulp.src('.')
	.pipe(git.add())
	.pipe(git.commit('chore(version): release version ' + getPackageJsonVersion()));

const distRename = () => {
	const streams = [];
	const stream = gulp.src(`dist/oblique/**/oblique-oblique*`)
		.pipe(rename((filename) => filename.basename = filename.basename.replace('oblique-oblique', 'oblique')))
		.pipe(gulp.dest('dist/oblique'));
	streams.push(stream);
	return merge(streams);
};

const clean = () => del('dist/oblique/**/oblique-oblique*');

gulp.task(
	'dist',
	gulp.parallel(
		distTestHelpers,
		distMeta,
		distFonts,
		distDocs,
		distFontAwesome,
		gulp.series(
			distStyles,
			gulp.parallel(
				distMaterialCss,
				distBootstrapCss,
				distCoreCss,
				distUtilCss,
				distCompatCss,
				distComponentsCss
			),
			distScss,
			distCss
		),
		gulp.series(distRename, clean, distBundle)
	)
);

gulp.task(
	'publish',
	gulp.series(commit)
);

gulp.task('themes',
	gulp.series(
		distStyles,
		gulp.parallel(
			distMaterialCss,
			distBootstrapCss,
			distCompatCss
		)
	)
);


function reload(module: string) {
	// Uncache module:
	delete require.cache[require.resolve(module)];

	// Require module again:
	return require(module);
}

function getPackageJsonVersion(): string {
	// We parse the json file instead of using require because require caches
	// multiple calls so the version number won't be updated
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function fixPath(url: string, prev: string, relative: boolean): string {
	if (!url.startsWith('~')) {
		return url;
	}

	if (!relative) {
		return url.replace('~', 'node_modules/');
	}

	const level = prev.split('/').reverse().indexOf('scss');
	const base = ['..', '..', '..', 'node_modules', ''];
	for (let i = 0; i < level; i++) {
		base.unshift('..');
	}
	return url.replace('~', base.join('/'));

}

function transpile(target: string, dir: string, cb): void {
	transpileFile(['dist', 'oblique', 'styles', 'scss', dir, 'oblique-' + target + '.scss'], target, true, cb);
}

function transpileFile(file: string[], target: string, relative: boolean, cb): void {
	const distCssPath = path.join('dist', 'oblique', 'styles', 'css');
	sass.render({
		file: path.join(...file),
		importer: (url, prev, cbb) => {
			cbb({file: fixPath(url, prev, relative)});
		},
		outputStyle: 'compressed',
		sourceMap: false, // doesn't get generated correctly
		outFile: 'dist/oblique/styles/css/oblique-' + target + '.css'
	}, (error, result) => {
		if (error) {
			console.log(error.message);
		} else {
			if (!fs.existsSync(distCssPath)) {
				fs.mkdirSync(distCssPath);
			}
			fs.writeFile(path.join('dist', 'oblique', 'styles', 'css', 'oblique-' + target + '.css'), result.css, (err) => {
				if (err) {
					console.log(err);
				}
				cb();
			});
		}
	});
}

function deleteFile(component: string): void {
	if (fs.existsSync(component)) {
		fs.unlinkSync(component);
	}
}

function generateComponentsStyles(dir: string[], component: string): void {
	fs.readdirSync(path.join(...dir)).forEach(file => {
		if (fs.statSync(path.join(...dir, file)).isDirectory()) {
			generateComponentsStyles([...dir, file], component);
		} else if (file.endsWith('scss')) {
			fs.appendFileSync(component, `@import "${dir.join('/')}/${file}";\n`);
		}
	});
}

function transpileComponents(dir: string[], cb): void {
	const component = 'components.scss';
	deleteFile(component);
	generateComponentsStyles(dir, component);
	transpileFile(['components.scss'], 'components', false, () => {
		deleteFile(component);
		cb();
	});
}
