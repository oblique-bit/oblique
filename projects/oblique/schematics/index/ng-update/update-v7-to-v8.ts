import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addAngularConfigInList, applyInTree, infoMigration, readFile, replaceInFile, setAngularProjectsConfig} from '../utils';
import {ObIDependencies, ObIMigrations} from './ng-update.model';

export interface IUpdateV8Schema {}

export class UpdateV7toV8 implements ObIMigrations {
	dependencies: ObIDependencies = {};

	applyMigrations(_options: IUpdateV8Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			return chain([
				this.prefixScssVariableNames(),
				this.prefixMixinNames(),
				this.removeLayoutCollapse(),
				this.removeDlHorizontalVariants(),
				this.removeCompatCss(),
				this.removeThemeService()
			])(tree, _context);
		};
	}

	private prefixScssVariableNames(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Prefix scss variable names');
			const apply = (filePath: string) => {
				[
					//Palette CI-CD colors
					'venetian-red',
					'red',
					'cerulean',
					'malibu',
					'pattens-blue',
					'solitude',
					'clear-day',
					'mocassin',
					'white',
					'smoke',
					'gainsboro',
					'light-gray',
					'silver',
					'empress',
					'coal',
					'night-rider',
					'black',
					'gray-extra-light',
					'gray-lighter',
					'gray-light',
					'gray',
					'gray-dark',
					'gray-darker',
					//Bootstrap
					'secondary',
					'info',
					'body-width',
					'danger',
					'body-color',
					'link-color',
					'link-hover-color',
					'theme-color-interval',
					'input-color',
					'input-border-color',
					'input-border-radius',
					'input-border-radius-lg',
					'input-border-radius-sm',
					'dropdown-border-color',
					'dropdown-link-color',
					'dropdown-link-hover-color',
					'nav-link-disabled-color',
					'nav-tabs-link-hover-border-color',
					'nav-pills-border-radius',
					'list-group-border-radius',
					'list-group-item-padding-x',
					'modal-content-border-color',
					'alert-border-radius',
					'alert-border-width',
					//Variables
					'duration-default',
					'duration-fast',
					'smaller',
					'smallest',
					'bigger',
					'biggest',
					'font-size-base',
					'font-size-xl',
					'font-size-lg',
					'font-size-sm',
					'font-size-xs',
					'font-size-normal',
					'font-size-biggest',
					'font-size-bigger',
					'font-size-smaller',
					'font-size-smallest',
					'spacing-xl',
					'spacing-lg',
					'spacing-default',
					'spacing-sm',
					'spacing-xs',
					'z-index-default',
					'z-index-controls',
					'z-index-layout',
					'z-index-widget',
					'z-index-overlay',
					'z-index-overlay-top',
					'header-height',
					'header-height-md',
					'header-height-no-navigation',
					'header-height-collapsed',
					'navigation-height',
					'footer-height',
					'footer-height-md',
					'footer-height-sm',
					'footer-height-collapsed',
					'layout-collapse',
					'border-radius-base',
					'navigation-scrollable-padding',
					'column-width',
					'off-canvas-sidebar-width',
					'off-canvas-sidebar-collapsed-width',
					'alert-symbol-width',
					'column-layout-toggle-height',
					'column-layout-toggle-width',
					'column-layout-toggle-radius',
					'sticky-element-height',
					'sticky-element-height-sm',
					'sticky-element-height-lg',
					'stepper-size',
					'stepper-size-sm',
					'stepper-size-lg',
					'stepper-font-size',
					'stepper-sm-font-size',
					'stepper-lg-font-size',
					'table-collapsed-header-width',
					'grid-breakpoints',
					'icon-font-family'
				].forEach(scssVariable => replaceInFile(tree, filePath, new RegExp(`\\$${scssVariable}`, 'g'), `$ob-${scssVariable}`));

				[
					//Brand
					'default',
					'accent',
					'extra-light',
					'light',
					'primary',
					'dark',
					'success-light',
					'success',
					'success-dark',
					'warning-light',
					'warning',
					'warning-dark',
					'error-light',
					'error',
					'error-dark',
					'logo-width',
					'logo-height',
					'logo-height-collapsed',
					'logo-width-collapsed',
					'line-width'
				].forEach(scssVariable => replaceInFile(tree, filePath, new RegExp(`\\$brand-${scssVariable}`, 'g'), `$ob-${scssVariable}`));

				//Palette Oblique colors
				replaceInFile(tree, filePath, new RegExp(/\$(primary|error|gray|success|warning)-(\d00?)/g), '$ob-$1-$2');
			};
			return applyInTree(tree, apply, '*.scss');
		};
	}

	private prefixMixinNames(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Prefix mixin names');
			const apply = (filePath: string) => {
				[
					'callout-styles',
					'firefox',
					'bubble-tail',
					'bubble-tail-border',
					'link-btn',
					'column-separator',
					'layout-collapse-down',
					'layout-collapse-up',
					'media-breakpoint-up',
					'media-breakpoint-down',
					'horizontal-description-list',
					'nav-hover',
					'nav-indent',
					'stepper-state',
					'stepper-variant',
					'table-collapse',
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6',
					'subtitle1',
					'subtitle2',
					'body1',
					'body2',
					'button',
					'caption',
					'overline',
					'badge-styles',
					'btn-variant',
					'mixed-dropdown-btn-group',
					'box-shadow-secondary',
					'checkbox-variant',
					'radio-variant',
					'form-control-validation',
					'icon-base',
					'icon',
					'table-variant',
					'text-control-clear-position',
					'toggle-state',
					'toggle-before',
					'toggle-after',
					'toggle-icon-before',
					'toggle-icon-after',
					'add-toggle',
					'form-field-size',
					'dropShadow',
					'innerBottomShadow',
					'list-title'
				].forEach(mixin => replaceInFile(tree, filePath, new RegExp(`\\@include ${mixin}`, 'g'), `@include ob-${mixin}`));
			};
			return applyInTree(tree, apply, '*.scss');
		};
	}

	private removeLayoutCollapse(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Replacing layout-collapse mixins');
			const apply = (filePath: string) => {
				replaceInFile(tree, filePath, /(?:ob-)?layout-collapse-(up|down)(?:\(\))?/g, `ob-media-breakpoint-$1(md)`);
			};
			return applyInTree(tree, apply, '*.scss');
		};
	}

	private removeDlHorizontalVariants(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove .ob-horizontal-* classes');
			const apply = (filePath: string) => {
				replaceInFile(tree, filePath, new RegExp(/\s?ob-horizontal-(?:large|small)/g), '');
			};
			return applyInTree(tree, apply, '*.html');
		};
	}

	private removeCompatCss(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Removing compat styles');
			return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: any) =>
				(config || []).filter((style: string) => !/node_modules\/@oblique\/oblique\/styles\/css\/oblique-compat\.s?css/.test(style))
			);
		};
	}

	private removeThemeService(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Remove ObThemeService');
			const apply = (filePath: string) => {
				const fileContent = readFile(tree, filePath);
				if (/ObThemeService/.test(fileContent)) {
					const service = fileContent.match(/(?<service>\w*)\s*:\s*ObThemeService,?/)?.groups?.service;
					const theme = this.getCSSPath(fileContent.match(new RegExp(`${service}\\.setTheme\\((?<theme>.*)\\)`))?.groups?.theme || '');
					const font = this.getCSSPath(fileContent.match(new RegExp(`${service}\\.setFont\\((?<font>.*)\\)`))?.groups?.font || '');
					const stylesPath = ['architect', 'build', 'options', 'styles'];
					[theme, font].filter(property => !!property).forEach(property => addAngularConfigInList(tree, stylesPath, property));

					tree.overwrite(
						filePath,
						fileContent
							.replace(/(?:THEMES|FONTS),?(?!\.)\s*/g, '')	// remove imports of THEMES and FONTS
							.replace(/[\w ]*\s*:\s*ObThemeService,?\s*/, '') // remove service injection in constructor
							.replace(/ObThemeService,?\s*/, '') // remove service import
							.replace(new RegExp(`(?:this\.)?${service}\\.set(?:Theme|Font)\\(.*\\);\s*`, 'g'), '') // remove call to setTheme / setFont
							.replace(/,(\s*(?:\)|}))/g, '$1') // remove eventual trailing commas im imports
							.replace(/import\s*{\s*}\s*from\s*['"]@oblique\/oblique['"]\s*;\s*/g, '') // remove empty imports
							.replace(/constructor\s*\(\s*\)\s*{\s*}/g, '') // remove empty imports
					);
				}
			};
			return applyInTree(tree, apply, '*.ts');
		};
	}

	private getCSSPath(themeOrFont: string): string | undefined {
		switch (themeOrFont) {
			case 'oblique-material':
			case 'THEMES.MATERIAL':
				return 'node_modules/@oblique/oblique/styles/css/oblique-material.css';
			case 'oblique-bootstrap':
			case 'THEMES.BOOTSTRAP':
				return 'node_modules/@oblique/oblique/styles/css/oblique-bootstrap.css';
			case 'frutiger':
			case 'FONTS.FRUTIGER':
				return 'node_modules/@oblique/oblique/styles/css/frutiger.css';
			case 'roboto':
			case 'FONTS.ROBOTO':
				return 'node_modules/@oblique/oblique/styles/css/roboto.css';
			default:
				return undefined;
		}
	}
}
