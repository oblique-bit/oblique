/* eslint-disable */
delete require.cache[require.resolve('./package.json')];
const fs = require('fs'),
	gulp = require('gulp'),
	git = require('gulp-git'),
	header = require('gulp-header'),
	replace = require('gulp-replace'),
	sass = require('sass'),
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
const distMaterialCss = async (done) => transpile('material', 'themes', done);
const distBootstrapCss = async (done) => transpile('bootstrap', 'themes', done);
const distCoreCss = async (done) => transpile('core', '', done);
const distUtilCss = async (done) => transpile('utilities', '', done);
const distComponentsCss = async (done) => transpileComponents(`${paths.src}/lib`, done);
const distAlertCss = async (done) => transpileFile(['dist', 'oblique', 'styles', 'scss', 'oblique-alert.scss'], 'alert', done);
const distIconCss = async (done) => transpileFile(['dist', 'oblique', 'styles', 'scss', 'oblique-icons.scss'], 'icons', done);

const addBanner = () => {
	const releaseDate = getTodayDate();
	const endOfLifeDate = getEndOfLifeDate(`${pkg.version.split('.')[0]}.0.0`);

	return gulp.src([`${paths.dist}/**/*.js`, `${paths.dist}/**/*.css`])
		.pipe(header(
			`/**
* @file Oblique, The front-end framework for your Swiss branded UI.
* @copyright 2020 - ${new Date().getFullYear()} Federal Office of Information Technology, Systems and Telecommunication FOITT {@link http://www.bit.admin.ch}
* @version ${pkg.version} (released on ${releaseDate}, supported at least until ${endOfLifeDate})
* @author Oblique team, FOITT, BS-BSC-EN4 <oblique@bit.admin.ch>
* @license MIT {@link https://oblique.bit.admin.ch/license}
* @see http://oblique.bit.oblique.ch
*/
`))
		.pipe(gulp.dest(paths.dist));
}

const distMeta = () => gulp.src(['README.md', 'CHANGELOG.md', 'LICENSE']).pipe(gulp.dest(paths.dist));

const distCss = () => gulp.src(`${paths.dist}/styles/css/*`)
	.pipe(replace(`${paths.fa}/webfonts`, `${paths.oblique}/fonts`))
	.pipe(replace(`../../fonts/`, `../fonts/`))
	.pipe(gulp.dest(`${paths.dist}/styles/css`));

const distBgImage = () => gulp.src(`${paths.dist}/styles/css/oblique-components.css`)
	.pipe(replace('../../../assets/images/cover-background.jpg', '../../assets/images/cover-background.jpg'))
	.pipe(gulp.dest(`${paths.dist}/styles/css`));

const distFonts = () => gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*', './node_modules/font-awesome/fonts/*', `${paths.src}/styles/fonts/*`])
	.pipe(gulp.dest(`${paths.dist}/styles/fonts`));

const distFontAwesome = () => gulp.src('./node_modules/@fortawesome/fontawesome-free/scss/*')
	.pipe(gulp.dest(`${paths.dist}/styles/scss/fontawesome`));

const distScss = () => gulp.src(`${paths.dist}/styles/scss/**/*.scss`)
	.pipe(replace(`${paths.fa}/webfonts`, `${paths.oblique}/fonts`))
	.pipe(replace(`${paths.fa}/scss`, `${paths.oblique}/scss/fontawesome`))
	.pipe(gulp.dest(`${paths.dist}/styles/scss`));

const distDocs = () => gulp.src([`${paths.src}/lib/**/*.description.html`, `${paths.src}/lib/**/*.api.json`])
	.pipe(gulp.dest(`${paths.dist}/lib`));

const commit = () => gulp.src('.')
	.pipe(git.add())
	.pipe(git.commit(`chore(toolchain): release version ${pkg.version}`));

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
	.pipe(gulp.dest(paths.dist));

gulp.task(
	'dist',
	gulp.parallel(
		telemetryPost,
		distMeta,
		distFonts,
		distDocs,
		distFontAwesome,
		distAssets,
		gulp.series(
			distStyles,
			gulp.parallel(
				distMaterialCss,
				distBootstrapCss,
				distCoreCss,
				distUtilCss,
				distComponentsCss,
				distIconCss,
				distAlertCss
			),
			distScss,
			distCss,
			distBgImage,
			postLib,
			addBanner
		)
	)
);

gulp.task('pre-dist', telemetryPre);

gulp.task(
	'publish',
	gulp.series(commit)
);

function transpile(target: string, dir: string, cb): void {
	transpileFile(['dist', 'oblique', 'styles', 'scss', dir, `oblique-${target}.scss`], target, cb);
}

function transpileFile(file: string[], target: string, cb): void {
	const distCssPath = path.join('dist', 'oblique', 'styles', 'css');
	sass.render({
		file: path.join(...file),
		importer: (url, prev, cbb) => {
			cbb({
				file: url.replace('~', 'node_modules/')
			});
		},
		outputStyle: 'compressed',
		sourceMap: false, // doesn't get generated correctly
		outFile: `dist/oblique/styles/css/oblique-${target}.css`,
		quietDeps: true
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
	transpileFile(['components.scss'], 'components', () => {
		deleteFile(component);
		cb();
	});
}

function getEndOfLifeDate(version) {
	const versionReleaseDate = getTagDate(version);
	const endOfLifeDate = new Date(versionReleaseDate);
	endOfLifeDate.setFullYear(endOfLifeDate.getFullYear() + 1, endOfLifeDate.getMonth() + 1, 0);
	return endOfLifeDate.toISOString().split('T')[0];
}

function getTagDate(tag: string): string {
	if (childProcess.execSync(`git tag -l "${tag}"`).toString()) {
		return childProcess.execSync(`git show -s --format=%ci ${tag}`).toString().split(' ')[0];
	} else {
		return getTodayDate();
	}
}

function getTodayDate(): string {
	return new Date().toISOString().split('T')[0];
}
