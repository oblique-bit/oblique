/* eslint-disable */
delete require.cache[require.resolve('./package.json')];
const fs = require('fs'),
	gulp = require('gulp'),
	header = require('gulp-header'),
	replace = require('gulp-replace'),
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

const addBanner = () => {
	const releaseDate = getTodayDate();
	const endOfLifeDate = getEndOfLifeDate(`${pkg.version.split('.')[0]}.0.0`);

	return gulp
		.src([`${paths.dist}/**/*.js`, `${paths.dist}/**/*.css`])
		.pipe(
			header(
				`/**
* @file Oblique, The front-end framework for your Swiss branded UI.
* @copyright 2020 - ${new Date().getFullYear()} Federal Office of Information Technology, Systems and Telecommunication FOITT {@link http://www.bit.admin.ch}
* @version ${pkg.version} (released on ${releaseDate}, supported at least until ${endOfLifeDate})
* @author Oblique team, FOITT, BS-BSC-EN4 <oblique@bit.admin.ch>
* @license MIT {@link https://oblique.bit.admin.ch/license}
* @see http://oblique.bit.oblique.ch
*/
`
			)
		)
		.pipe(gulp.dest(paths.dist));
};

const distMeta = () => gulp.src(['README.md', 'CHANGELOG.md', 'LICENSE']).pipe(gulp.dest(paths.dist));

const distCss = () =>
	gulp
		.src(`${paths.dist}/styles/css/oblique-core.css`)
		.pipe(replace(/(?<=url\()fa-/g, `~@oblique/oblique/styles/fonts/fa-`))
		.pipe(gulp.dest(`${paths.dist}/styles/css`));

const distBgImage = () =>
	gulp
		.src(`${paths.dist}/styles/css/oblique-components.css`)
		.pipe(replace('cover-background.jpg', '~@oblique/oblique/assets/images/cover-background.jpg'))
		.pipe(gulp.dest(`${paths.dist}/styles/css`));

const distFonts = () =>
	gulp
		.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/*', './node_modules/font-awesome/fonts/*', `${paths.src}/styles/fonts/*`])
		.pipe(gulp.dest(`${paths.dist}/styles/fonts`));

const distFontAwesome = () =>
	gulp.src('./node_modules/@fortawesome/fontawesome-free/scss/*').pipe(gulp.dest(`${paths.dist}/styles/scss/fontawesome`));

const distScss = () =>
	gulp
		.src(`${paths.dist}/styles/scss/**/*.scss`)
		.pipe(replace(`${paths.fa}/webfonts`, `${paths.oblique}/fonts`))
		.pipe(replace(`${paths.fa}/scss`, `${paths.oblique}/scss/fontawesome`))
		.pipe(gulp.dest(`${paths.dist}/styles/scss`));

const distDocs = () =>
	gulp.src([`${paths.src}/lib/**/*.description.html`, `${paths.src}/lib/**/*.api.json`]).pipe(gulp.dest(`${paths.dist}/lib`));

gulp.task(
	'dist',
	gulp.parallel(
		distMeta,
		distFonts,
		distDocs,
		distFontAwesome,
		distAssets,
		gulp.series(distStyles, distScss, distCss, distBgImage, addBanner)
	)
);

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
