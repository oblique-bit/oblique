import {rmSync} from 'node:fs';
import {generateCSS} from './tokens/style-dictionary.mjs';
import {listModes} from './tokens/themes.mjs';

const libPath = 'src/lib';
const themesFolder = 'src/lib/themes';
const modes = listModes(themesFolder);
await generateCSS(modes, libPath);
rmSync(themesFolder, {recursive: true, force: true});
