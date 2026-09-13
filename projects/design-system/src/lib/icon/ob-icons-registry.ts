import type {ObRegistrableIcon} from './ob-icon-model';

const registry: Record<string, ObRegistrableIcon> = {};

export const iconsRegistry = {
	registerIcon: (icon: ObRegistrableIcon): void => {
		registry[icon.key] = icon;
	},

	registerIcons: (icons: ObRegistrableIcon[]): void => {
		icons.forEach(icon => iconsRegistry.registerIcon(icon));
	},

	getIcon: (key: string): ObRegistrableIcon | null => {
		return registry[key] || null;
	},

	getAllIconKeys: (): ObRegistrableIcon[] => {
		return Object.values(registry);
	},
};
