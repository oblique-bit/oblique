/* eslint-disable */
delete require.cache[require.resolve('./package.json')];
const fs = require('fs'),
	gulp = require('gulp'),
	git = require('gulp-git'),
	gulpFile = require('gulp-file'),
	header = require('gulp-header'),
	rename = require('gulp-rename'),
	replace = require('gulp-replace'),
	sass = require('node-sass'),
	del = require('del'),
	path = require('path'),
	childProcess = require('child_process'),
	paths = {
		dist: './dist/oblique',
		src: './projects/oblique/src',
		fa: '~@fortawesome/fontawesome-free',
		oblique: '~@oblique/oblique/styles'
	},
	pkg = require('./package.json');

const distStyles = () => gulp.src([`${paths.src}/styles/**/*`]).pipe(gulp.dest(`${paths.dist}/styles`));
const distAssets = () => gulp.src([`${paths.src}/assets/**/*`]).pipe(gulp.dest(`${paths.dist}/assets`));
const distMaterialCss = (done) => transpile('material', 'themes', done);
const distBootstrapCss = (done) => transpile('bootstrap', 'themes', done);
const distCoreCss = (done) => transpile('core', '', done);
const distUtilCss = (done) => transpile('utilities', '', done);
const distCompatCss = (done) => transpile('compat', '', done);
const distComponentsCss = (done) => transpileComponents(`${paths.src}/lib`, done);

const addBanner = () => {
	const releaseDate = childProcess.execSync(`git show -s --format=%ci ${pkg.version}`).toString().split(' ')[0];
	const endOfLifeDate = getEndOfLifeDate(`${pkg.version.split('.')[0]}.0.0`);

	return gulp.src([`${paths.dist}/**/*.js`, `${paths.dist}/**/*.css`])
		.pipe(header(
			`/**
* @file Oblique, The front-end framework for your Swiss branded UI.
* @copyright 2020 - ${new Date().getFullYear()} Federal Office of Information Technology, Systems and Telecommunication FOITT {@link http://www.bit.admin.ch}
* @version ${pkg.version} (released on ${releaseDate}, supported at least until ${endOfLifeDate})
* @author ObliqueTeam, BIT-BS-PAC-EWM <oblique@bit.admin.ch>
* @license MIT {@link https://oblique.bit.admin.ch/license}
* @see http://oblique.bit.oblique.ch
*/
`))
		.pipe(gulp.dest(paths.dist));
}

const distMeta = () => {
	const output = require(`${paths.dist}/package.json`);

	['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs', 'publishConfig']
		.forEach(field => output[field] = pkg[field]);
	['main', 'module', 'es2015', 'esm2015', 'fesm2015', 'typings', 'metadata']
		.forEach(field => output[field] = output[field].replace('oblique-oblique', 'oblique'));

	return gulp.src(['README.md', 'CHANGELOG.md', 'LICENSE'])
		.pipe(gulpFile('package.json', JSON.stringify(output, null, 2)))
		.pipe(gulp.dest(paths.dist));
};

const distCss = () => gulp.src(`${paths.dist}/styles/css/*`)
	.pipe(replace(`${paths.fa}/webfonts`, `${paths.oblique}/fonts`))
	.pipe(gulp.dest(`${paths.dist}/styles/css`));

const distBgImage = () => gulp.src(`${paths.dist}/styles/css/oblique-components.css`)
	.pipe(replace('../../../assets/images/cover-background.jpg', '../../assets/images/cover-background.jpg'))
	.pipe(gulp.dest(`${paths.dist}/styles/css`));

const distFonts = () => gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*', './node_modules/font-awesome/fonts/*', `${paths.src}/styles/fonts/*`])
	.pipe(gulp.dest(`${paths.dist}/styles/fonts`));

const distFontAwesome = () => gulp.src('./node_modules/@fortawesome/fontawesome-free/scss/*')
	.pipe(gulp.dest(`${paths.dist}/styles/scss/fontawesome`));

const distBundles = () => gulp.src([`${paths.dist}/bundles/*.js`, `${paths.dist}/fesm5/*.js`, `${paths.dist}/fesm2015/*.js`])
	.pipe(replace('oblique-oblique', 'oblique'))
	.pipe(gulp.dest(file => file.base));

const distScss = () => gulp.src(`${paths.dist}/styles/scss/**/*.scss`)
	.pipe(replace(`${paths.fa}/webfonts`, `${paths.oblique}/fonts`))
	.pipe(replace(`${paths.fa}/scss`, `${paths.oblique}/scss/fontawesome`))
	.pipe(gulp.dest(`${paths.dist}/styles/scss`));

const distDocs = () => gulp.src([`${paths.src}/lib/**/*.description.html`, `${paths.src}/lib/**/*.api.json`])
	.pipe(gulp.dest(`${paths.dist}/lib`));

const distMap = () => gulp.src(`${paths.dist}/**/*.map`)
	.pipe(replace('oblique-oblique', 'oblique'))
	.pipe(gulp.dest(paths.dist));

const commit = () => gulp.src('.')
	.pipe(git.add())
	.pipe(git.commit(`chore(toolchain): release version ${pkg.version}`));

const distRename = () => gulp.src(`${paths.dist}/**/oblique-oblique*`)
	.pipe(rename((filename) => filename.basename = filename.basename.replace('oblique-oblique', 'oblique')))
	.pipe(gulp.dest(paths.dist));

const clean = () => del(`${paths.dist}/**/oblique-oblique*`);

const telemetryPre = () => gulp.src(`${paths.src}/lib/telemetry/telemetry-record.ts`)
	.pipe(replace('require(\'package.json\')', '\'_REQUIRE_PACKAGE_PLACEHOLDER_\''))
	.pipe(replace('require(\'package-lock.json\').dependencies[\'@oblique/oblique\'].version', '\'_OBLIQUE_VERSION_PLACEHOLDER_\''))
	.pipe(gulp.dest(`${paths.src}/lib/telemetry`));

const telemetryPost = () => gulp.src(`${paths.src}/lib/telemetry/telemetry-record.ts`)
	.pipe(replace('\'_REQUIRE_PACKAGE_PLACEHOLDER_\'', 'require(\'package.json\')'))
	.pipe(replace('\'_OBLIQUE_VERSION_PLACEHOLDER_\'', 'require(\'package-lock.json\').dependencies[\'@oblique/oblique\'].version'))
	.pipe(gulp.dest(`${paths.src}/lib/telemetry`));

const postLib = () => gulp.src(`${paths.dist}/**/*.js`)
	.pipe(replace('\'_REQUIRE_PACKAGE_PLACEHOLDER_\'', 'require(\'package.json\')'))
	.pipe(replace('\'_OBLIQUE_VERSION_PLACEHOLDER_\'', 'require(\'package-lock.json\').dependencies[\'@oblique/oblique\'].version'))
	.pipe(replace('require(\'!!raw-loader!../../assets/obliqueIcons.svg\')', 'require(\'!!raw-loader!@oblique/oblique/assets/obliqueIcons.svg\')'))
	.pipe(gulp.dest(paths.dist));

gulp.task(
	'dist',
	gulp.parallel(
		telemetryPost,
		distMeta,
		distFonts,
		distDocs,
		distFontAwesome,
		distBundles,
		distAssets,
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
			distCss,
			distRename,
			distBgImage,
			postLib,
			gulp.parallel(
				addBanner,
				distMap
			),
			clean
		)
	)
);

gulp.task('pre-dist', telemetryPre);

gulp.task(
	'publish',
	gulp.series(commit)
);

gulp.task('themes',
	gulp.parallel(
		distAssets,
		gulp.series(
			distStyles,
			gulp.parallel(
				distMaterialCss,
				distBootstrapCss,
				distCompatCss
			)
		)
	)
);

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
	transpileFile(['dist', 'oblique', 'styles', 'scss', dir, `oblique-${target}.scss`], target, true, cb);
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
		outFile: `dist/oblique/styles/css/oblique-${target}.css`
	}, (error, result) => {
		if (error) {
			console.log(error.message);
		} else {
			if (!fs.existsSync(distCssPath)) {
				fs.mkdirSync(distCssPath);
			}
			fs.writeFile(path.join('dist', 'oblique', 'styles', 'css', `oblique-${target}.css`), result.css, (err) => {
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
		} else if (file.endsWith('ts')) {
			const content = fs.readFileSync(path.join(...dir, file), 'utf8').replace(/\s/g, '');
			const stylePattern = /styleUrls:(\[(.*?)\]){1}/;
			const result = content.match(stylePattern);
			if (result) {
				const styleUrls = JSON.parse(result[0].replace('styleUrls:', '').replace(/'/g, '"').trim());
				styleUrls.filter(url => url.indexOf('..') === -1)
					.map(url => url.replace(/.\//g, ''))
					.map(url => `${dir.join('/')}/${url}`)
					.forEach(stylePath => fs.appendFileSync(component, `@import "${stylePath}";\n`));
			}
		}
	});
}

function transpileComponents(dir: string, cb): void {
	const component = 'components.scss';
	deleteFile(component);
	generateComponentsStyles(dir.split('/'), component);
	transpileFile(['components.scss'], 'components', false, () => {
		deleteFile(component);
		cb();
	});
}

function getEndOfLifeDate(version) {
	const versionReleaseDate = childProcess.execSync(`git show -s --format=%ci ${version}`).toString().split(' ')[0];
	const endOfLifeDate = new Date(versionReleaseDate);
	endOfLifeDate.setFullYear(endOfLifeDate.getFullYear() + 1, endOfLifeDate.getMonth() + 1, 0);
	return endOfLifeDate.toISOString().split('T')[0];
}
