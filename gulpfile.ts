const fs = require('fs'),
	gulp = require('gulp'),
	git = require('gulp-git'),
	gulpFile = require('gulp-file'),
	header = require('gulp-header'),
	sass = require('node-sass'),
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
	gulp.src(['projects/oblique/src/styles/**/*']).pipe(gulp.dest(paths.dist + 'styles'));

const distMaterialCss = (done) => transpile('material', 'themes', done);
const distBootstrapCss = (done) => transpile('bootstrap', 'themes', done);
const distCoreCss = (done) => transpile('core', '', done);
const distUtilCss = (done) => transpile('utilities', '', done);
const distComponentsCss = (done) => transpileComponents('projects/oblique/src/lib', done);

const distTestHelpers = () => gulp.src(['test_helpers/*']).pipe(gulp.dest(paths.dist + 'test_helpers'));

const distMeta = () => {
	const meta = reload('./package.json');
	const output = require(paths.dist + 'package.json');

	['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs', 'publishConfig']
		.forEach(field => output[field] = meta[field]);

	output['peerDependencies'] = {};
	output['scripts'] = {postinstall: 'node copy.js'};
	Object.keys(meta.dependencies).forEach((dependency) => output['peerDependencies'][dependency] = meta.dependencies[dependency]);

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
		.pipe(gulp.dest(paths.dist + 'styles/css'));
};

const commit = () => gulp.src('.')
	.pipe(git.add())
	.pipe(git.commit('chore(version): release version ' + getPackageJsonVersion()));

gulp.task(
	'dist',
	gulp.parallel(
		distTestHelpers,
		distMeta,
		gulp.series(
			distStyles,
			gulp.parallel(
				distMaterialCss,
				distBootstrapCss,
				distCoreCss,
				distUtilCss,
				distComponentsCss
			),
			distCss
		),
		distBundle
	)
);

gulp.task(
	'publish',
	gulp.series(commit)
);


function reload(module) {
	// Uncache module:
	delete require.cache[require.resolve(module)];

	// Require module again:
	return require(module);
}

function getPackageJsonVersion() {
	// We parse the json file instead of using require because require caches
	// multiple calls so the version number won't be updated
	return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}

function fixPath(url, prev, relative) {
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

function transpile(target, dir, cb) {
	transpileFile('dist/oblique/styles/scss/' + dir + '/oblique-' + target + '.scss', target, true, cb);
}

function transpileFile(file, target, relative, cb) {
	sass.render({
		file: file,
		importer: (url, prev, cbb) => {
			cbb({file: fixPath(url, prev, relative)});
		},
		outputStyle: 'compressed',
		sourceMap: false, // doesn't get generated correctly
		outFile: 'dist/oblique/styles/css/oblique-' + target + '.css'
	}, function (error, result) {
		if (error) {
			console.log(error.message);
		} else {
			if (!fs.existsSync('dist/oblique/styles/css')) {
				fs.mkdirSync('dist/oblique/styles/css');
			}
			fs.writeFile('dist/oblique/styles/css/oblique-' + target + '.css', result.css, (err) => {
				if (err) {
					console.log(err);
				}
				cb();
			});
		}
	});
}

function deleteFile(component) {
	if (fs.existsSync(component)) {
		fs.unlinkSync(component);
	}
}

function generateComponentsStyles(dir, component) {
	fs.readdirSync(dir).forEach(d => {
		if (fs.statSync(path.join(dir, d)).isDirectory()) {
			fs.readdirSync(path.join(dir, d)).forEach(f => {
				if (f.endsWith('scss')) {
					fs.appendFileSync(component, '@import "' + path.join(dir, d, f) + '";\n');
				}
			});
		}
	});
}

function transpileComponents(dir, cb) {
	const component = 'components.scss';
	deleteFile(component);
	generateComponentsStyles(dir, component);
	transpileFile('components.scss', 'components', false, () => {
		deleteFile(component);
		cb();
	});
}
