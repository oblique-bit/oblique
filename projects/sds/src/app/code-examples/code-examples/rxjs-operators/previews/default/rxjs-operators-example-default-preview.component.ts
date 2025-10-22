import {obPauseWhenPageHidden} from '@oblique/oblique';
import {Component} from '@angular/core';
import {timer} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AsyncPipe} from '@angular/common';

@Component({
	selector: 'app-rxjs-operators-example-default-preview',
	imports: [AsyncPipe],
	templateUrl: './rxjs-operators-example-default-preview.component.html'
})
export class RxjsOperatorsExampleDefaultPreviewComponent {
	readonly interval = timer(0, 1000).pipe(takeUntilDestroyed(), obPauseWhenPageHidden());
}
