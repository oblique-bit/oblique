import {Eslint} from './steps/eslint';
import {Prettier} from './steps/prettier';
import {Stylelint} from './steps/stylelint';

Eslint.perform('--fix');
Stylelint.perform('--fix');
Prettier.perform('--write');
