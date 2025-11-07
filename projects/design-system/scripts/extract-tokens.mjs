import {rmSync} from 'node:fs';
import {getThemes} from './tokens/themes.mjs';
import {generateCSS} from './tokens/style-dictionary.mjs';

const libPath = 'src/lib';
const themesFolder = 'src/lib/themes';
const themes = getThemes(themesFolder);
await generateCSS(themes, libPath);
rmSync(themesFolder, {recursive: true, force: true});
