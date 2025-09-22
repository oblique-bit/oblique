import type {ObEIcon} from '@oblique/oblique';
import type {ObECategory} from './categories.model';

type ObECategoryValue = `${ObECategory}`;
type ObEIconValue = `${ObEIcon}`;

export interface IconMetadata {
	name: ObEIconValue;
	oldName?: string;
	purpose: 'single' | 'multi';
	usage: string;
	category: ObECategoryValue;
	aliases?: string[];
	description: string;
}
