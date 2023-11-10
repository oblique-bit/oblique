import {animate, state, style, transition, trigger} from '@angular/animations';

const visibleStyle = {
	height: '*',
	visibility: 'visible'
};

const hiddenStyle = {
	height: 0,
	visibility: 'hidden'
};

export const animations = trigger('expandCollapse', [
	state('open', style(visibleStyle)),
	state('close', style(hiddenStyle)),
	transition('open <=> close', animate('{{ time }}ms ease-in-out'))
]);
