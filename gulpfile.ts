/* eslint-disable */
delete require.cache[require.resolve('./package.json')];
const gulp = require('gulp'),
	header = require('gulp-header'),
	childProcess = require('child_process'),
	paths = {
		dist: './dist/oblique'
	},
	pkg = require('./package.json');

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

gulp.task('dist', addBanner);

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
