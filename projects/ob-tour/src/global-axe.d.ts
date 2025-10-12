import 'jest-axe';

// globaler Namespace ist in allen Jest-Versionen stabil
declare global {
	namespace jest {
		interface Matchers<R> {
			toHaveNoViolations: () => R;
		}
	}
}
export {};
