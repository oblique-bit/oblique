var conventionalChangelog = require('conventional-changelog'),
	fs = require('fs');

var changelog = fs.readFileSync('CHANGELOG.md');
var writestream = fs.createWriteStream('CHANGELOG.md');

conventionalChangelog({
	preset: 'angular'
}).pipe(writestream);
writestream.on('finish', function () {
	fs.appendFileSync('CHANGELOG.md', changelog);
});


