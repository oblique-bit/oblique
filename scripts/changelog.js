var conventionalChangelog = require('conventional-changelog'),
	fs = require('fs');

var changelog = fs.readFileSync('CHANGELOG.md');
var writestream = fs.createWriteStream('CHANGELOG.md');

conventionalChangelog({
	preset: 'angular'
}).pipe(writestream);
writestream.on('finish', function () {
	fs.appendFileSync('CHANGELOG.md', changelog)
	fs.readFile('CHANGELOG.md', 'utf-8', function(err, data) {
		var result = data.replace(/\/scm\/oui\/oblique2-reactive\/compare\/(?:\d\.\d\.\d)(?:-RC\.\d)?\.\.\.(.+)/, '/projects/OUI/repos/oblique2-reactive/browse?at=$1')
		fs.writeFileSync('CHANGELOG.md', result);
	});
});
