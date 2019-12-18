import {Injectable} from '@angular/core';

@Injectable()
export class MockPopUpService {
	public confirm(message?: string): boolean {
		return true;
	}

	public alert(message?: any): void {
	}

	public prompt(message?: string, _default?: string): string | null {
		return null;
	}
}
