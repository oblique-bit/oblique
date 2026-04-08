import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import {Log} from './log';
import {Files} from './files';

export async function minifyCss(source: string, destination: string): Promise<void> {
	Log.info(`Create a minified version of ${source}`);
	const result = await postcss([postcssImport, autoprefixer, cssnano]).process(Files.read(source), {
		from: source,
		to: destination,
		map: {inline: false},
	});
	Files.write(destination, result.css);
	if (result.map) {
		Files.write(`${destination}.map`, result.map.toString());
	}
}
