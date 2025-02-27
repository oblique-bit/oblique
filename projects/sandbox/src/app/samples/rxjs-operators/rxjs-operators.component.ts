import {Component} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {timer} from 'rxjs';
import {obPauseWhenPageHidden} from '@oblique/oblique';

@Component({
	selector: 'sb-rxjs-operators',
	templateUrl: './rxjs-operators.component.html',
	standalone: false
})
export class RxjsOperatorsComponent {
	readonly interval = timer(0, 1000).pipe(takeUntilDestroyed(), obPauseWhenPageHidden());
}
