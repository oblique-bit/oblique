import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

export const animations = trigger('inOut', [
	state('in', style({opacity: 1})),
	transition(
		'* => in',
		[
			animate(
				'650ms ease-in-out',
				keyframes([
					style({offset: 0, opacity: 0, maxHeight: 0, transform: 'translateX({{translateX}})', overflow: 'hidden'}),
					style({offset: 0.6, opacity: 0, maxHeight: '500px', transform: 'translateX({{translateX}})', overflow: 'hidden'}),
					style({offset: 1, opacity: 1, maxHeight: 'none', transform: 'translateX(0)', overflow: 'hidden'})
				])
			)
		],
		{params: {translateX: '15%'}}
	),
	state('in-left', style({opacity: 1})),
	transition(
		'* => in-left',
		[
			animate(
				'650ms ease-in-out',
				keyframes([
					style({offset: 0, opacity: 0, maxHeight: 0, transform: 'translateX({{translateX}})', overflow: 'hidden'}),
					style({offset: 0.6, opacity: 0, maxHeight: '500px', transform: 'translateX({{translateX}})', overflow: 'hidden'}),
					style({offset: 1, opacity: 1, maxHeight: 'none', transform: 'translateX(0)', overflow: 'hidden'})
				])
			)
		],
		{params: {translateX: '-15%'}}
	),
	state('in-first', style({opacity: 1})),
	transition('* => in-first', [
		animate(
			'350ms ease-in-out',
			keyframes([style({offset: 0, opacity: 0, transform: 'translateX(15%)'}), style({offset: 1, opacity: 1, transform: 'translateX(0)'})])
		)
	]),
	state('in-first-left', style({opacity: 1})),
	transition('* => in-first-left', [
		animate(
			'350ms ease-in-out',
			keyframes([style({offset: 0, opacity: 0, transform: 'translateX(-15%)'}), style({offset: 1, opacity: 1, transform: 'translateX(0)'})])
		)
	]),
	state('out', style({opacity: 0, maxHeight: 0, overflow: 'hidden', display: 'none'})),
	transition('* => out', [
		animate(
			'350ms ease-in-out',
			keyframes([
				style({offset: 0, opacity: 1, maxHeight: '500px', overflow: 'hidden'}),
				style({offset: 0.2, opacity: 0, maxHeight: '500px', overflow: 'hidden'}),
				style({offset: 1, opacity: 0, maxHeight: 0, overflow: 'hidden'})
			])
		)
	])
]);
