import type {ObSchemaOptions} from '../shared/types';

export interface ObI18nSchemaOptions extends ObSchemaOptions {
	silent: boolean;
	locales: string[];
}
