import {Component} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {timer} from 'rxjs';
import {obPauseWhenPageHidden} from '@oblique/oblique';

@Component({
	selector: 'sb-rxjs-operators',
	standalone: false,
	templateUrl: './rxjs-operators.component.html'
})
export class RxjsOperatorsComponent {
	readonly interval = timer(0, 1000).pipe(takeUntilDestroyed(), obPauseWhenPageHidden());
}
