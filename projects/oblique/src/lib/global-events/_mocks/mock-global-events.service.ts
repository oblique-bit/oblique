import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable()
export class ObMockGlobalEventsService {
	public readonly beforeUnload$ = of({} as BeforeUnloadEvent);
	public readonly click$ = of({} as MouseEvent);
	public readonly mouseMove$ = of({} as MouseEvent);
	public readonly mouseDown$ = of({} as MouseEvent);
	public readonly keyUp$ = of({} as KeyboardEvent);
	public readonly keyDown$ = of({} as KeyboardEvent);
	public readonly scroll$ = of({} as Event);
	public readonly wheel$ = of({} as Event);
	public readonly resize$ = of({} as UIEvent);
}
