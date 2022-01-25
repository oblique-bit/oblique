interface Json {
	[key: string]: any;
}

class AdaptPackageJson {
	private static readonly fs = require('fs');
	private static readonly path = require('path');

	static perform(): void {
		const filePath = AdaptPackageJson.path.join('dist', 'oblique', 'package.json');
		const distPackage = AdaptPackageJson.getDistPackage(filePath);
		let adaptedDistPackage = AdaptPackageJson.removeExports(distPackage);
		adaptedDistPackage = AdaptPackageJson.addProperties(adaptedDistPackage);

		AdaptPackageJson.fs.writeFileSync(filePath, JSON.stringify(adaptedDistPackage, null, 2));
	}

	private static getDistPackage(filePath: string): Json {
		return JSON.parse(AdaptPackageJson.fs.readFileSync(filePath));
	}

	private static removeExports(distPackage: Json): Json {
		delete distPackage.exports;
		return distPackage;
	}

	private static addProperties(distPackage: Json): Json {
		const rootPackage = JSON.parse(AdaptPackageJson.fs.readFileSync('package.json'));
		['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs', 'publishConfig'].forEach(
			field => (distPackage[field] = rootPackage[field])
		);

		return distPackage;
	}
}

AdaptPackageJson.perform();
