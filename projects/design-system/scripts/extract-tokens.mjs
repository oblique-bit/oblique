import {rmSync} from 'node:fs';
import {getThemes} from './tokens/themes.mjs';

const themesFolder = 'src/lib/themes';
const themes = getThemes(themesFolder);
console.log(themes);
rmSync(themesFolder, {recursive: true, force: true});
