import {copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, unlinkSync, writeFileSync} from 'fs';
import path from 'path';

export class Files {
	static readonly separator = path.sep;

	static read(filePath: string): string {
		return readFileSync(Files.buildOSPath(filePath)).toString('utf8');
	}

	static readJson<T>(filePath: string): T {
		return JSON.parse(Files.read(filePath));
	}

	static overwrite(filePath: string, replace: (content: string) => string): void {
		Files.write(filePath, replace(Files.read(filePath)));
	}

	static write(filePath: string, content: string): void {
		writeFileSync(Files.buildOSPath(filePath), content);
	}

	static writeJson(filePath: string, content: Record<string, unknown>): void {
		return Files.write(filePath, JSON.stringify(content, null, 2));
	}

	static readDirectory(filePath: string): string[] {
		return readdirSync(Files.buildOSPath(filePath));
	}

	static isDirectory(filePath: string): boolean {
		return statSync(Files.buildOSPath(filePath)).isDirectory();
	}

	static rename(oldPath: string, newPath: string): void {
		renameSync(Files.buildOSPath(oldPath), Files.buildOSPath(newPath));
	}

	static remove(filePath: string): void {
		const target = Files.buildOSPath(filePath);
		if (Files.isDirectory(target)) {
			rmSync(target, {recursive: true});
		} else {
			unlinkSync(target);
		}
	}

	static exists(filePath: string): boolean {
		return existsSync(Files.buildOSPath(filePath));
	}

	static copy(sourcePath: string, destinationPath: string): void {
		const destination = Files.buildOSPath(destinationPath);
		mkdirSync(path.dirname(destination), {recursive: true});
		copyFileSync(Files.buildOSPath(sourcePath), destination);
	}

	static list(directory: string): string[] {
		const directoryPath = Files.buildOSPath(directory);
		return Files.readDirectory(directory)
			.map(fileName => path.join(directoryPath, fileName))
			.reduce<string[]>(
				(filePaths, filePath) => (Files.isDirectory(filePath) ? [...filePaths, ...Files.list(filePath)] : [...filePaths, filePath]),
				[]
			);
	}

	private static buildOSPath(filePath: string): string {
		return path.join(...filePath.split('/'));
	}
}
