import {readFileSync, writeFileSync} from 'fs';

type Json = Record<string, any>;
export class PackageJson {
	static write(filePath: string, data: Json): void {
		writeFileSync(filePath, JSON.stringify(data, null, 2));
	}
	static filterOut(filePath: string, fields: string[]): Json {
		return PackageJson.filter(PackageJson.getData(filePath), ([key]) => !fields.includes(key));
	}

	static filterIn(filePath: string, fields: string[]): Json {
		return PackageJson.filter(PackageJson.getData(filePath), ([key]) => fields.includes(key));
	}
	static getData(filePath: string): Json {
		return JSON.parse(readFileSync(filePath).toString());
	}

	private static filter(data: Json, func: (string) => boolean): Json {
		return Object.fromEntries(Object.entries(data).filter(func));
	}
}
