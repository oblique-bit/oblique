import type {ObSchemaOptions} from '../shared/types';

export interface ObLintingSchemaOptions extends ObSchemaOptions {
	silent: boolean;
	prefix: string;
}
