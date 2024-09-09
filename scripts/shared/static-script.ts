export abstract class StaticScript {
	protected static instance: StaticScript;

	// the protected constructor prevents the script from being instantiated
	protected constructor() {
		if (StaticScript.instance) {
			// neither "fatal" method nor "Log" class can be used as it would create a circular dependency
			console.error('The "finalize" method needs to be called before calling "initialize" again');
			process.exit(-1);
		}
	}

	finalize(): void {
		StaticScript.instance = undefined;
	}
}
