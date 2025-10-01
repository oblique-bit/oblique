# Oblique Tour

The Oblique Tour Library provides a reusable and accessible Angular solution for implementing interactive onboarding tours within applications using the Oblique framework.

This package is the `@oblique/ob-tour` library distributed on NPM.

See [README.md](../../README.md) for information about the other packages.

## Documentation

The official Oblique documentation is located here: [https://oblique.bit.admin.ch/](https://oblique.bit.admin.ch/)

You will find information about how to use Oblique, its Tour library, code samples, FAQ and more.

---

## Usage

### 1. Create a new application with Oblique CLI

If you are using the official Oblique CLI:

```bash
npx @oblique/cli new your-app-name
```

For further instructions go to: "https://oblique.bit.admin.ch/introductions/getting-started-as-a-developer", under "Creating a new Oblique application".

After this, install @oblique/ob-tour:

```bash
npm i @oblique/ob-tour
```

This command automatically installs all required dependencies, including `@oblique/oblique`, `@oblique/ob-tour`, and `@angular/material`, and sets up the correct configuration for you.

---

### 2. Manual installation (without CLI)

If you want to add Oblique Tour manually to an existing Angular project:

#### Install dependencies

```bash
npm install @oblique/ob-tour @oblique/oblique @ngx-translate/core @ngx-translate/http-loader @angular/material
```

---

#### Update the global styles

In your `angular.json`, under `build.options.styles`, add:

```json
"styles": [
  "node_modules/@oblique/oblique/styles/css/oblique-core.css",
  "src/styles.scss"
]
```

Make sure your production bundle limits are increased:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "1.7mb",
    "maximumError": "2mb"
  }
]
```

---

#### Add fonts and Material icons

In your `index.html` head section:

```html
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet" /> <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
```

---

#### Configure translation loading

In your `angular.json`, extend the build assets to include translations:

```json
"assets": [
  {
    "glob": "**/*.json",
    "input": "projects/full-of-content/assets",
    "output": "assets"
  },
  {
    "glob": "**/*.json",
    "input": "node_modules/@oblique/ob-tour/assets/i18n",
    "output": "assets/i18n"
  },
  {
    "glob": "**/*.json",
    "input": "node_modules/@oblique/oblique/assets/i18n",
    "output": "assets/i18n"
  }
]
```

---

#### Provide translation and HTTP configuration

In your main application configuration:

```typescript
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideAppInitializer, inject } from "@angular/core";
import { ObIconService } from "@oblique/oblique";

export const appConfig = {
	providers: [provideHttpClient(withInterceptorsFromDi()), provideAppInitializer(() => inject(ObIconService))],
};
```

Then provide translations using a combined loader:

```typescript
import { HttpClient } from "@angular/common/http";
import { importProvidersFrom } from "@angular/core";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { Observable, forkJoin, map } from "rxjs";

export function provideTranslations() {
	return importProvidersFrom(
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (http: HttpClient) => new CombinedTranslateLoader(http),
				deps: [HttpClient],
			},
			defaultLanguage: "en",
		}),
	);
}

export class CombinedTranslateLoader implements TranslateLoader {
	constructor(private readonly http: HttpClient) {}

	getTranslation(lang: string): Observable<Record<string, unknown>> {
		const obTourTranslations = this.http.get<Record<string, unknown>>(`./assets/i18n/ob-tour-${lang}.json`);
		const obliqueTranslations = this.http.get<Record<string, unknown>>(`./assets/i18n/oblique-${lang}.json`);

		return forkJoin([obliqueTranslations, obTourTranslations]).pipe(map(([oblique, obTour]) => ({ ...oblique, ...obTour })));
	}
}
```

---

### 3. Configure tours

Define your tour set and use the components in your app:

```typescript
import { Component } from "@angular/core";
import { ObtTourMenuComponent, ObtTourSet } from "@oblique/ob-tour";
import { MatIconModule } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, ObtTourMenuComponent, MatIconModule],
	template: `<obt-tour-menu [tours]="toursSet"></obt-tour-menu>`,
})
export class AppComponent {
	readonly toursSet: ObtTourSet = {
		tours: [
			{
				tourTitle: "Welcome Tour",
				storageKey: "welcomeTour",
				steps: [
					{ stepTitle: "Welcome", stepDescription: "Learn how to navigate the app." },
					{ stepTitle: "Menu", stepDescription: "Access features using the left panel." },
				],
			},
		],
	};
}
```

---

## Accessibility

Oblique Tour complies with **WCAG 2.1 AA**, **BehiG**, and **eCH-0059** accessibility standards.
It includes:

- Full keyboard navigation
- Accessible overlays and ARIA attributes
- Focus management and restoration

---

## Testing locally

To build and test the library locally:

```bash
npm run build -w projects/ob-tour
cd dist/ob-tour
npm link
```

Then link it into your app project:

```bash
npm link @oblique/ob-tour
```

Run your Angular app and interact with the tours.

---

## Contribute to Oblique Tour

If you’d like to contribute, please follow our [contributing guidelines](../../CONTRIBUTING.md).
Contributions must comply with Oblique coding, linting and accessibility standards.

---

## License

Copyright (c)
The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
