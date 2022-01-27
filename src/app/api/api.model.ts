export interface ObIAPI {
	name: string;
	selector?: string;
	exported?: string;
	usage?: string;
	type?: string;
	since: string;
	updated?: string;
	variables?: ObIAPIelement[];
	inputs?: ObIAPIelement[];
	outputs?: ObIAPIelement[];
	methods?: ObIAPIelement[];
	projection?: ObIAPIelement[];
	internationalization?: ObIAPIelement[];
	tokens?: ObIAPIelement[];
}

export interface ObIAPIelement {
	name: string;
	text: string;
	type?: string;
	values?: any[];
	arguments?: string[];
	returns?: string;
	see?: string;
	default?: string | boolean | number;
	since: string;
	updated?: string;
	isOptional?: boolean;
}
