// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class StaticScript {
	protected static instance: StaticScript;

	// the protected constructor prevents the script from being instantiated
	protected constructor() {
		if (StaticScript.instance) {
			throw new Error('The "finalize" method needs to be called before calling "initialize" again.');
		}
	}

	finalize(): void {
		StaticScript.instance = undefined;
	}
}
