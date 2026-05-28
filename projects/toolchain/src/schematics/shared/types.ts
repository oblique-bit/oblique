import type {JsonValue} from '@angular-devkit/core';

export interface ObJsonProperty {
	key: string;
	value: JsonValue;
}

export type ObMakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export interface ObSchemaOptions {
	silent: boolean;
}
