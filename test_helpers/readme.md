# Test helpers
These are helpers for tests, mainly mocks for Oblique or frequently used pipes.

## Caution: generated content 
These helpers are distributed with Oblique as part of the library. They are copied into your project with a `postinstall` script. 
This means that each time the `npm i` or `npm ci` commands are invoked, they will be generated anew.
You can skip this behavior with the `--ignore-scrips` flag.

Generated files should not by synced, therefore you should add `/test_helpers` to your `.gitignore` file.

## Typescript config
For better usability, add a shortcut in your `tsconfig.json`. Under `compilerOptions.path`, add

    "tests": [
        "test_helpers"
    ]
The path may have to be adjusted according to the `baseUrl` property value.

This will enable you to easily import mocks in your tests:

    import {MockTranslatePipe} from 'tests';
