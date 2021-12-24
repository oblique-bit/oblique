class Sanitize {
	private static readonly fs = require('fs');

	static perform(): void {
		if (Sanitize.fs.existsSync('package-lock.json')) {
			Sanitize.fs.writeFileSync(
				'package-lock.json',
				Sanitize.fs
					.readFileSync('package-lock.json')
					.toString()
					.replace(/repo\.bit\.admin\.ch\/repository\/npm-group/g, 'registry.npmjs.org')
			);
		}
	}
}

Sanitize.perform();
