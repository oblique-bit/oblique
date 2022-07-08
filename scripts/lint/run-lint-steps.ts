import {Eslint} from './steps/eslint';
import {Prettier} from './steps/prettier';
import {Stylelint} from './steps/stylelint';

Eslint.perform();
Stylelint.perform();
Prettier.perform('--check');
