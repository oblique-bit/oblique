import {animate, state, style, transition, trigger} from '@angular/animations';

const visibleStyle = {
	height: '*'
};

const hiddenStyle = {
	height: 0
};

export const animations = trigger('expandCollapse', [
	state('open', style(visibleStyle)),
	state('close', style(hiddenStyle)),
	transition('open <=> close', animate('{{ time }}ms ease-in-out'))
]);
