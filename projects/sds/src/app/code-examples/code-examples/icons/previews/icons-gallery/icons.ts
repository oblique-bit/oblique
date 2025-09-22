/* eslint-disable max-lines */
import type {IconMetadata} from './icons.model';

export const iconMetadata: IconMetadata[] = [
	{
		name: 'home',
		purpose: 'single',
		usage: 'Reserved for the homepage in the global navigation.',
		category: 'Navigation',
		aliases: ['homepage', 'startseite', 'landing page', 'hauptseite', 'front page', 'index', 'dashboard'],
		description: 'An icon for a home or start page represented by a house with a pitched roof.'
	},
	{
		name: 'menu',
		purpose: 'single',
		usage: 'Reserved for opening the main navigation menu.',
		category: 'Navigation',
		aliases: ['hamburger', 'navigation', 'navbar', 'menü', 'dropdown', 'burger menu', '3 lines', 'mobile menu'],
		description: 'Three horizontal lines representing the main menu.'
	},
	{
		name: 'apps',
		purpose: 'single',
		usage: 'Reserved for a menu containing multiple applications or services.',
		category: 'Navigation',
		aliases: [
			'applications',
			'anwendungen',
			'app launcher',
			'app switcher',
			'software',
			'programs',
			'dienste',
			'widgets',
			'services',
			'service panel',
			'menu'
		],
		description: '3 by 3 grid of circles representing a collection of applications or services.'
	},
	{
		name: 'search',
		purpose: 'single',
		usage: 'Reserved for a search.',
		category: 'Navigation',
		aliases: ['finden', 'suche', 'magnifying glass', 'magnifier', 'lupe', 'query', 'finden', 'lookup', 'discover'],
		description: 'A magnifying glass symbol representing search functionality.'
	},
	{
		name: 'login',
		purpose: 'single',
		usage: 'Reserved for log in.',
		category: 'Navigation',
		aliases: [
			'signin',
			'log in',
			'sign in',
			'log-in',
			'sign-in',
			'anmelden',
			'account',
			'einloggen',
			'zugang',
			'konto',
			'user',
			'access',
			'enter',
			'account',
			'authentication',
			'sign up',
			'sign-up'
		],
		description: 'An arrow pointing to the right into a doorway, indicating login.'
	},
	{
		name: 'logout',
		purpose: 'single',
		usage: 'Reserved for log out.',
		category: 'Navigation',
		aliases: [
			'signout',
			'logout',
			'sign out',
			'log out',
			'sign-out',
			'log-out',
			'abmelden',
			'exit',
			'ausloggen',
			'verlassen',
			'beenden',
			'disconnect',
			'account',
			'end session'
		],
		description: 'An arrow pointing to the right out of a doorway, indicating logout.'
	},
	{
		name: 'bookmark',
		purpose: 'single',
		usage: 'Reserved for saving content as a favorite or bookmark.',
		category: 'Navigation',
		aliases: ['favorite', 'lesezeichen', 'save', 'favorit', 'pin', 'merken', 'star', 'speichern'],
		description: 'A ribbon-shaped symbol representing saving content or adding it to favorites.'
	},
	{
		name: 'link',
		purpose: 'single',
		usage: 'Reserved for links, URLs, and copy link.',
		category: 'Navigation',
		aliases: ['verknüpfung', 'hyperlink', 'url', 'weblink', 'connect', 'verbindung', 'chain', 'website', 'www', 'https'],
		description: 'A diagonally tilted chain of three connected parts, symbolizing a hyperlink or URL.'
	},
	{
		oldName: 'unlink',
		name: 'link_disconnect',
		purpose: 'single',
		usage: 'Reserved for removing an existing link.',
		category: 'Navigation',
		aliases: [
			'trennen',
			'disconnect',
			'hyperlink',
			'url',
			'weblink',
			'unlink',
			'remove link',
			'break',
			'separate',
			'chain break',
			'cut link',
			'delete connection',
			'www',
			'https'
		],
		description: 'A broken chain with small fragments or splashes, symbolizing link removal or disconnection.'
	},
	{
		oldName: 'external',
		name: 'link_external',
		purpose: 'single',
		usage:
			'Reserved for links that open in a new tab or lead to external websites or resources.\nFor internal links use the link icon. For navigating within the same page use the anchor icon.',
		category: 'Navigation',
		aliases: [
			'extern',
			'new tab',
			'neuer tab',
			'new window',
			'neues fenster',
			'url',
			'hyperlink',
			'outside',
			'offsite',
			'redirect',
			'outbound',
			'external',
			'ausserhalb',
			'open in',
			'www',
			'https',
			'website',
			'shortcut'
		],
		description: 'External link icon – an arrow pointing out of a square.'
	},
	{
		name: 'anchor',
		purpose: 'single',
		usage: 'Reserved for linking to a specific section or location within the same page.',
		category: 'Navigation',
		aliases: [
			'link',
			'root',
			'anker',
			'fixpoint',
			'festpunkt',
			'sprunglink',
			'position',
			'stable',
			'fix',
			'web anchor',
			'reference',
			'verknüpfung',
			'hyperlink',
			'url',
			'weblink',
			'website',
			'www',
			'https'
		],
		description: 'A ship anchor symbol indicating an in-page link.'
	},
	{
		oldName: 'more',
		name: 'show-more_vertical',
		purpose: 'single',
		usage: 'Reserved for more actions menus and overflows.\nNot intended for expanding table rows; use the chevron_down icon instead.',
		category: 'Navigation',
		aliases: [
			'vertical',
			'mehr',
			'additional',
			'options',
			'extras',
			'weiteres',
			'continue',
			'additional',
			'expand',
			'more',
			'show more',
			'three dots',
			'actions',
			'menu'
		],
		description: 'Three vertical dots representing a more options menu.'
	},
	{
		name: 'show-more_horizontal',
		purpose: 'single',
		usage: 'Reserved for more actions menus and overflows.\nNot intended for expanding table rows; use the chevron_down icon instead.',
		category: 'Navigation',
		aliases: [
			'horizontal',
			'mehr',
			'additional',
			'options',
			'extras',
			'weiteres',
			'continue',
			'additional',
			'expand',
			'more',
			'show more',
			'three dots',
			'actions',
			'menu'
		],
		description: 'Three horizontal dots representing a more options menu.'
	},
	{
		oldName: 'alternate-arrow',
		name: 'scroll_horizontal',
		purpose: 'single',
		usage: 'Reserved for indicating that an object can be scrolled horizontally.',
		category: 'Navigation',
		aliases: [
			'scrollen',
			'seitlich',
			'sideways',
			'horizontal',
			'scroll',
			'verschieben',
			'move',
			'pan',
			'alternate-arrow',
			'double',
			'both',
			'bidirectional'
		],
		description: 'A bidirectional horizontal arrow indicating scrollable content.'
	},
	{
		name: 'scroll_vertical',
		purpose: 'single',
		usage: 'Reserved for indicating that an object can be scrolled vertically.',
		category: 'Navigation',
		aliases: ['scrollen', 'vertical', 'scroll', 'verschieben', 'move', 'pan', 'alternate-arrow', 'double', 'both', 'bidirectional'],
		description: 'A bidirectional vertical arrow indicating scrollable content.'
	},
	{
		oldName: 'exchange',
		name: 'swap_horizontal',
		purpose: 'single',
		usage: 'Reserved for switching or swapping elements horizontally.\nNot intended to represent paste or replace actions.',
		category: 'Navigation',
		aliases: ['tauschen', 'wechseln', 'switch', 'trade', 'austausch', 'replace', 'flip', 'alternate', 'horizontal', 'exchange'],
		description: 'Two horizontal arrows pointing in opposite directions, indicating a horizontal swap.'
	},
	{
		name: 'swap_vertical',
		purpose: 'single',
		usage: 'Reserved for switching or swapping elements vertically.\nNot intended to represent paste or replace actions.',
		category: 'Navigation',
		aliases: ['tauschen', 'wechseln', 'switch', 'trade', 'austausch', 'replace', 'flip', 'alternate', 'vertical'],
		description: 'Two vertical arrows pointing in opposite directions, indicating a horizontal swap.'
	},
	{
		oldName: 'repeat',
		name: 'arrow_clockwise',
		purpose: 'multi',
		usage:
			'Used to retry an action (e.g., resending a request, restart a video), to update data, or rotate an element.\nUse the refresh icon to refresh the content or reset. Use the redo icon to redo the resent user activity.',
		category: 'Navigation',
		aliases: ['rotation', 'rotate', 'right', 'turn'],
		description: 'A clockwise open circle arrow.'
	},
	{
		name: 'arrow_counterclockwise',
		purpose: 'multi',
		usage:
			'Used for actions like revert or rotation.\nUse the history icon to access a history of previous actions, changes, or versions. Use the undo icon to reverse the most recent user activity.',
		category: 'Navigation',
		aliases: [
			'wiederholen',
			'repeat',
			'cycle',
			'loop',
			'erneut',
			'again',
			'rotation',
			'iterate',
			'reset',
			'update',
			'rotate',
			'left',
			'turn'
		],
		description: 'A counterclockwise open circle arrow.'
	},
	{
		oldName: 'arrow-up',
		name: 'arrow_up',
		purpose: 'multi',
		usage:
			'Used to sort content in ascending order.\nTo the top of the page, or for collapsing sections such as menus or accordions use the chevron_up icon.\nTo maximize content view use the expand icon.',
		category: 'Navigation',
		aliases: ['arrow', 'pfeil', 'direction', 'oben', 'up', 'aufwärts', 'upwards', 'north', 'ascend', 'top', 'improvement', 'sorting'],
		description: 'An arrow pointing up.'
	},
	{
		oldName: 'arrow-up-left',
		name: 'arrow_up-left',
		purpose: 'multi',
		usage: 'Multiple usage.\nNot intended for collapsing elements, or minimizing or maximizing a view.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'links',
			'oben',
			'north',
			'west',
			'diagonal',
			'up',
			'left',
			'upper',
			'schräg',
			'top',
			'upwards'
		],
		description: 'An arrow pointing diagonally upwards and to the left.'
	},
	{
		oldName: 'arrow-up-right',
		name: 'arrow_up-right',
		purpose: 'multi',
		usage: 'Multiple usage.\nNot intended for collapsing elements, or minimizing or maximizing a view.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'rechts',
			'oben',
			'north',
			'east',
			'diagonal',
			'up',
			'right',
			'upper',
			'schräg',
			'top',
			'upwards'
		],
		description: 'An arrow pointing diagonally upwards and to the right.'
	},
	{
		oldName: 'arrow-down',
		name: 'arrow_down',
		purpose: 'multi',
		usage:
			'Used to navigate downward on the page (e.g., to the next content section) or to sort content in descending order.\nFor expanding sections such as menus or accordions use the chevron_down icon.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'unten',
			'down',
			'abwärts',
			'downwards',
			'south',
			'descend',
			'bottom',
			'deterioration',
			'sorting'
		],
		description: 'An arrow pointing down.'
	},
	{
		oldName: 'arrow-down-left',
		name: 'arrow_down-left',
		purpose: 'multi',
		usage: 'Multiple usage.\nNot intended for expanding elements, or minimizing or maximizing a view.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'links',
			'unten',
			'south',
			'west',
			'diagonal',
			'down',
			'left',
			'lower',
			'schräg',
			'bottom',
			'downwards'
		],
		description: 'An arrow pointing diagonally downwards and to the left.'
	},
	{
		oldName: 'arrow-down-right',
		name: 'arrow_down-right',
		purpose: 'multi',
		usage: 'Multiple usage.\nNot intended for expanding elements, or minimizing or maximizing a view.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'rechts',
			'unten',
			'south',
			'east',
			'diagonal',
			'down',
			'right',
			'lower',
			'schräg',
			'bottom',
			'diagonal',
			'downwards'
		],
		description: 'An arrow pointing diagonally downwards and to the right.'
	},
	{
		oldName: 'arrow-right',
		name: 'arrow_right',
		purpose: 'multi',
		usage: 'Used to navigate to the next element.\nTo navigate to the previous page use the chevron_right icon.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'rechts',
			'right',
			'rechtswärts',
			'rightwards',
			'east',
			'next',
			'forward',
			'weiter',
			'nächste'
		],
		description: 'An arrow pointing right.'
	},
	{
		oldName: 'arrow-left',
		name: 'arrow_left',
		purpose: 'multi',
		usage: 'Used to navigate to the previous element.\nTo navigate to the previous page use the chevron_left icon.',
		category: 'Navigation',
		aliases: [
			'arrow',
			'pfeil',
			'direction',
			'links',
			'left',
			'linkswärts',
			'leftwards',
			'west,\nback,\n\nprevious,\n\nbackward,\n\nzurück'
		],
		description: 'An arrow pointing left.'
	},
	{
		oldName: 'chevron-left',
		name: 'chevron_left',
		purpose: 'multi',
		usage:
			'Used to navigate to the previous element or page (e.g. in menus, pagination, carousels, and buttons) or to expand/collapse vertical sections.',
		category: 'Navigation',
		aliases: ['winkel', 'links', 'left,\nback,\n\nprevious,\n\nbackward,\n\nzurück'],
		description: 'A left-pointing chevron.'
	},
	{
		oldName: 'chevron-small-left',
		name: 'chevron_left-small',
		purpose: 'multi',
		usage: 'Used in small components to navigate to the previous element or to expand/collapse vertical sections.',
		category: 'Navigation',
		aliases: ['winkel', 'links', 'left', 'small', 'klein,\nback,\n\nprevious,\n\nbackward,\n\nzurück'],
		description: 'A small left-pointing chevron.'
	},
	{
		oldName: 'chevron-double-left',
		name: 'chevron_double-left',
		purpose: 'multi',
		usage: 'Use to indicate multiple steps at once.',
		category: 'Navigation',
		aliases: ['doppel', 'double', 'winkel', 'links', 'left', 'fast', 'skip', 'schnell', 'rewind'],
		description: 'A double left-pointing chevron.'
	},
	{
		oldName: 'chevron-line-left',
		name: 'chevron_left-to-line',
		purpose: 'multi',
		usage: 'Used to navigate to the first page or to the start of a content sequence (e.g., in pagination).',
		category: 'Navigation',
		aliases: ['winkel', 'to', 'line', 'linie', 'links', 'beginning', 'start', 'anfang', 'leftmost', 'erste', 'seite', 'first', 'page'],
		description: 'A left-pointing chevron with vertical line.'
	},
	{
		oldName: 'chevron-right',
		name: 'chevron_right',
		purpose: 'multi',
		usage:
			'Used to navigate to the next element or page (e.g. in menus, pagination, carousels, or buttons) or to expand/collapse vertical sections.',
		category: 'Navigation',
		aliases: ['winkel', 'rechts', 'right', 'next', 'forward', 'weiter', 'nächste'],
		description: 'A right-pointing chevron.'
	},
	{
		oldName: 'chevron-small-right',
		name: 'chevron_right-small',
		purpose: 'multi',
		usage:
			'Used in small components to navigate to the next element, expand or collapse vertical sections, or indicate hierarchy in breadcrumbs.',
		category: 'Navigation',
		aliases: ['winkel', 'rechts', 'right', 'small', 'klein', 'next', 'forward', 'weiter', 'nächste'],
		description: 'A small right-pointing chevron.'
	},
	{
		oldName: 'chevron-double-right',
		name: 'chevron_double-right',
		purpose: 'multi',
		usage: 'Used to indicate multiple steps at once.',
		category: 'Navigation',
		aliases: ['doppel', 'double', 'winkel', 'rechts', 'right', 'fast', 'skip', 'schnell'],
		description: 'A double right-pointing chevron.'
	},
	{
		oldName: 'chevron-line-right',
		name: 'chevron_right-to-line',
		purpose: 'multi',
		usage: 'Used to navigate to the last page or the end of a content sequence (e.g., in pagination).',
		category: 'Navigation',
		aliases: ['winkel', 'to', 'line', 'linie', 'rechts', 'finish', 'ende', 'rightmost', 'last', 'page', 'letzte', 'seite'],
		description: 'A right-pointing chevron with vertical line.'
	},
	{
		oldName: 'chevron-down',
		name: 'chevron_down',
		purpose: 'multi',
		usage: 'Used to expand sections (such as dropdowns, selects, accordions, or panels).',
		category: 'Navigation',
		aliases: ['winkel', 'unten', 'down', 'bottom'],
		description: 'A downward-pointing chevron.'
	},
	{
		oldName: 'chevron-small-down',
		name: 'chevron_down-small',
		purpose: 'multi',
		usage: 'Used in small components to expand dropdowns, selects, or panels.\nUse the chevron_down icon to expand accordions.',
		category: 'Navigation',
		aliases: ['winkel', 'unten', 'down', 'bottom', 'small', 'klein', 'expand', 'open', 'show', 'dropdown', 'menu'],
		description: 'A small downward-pointing chevron.'
	},
	{
		oldName: 'chevron-up',
		name: 'chevron_up',
		purpose: 'multi',
		usage: 'Used to collapse sections, typically as the opposite of the chevron_down icon, and also to navigate to the top of the page.',
		category: 'Navigation',
		aliases: ['winkel', 'oben', 'up', 'top', 'collapse', 'close', 'hide', 'dropdown', 'menu'],
		description: 'An upward-pointing chevron.'
	},
	{
		oldName: 'chevron-small-up',
		name: 'chevron_up-small',
		purpose: 'multi',
		usage: 'Used in small components to expand dropdowns, selects, or panels.\nTo collapse accordions use the chevron_up icon.',
		category: 'Navigation',
		aliases: ['winkel', 'oben', 'up', 'top', 'small', 'klein', 'collapse', 'close', 'hide', 'dropdown', 'menu'],
		description: 'A small upward-pointing chevron.'
	},
	{
		oldName: 'cog',
		name: 'settings',
		purpose: 'single',
		usage: 'Reserved for settings and configuration options.',
		category: 'Interface',
		aliases: [
			'preferences',
			'einstellungen',
			'cog',
			'options',
			'configuration',
			'zahnrad',
			'gear',
			'customize',
			'optionen',
			'konfiguration',
			'system'
		],
		description: 'Settings menu, represented by a gear symbol'
	},
	{
		name: 'share',
		purpose: 'single',
		usage: 'Reserved for sharing an object.',
		category: 'Interface',
		aliases: ['teilen', 'send', 'freigeben', 'social media', 'distribute', 'publish', 'senden', 'connect', 'access'],
		description: 'Three circles connected with lines, representing sharing options.'
	},
	{
		name: 'filter',
		purpose: 'single',
		usage:
			'Reserved for filtering search results, data or other content based on specific criteria.\nFor sorting use the arrow_ down and the arrow_up icons.',
		category: 'Interface',
		aliases: ['sort', 'filtern', 'refine', 'sortieren', 'funnel', 'narrow', 'trichter', 'kategorisieren', 'refine'],
		description: 'A funnel-shaped symbol indicating filtering options.'
	},
	{
		oldName: 'filter-descending',
		name: 'sort-list_descending',
		purpose: 'single',
		usage:
			'Reserved for filtering with a predefined list of sorting options.\nFor pure filtering use the filter icon. For sorting from the highest to the lowest use the arrow_down icon.',
		category: 'Interface',
		aliases: [
			'absteigend filtern',
			'sort descending',
			'z-a',
			'highest first',
			'absteigend sortieren',
			'largest first',
			'descending order',
			'high to low'
		],
		description: 'A vertical downward arrow next to horizontal lines, indicating descending sort order.'
	},
	{
		oldName: 'filter-ascending',
		name: 'sort-list_ascending',
		purpose: 'single',
		usage:
			'Reserved for filtering with a predefined list of sorting options.\nFor pure filtering, use the filter icon. For simple sorting use the arrow_down icon.',
		category: 'Interface',
		aliases: [
			'aufsteigend filtern',
			'sort ascending',
			'a-z',
			'lowest first',
			'aufsteigend sortieren',
			'smallest first',
			'ascending order',
			'low to high'
		],
		description: 'An upward arrow next to horizontal lines, indicating ascending sort order.'
	},
	{
		name: 'expand',
		purpose: 'single',
		usage:
			'Reserved for maximizing a view.\nTypically used in pair with the collapse icon.\nFor media full-screen actions use the fullscreen and the fullscreen_exit icons instead.',
		category: 'Interface',
		aliases: ['vergrössern', 'maximize', 'fullscreen', 'zoom', 'grow', 'stretch', 'enlarge', 'resize', 'full', 'size'],
		description: 'Two outward-facing diagonal arrows.'
	},
	{
		oldName: 'compress',
		name: 'collapse',
		purpose: 'single',
		usage:
			'Reserved for minimizing a view.\nShould be used in combination with the expand icon.\nFor media full-screen actions use the fullscreen and the fullscreen_exit icons instead.',
		category: 'Interface',
		aliases: ['komprimieren', 'minimize', 'schrumpfen', 'verkleinern', 'reduce', 'shrink', 'resize', 'zusammenfalten'],
		description: 'Two inward-facing diagonal arrows.'
	},
	{
		name: 'download',
		purpose: 'single',
		usage: 'Reserved for file download.',
		category: 'Interface',
		aliases: ['herunterladen', 'save file', 'speichern', 'cloud', 'daten holen', 'get file', 'fetch', 'retrieve'],
		description: 'A downward arrow and a line below, indicating download.'
	},
	{
		name: 'upload',
		purpose: 'single',
		usage:
			'Reserved for uploading files, content, or other data.\nFor cloud-specific uploads use the cloud_upload icon. For sharing use the share icon.',
		category: 'Interface',
		aliases: ['hochladen', 'send', 'senden', 'file', 'datei', 'upload', 'transfer'],
		description: 'An upward arrow and a line below, indicating upload.'
	},
	{
		name: 'save',
		purpose: 'single',
		usage: 'Reserved for saving changes.',
		category: 'Interface',
		aliases: ['speichern', 'store', 'sichern', 'preserve', 'aufbewahren', 'backup', 'record', 'keep', 'diskette', 'floppy disk'],
		description: 'A floppy disk symbol, indicating a save action.'
	},
	{
		oldName: 'pen',
		name: 'pencil',
		purpose: 'multi',
		usage: 'Mainly used for editing content.',
		category: 'Interface',
		aliases: ['stift', 'edit', 'write', 'bearbeiten', 'modify', 'bleistift', 'farbstift', 'schreiben', 'ändern', 'update', 'rename'],
		description: 'A diagonal pencil symbol, representing edit or drawing functionality.'
	},
	{
		oldName: 'printer',
		name: 'print',
		purpose: 'multi',
		usage: 'Used for the print function or to display a print-friendly version.',
		category: 'Interface',
		aliases: ['drucker', 'drucken', 'papierform', 'hard copy', 'document', 'ausdruck', 'print out', 'printing', 'paper'],
		description: 'A printer with a printed page coming out.'
	},
	{
		oldName: 'trash',
		name: 'delete',
		purpose: 'single',
		usage: 'Reserved for deleting an object.',
		category: 'Interface',
		aliases: ['papierkorb', 'löschen', 'remove', 'abfalleimer', 'kübel', 'entfernen', 'bin', 'discard', 'garbage', 'eliminate'],
		description: 'A trash bin symbol, representing a delete action.'
	},
	{
		name: 'clock',
		purpose: 'multi',
		usage: 'Used for clock, current time, working hours, timers, or alarms.',
		category: 'Interface',
		aliases: ['uhr', 'uhrzeit', 'zeit', 'watch', 'alarm', 'timer', 'timepiece', 'hour', 'minute', 'second', 'recent', 'history'],
		description: 'An analog clock face showing time.'
	},
	{
		name: 'history',
		purpose: 'multi',
		usage: 'Used for history, timelines, activity logs, or chronological records.',
		category: 'Interface',
		aliases: [
			'verlauf',
			'chronik',
			'timeline',
			'past',
			'früher',
			'logs',
			'previous',
			'records',
			'time machine',
			'rotate left',
			'manage history'
		],
		description: 'A circular arrow forming a loop with clock hands inside.'
	},
	{
		name: 'calendar',
		purpose: 'multi',
		usage: 'Used for dates, date input fields, to represent agendas, scheduling, or calendar-related functions.',
		category: 'Interface',
		aliases: ['kalender', 'date', 'termin', 'schedule', 'appointment', 'agenda', 'planner', 'event', 'month', 'day', 'year'],
		description: 'A paper calendar with top binding.'
	},
	{
		name: 'tag',
		purpose: 'multi',
		usage:
			'Used for labeling, categorizing, or assigning metadata.\nFor flagging use the flag icon. For payments use the credit-card icon. For tickets use the ticket icon.',
		category: 'Interface',
		aliases: ['etikett', 'label', 'markierung', 'keyword', 'category', 'badge', 'classify', 'marker', 'topic', 'price'],
		description: 'A tag-shaped label with angled edge and circular hole.'
	},
	{
		name: 'camera',
		purpose: 'multi',
		usage:
			'Used to enable the device camera or take photos.\nUse the image icon for placeholders, the video icon for video content, the eye icon for visibility, and the screenshot icon for capturing the screen.',
		category: 'Interface',
		aliases: ['kamera', 'photo', 'snapshot', 'capture', 'aufnahme', 'photography', 'shoot', 'record'],
		description: 'A classic camera with lens and viewfinder.'
	},
	{
		name: 'refresh',
		purpose: 'multi',
		usage: 'Reserved for refreshing data or syncing content.\nUse the arrow_clockwise icon for retry or update actions.',
		category: 'Interface',
		aliases: ['aktualisieren', 'reload', 'update', 'neu laden', 'renew', 'sync', 'regenerate', 'reset', 'synchronize'],
		description: 'Two arrows forming a circle, pointing in an clockwise direction.'
	},
	{
		name: 'undo',
		purpose: 'single',
		usage: 'Reserved for undoing a recent action.',
		category: 'Interface',
		aliases: ['rückgängig', 'zurück', 'revert', 'cancel', 'previous', 'annullieren', 'restore', 'backwards'],
		description: 'An arrow pointing left, with a curved hook at the other end.'
	},
	{
		name: 'redo',
		purpose: 'single',
		usage: 'Reserved for redoing a recent action.',
		category: 'Interface',
		aliases: ['redo', 'repeat', 'arrow', 'redo arrow', 'forward arrow', 'erneut', 'erneut ausführen', 'aktion wiederholen', 'zurücksetzen'],
		description: 'An arrow pointing right, with a curved hook at the other end.'
	},
	{
		oldName: 'zoom-in',
		name: 'zoom_in',
		purpose: 'single',
		usage: 'Reserved for zooming in of an object or view.',
		category: 'Interface',
		aliases: [
			'vergrössern',
			'magnify',
			'enlarge',
			'expand',
			'heranzoomen',
			'closer view',
			'detail',
			'scale up',
			'magnifying glass',
			'magnifier'
		],
		description: 'A magnifying glass with a plus sign inside, indicating zoom in.'
	},
	{
		oldName: 'zoom-out',
		name: 'zoom_out',
		purpose: 'single',
		usage: 'Reserved for zooming out of an object or view.',
		category: 'Interface',
		aliases: [
			'verkleinern',
			'reduce',
			'shrink',
			'minimize',
			'herauszoomen',
			'overview',
			'distance',
			'scale down',
			'magnifying glass',
			'magnifier'
		],
		description: 'A magnifying glass with a minus sign inside, indicating zoom out.'
	},
	{
		oldName: 'text-area-left',
		name: 'textarea_left',
		purpose: 'single',
		usage: 'Reserved for resizing a textarea element (used as part of components).',
		category: 'Interface',
		aliases: ['textfeld links', 'resize left', 'adjust left', 'expand left', 'text resize', 'handle left', 'drag left', 'text area'],
		description: 'A short and long parallel diagonal lines angled downwards to the left.'
	},
	{
		oldName: 'text-area-right',
		name: 'textarea_right',
		purpose: 'single',
		usage: 'Reserved for resizing a textarea element (used as part of components).',
		category: 'Interface',
		aliases: ['textfeld rechts', 'resize right', 'adjust right', 'expand right', 'text resize', 'handle right', 'drag right', 'text area'],
		description: 'A short and long parallel diagonal lines angled downwards to the right.'
	},
	{
		name: 'drag-indicator',
		purpose: 'single',
		usage: 'Reserved for draggable elements along a vertical axis.',
		category: 'Interface',
		aliases: ['ziehen', 'verschieben', 'drag handle', 'move', 'grab', 'handle', 'gripper', 'reorder', 'drag dots'],
		description: 'Six dots arranged in two vertical columns.'
	},
	{
		name: 'screenshot',
		purpose: 'single',
		usage: 'Reserved for taking a screenshot or screen capture.',
		category: 'Interface',
		aliases: [
			'screenshot',
			'screen capture',
			'screen grab',
			'print screen',
			'snapshot',
			'screen',
			'capture',
			'desktop capture',
			'monitor snapshot',
			'screen image',
			'camera',
			'bildschirmfoto',
			'bildschirm erfassen'
		],
		description: 'A four-corner frame with a camera symbol, representing a screenshot or screen capture.'
	},
	{
		name: 'crop',
		purpose: 'single',
		usage: 'Reserved for cropping images.',
		category: 'Interface',
		aliases: ['zuschneiden', 'trim', 'resize', 'ausschneiden', 'cut', 'frame', 'adjust', 'selection'],
		description: 'Two overlapping right-angle corners forming a cropping frame.'
	},
	{
		oldName: 'wand',
		name: 'magic-wand',
		purpose: 'multi',
		usage:
			'Used to apply automatic or smart actions (e.g., auto-adjust, smart selection, quick fixes), or for AI-powered tools.\nUse the artificial-intelligence icon for general AI topics.',
		category: 'Interface',
		aliases: [
			'zauberstab',
			'magic',
			'auto fix',
			'automatic',
			'format painter',
			'style',
			'enchant',
			'special effects',
			'wand',
			'suggestion',
			'surprise'
		],
		description: 'A tilted wand with sparkles around the tip, symbolizing magic.'
	},
	{
		oldName: 'eyedropper',
		name: 'color-picker',
		purpose: 'multi',
		usage: 'Used for select a color with a color picker.',
		category: 'Interface',
		aliases: ['pipette', 'farbwähler', 'color selection', 'dropper', 'palette', 'color sample', 'tone', 'hue'],
		description: 'An eyedropper tool tilted diagonally.'
	},
	{
		name: 'brush',
		purpose: 'multi',
		usage: 'Used to represent drawing or styling tools.',
		category: 'Interface',
		aliases: ['pinsel', 'malen', 'paint', 'kunstpinsel', 'draw', 'painting', 'art', 'stroke'],
		description: 'A paintbrush with curved bristles.'
	},
	{
		oldName: 'art',
		name: 'palette',
		purpose: 'multi',
		usage: 'Reserved for colour palettes, colour selection, theme customisation or design-related settings.',
		category: 'Interface',
		aliases: ['farbpalette', 'farben', 'colors', 'painting', 'kunst', 'artistic', 'scheme', 'design', 'styles', 'paint', 'theme'],
		description: 'An artist palette with a paintbrush.'
	},
	{
		name: 'eraser',
		purpose: 'single',
		usage:
			'Intended for manual removal of strokes, shapes, or annotations.\nFor canceling an action or change use the xmark icon;\nfor undo the resent user action use the Undo icon;\nfor deleting objects use the delete icon.',
		category: 'Interface',
		aliases: ['radiergummi', 'löschen', 'remove', 'clean', 'entfernen', 'delete', 'clear', 'erase'],
		description: 'A rubber eraser tilted diagonally.'
	},
	{
		name: 'plus',
		purpose: 'multi',
		usage:
			'Used for creating or adding an object (e.g., a row in a table) or for mathematical addition.\nNot intended for expanding content (e.g., accordions or menus); use the chevron icons instead.',
		category: 'Interface',
		aliases: ['hinzufügen', 'add', 'new', 'create', 'erstellen', 'positive', 'insert', 'increase'],
		description: 'A plus sign.'
	},
	{
		oldName: 'plus-circle',
		name: 'plus_circle',
		purpose: 'multi',
		usage: 'Alternative for the plus icon.\nNot intended for expanding the content (e.g. in accordions, menus).',
		category: 'Interface',
		aliases: ['kreis', 'circle', 'add button', 'create', 'new', 'hinzufügen', 'new item', 'positive', 'insert', 'create', 'add'],
		description: 'A plus sign inside a circle.'
	},
	{
		name: 'minus',
		purpose: 'multi',
		usage:
			'Used in certain cases as the opposite of the Plus icon or for mathematical subtraction.\nFor deleting objects, use the delete icon. For manual removal of strokes or annotations use the eraser icon.',
		category: 'Interface',
		aliases: ['entfernen', 'remove', 'subtract', 'delete', 'weniger', 'negative', 'reduce', 'decrease'],
		description: 'A minus sign.'
	},
	{
		name: 'minus_circle',
		purpose: 'multi',
		usage: 'Alternative for the minus icon.',
		category: 'Interface',
		aliases: ['kreis', 'circle', 'remove button', 'delete item', 'entfernen', 'subtract', 'decrease', 'negative', 'reduce'],
		description: 'A minus sign inside a circle.'
	},
	{
		oldName: 'cards',
		name: 'grid',
		purpose: 'single',
		usage: 'Reserved for toggling to grid layout.',
		category: 'Interface',
		aliases: ['karten', 'kachelansicht', 'grid view', 'tiles', 'raster', 'gallery', 'thumbnails', 'matrix', 'layout', 'cards'],
		description: 'A 2 by 2 square grid layout.'
	},
	{
		name: 'list',
		purpose: 'multi',
		usage:
			'Used for toggling to a list layout (often in combination with the grid icon), and for indicating various types of lists such as bulleted, ordered, or task lists.\nFor a task inbox or central task depot use the inbox icon.',
		category: 'Interface',
		aliases: [
			'liste',
			'listenansicht',
			'list view',
			'rows',
			'einträge',
			'detail view',
			'linear',
			'sequential',
			'bullet',
			'unordered',
			'tasks'
		],
		description: 'Three horizontal lines with dots on the left.'
	},
	{
		oldName: 'list-paragraph',
		name: 'list_paragraph',
		purpose: 'single',
		usage: 'Reserved for usage in legal context.',
		category: 'Interface',
		aliases: [
			'liste',
			'absatzliste',
			'structured text',
			'formatted list',
			'content blocks',
			'article',
			'text blocks',
			'paragraphs',
			'document'
		],
		description: 'A paragraph symbol next to three horizontal lines.'
	},
	{
		name: 'pin',
		purpose: 'multi',
		usage:
			'Used for pinning elements in place or making content sticky.\nFor location use the location icon.\nTo remember things use the bookmark or the star icons.',
		category: 'Interface',
		aliases: ['stecknadel', 'merken', 'fixieren', 'attach', 'festhalten', 'secure', 'push pin', 'thumbtack', 'note', 'remember'],
		description: 'A pushpin, as used to pin documents on a notice board, depicted in diagonal direction.'
	},
	{
		name: 'compare',
		purpose: 'single',
		usage: 'Reserved to compare two or more objects.',
		category: 'Interface',
		aliases: ['vergleichen', 'side by side', 'gegenüberstellen', 'contrast', 'unterschiede', 'similarities', 'evaluate', 'assessment'],
		description: 'Two columns, each with squares on top and three horizontal lines underneath.'
	},
	{
		name: 'inbox',
		purpose: 'single',
		usage:
			'Reserved for inboxes, such as mail inboxes, task inboxes, or central task depots.\nCan be used with the badge component to display the number of messages.\nFor notifications use the notification icon.',
		category: 'Communication',
		aliases: ['messages', 'posteingang', 'mail', 'email', 'notifications', 'mailbox', 'nachrichten', 'unread'],
		description: 'A paper tray, representing an inbox.'
	},
	{
		name: 'phone',
		purpose: 'multi',
		usage:
			'Used before a phone number or for a content related to phone calls.\nFor call centers or support phone lines use the headset icon. For general support content use the support icon.',
		category: 'Communication',
		aliases: ['telefon', 'call', 'anruf', 'contact', 'mobile', 'cell', 'handy', 'telephone', 'dial out', 'natel'],
		description: 'The handset of a traditional telephone.'
	},
	{
		name: 'fax',
		purpose: 'multi',
		usage:
			'Used for fax numbers or the option to send and receive faxes.\nFor printing use the print icon. For phone numbers use the phone, support, or headset icon depending on the context.',
		category: 'Communication',
		aliases: ['faxgerät', 'telecopier', 'faxen', 'send fax', 'document transfer', 'telefax', 'facsimile', 'fax machine'],
		description: 'A fax machine with a paper in its tray.'
	},
	{
		oldName: 'lifering',
		name: 'support',
		purpose: 'single',
		usage:
			'Reserved for representing general support or help content.\nFor FAQ use the question icon. For call centers or direct support phone lines use the headset icon.\nFor technical support may be used the wrench icon.',
		category: 'Communication',
		aliases: [
			'hilfe',
			'help',
			'assistance',
			'service',
			'kundendienst',
			'aid',
			'faq',
			'life raft',
			'life ring',
			'lifebuoy',
			'life preserver',
			'sos',
			'bay watch'
		],
		description: 'A round, segmented ring buoy, symbolizing support or help.'
	},
	{
		name: 'headset',
		purpose: 'multi',
		usage:
			'Used for call centers or direct support phone lines.\nFor general support or help content use the support icon. For FAQ use the question icon.',
		category: 'Communication',
		aliases: ['kopfhörer', 'audio', 'sound', 'listen', 'microphone', 'hören', 'headset', 'earphones', 'headphones', 'live', 'call center'],
		description: 'An over-ear headset with microphone.'
	},
	{
		oldName: 'language',
		name: 'translate',
		purpose: 'single',
		usage:
			'Reserved for multilingual language translation.\nNot intended for regular language selection (DE/IT/FR/RM/EN); for that use the related Oblique language switcher component.',
		category: 'Communication',
		aliases: ['sprache', 'übersetzung', 'translation', 'idioma', 'localization', 'multilingual', 'interpreter', 'languages'],
		description: 'Latin letter A next to a non-Latin character.'
	},
	{
		name: 'globe',
		purpose: 'multi',
		usage:
			'Used for the world in general, coordinates, time zones, international topics. Also to represent global communication, connectivity, the internet, or networks.\nFor multilingual or translation contexts use the translate icon. For geographic maps use the map icon.',
		category: 'Communication',
		aliases: ['weltkugel', 'world', 'erde', 'international', 'global', 'planet', 'earth', 'atlas', 'worldwide', 'map', 'internet', 'www'],
		description: 'A wireframe-style globe with meridians and parallels.'
	},
	{
		oldName: 'bullhorn',
		name: 'megaphone',
		purpose: 'multi',
		usage:
			'Used for announcements, public messages, or promotions.\nFor alerts or informational messages use icons from the status and feedback category.',
		category: 'Communication',
		aliases: [
			'lautsprecher',
			'announcement',
			'ansage',
			'broadcast',
			'alert',
			'announce',
			'loudspeaker',
			'public',
			'bullhorn',
			'news',
			'loudspeaker'
		],
		description: "A handheld megaphone or loudspeaker, as used to amplify a person's voice."
	},
	{
		name: 'rss',
		purpose: 'single',
		usage: 'Reserved for RSS feeds.',
		category: 'Communication',
		aliases: ['feed', 'news', 'updates', 'syndication', 'abonnement', 'newsfeed', 'subscribe', 'channel'],
		description: 'The RSS symbol: dot with two curved lines. Indicates a broadcast or feed signal.'
	},
	{
		name: 'reply',
		purpose: 'single',
		usage: 'Reserved for replying to a message thread.',
		category: 'Communication',
		aliases: ['antworten', 'respond', 'answer', 'feedback', 'reaktion', 'message back', 'write back'],
		description: 'A left arrow with a corner.'
	},
	{
		name: 'forward',
		purpose: 'single',
		usage: 'Reserved for forwarding messages.',
		category: 'Communication',
		aliases: ['weiterleiten', 'send to', 'share with', 'transfer', 'pass on', 'redirect', 'send forward', 'distribute'],
		description: 'A right arrow with a corner.'
	},
	{
		name: 'address-book',
		purpose: 'multi',
		usage: 'Used for address books or collections of contacts.\nFor user lists or groups of people use the person_group icon.',
		category: 'Communication',
		aliases: [
			'adressbuch',
			'contacts',
			'kontakte',
			'directory',
			'names',
			'phonebook',
			'telefonbuch',
			'people',
			'person',
			'book',
			'address'
		],
		description: 'An address book with a simplified person figure on the cover.'
	},
	{
		oldName: 'envelope',
		name: 'mail',
		purpose: 'multi',
		usage:
			'Used for mail and messages, including email, unread messages, or postal addresses.\nFor sending messages use the send icon. For opened or viewed messages use the mail_open icon.',
		category: 'Communication',
		aliases: [
			'briefumschlag',
			'email',
			'nachricht',
			'post',
			'message',
			'letter',
			'correspondence',
			'kontakt',
			'envelope',
			'message',
			'inbox'
		],
		description: 'A closed rectangular envelope with a triangular flap.'
	},
	{
		oldName: 'envelope-open',
		name: 'mail_open',
		purpose: 'single',
		usage: 'Reserved for emails or messages that have been opened or viewed.',
		category: 'Communication',
		aliases: [
			'geöffneter brief',
			'read email',
			'opened message',
			'viewed mail',
			'read message',
			'gelesene post',
			'letter',
			'inbox',
			'open'
		],
		description: 'An open rectangular envelope with a triangular flap.'
	},
	{
		oldName: 'mail-attachment',
		name: 'mail_attachment',
		purpose: 'single',
		usage: 'Reserved for emails with an attachment.',
		category: 'Communication',
		aliases: ['anhang', 'attachment', 'file', 'dokument', 'document', 'beilage', 'enclosed', 'beigefügt', 'paper', 'clip'],
		description: 'A closed envelope with a paperclip on the lower-right corner.'
	},
	{
		oldName: 'speech-bubble',
		name: 'message',
		purpose: 'multi',
		usage:
			'Used for comments or general communication.\nFor chat interfaces use the bot icon. For email-related actions use the mail icon.',
		category: 'Communication',
		aliases: [
			'sprechblase',
			'chat',
			'conversation',
			'dialog',
			'diskussion',
			'comment',
			'kommunikation',
			'text',
			'comment',
			'speech bubble',
			'message'
		],
		description: 'A rectangular speech bubble with no content.'
	},
	{
		oldName: 'paper-plane',
		name: 'send',
		purpose: 'single',
		usage: 'Reserved for sending messages.',
		category: 'Communication',
		aliases: [
			'papierflugzeug',
			'senden',
			'absenden',
			'schicken',
			'message',
			'deliver',
			'submit',
			'transmit',
			'mail',
			'email',
			'paper',
			'airplane',
			'aeroplane',
			'plane'
		],
		description: 'A paper plane angled upward to the right.'
	},
	{
		oldName: 'bell',
		name: 'notification',
		purpose: 'single',
		usage:
			'Reserved for notifications.\nCan be used with the badge component to display the number of new notifications.\nSee also the inbox icon.',
		category: 'Communication',
		aliases: [
			'glocke',
			'benachrichtigung',
			'alerts',
			'alarm',
			'message',
			'hinweis',
			'update',
			'reminder',
			'notify',
			'alarm',
			'bell',
			'reminder',
			'chime'
		],
		description: 'A bell with a small top handle and rounded clapper visible at the bottom.'
	},
	{
		oldName: 'bell-slash',
		name: 'notification_off',
		purpose: 'single',
		usage: 'Reserved for muting or disabling notifications.',
		category: 'Communication',
		aliases: [
			'glocke',
			'disable',
			'alerts',
			'alarm',
			'stumm',
			'kein',
			'benachrichtigung',
			'silent mode',
			'do not disturb',
			'durchgestrichen',
			'no',
			'off',
			'muted',
			'mute',
			'slash'
		],
		description: 'A bell crossed by a diagonal line.'
	},
	{
		name: 'shopping-cart',
		purpose: 'multi',
		usage: 'Used to represent a shopping cart or basket in main navigation.',
		category: 'Physical items and infrastructure',
		aliases: ['cart', 'warenkorb', 'basket', 'einkaufswagen', 'checkout', 'purchase', 'kaufen', 'trolley'],
		description: 'A shopping cart that you might find in a supermarket.'
	},
	{
		name: 'map',
		purpose: 'single',
		usage:
			'Reserved for representing a geographical map.\nFor physical addresses use the location or mail icon; for global context se the globe icon.',
		category: 'Physical items and infrastructure',
		aliases: ['karte', 'landkarte', 'geography', 'navigation', 'plan', 'route', 'atlas', 'directions', 'location'],
		description: 'A paper map with creases.'
	},
	{
		oldName: 'map-marker',
		name: 'location',
		purpose: 'multi',
		usage:
			'Used to represent a physical address, position, or geographic location.\nNot intended for status indicators or highlighting informational content.',
		category: 'Physical items and infrastructure',
		aliases: ['standort', 'pin', 'position', 'ort', 'place', 'gps', 'coordinates', 'address', 'map'],
		description: 'A map marker with circular center.'
	},
	{
		name: 'compass',
		purpose: 'multi',
		usage:
			'Used for features related to exploration, navigation, or orientation within a map or environment. Often represents the four cardinal directions.',
		category: 'Physical items and infrastructure',
		aliases: [
			'kompass',
			'compass',
			'direction',
			'orientation',
			'navigate',
			'north',
			'guide',
			'explore',
			'adventures',
			'discover',
			'map',
			'location cardinal directions north',
			'south',
			'east',
			'west'
		],
		description: 'A navigation compass.'
	},
	{
		oldName: 'bullseye',
		name: 'target',
		purpose: 'multi',
		usage: 'Used to represent a goal, objective, or target.',
		category: 'Physical items and infrastructure',
		aliases: [
			'ziel',
			'zielscheibe',
			'aim',
			'goal',
			'treffer',
			'objective',
			'precision',
			'focus',
			'bullseye',
			'crosshair',
			'reticule',
			'reticle',
			'purpose'
		],
		description: 'A target shape with central bullseye.'
	},
	{
		name: 'calculator',
		purpose: 'multi',
		usage: 'Used in contexts related to calculations, mathematics, or financial input.',
		category: 'Physical items and infrastructure',
		aliases: ['rechner', 'math', 'berechnen', 'compute', 'calculation', 'numbers', 'taschenrechner', 'counting'],
		description: 'A calculator with buttons and display.'
	},
	{
		name: 'graduation-cap',
		purpose: 'multi',
		usage: 'Used to represent education, learning, academic content in an international context, or for academic graduation.',
		category: 'Physical items and infrastructure',
		aliases: ['education', 'graduation', 'academic', 'university', 'learning', 'student', 'cas', 'bachelor', 'master'],
		description: 'A graduation cap, worn on the head of students graduating from college or university.'
	},
	{
		name: 'book',
		purpose: 'multi',
		usage: 'Used for various content concerning reading, writing, learning, and schooling.',
		category: 'Physical items and infrastructure',
		aliases: ['buch', 'literature', 'reading', 'publication', 'lesen', 'bibliothek', 'manual', 'education'],
		description: 'A closed hardcover book, shown from the front.'
	},
	{
		name: 'key',
		purpose: 'multi',
		usage: 'Used to represent access, authentication, security, or credentials.',
		category: 'Physical items and infrastructure',
		aliases: ['schlüssel', 'zugang', 'access', 'passwort', 'password', 'secure', 'security', 'authorization', 'authentication'],
		description: 'A classic key with round head and teeth.'
	},
	{
		name: 'bundeshaus',
		purpose: 'single',
		usage:
			'Reserved to represent the Bundeshaus (Federal Parliament) or a federal department (Bundesamt).\nNot intended for other buildings or institutions.',
		category: 'Physical items and infrastructure',
		aliases: ['parliament', 'regierung', 'schweiz', 'bern', 'federal house', 'switzerland', 'politik', 'government', 'swiss', 'country'],
		description: 'A stylized image of the Swiss Federal Palace with dome and side towers.'
	},
	{
		name: 'coffee',
		purpose: 'multi',
		usage: 'Used for a break time, refreshments, or coffee.',
		category: 'Physical items and infrastructure',
		aliases: ['kaffee', 'tasse', 'drink', 'cup', 'getränk', 'break', 'brew', 'caffeine', 'pause', 'cafe', 'buffet'],
		description: 'A coffee cup on a small saucer.'
	},
	{
		name: 'flask',
		purpose: 'multi',
		usage: 'Used to represent science, laboratories, or experimental features.',
		category: 'Physical items and infrastructure',
		aliases: ['kolben', 'labor', 'experimental', 'science', 'chemie', 'test', 'laboratory', 'research', 'labs', 'erlenmeyer', 'beaker'],
		description: 'A rounded-bottom flask with thin neck.'
	},
	{
		name: 'dog',
		purpose: 'multi',
		usage: 'Used to represent dogs, and in some cases, broader animal-related content.',
		category: 'Physical items and infrastructure',
		aliases: ['hund', 'haustier', 'pet', 'animal', 'tier', 'canine', 'companion'],
		description: 'A dog head in profile.'
	},
	{
		name: 'horse',
		purpose: 'multi',
		usage: 'Used to represent horses.',
		category: 'Physical items and infrastructure',
		aliases: ['pferd', 'tier', 'animal', 'equine', 'reiten', 'riding', 'steed', 'livestock'],
		description: 'A horse head in profile.'
	},
	{
		oldName: 'balance',
		name: 'justice-scales',
		purpose: 'single',
		usage: 'Reserved for legal topics, official regulations, and laws currently in force.\nFor comparisons use the compare icon.',
		category: 'Physical items and infrastructure',
		aliases: ['waage', 'balance', 'gerechtigkeit', 'justice', 'recht', 'fairness', 'law', 'equality', 'scales'],
		description: 'A classic balance scale.'
	},
	{
		oldName: 'balance-slash',
		name: 'justice-scales_off',
		purpose: 'single',
		usage: 'Reserved for official regulations or laws that are no longer in force or not currently applicable.',
		category: 'Physical items and infrastructure',
		aliases: [
			'waage durchgestrichen',
			'injustice',
			'unfair',
			'unbalanced',
			'ungleich',
			'biased',
			'inequality',
			'imbalanced',
			'slash',
			'balance',
			'law',
			'no',
			'off'
		],
		description: 'A classic balance scale with a diagonal line crossing through it.'
	},
	{
		oldName: 'scroll',
		name: 'manuscript',
		purpose: 'multi',
		usage: 'May be used for structured documents such as declarations, transcripts, formal lists, or receipts.',
		category: 'Physical items and infrastructure',
		aliases: ['schriftrolle', 'document', 'ancient text', 'papyrus', 'pergament', 'historical document', 'old text', 'record'],
		description: 'A vertical manuscript with rolled top and bottom edges, and text lines.'
	},
	{
		name: 'credit-card',
		purpose: 'multi',
		usage: 'Used for payment methods, billing information, invoices.',
		category: 'Physical items and infrastructure',
		aliases: ['kreditkarte', 'payment', 'zahlung', 'bank card', 'plastic money', 'finance', 'transaction', 'banking'],
		description: 'A horizontal credit card with a magnetic strip.'
	},
	{
		name: 'coins',
		purpose: 'multi',
		usage: 'Used to represent money, currency, or coins.\nFor payment methods use the credit-card card icon.',
		category: 'Physical items and infrastructure',
		aliases: ['münzen', 'geld', 'money', 'currency', 'cash', 'finance', 'payment', 'wealth'],
		description: 'A vertical stack of coins with one front-facing coin marked with the number 5.'
	},
	{
		name: 'magnet',
		purpose: 'multi',
		usage: 'Used to represent attraction or sticky behavior, such as snap-to-grid or edge alignment.',
		category: 'Physical items and infrastructure',
		aliases: ['magnet', 'anziehung', 'attraction', 'force', 'magnetisch', 'pull', 'attract', 'polarized'],
		description: 'A U-shaped magnet.'
	},
	{
		name: 'briefcase',
		purpose: 'multi',
		usage: 'Used for work-related topics, job vacancies, or business services.',
		category: 'Physical items and infrastructure',
		aliases: ['aktentasche', 'business', 'arbeit', 'work', 'job', 'career', 'office', 'professional', 'suitcase', 'toolbox'],
		description: 'A case with a handle on top.'
	},
	{
		name: 'certificate',
		purpose: 'multi',
		usage: 'Used to represent official documents, certifications, approvals, or credentials.',
		category: 'Physical items and infrastructure',
		aliases: ['zertifikat', 'diploma', 'achievement', 'qualification', 'urkunde', 'document', 'credential', 'award'],
		description: 'A horizontal document with a ribbon badge on the left and horizontal lines indicating text.'
	},
	{
		name: 'building',
		purpose: 'multi',
		usage:
			'Used to represent agencies, public institutions, service locations, or government-owned facilities.\nFor university or museum use the antient-building icon.',
		category: 'Physical items and infrastructure',
		aliases: ['gebäude', 'architecture', 'structure', 'office', 'haus', 'construction', 'tower', 'skyscraper'],
		description: 'A modern multi-story building with multiple windows.'
	},
	{
		name: 'hospital',
		purpose: 'multi',
		usage: 'Used for medical institutions.',
		category: 'Physical items and infrastructure',
		aliases: ['krankenhaus', 'medical', 'healthcare', 'clinic', 'spital', 'emergency', 'healthcare facility', 'medical center'],
		description: 'A building with a medical cross on top and multiple windows.'
	},
	{
		oldName: 'university',
		name: 'antique-building',
		purpose: 'multi',
		usage: 'Used for universities, museums, or other heritage sites.',
		category: 'Physical items and infrastructure',
		aliases: [
			'universität',
			'education',
			'hochschule',
			'college',
			'school',
			'campus',
			'academic',
			'education',
			'historisches gebäude',
			'ancient',
			'historical',
			'monument',
			'landmark',
			'heritage',
			'classical',
			'archeological'
		],
		description: 'A classical or antique building with columns.'
	},
	{
		oldName: 'industry',
		name: 'factory',
		purpose: 'multi',
		usage:
			'Used to represent industrial facilities, manufacturing, or production sites. In broader contexts, it may symbolize a company or business.',
		category: 'Physical items and infrastructure',
		aliases: ['industry', 'manufacturing', 'production', 'fabrik', 'plant', 'production facility', 'industrial', 'manufacturing plant'],
		description: 'An industrial building with sawtooth roofline.'
	},
	{
		oldName: 'bed',
		name: 'accommodation',
		purpose: 'multi',
		usage: 'Used for places to stay, like hotels or sleeping areas.',
		category: 'Physical items and infrastructure',
		aliases: ['bett', 'hotel', 'sleep', 'lodging', 'unterkunft', 'rest', 'bedroom', 'hostel', 'bed', 'occupied', 'furniture', 'hostel'],
		description: 'A human figure in a bed.'
	},
	{
		name: 'car',
		purpose: 'multi',
		usage: 'Used to represent driving, vehicles, or transport.',
		category: 'Physical items and infrastructure',
		aliases: ['auto', 'fahrzeug', 'vehicle', 'automobile', 'pkw', 'transportation', 'drive', 'motor vehicle'],
		description: 'A front view of a car.'
	},
	{
		name: 'truck',
		purpose: 'multi',
		usage: 'Used to represent delivery, transport, or logistics.',
		category: 'Physical items and infrastructure',
		aliases: ['lkw', 'lastwagen', 'transport', 'delivery', 'vehicle', 'lorry', 'freight', 'hauling'],
		description: 'A side view of a truck.'
	},
	{
		name: 'wrench',
		purpose: 'multi',
		usage: 'Used for repair, tools, or technical services.',
		category: 'Physical items and infrastructure',
		aliases: ['schraubenschlüssel', 'tool', 'werkzeug', 'repair', 'fix', 'mechanic', 'maintenance', 'spanner'],
		description: 'A wrench tool displayed at a diagonal angle.'
	},
	{
		name: 'ticket',
		purpose: 'multi',
		usage: 'Used to represent event tickets, reservations, or bookings.',
		category: 'Physical items and infrastructure',
		aliases: ['ticket', 'eintrittskarte', 'admission', 'stub', 'event pass', 'voucher', 'entry', 'pass', 'billet'],
		description: 'A ticket with a perforated line.'
	},
	{
		name: 'weight',
		purpose: 'multi',
		usage: 'Used to represent physical weight.',
		category: 'Physical items and infrastructure',
		aliases: ['gewicht', 'mass', 'schwer', 'heavy', 'scale', 'measurement', 'load', 'heft'],
		description: 'A heavy weight with a handle.'
	},
	{
		oldName: 'fitness',
		name: 'dumbbell',
		purpose: 'multi',
		usage: 'Used to represent fitness-related content.',
		category: 'Physical items and infrastructure',
		aliases: ['fitness', 'hantel', 'workout', 'exercise', 'training', 'gym', 'strength', 'bodybuilding'],
		description: 'A dumbbell with weight plates on both sides.'
	},
	{
		name: 'artificial-intelligence',
		purpose: 'multi',
		usage: 'Used to represent artificial intelligence or AI-powered features.',
		category: 'Devices and tech',
		aliases: [
			'artificial',
			'intelligence',
			'ai',
			'künstliche intelligenz',
			'ki',
			'machine learning',
			'deep learning',
			'neural network',
			'neural',
			'smart technology',
			'intelligente systeme',
			'cyber intelligenz',
			'digital brain',
			'intelligent',
			'intelligence',
			'data',
			'daten',
			'algorithm',
			'automation',
			'technology',
			'zukunftstechnologie',
			'bot',
			'virtueller assistent',
			'tech'
		],
		description: 'The abbreviation AI for Artificial Intelligence inside a square, with a sparkle in the bottom-right corner.'
	},
	{
		name: 'bot',
		purpose: 'multi',
		usage: 'Used for automated chats, or AI-powered assistance.',
		category: 'Devices and tech',
		aliases: [
			'bot',
			'chatbot',
			'ai',
			'ai bot',
			'service bot',
			'digital assistant',
			'virtual assistant',
			'assistant',
			'dialogue system',
			'speech assistant',
			'sprachassistent',
			'digital',
			'tech',
			'automation',
			'automatisierung',
			'robot',
			'roboter',
			'roboterkopf',
			'neural bot',
			'intelligence',
			'künstliche intelligenz',
			'ki',
			'virtueller assistent'
		],
		description: 'A robot figure with a rectangular head and an antenna.'
	},
	{
		name: 'cloud',
		purpose: 'single',
		usage:
			'Reserved for cloud-related functionality, such as online storage, cloud computing, or remote services.\nNot intended for weather-related use — consider an external icon sets for weather-specific content.',
		category: 'Devices and tech',
		aliases: ['wolke', 'speicher', 'storage', 'online', 'server', 'web', 'remote', 'data center'],
		description: 'A cloud symbol representing cloud-based technology or storage.'
	},
	{
		oldName: 'cloud-upload',
		name: 'cloud_upload',
		purpose: 'single',
		usage: 'Reserved for cloud-related functionality, such as online storage, cloud computing, or remote services.',
		category: 'Devices and tech',
		aliases: [
			'speichern',
			'to cloud',
			'wolke',
			'online',
			'web upload',
			'remote save',
			'server push',
			'store',
			'hochladen',
			'send',
			'senden',
			'file',
			'datei',
			'upload',
			'transfer'
		],
		description: 'A cloud symbol with an upward arrow, representing file upload to the cloud.'
	},
	{
		name: 'wifi',
		purpose: 'single',
		usage: 'Reserved for everything directly related to a wireless or wi-fi connection.',
		category: 'Devices and tech',
		aliases: ['wlan', 'wireless', 'internet', 'network', 'connection', 'verbindung', 'netzwerk', 'hotspot'],
		description: 'The symbol for a wireless or Wi-Fi connection: curved lines radiating upward from a central point.'
	},
	{
		name: 'antenna',
		purpose: 'multi',
		usage: 'Used to represent signal transmission, broadcast, or wireless communication.',
		category: 'Devices and tech',
		aliases: ['radio transmission', 'radio tower', 'funk antenna', 'antenna'],
		description: 'A radio tower with circular waves, symbolizing a wireless signal or broadcast'
	},
	{
		name: 'database',
		purpose: 'multi',
		usage: 'Used for database-related content, such as data storage, structured records, or backend systems.',
		category: 'Devices and tech',
		aliases: ['datenbank', 'datenspeicher', 'storage', 'records', 'information', 'data storage', 'server', 'structured data'],
		description: 'A stack of three cylindrical layers representing a database.'
	},
	{
		name: 'server',
		purpose: 'multi',
		usage: 'Used to represent data servers, hosting infrastructure, backend systems, or network services.',
		category: 'Devices and tech',
		aliases: ['server', 'host', 'computer', 'web server', 'cloud', 'rechenzentrum', 'service', 'hosting'],
		description: 'Two horizontal rectangles with dots on the left side representing server units.'
	},
	{
		oldName: 'code-branch',
		name: 'branch',
		purpose: 'multi',
		usage: 'Used for code branches and branching workflows.',
		category: 'Devices and tech',
		aliases: [
			'verzweigung',
			'version control',
			'git',
			'fork',
			'entwicklung',
			'programming',
			'codebase',
			'repository,\ncode',
			'development',
			'github,\n\nbranches'
		],
		description: 'Three connected circles with one diverging path, suggesting a split or fork in a line.'
	},
	{
		name: 'bug',
		purpose: 'single',
		usage: 'Reserved for software bugs.',
		category: 'Devices and tech',
		aliases: ['fehler', 'insekt', 'error', 'problem', 'issue', 'software', 'glitch', 'defect', 'software error', 'report'],
		description: 'A beetle-like insect with a segmented body, legs, and antennas.'
	},
	{
		name: 'keyboard',
		purpose: 'single',
		usage: 'Reserved for keyboard support.',
		category: 'Devices and tech',
		aliases: ['tastatur', 'eingabe', 'tippen', 'input', 'type', 'keys', 'schreiben', 'computer input'],
		description: 'A computer keyboard with buttons and a spacebar on the bottom row.'
	},
	{
		name: 'headphones',
		purpose: 'multi',
		usage:
			'Used to represent audio output via headphones or personal listening.\nFor direct support or service lines use the headset icon instead.',
		category: 'Devices and tech',
		aliases: ['headphones', 'earphones', 'kopfhörer', 'audio'],
		description: 'A pair of over-ear headphones.'
	},
	{
		oldName: 'audio',
		name: 'volume_high',
		purpose: 'multi',
		usage: 'Used to represent audio output, sound settings, or full volume.',
		category: 'Devices and tech',
		aliases: ['ton', 'lautstärke', 'sound', 'audio', 'musik', 'speaker', 'media', 'high', 'on', 'louder', 'up', 'read aloud'],
		description: 'A speaker with two sound waves indicating high or full volume.'
	},
	{
		oldName: 'audio-low',
		name: 'volume_low',
		purpose: 'single',
		usage: 'Used to represent reduced audio output or low volume settings.',
		category: 'Devices and tech',
		aliases: [
			'ton',
			'lautstärke',
			'sound',
			'audio',
			'musik',
			'speaker',
			'media',
			'leise',
			'low',
			'reduced',
			'quiet',
			'gedämpft',
			'soft',
			'on'
		],
		description: 'A speaker with one small sound wave indicating low volume.'
	},
	{
		oldName: 'audio-mute',
		name: 'volume_muted',
		purpose: 'single',
		usage: 'Used to represent muted sound or disabled audio.',
		category: 'Devices and tech',
		aliases: [
			'ton',
			'lautstärke',
			'sound',
			'audio',
			'musik',
			'speaker',
			'media',
			'stumm',
			'muted',
			'aus',
			'silence',
			'kein',
			'no',
			'slash',
			'off',
			'silent',
			'quiet'
		],
		description: 'A speaker with a diagonal strikethrough, representing muted or no sound.'
	},
	{
		name: 'microphone',
		purpose: 'multi',
		usage:
			'Used to represent audio input, record sound, or for speaking.\nCommonly used in contexts like radio, interview, broadcasting, recording, and podcasts.',
		category: 'Devices and tech',
		aliases: [
			'ton',
			'lautstärke',
			'sound',
			'audio',
			'musik',
			'speaker',
			'mikrofon',
			'voice',
			'recording',
			'sprechen',
			'speech',
			'input',
			'dictation',
			'mic',
			'speak',
			'interview',
			'podcast',
			'radio',
			'call'
		],
		description: 'A studio microphone on a stand.'
	},
	{
		oldName: 'microphone-slash',
		name: 'microphone_muted',
		purpose: 'single',
		usage: 'Reserved for no microphone input.',
		category: 'Devices and tech',
		aliases: [
			'ton',
			'lautstärke',
			'sound',
			'audio',
			'musik',
			'speaker',
			'mikrofon',
			'disabled microphone',
			'no',
			'input',
			'stummgeschaltet',
			'mic',
			'off',
			'silent',
			'muted',
			'kein',
			'aus',
			'slash',
			'recording',
			'voice',
			'speak',
			'interview',
			'podcast',
			'radio',
			'call'
		],
		description: 'A microphone on a stand with a diagonal strikethrough.'
	},
	{
		name: 'barcode',
		purpose: 'multi',
		usage: 'Used for product codes, scanning, or inventory tracking.',
		category: 'Devices and tech',
		aliases: ['strichcode', 'scan', 'product code', 'upc', 'ean', 'identification', 'scanner', 'product identifier'],
		description: 'A vertical lines representing a barcode.'
	},
	{
		name: 'qr-code',
		purpose: 'multi',
		usage: 'Used for QR-code experiences.',
		category: 'Devices and tech',
		aliases: [
			'qr-code',
			'quick response',
			'scan code',
			'matrix barcode',
			'scannen',
			'mobile scan',
			'link code',
			'square code',
			'ticket',
			'link'
		],
		description: 'A square QR code symbol.'
	},
	{
		name: 'mobile',
		purpose: 'multi',
		usage: 'Used for smartphones, mobile devices, or mobile-friendly layouts.',
		category: 'Devices and tech',
		aliases: [
			'handy',
			'smartphone',
			'cell',
			'phone',
			'device',
			'telefon',
			'phone',
			'mobile',
			'wireless',
			'iphone',
			'smartphone',
			'natel',
			'screen',
			'display'
		],
		description: 'A portrait smartphone with speaker slit and bottom dot.'
	},
	{
		name: 'tablet',
		purpose: 'multi',
		usage: 'Used for tablets, touch devices, or tablet-optimized views.',
		category: 'Devices and tech',
		aliases: ['tablet', 'ipad', 'device', 'touchscreen', 'pad', 'flachcomputer', 'touch device', 'portable', 'screen', 'display'],
		description: 'A portrait tablet with speaker slit and bottom dot.'
	},
	{
		name: 'desktop',
		purpose: 'multi',
		usage: 'Used for desktop PCs, monitors, or screen-based layouts.',
		category: 'Devices and tech',
		aliases: ['computer', 'pc', 'workstation', 'desktop computer', 'bürorechner', 'station', 'monitor', 'screen', 'display'],
		description: 'A widescreen desktop monitor with a stand.'
	},
	{
		name: 'lock',
		purpose: 'multi',
		usage: 'Used for security, privacy, restricted access, or to indicate content bound to a fixed state or user.',
		category: 'Status and feedback',
		aliases: [
			'schloss',
			'locked',
			'sperren',
			'secure',
			'protect',
			'verschlüsseln',
			'security',
			'verriegeln',
			'private',
			'permission',
			'no access',
			'restricted',
			'security',
			'authentication',
			'password'
		],
		description: 'A closed padlock.'
	},
	{
		oldName: 'unlock',
		name: 'lock_open',
		purpose: 'multi',
		usage: 'Used to indicate accessible content, removed restrictions, or content unbound from a fixed state or user.',
		category: 'Status and feedback',
		aliases: [
			'entsperren',
			'freigeben',
			'open',
			'access',
			'zugänglich',
			'allow',
			'permission',
			'schloss',
			'unlocked',
			'secure',
			'protect',
			'verschlüsseln',
			'security',
			'private',
			'permission',
			'access',
			'restricted',
			'security',
			'authentication',
			'password'
		],
		description: 'An opened padlock.'
	},
	{
		name: 'shield_checkmark',
		purpose: 'multi',
		usage: 'Used to represent verified security, trust, or successful protection.',
		category: 'Status and feedback',
		aliases: [
			'shield',
			'checkmark',
			'verified',
			'secure',
			'protection',
			'trusted',
			'shield icon',
			'security icon',
			'verified shield',
			'success shield',
			'trusted badge',
			'safe icon',
			'shield with tick',
			'verified security',
			'access'
		],
		description: 'A shield containing a checkmark symbol.'
	},
	{
		name: 'shield_lock',
		purpose: 'multi',
		usage: 'Used to represent restricted access, confidentiality, or secured environments.',
		category: 'Status and feedback',
		aliases: [
			'shield',
			'lock',
			'shield lock',
			'secure',
			'restricted access',
			'confidential',
			'protected',
			'privacy',
			'secure zone',
			'encrypted',
			'padlock shield',
			'secure environment',
			'locked icon',
			'shield with lock',
			'access'
		],
		description: 'A shield containing a padlock symbol.'
	},
	{
		name: 'eye',
		purpose: 'multi',
		usage:
			'Used for toggling visibility on or indicating that content is visible (e.g., passwords). Also used to show detail view or previews.',
		category: 'Status and feedback',
		aliases: ['auge', 'open eye', 'show', 'reveal', 'view', 'sichtbar', 'visible', 'visibility', 'watch', 'zeigen', 'preview', 'detail'],
		description: 'A human eye, looking forward.'
	},
	{
		oldName: 'eye-slash',
		name: 'eye_off',
		purpose: 'multi',
		usage: 'Used for toggling visibility off or indicating that content is hidden (e.g., passwords).',
		category: 'Status and feedback',
		aliases: ['verstecken', 'hide', 'unsichtbar', 'verbergen', 'mask', 'conceal', 'invisible', 'hidden'],
		description: 'A human eye with diagonal strikethrough.'
	},
	{
		oldName: 'bolt',
		name: 'lightning',
		purpose: 'multi',
		usage: 'Used for electricity, speed, or to draw attention. Also represents energy or lightning.',
		category: 'Status and feedback',
		aliases: ['blitz', 'energie', 'power', 'flash', 'schnell', 'speed', 'electricity', 'thunderbolt', 'fast', 'instant', 'energy'],
		description: 'A zigzag lightning bolt in vertical orientation.'
	},
	{
		oldName: 'thumbs-up',
		name: 'thumbs_up',
		purpose: 'multi',
		usage: 'Used for voting, agreement, or positive response.',
		category: 'Status and feedback',
		aliases: [
			'daumen hoch',
			'like',
			'approve',
			'positive',
			'zustimmung',
			'gut',
			'good',
			'approval',
			'agree',
			'vote',
			'upvote',
			'feedback',
			'hand',
			'gesture'
		],
		description: 'A thumbs-up gesture indicating approval.'
	},
	{
		oldName: 'thumbs-down',
		name: 'thumbs_down',
		purpose: 'multi',
		usage: 'Used for voting, disagreement, or negative response.',
		category: 'Status and feedback',
		aliases: [
			'daumen runter',
			'dislike',
			'negative',
			'ablehnung',
			'schlecht',
			'bad',
			'disapproval',
			'disagree',
			'downvote',
			'feedback',
			'hand',
			'gesture'
		],
		description: 'A thumbs-down gesture indicating disapproval.'
	},
	{
		oldName: 'smile',
		name: 'happy',
		purpose: 'multi',
		usage: 'Used to show positive feedback or a good experience.',
		category: 'Status and feedback',
		aliases: ['glücklich', 'froh', 'smiley', 'smile', 'grinsen', 'lachen', 'positivity', 'joy', 'cheerful', 'emoji', 'emoticon', 'face'],
		description: 'A happy face with a smile.'
	},
	{
		oldName: 'frown',
		name: 'sad',
		purpose: 'multi',
		usage: 'Used to show negative feedback or a poor experience.',
		category: 'Status and feedback',
		aliases: [
			'traurig',
			'unglücklich',
			'negativ',
			'enttäuscht',
			'sad',
			'disappointed',
			'negative',
			'unhappy',
			'down',
			'smiley',
			'emoji',
			'emoticon',
			'smiley',
			'face'
		],
		description: 'A frowning face with a downturned smile.'
	},
	{
		name: 'heart',
		purpose: 'multi',
		usage:
			'Indicates an item can be liked or favorited (default state). Toggles to the heart_filled when selected.\nFor bookmarking content, use the bookmark icon.',
		category: 'Status and feedback',
		aliases: ['herz', 'liebe', 'favourite', 'love', 'gefällt mir', 'like', 'emotion', 'affection'],
		description: 'A classic love heart, outlined.'
	},
	{
		oldName: 'heart-filled',
		name: 'heart_filled',
		purpose: 'multi',
		usage:
			'Indicates an item has been liked or favorited (selected state). Toggles back to the heart icon when unselected.\nFor bookmarking content, use the bookmark icon.',
		category: 'Status and feedback',
		aliases: ['ausgefülltes herz', 'love', 'favourited', 'liked', 'marked', 'saved', 'selected', 'cherished', 'filled'],
		description: 'A classic love heart, filled.'
	},
	{
		name: 'flag',
		purpose: 'multi',
		usage:
			'Used to mark or report content for review (default state). Toggles to flag_filled when selected.\nFor favorites or bookmarks, use the bookmark, star, or heart icons. For reporting software issues use the bug icon.',
		category: 'Status and feedback',
		aliases: ['flagge', 'fahne', 'banner', 'mark', 'markieren', 'indicator', 'report', 'important'],
		description: 'Outlined simple flag on a vertical pole.'
	},
	{
		oldName: 'flag-filled',
		name: 'flag_filled',
		purpose: 'multi',
		usage:
			'Indicates that content has been marked or reported for review (selected state).\nFor favorites or bookmarks, use the bookmark, star, or heart icons. For reporting software issues use the bug icon.',
		category: 'Status and feedback',
		aliases: ['ausgefüllte flagge', 'flagged', 'marked', 'reported', 'saved', 'bookmarked', 'highlighted', 'pinned', 'filled'],
		description: 'A filled simple flag on a vertical pole.'
	},
	{
		name: 'star',
		purpose: 'multi',
		usage:
			'Used to mark favorites, highlight important content, or represent ratings (e.g., in a 1–5 star system).\nToggles to the star_filled icon when selected.',
		category: 'Status and feedback',
		aliases: ['stern', 'bewertung', 'rating', 'favourited', 'highlight', 'wichtig', 'special', 'mark'],
		description: 'An outlined five-pointed star.'
	},
	{
		oldName: 'star-filled',
		name: 'star_filled',
		purpose: 'multi',
		usage:
			'Indicates that an item has been marked as a favorite, highlighted, or given a rating (e.g., selected state in a 1–5 star system).\nToggles back to the star icon when unselected.',
		category: 'Status and feedback',
		aliases: ['ausgefüllter stern', 'rating', 'rated', 'favourited', 'bookmarked', 'saved', 'preferred', 'marked', 'important', 'filled'],
		description: 'A filled five-pointed star.'
	},
	{
		oldName: 'stop',
		name: 'stop-gesture',
		purpose: 'multi',
		usage: 'Used to signal that an operation, process, or action should be stopped. Can also represent a raised hand gesture.',
		category: 'Status and feedback',
		aliases: ['stop', 'anhalten', 'pause', 'end', 'beenden', 'halt', 'abort', 'cease', 'hand'],
		description: 'A raised open hand.'
	},
	{
		name: 'info',
		purpose: 'multi',
		usage:
			'Used to indicate helpful or additional information; not intended for standalone use.\nUse the info_bold icon for alert messages.',
		category: 'Status and feedback',
		aliases: ['mark', 'information', 'hinweis', 'details', 'notice', 'mehr', 'erfahren', 'learn', 'more', 'additional'],
		description: 'A lower case letter i.'
	},
	{
		oldName: 'info-circle',
		name: 'info_circle',
		purpose: 'multi',
		usage: 'Used to indicate that additional information is available.',
		category: 'Status and feedback',
		aliases: [
			'mark',
			'kreis',
			'circle',
			'information',
			'details',
			'button',
			'notice',
			'circular',
			'hinweis',
			'mehr',
			'erfahren',
			'learn',
			'more',
			'additional'
		],
		description: 'A lower case letter i inside a circle.'
	},
	{
		oldName: 'alert-information',
		name: 'info_bold',
		purpose: 'single',
		usage: 'Reserved for alert messages and informational components.',
		category: 'Status and feedback',
		aliases: [
			'mark',
			'fett',
			'bold',
			'information',
			'details',
			'alert',
			'notice',
			'hinweis',
			'mehr',
			'erfahren',
			'learn',
			'more',
			'additional'
		],
		description: 'A lower case bold letter i.'
	},
	{
		oldName: 'help',
		name: 'question',
		purpose: 'multi',
		usage:
			'Used to indicate help or support, typically in navigation.\nAvoid using it as a standalone element.\nFor general support or help content use the support icon.',
		category: 'Status and feedback',
		aliases: [
			'fragezeichen',
			'questionmark',
			'mark',
			'?',
			'query',
			'inquiry',
			'faq',
			'help',
			'support',
			'hilfe',
			'assistance',
			'aid',
			'service ',
			'guidance'
		],
		description: 'A question mark.'
	},
	{
		oldName: 'help-circle',
		name: 'question_circle',
		purpose: 'multi',
		usage: 'Used to provide tooltips, help, or additional contextual information.',
		category: 'Status and feedback',
		aliases: [
			'circle',
			'kreise',
			'circular',
			'fragezeichen',
			'questionmark',
			'mark',
			'?',
			'query',
			'inquiry',
			'faq',
			'help',
			'support',
			'hilfe',
			'assistance',
			'aid',
			'service ',
			'guidance'
		],
		description: 'A circle with a question mark inside, representing help or additional information.'
	},
	{
		oldName: 'warning',
		name: 'exclamation',
		purpose: 'multi',
		usage:
			'Used to highlight important content; not intended for standalone usage.\nUse the exclamation_circle icon in input field error states or warning pills, the exclamation_triangle icon for warnings, and the exclamation_bold icon for alert messages or informational content.',
		category: 'Status and feedback',
		aliases: ['warnung', '!', 'exclaim', 'alert', 'caution', 'attention', 'achtung', 'notice', 'warning', 'notice', 'issue'],
		description: 'An exclamation mark.'
	},
	{
		oldName: 'alert-warning',
		name: 'exclamation_bold',
		purpose: 'single',
		usage:
			'Reserved for informational infoboxes (alerts) and notifications.\nDisplayed in combination with the specific color.\nNot intended for standalone usage.',
		category: 'Status and feedback',
		aliases: [
			'bold',
			'fett',
			'warnung',
			'!',
			'exclaim',
			'alert',
			'caution',
			'attention',
			'achtung',
			'notice',
			'warning',
			'notice',
			'issue'
		],
		description: 'A bold exclamation mark.'
	},
	{
		oldName: 'warning-triangle',
		name: 'exclamation_triangle',
		purpose: 'single',
		usage: 'Reserved for warning in infoboxes (alerts) and warning in notifications.\nDisplayed in combination with the specific color.',
		category: 'Status and feedback',
		aliases: [
			'dreieck',
			'triangle',
			'triangular',
			'warnung',
			'!',
			'exclaim',
			'alert',
			'caution',
			'attention',
			'achtung',
			'notice',
			'warning',
			'notice',
			'issue',
			'hazard',
			'danger'
		],
		description: 'An exclamation mark inside a triangle.'
	},
	{
		oldName: 'warning-circle',
		name: 'exclamation_circle',
		purpose: 'multi',
		usage: 'Used for an error state for input field, warning in a pill.\nUsed also in specific warnings.',
		category: 'Status and feedback',
		aliases: [
			'kreis',
			'circle circular',
			'warning',
			'!',
			'exclaim',
			'alert',
			'caution',
			'attention',
			'achtung',
			'notice',
			'warning',
			'notice',
			'issue'
		],
		description: 'An exclamation mark inside a circle.'
	},
	{
		oldName: 'warning-box',
		name: 'exclamation_diamond',
		purpose: 'single',
		usage:
			'Reserved for warnings when the standard warning icon (exclamation_triangle) is not emphasizing enough.\nDisplayed in combination with the specific color.',
		category: 'Status and feedback',
		aliases: [
			'raute',
			'diamond',
			'diamant',
			'rhombus',
			'warning',
			'!',
			'exclaim',
			'alert',
			'caution',
			'attention',
			'achtung',
			'notice',
			'warning',
			'notice',
			'issue',
			'hazard',
			'danger'
		],
		description: 'An exclamation mark inside a diamond shape.'
	},
	{
		name: 'checkmark',
		purpose: 'multi',
		usage:
			'Used to indicate confirmation, completion, or a correct status. In alert messages displayed in combination with the success color.',
		category: 'Status and feedback',
		aliases: [
			'häkchen',
			'tick',
			'correct',
			'yes',
			'approved',
			'bestätigung',
			'successful',
			'confirmation',
			'positive',
			'mark',
			'done',
			'verification'
		],
		description: 'A simple checkmark.'
	},
	{
		oldName: 'checkmark-circle',
		name: 'checkmark_circle',
		purpose: 'multi',
		usage:
			'Used as an alternative to the checkmark icon to indicate confirmation, completion, or a correct status.\nDisplayed in combination with the success color.',
		category: 'Status and feedback',
		aliases: [
			'kreis',
			'circle circular',
			'häkchen',
			'tick',
			'correct',
			'yes',
			'approved',
			'bestätigung',
			'successful',
			'confirmation',
			'positive',
			'mark',
			'done',
			'verification'
		],
		description: 'A circle with a check mark inside.'
	},
	{
		oldName: 'alert-success',
		name: 'checkmark_bold',
		purpose: 'single',
		usage: 'Reserved for success infoboxes (alerts) and notifications. Used in combination with the success color.',
		category: 'Status and feedback',
		aliases: [
			'bold',
			'fett',
			'häkchen',
			'tick',
			'correct',
			'yes',
			'approved',
			'bestätigung',
			'successful',
			'confirmation',
			'positive',
			'mark',
			'done',
			'verification'
		],
		description: 'A bold checkmark.'
	},
	{
		name: 'checkmark_star',
		purpose: 'multi',
		usage: 'Used for checkout confirmation by web-shop order process.\nNot intended for common system feedback messages.',
		category: 'Status and feedback',
		aliases: ['shop check out', 'order', 'shopping', 'erfolgreich gekauft', 'purchase completed'],
		description: 'An eight-pointed star with rounded corners and a checkmark inside.'
	},
	{
		oldName: 'cancel',
		name: 'xmark',
		purpose: 'multi',
		usage:
			'Used to close, cancel, or dismiss elements such as alerts, or notifications.\nOn mobile to close navigation menu.\nTo close a dialog use button with a label Cancel or Close.',
		category: 'Status and feedback',
		aliases: [
			'abbrechen',
			'cancel',
			'close',
			'dismiss',
			'schliessen',
			'exit',
			'remove',
			'delete',
			'error',
			'cross',
			'x',
			'mark',
			'fehler',
			'issue'
		],
		description: 'A cross mark formed by two diagonal lines.'
	},
	{
		oldName: 'cancel-circle',
		name: 'xmark_circle',
		purpose: 'multi',
		usage: 'Used for clearing a text field, remove a pill.',
		category: 'Status and feedback',
		aliases: [
			'kreis',
			'circle circular',
			'abbrechen',
			'cancel',
			'close',
			'dismiss',
			'schliessen',
			'exit',
			'remove',
			'delete',
			'error',
			'cross',
			'x',
			'mark',
			'fehler',
			'issue'
		],
		description: 'A cross mark inside a circle.'
	},
	{
		oldName: 'alert-error',
		name: 'xmark_bold',
		purpose: 'single',
		usage: 'Reserved for alert messages and components.',
		category: 'Status and feedback',
		aliases: [
			'bold',
			'fett',
			'alert',
			'kreis',
			'circle circular',
			'abbrechen',
			'cancel',
			'close',
			'dismiss',
			'schliessen',
			'exit',
			'remove',
			'delete',
			'error',
			'cross',
			'x',
			'mark',
			'fehler',
			'issue'
		],
		description: 'A bold cross mark.'
	},
	{
		oldName: 'ban',
		name: 'prohibition',
		purpose: 'multi',
		usage: 'Used to represent prohibition, restriction, or denial of access.\nIndicates a disallowed or forbidden action.',
		category: 'Status and feedback',
		aliases: [
			'ban',
			'verboten',
			'prohibited',
			'not allowed',
			'restriction',
			'no entry',
			'verbot',
			'forbidden',
			'restricted',
			'forbid',
			'block',
			'stop'
		],
		description: 'The prohibition symbol: a circle with a diagonal strikethrough, indicating restriction or forbidden action.'
	},
	{
		oldName: 'user',
		name: 'person',
		purpose: 'multi',
		usage: 'Used to represent a person or a user.',
		category: 'People and identity',
		aliases: ['benutzer', 'user', 'account', 'profile', 'person', 'individual', 'member', 'identity', 'avatar', 'customer'],
		description: 'A simplified human figure with a round head and shoulders.'
	},
	{
		oldName: 'users',
		name: 'person_group',
		purpose: 'multi',
		usage: 'Used to represent a group or collection of people or users.',
		category: 'People and identity',
		aliases: ['benutzergruppe', 'group', 'team', 'users', 'community', 'multiple', 'mehrere', 'people', 'collective family'],
		description: 'A group of three simplified human figures.'
	},
	{
		oldName: 'user-checkmark',
		name: 'person_checkmark',
		purpose: 'multi',
		usage: 'Used to represent a verified or approved user.',
		category: 'People and identity',
		aliases: [
			'user',
			'bestätigt',
			'benutzer',
			'verified',
			'approved',
			'confirmed',
			'account',
			'verifiziert',
			'validated',
			'trusted',
			'authenticated',
			'checkmark'
		],
		description: 'A simplified human figure next to a checkmark at the top right corner.'
	},
	{
		oldName: 'user-cog',
		name: 'person_settings',
		purpose: 'single',
		usage:
			'Used for user settings when shown alone.\nAvoid using it in general user menus (e.g., account dropdowns). Use the person icon to represent a user.',
		category: 'People and identity',
		aliases: [
			'benutzer',
			'einstellungen',
			'user',
			'settings',
			'account',
			'options',
			'profile',
			'configure',
			'preferences',
			'config',
			'management'
		],
		description: 'A simplified human figure next to a gear icon in the top right corner.'
	},
	{
		oldName: 'user-pen',
		name: 'person_pencil',
		purpose: 'multi',
		usage: 'Used to edit a user data or represent an author.',
		category: 'People and identity',
		aliases: [
			'benutzer',
			'bearbeitung',
			'edit',
			'user',
			'modify',
			'profile',
			'account',
			'ändern',
			'modification',
			'update',
			'author',
			'autor'
		],
		description: 'A simplified human figure next to a pencil icon in the top right corner.'
	},
	{
		oldName: 'user-brush',
		name: 'person_brush',
		purpose: 'multi',
		usage: 'Used to represent a designer, an artist, or a creative professional.',
		category: 'People and identity',
		aliases: ['benutzerstil', 'user', 'style', 'profile', 'designer', 'customization', 'anpassen', 'styling', 'personalize', 'customize'],
		description: 'A simplified human figure next to a brush icon in the top right corner.'
	},
	{
		oldName: 'user-code',
		name: 'person_code',
		purpose: 'multi',
		usage: 'Used to represent a software developer, or someone involved in coding.',
		category: 'People and identity',
		aliases: ['entwickler', 'programmer', 'coder', 'developer', 'user', 'account', 'programmierer', 'tech', 'engineer', 'coding'],
		description: 'A simplified human figure next to angle brackets representing code in the top right corner.'
	},
	{
		oldName: 'doctor',
		name: 'person_medic',
		purpose: 'multi',
		usage: 'Used to represent a medical worker, doctor, or healthcare professionals.',
		category: 'People and identity',
		aliases: ['arzt', 'physician', 'professional', 'healthcare', 'worker', 'doktor', 'medical', 'health', 'staff', 'spital'],
		description:
			'A simplified human figure wearing a medical hat, with a medical cross on the chest, representing a healthcare worker or doctor.'
	},
	{
		name: 'badge',
		purpose: 'multi',
		usage: 'Used to represent ID badges or access passes.',
		category: 'People and identity',
		aliases: ['abzeichen, credentials, identification, ausweis, badge card, security pass, permit'],
		description: 'A personal badge with a chip, a person icon, and two horizontal lines representing text.'
	},
	{
		name: 'id-card',
		purpose: 'multi',
		usage:
			'Used to represent identification or contact cards, as well as personal information such as name and role.\nFor ID badges or access passes, use the badge icon.',
		category: 'People and identity',
		aliases: [
			'ausweis',
			'identification',
			'personal',
			'id',
			'id card',
			'identity',
			'card',
			'personalausweis',
			'badge',
			'license',
			'credentials'
		],
		description: 'A personal identification card with a person icon, and two horizontal lines representing text.'
	},
	{
		oldName: 'gender-identity-agender',
		name: 'gender_agender',
		purpose: 'single',
		usage: 'Used to represent agender individuals or identity (people who do not identify with any gender).',
		category: 'People and identity',
		aliases: ['agender', 'geschlechtslos', 'without', 'genderless', 'neutral', 'non', 'gendered'],
		description: 'Agender identity symbol: a circle with a horizontal line across the center and a vertical line extending upward.'
	},
	{
		oldName: 'gender-identity-bigender',
		name: 'gender_bigender',
		purpose: 'single',
		usage:
			'Used to represent bigender identity (someone who identifies with both male and female genders).\nNot to be confused with the heterosexuality symbol.',
		category: 'People and identity',
		aliases: ['bigender', 'zwei', 'geschlechter', 'dual', 'gender', 'both', 'fluid', 'multi', 'diverse'],
		description: 'Bigender symbol: circle with an arrow at the top right and a cross at the bottom.'
	},
	{
		oldName: 'gender-identity-female',
		name: 'gender_female',
		purpose: 'multi',
		usage: 'Used as a representation of women, feminine identity, or female gender.',
		category: 'People and identity',
		aliases: ['weiblich', 'frau', 'woman', 'feminine', 'female', 'venus', 'girl'],
		description: 'Female gender symbol: circle with a cross at the bottom.'
	},
	{
		oldName: 'gender-identity-male',
		name: 'gender_male',
		purpose: 'multi',
		usage: 'Used as a representation of men, masculine identity, or male gender.',
		category: 'People and identity',
		aliases: ['männlich', 'mann', 'man', 'masculine', 'male', 'mars', 'boy'],
		description: 'Male gender symbol: circle with an arrow at the top right.'
	},
	{
		oldName: 'gender-identity-gender-expansive',
		name: 'gender_transgender',
		purpose: 'single',
		usage: 'Used to represent transgender identity.',
		category: 'People and identity',
		aliases: ['gender', 'transgender', 'expansive', 'broad', 'expanded', 'identity', 'spectrum', 'erweitert', 'diverse'],
		description:
			'Transgender symbol: a circle with an arrow at the top right, a cross at the bottom, and a stroked arrow at the top-left side.'
	},
	{
		oldName: 'gender-identity-neutrois',
		name: 'gender_neutrois',
		purpose: 'single',
		usage: 'Used to represent neutrois identity.',
		category: 'People and identity',
		aliases: ['neutrois', 'neutral', 'null', 'neither', 'weder noch', 'gender', 'third', 'non-binary', 'nicht-binär'],
		description: 'Neutrois gender symbol: circle with a vertical line extending downward.'
	},
	{
		oldName: 'gender-identity-non-binary',
		name: 'gender_non-binary',
		purpose: 'single',
		usage: 'Used to represent non-binary identity.',
		category: 'People and identity',
		aliases: ['nicht-binär', 'enby', 'weder noch', 'queer', 'third', 'diverse'],
		description: 'Non-binary gender symbol: circle and an upward line with an asterisk on top.'
	},
	{
		oldName: 'increase',
		name: 'growth',
		purpose: 'multi',
		usage: 'Used to represent upward trends, progress, or growth.',
		category: 'Data visualisation',
		aliases: [
			'zunahme',
			'wachstum',
			'rise',
			'gain',
			'steigend',
			'upward',
			'positive',
			'uptrend',
			'improvement',
			'arrow',
			'increase',
			'line',
			'chart grow'
		],
		description: 'A rising zigzag arrow.'
	},
	{
		oldName: 'decrease',
		name: 'decline',
		purpose: 'multi',
		usage: 'Used to represent downward trends, loss, or decline.',
		category: 'Data visualisation',
		aliases: [
			'abnahme',
			'rückgang',
			'reduction',
			'falling',
			'downtrend',
			'sinkend',
			'fallend',
			'downward',
			'negative',
			'drop',
			'arrow',
			'decrease',
			'line',
			'chart decrease'
		],
		description: 'A falling zigzag arrow.'
	},
	{
		oldName: 'chart-bar',
		name: 'chart_bar_horizontal',
		purpose: 'multi',
		usage:
			'Used to present data in a horizontal bar chart or diagram.\nFor metrics or performance indicators, consider using the tachometer icon.',
		category: 'Data visualisation',
		aliases: [
			'balken',
			'diagramm',
			'graph',
			'statistics',
			'data visualization',
			'horizontal',
			'Data visualisation',
			'metrics',
			'bar graph'
		],
		description: 'A horizontal bar chart with multiple bars of varying length.'
	},
	{
		oldName: 'chart',
		name: 'chart_bar_vertical',
		purpose: 'multi',
		usage:
			'Used to display data in a vertical column chart or diagram.\nFor metrics or performance indicators, consider using the tachometer icon.',
		category: 'Data visualisation',
		aliases: ['diagramm', 'graph', 'statistics', 'data visualization', 'vertical', 'Data visualisation', 'metrics', 'visualization'],
		description: 'A Vertical bar chart with multiple bars of varying length.'
	},
	{
		oldName: 'chart-pie',
		name: 'chart_pie',
		purpose: 'multi',
		usage: 'Used to present data as a pie chart, typically to show proportions or distribution.',
		category: 'Data visualisation',
		aliases: ['kreis', 'diagramm', 'pie', 'graph', 'sector graph', 'circular', 'torten', 'kuchen', 'segments', 'proportion'],
		description: 'Circular pie chart with four segments.'
	},
	{
		oldName: 'chart-line',
		name: 'chart_line',
		purpose: 'multi',
		usage: 'Used to display trends or continuous data in a line graph.',
		category: 'Data visualisation',
		aliases: ['linien', 'diagramm', 'trend', 'graph', 'progress', 'verlauf', 'time series', 'development', 'trajectory'],
		description: 'Line chart with a single fluctuating line.'
	},
	{
		oldName: 'chart-increase',
		name: 'chart_line_growth',
		purpose: 'multi',
		usage: 'Used to indicate increasing trends or growth over time.',
		category: 'Data visualisation',
		aliases: [
			'zunahme',
			'wachstum',
			'rise',
			'gain',
			'steigend',
			'upward',
			'positive',
			'uptrend',
			'improvement',
			'arrow',
			'increase',
			'line',
			'verlauf',
			'rising',
			'trend',
			'growth',
			'graph',
			'chart',
			'bar',
			'line',
			'diagramm'
		],
		description: 'Line chart with a rising zigzag arrow indicating growth.'
	},
	{
		oldName: 'chart-decrease',
		name: 'chart_line_decline',
		purpose: 'multi',
		usage: 'Used to indicate decreasing trends or decline over time.',
		category: 'Data visualisation',
		aliases: [
			'abnahme',
			'rückgang',
			'reduction',
			'fallend',
			'drop',
			'arrow',
			'abwärts',
			'verlauf',
			'downtrend',
			'falling',
			'negative',
			'sinkend',
			'decline',
			'downward',
			'graph',
			'chart',
			'bar',
			'line',
			'diagramm'
		],
		description: 'Line chart with a diagonal zigzag arrow pointing downwards.'
	},
	{
		oldName: 'chart-search',
		name: 'search_insights',
		purpose: 'multi',
		usage: 'Used to represent data analysis or insights.',
		category: 'Data visualisation',
		aliases: [
			'diagramm',
			'suche',
			'data',
			'analysis',
			'chart',
			'bar',
			'Data visualisation',
			'trend finding',
			'datenanalyse',
			'insights',
			'exploration',
			'pattern',
			'search',
			'graph',
			'magnifier',
			'magnifying',
			'lupe'
		],
		description: 'Magnifier glass with three chart columns inside the lens.'
	},
	{
		name: 'tachometer',
		purpose: 'multi',
		usage: 'Used to display metrics, dashboards, system overviews, or management summaries.',
		category: 'Data visualisation',
		aliases: [
			'tacho',
			'speedometer',
			'gauge',
			'speed',
			'geschwindigkeitsmesser',
			'dashboard',
			'performance',
			'indicator',
			'dial',
			'metrics'
		],
		description: 'Circular gauge with needle.'
	},
	{
		oldName: 'universal-access',
		name: 'accessibility',
		purpose: 'single',
		usage:
			'Used on equipment and user interfaces to indicate accessibility settings.\nFor physical accessibility related to limited mobility, use the “wheelchair” icon.',
		category: 'Accessibility',
		aliases: [
			'barrierefreiheit',
			'accessibility',
			'accessible',
			'inclusive',
			'design',
			'alle',
			'zugänglich',
			'universal',
			'disability',
			'access',
			'equal',
			'wcag',
			'wheelchair'
		],
		description: 'Universal accessibility symbol: stylized human figure with outstretched arms and legs inside a circle.'
	},
	{
		name: 'wheelchair',
		purpose: 'single',
		usage:
			'Reserved to indicate access for individuals with limited mobility, including wheelchair users.\nFor digital accessibility, use the accessibility icon.\nRepresents the International Symbol of Access (ISA), standardized by ISO 7001 and ADA guidelines.',
		category: 'Accessibility',
		aliases: [
			'rollstuhl',
			'mobility',
			'disabled',
			'accessible',
			'barrierefrei',
			'disability',
			'aid',
			'handicap',
			'barrierefreiheit',
			'accessibility',
			'inclusive',
			'design',
			'alle',
			'zugänglich',
			'universal',
			'equal',
			'wheelchair'
		],
		description: 'The International Symbol of Access: Side view of human figure in a wheelchair.'
	},
	{
		oldName: 'blind',
		name: 'visual-impairment',
		purpose: 'single',
		usage:
			'Reserved to indicate facilities accessible to people who are blind or have low vision.\nUse the low-vision icon for low-vision accessibility features, the braille icon for braille content, and the audio-description icon for accessible video content.\nRepresents the ISO 7001 symbol for accessibility related to blind or low-vision individuals.',
		category: 'Accessibility',
		aliases: [
			'barrierefreiheit',
			'accessibility',
			'blindness',
			'low',
			'vision',
			'sehbehindert',
			'visually',
			'impairment',
			'impaired',
			'loss',
			'sight',
			'disability',
			'sight'
		],
		description: 'A person walking with a white cane as a mobility aid.'
	},
	{
		name: 'low-vision',
		purpose: 'single',
		usage:
			'Reserved to indicate features or settings for people with low vision (higher contrast, larger text, or improved readability).\nRepresents the ISO 7001 symbol for accessibility for individuals with low vision.',
		category: 'Accessibility',
		aliases: [
			'sehschwäche',
			'partial',
			'limited',
			'sight',
			'sehen',
			'limitation',
			'barrierefreiheit',
			'accessibility',
			'blindness',
			'low',
			'vision',
			'sehbehindert',
			'visually',
			'impairment',
			'impaired',
			'loss',
			'sight',
			'disability'
		],
		description:
			'An eye with one diagonal line passing through from top right to bottom left and six diagonal lines (alternating black and white) covering right side.'
	},
	{
		oldName: 'deaf',
		name: 'hard-of-hearing',
		purpose: 'single',
		usage:
			'Reserved to show that communication support is available for people with hearing loss or deafness.\nUse the sign-language icon for sign language services, and the closed-captions icon for captions or subtitles.\nRepresents the International Symbol of Access for Hearing Loss.',
		category: 'Accessibility',
		aliases: [
			'barrierefreiheit',
			'accessibility',
			'gehörlos',
			'hearing',
			'impaired',
			'deaf',
			'disability',
			'schwerhörig',
			'auditory',
			'impairment',
			'loss',
			'ear',
			'aid',
			'listening'
		],
		description: 'An ear with a broken line across it.'
	},
	{
		name: 'sign-language',
		purpose: 'single',
		usage: 'Indicates that sign language interpretation is provided.',
		category: 'Accessibility',
		aliases: ['gebärdensprache', 'signing', 'hand', 'signs', 'deaf', 'communication', 'asl', 'nonverbal', 'language', 'gestures'],
		description: 'Two open overlapping hands.'
	},
	{
		name: 'easy-language',
		purpose: 'single',
		usage: 'Reserved to indicate content written in easy-to-understand language.',
		category: 'Accessibility',
		aliases: [
			'leichte',
			'sprache',
			'simplified',
			'language',
			'plain',
			'reading',
			'einfache',
			'clear',
			'communication',
			'text',
			'basic',
			'book'
		],
		description: 'An open book with a thumbs-up hand in front, representing easy or accessible language.'
	},
	{
		name: 'braille',
		purpose: 'single',
		usage: 'Reserved to indicate that Braille is available.',
		category: 'Accessibility',
		aliases: [
			'braille',
			'blindenschrift',
			'tactile',
			'writing',
			'raised',
			'dots',
			'touch',
			'reading',
			'blind',
			'alphabet',
			'communication',
			'text'
		],
		description: 'Two Braille letters spelling CH.'
	},
	{
		name: 'audio-description',
		purpose: 'single',
		usage: 'Reserved for enabling audio descriptions in videos.',
		category: 'Accessibility',
		aliases: [
			'deskription',
			'verbal',
			'description',
			'narration',
			'described',
			'ton',
			'beschreibung',
			'narrated',
			'content',
			'explanation',
			'media',
			'volume',
			'sound',
			'audio'
		],
		description: 'The abbreviation AD followed by sound waves, representing audio description for visually impaired users.'
	},
	{
		oldName: 'closed-captions',
		name: 'closed-captions',
		purpose: 'single',
		usage: 'Reserved for enabling closed captions in videos.',
		category: 'Accessibility',
		aliases: [
			'closed captions, cc, subtitles, captioning, video captions, accessibility, transcript, media text, audio captions, subtitle icon, hearing accessibility, caption icon, audio, video, player'
		],
		description: 'The abbreviation CC in a frame representing closed captions.'
	},
	{
		oldName: 'git-hub',
		name: 'github',
		purpose: 'single',
		usage: 'Used for links to GitHub pages or to indicate that GitHub is part of the project.',
		category: 'Social media',
		aliases: ['github', 'git', 'repository', 'version control', 'code hosting', 'open source', 'development'],
		description: 'GitHub logo showing Octocat character.'
	},
	{
		name: 'facebook',
		purpose: 'single',
		usage: 'Used to link to or represent a presence on Facebook.',
		category: 'Social media',
		aliases: ['media', 'fb', 'meta', 'soziales', 'netzwerk', 'social media', 'network', 'platform'],
		description: 'Facebook logo with outlined letter f.'
	},
	{
		name: 'instagram',
		purpose: 'single',
		usage: 'Used to link to or represent a presence on Instagram.',
		category: 'Social media',
		aliases: ['social media', 'ig', 'insta', 'fotos', 'platform', 'network', 'photos', 'image', 'sharing'],
		description: 'Instagram logo with camera icon.'
	},
	{
		oldName: 'linked-in',
		name: 'linkedin',
		purpose: 'single',
		usage: 'Used to link to or represent a presence on LinkedIn.',
		category: 'Social media',
		aliases: ['business', 'network', 'career', 'platform', 'professional', 'job', 'beruflich', 'netzwerk', 'social', 'media'],
		description: 'LinkedIn logo with letters in.'
	},
	{
		name: 'xing',
		purpose: 'single',
		usage: 'Used to link to or represent a presence on Xing.',
		category: 'Social media',
		aliases: ['business', 'network', 'career', 'platform', 'professional', 'job', 'beruflich', 'netzwerk', 'social', 'media'],
		description: 'Xing logo with stylized x shape'
	},
	{
		name: 'x-twitter',
		purpose: 'single',
		usage: 'Used to link to or represent a presence on X (formerly Twitter).',
		category: 'Social media',
		aliases: ['twitter', 'x', 'tweet', 'social media', 'microblogging', 'kurz', 'nachrichten', 'network', 'platform'],
		description: 'Social network X logo (formerly Twitter) with letter x.'
	},
	{
		name: 'youtube',
		purpose: 'single',
		usage: 'Used to link to or represent a presence on YouTube.',
		category: 'Social media',
		aliases: ['video', 'platform', 'yt', 'videos', 'channel', 'kanal', 'streaming', 'content', 'sharing'],
		description: 'YouTube logo with play button.'
	},
	{
		name: 'clipboard',
		purpose: 'multi',
		usage: 'Used for pasting content from the clipboard, or to represent clipboard and notes.',
		category: 'Content and files',
		aliases: ['zwischenablage', 'copy', 'paste', 'board', 'klemmboard', 'notes', 'clipping', 'holder'],
		description: 'A clipboard with a top clip.'
	},
	{
		name: 'folder',
		purpose: 'multi',
		usage: 'Used for folders or to represent structured, categorized, or work-related content.',
		category: 'Content and files',
		aliases: ['ordner', 'verzeichnis', 'directory', 'archive', 'collection', 'data', 'files', 'documents'],
		description: 'A paper folder with tab on the top left.'
	},
	{
		oldName: 'folder-open',
		name: 'folder_open',
		purpose: 'multi',
		usage: 'Used for currently open folders or to indicate active access to structured content.',
		category: 'Content and files',
		aliases: [
			'geöffneter ordner',
			'open directory',
			'directory',
			'browsing',
			'viewing',
			'inspecting',
			'file access',
			'navigate',
			'explore'
		],
		description: 'A slightly open paper folder.'
	},
	{
		name: 'image',
		purpose: 'multi',
		usage: 'Used as an image placeholder, or for image upload.\nFor image files use the file_image icon.',
		category: 'Content and files',
		aliases: ['bild', 'foto', 'picture', 'grafik', 'illustration', 'photo', 'visual', 'artwork', 'placeholder'],
		description: 'A placeholder image with mountains and a sun in the top left.'
	},
	{
		name: 'stack',
		purpose: 'multi',
		usage: 'Used to represent collections of files, or other grouped items.',
		category: 'Content and files',
		aliases: [
			'stack',
			'stacked',
			'files',
			'file group',
			'layered items',
			'document stack',
			'layers',
			'grouped files',
			'collection',
			'pile of papers',
			'content stack',
			'stack icon',
			'multi document',
			'resource stack'
		],
		description: 'Three stacked layers or papers shown in perspective.'
	},
	{
		oldName: 'duplicate',
		name: 'copy',
		purpose: 'multi',
		usage: 'Used for copying data such as text, code or other objects. Also for cloning and duplicating objects.',
		category: 'Content and files',
		aliases: [
			'kopieren',
			'duplicate',
			'clone',
			'copy',
			'replicate',
			'duplizieren',
			'multiply',
			'replika',
			'duplicate',
			'object',
			'files',
			'data'
		],
		description: 'Two overlapping rectangles or sheets of paper.'
	},
	{
		name: 'attachment',
		purpose: 'single',
		usage:
			'Reserved for attaching files to messages or other objects, or for indicating that an attachment is present.\nNot to be confused with the link icon.',
		category: 'Content and files',
		aliases: ['anhang', 'beilage', 'paper', 'clip', 'file', 'dokument', 'attached', 'dateianhang', 'enclosed'],
		description: 'A paper clip, as used to hold together sheets of paper..'
	},
	{
		oldName: 'archive',
		name: 'archive-box',
		purpose: 'multi',
		usage: 'Used to represent archiving, accessing archived records, or storage.',
		category: 'Content and files',
		aliases: [
			'archiv',
			'storage',
			'box',
			'lagerung',
			'sammlung',
			'repository',
			'records',
			'collection',
			'inventory',
			'file',
			'document',
			'datei',
			'dokument',
			'archivieren'
		],
		description: 'An archive box with a lid.'
	},
	{
		name: 'video',
		purpose: 'single',
		usage: 'Reserved for video content.',
		category: 'Content and files',
		aliases: ['video', 'film', 'movie', 'clip', 'aufnahme', 'recording', 'footage', 'media'],
		description: 'A rectangular video tape with right-pointing triangle at the center.'
	},
	{
		name: 'file',
		purpose: 'multi',
		usage: 'Used for a generic file or document, regardless of content type.',
		category: 'Content and files',
		aliases: ['datei', 'document', 'dokument', 'data', 'record', 'paper', 'page', 'sheet', 'papier', 'print', 'drucken'],
		description: 'A sheet of paper with a folded corner, representing a file.'
	},
	{
		oldName: 'file-lines',
		name: 'file_text',
		purpose: 'multi',
		usage: 'Used for files or documents that contain text content.',
		category: 'Content and files',
		aliases: ['datei', 'document', 'dokument', 'data', 'record', 'paper', 'page', 'sheet', 'format', 'text', 'written', 'content'],
		description: 'A sheet of paper with text lines.'
	},
	{
		oldName: 'file-bullet',
		name: 'file_list',
		purpose: 'multi',
		usage: 'Used for documents containing structured lists.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'aufzählungs',
			'bullet',
			'list',
			'dotted',
			'structured',
			'ordered',
			'points'
		],
		description: 'A sheet of paper with bulleted list.'
	},
	{
		oldName: 'file-checkmark',
		name: 'file_checkmark',
		purpose: 'multi',
		usage: 'Used for files or documents that have been reviewed, approved, completed, or verified.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'bestätigte',
			'verified',
			'checked',
			'completed ',
			'geprüft',
			'validated',
			'approved',
			'confirmed'
		],
		description: 'A sheet of paper a folded corner and a checkmark.'
	},
	{
		oldName: 'file-user',
		name: 'file_person',
		purpose: 'multi',
		usage: 'Used for documents associated with a person.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'benutzer',
			'user',
			'profile',
			'personal',
			'persönlich',
			'individual'
		],
		description: 'A sheet of paper with person silhouette.'
	},
	{
		oldName: 'file-plus',
		name: 'file_add',
		purpose: 'single',
		usage: 'Reserved to create or add a new file or document.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'hinzufügen',
			'add',
			'new',
			'create',
			'neu',
			'additional',
			'creation',
			'generation'
		],
		description: 'A sheet of paper with plus sign.'
	},
	{
		oldName: 'file-forward',
		name: 'file_forward',
		purpose: 'multi',
		usage: 'Used for a file or document that is being forwarded or shared.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'weiterleiten',
			'share',
			'forward',
			'send',
			'teilen',
			'sharing',
			'transfer',
			'pass'
		],
		description: 'A sheet of paper with right arrow.'
	},
	{
		oldName: 'file-image',
		name: 'file_image',
		purpose: 'single',
		usage: 'Used to represent image files, such as photos, graphics, or illustrations.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'bild',
			'image',
			'photo',
			'picture',
			'foto',
			'graphic',
			'visual',
			'illustration',
			'jpg',
			'png',
			'jpeg',
			'avif',
			'webp'
		],
		description: 'A sheet of paper with a folded corner and an image placeholder, representing an image file.'
	},
	{
		oldName: 'file-pdf',
		name: 'file_pdf',
		purpose: 'single',
		usage: 'Used for files in PDF format.',
		category: 'Content and files',
		aliases: ['datei', 'document', 'dokument', 'data', 'record', 'paper', 'page', 'sheet', 'format', 'pdf', 'portable', 'adobe,'],
		description: 'A sheet of paper with PDF label.'
	},
	{
		oldName: 'file-epub',
		name: 'file_epub',
		purpose: 'single',
		usage: 'Used for files in EPUB format.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'epub',
			'electronic',
			'book',
			'ebook',
			'digital',
			'e-book',
			'elektronisch',
			'buch',
			'reader',
			'publication'
		],
		description: 'A sheet of paper with EPUB label.'
	},
	{
		oldName: 'file-xml',
		name: 'file_xml',
		purpose: 'single',
		usage: 'Used for files in XML format.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'xml',
			'markup',
			'web',
			'structured',
			'language',
			'code',
			'extensible',
			'structure'
		],
		description: 'A sheet of paper with XML label.'
	},
	{
		oldName: 'file-csv',
		name: 'file_csv',
		purpose: 'single',
		usage: 'Used for files in XML format.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'csv',
			'comma',
			'separated',
			'table',
			'spreadsheet',
			'tabellen',
			'values',
			'database',
			'tabular'
		],
		description: 'A sheet of paper with CSV label.'
	},
	{
		oldName: 'file-code',
		name: 'file_code',
		purpose: 'single',
		usage: 'Used for files containing source code or scripts.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'code',
			'programming',
			'script',
			'coding',
			'programmierung',
			'development',
			'source'
		],
		description: 'A paper sheet with code symbol made of angle brackets and a slash inside.'
	},
	{
		oldName: 'file-json',
		name: 'file_json',
		purpose: 'single',
		usage: 'Used for files in JSON format.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'json',
			'javascript',
			'object',
			'structure',
			'web',
			'structured'
		],
		description: 'A sheet of paper with JSON label.'
	},
	{
		oldName: 'file-ppt',
		name: 'file_powerpoint',
		purpose: 'single',
		usage: 'Used for Microsoft PowerPoint documents (.ppt or .pptx).',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'powerpoint',
			'presentation',
			'slides',
			'deck',
			'präsentation',
			'pptx',
			'ppt',
			'microsoft'
		],
		description: 'A sheet of paper with PPT label.'
	},
	{
		oldName: 'file-word',
		name: 'file_word',
		purpose: 'single',
		usage: 'Used for Microsoft Word documents (.doc or .docx).',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'word',
			'text',
			'writing',
			'editor',
			'processor',
			'doc',
			'docx',
			'editing',
			'microsoft'
		],
		description: 'A sheet of paper with DOC label.'
	},
	{
		oldName: 'file-excel',
		name: 'file_excel',
		purpose: 'single',
		usage: 'Used for Microsoft Excel documents (.xls or .xlsx).',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'excel',
			'spreadsheet',
			'calculation',
			'table',
			'tabellen',
			'analysis',
			'worksheet',
			'xls',
			'xlsx',
			'microsoft'
		],
		description: 'A sheet of paper with XLS label.'
	},
	{
		oldName: 'file-zip',
		name: 'file_zip',
		purpose: 'single',
		usage: 'Used for compressed archive files, typically in ZIP format (.zip).',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'zip',
			'compressed',
			'packed ',
			'komprimiert',
			'compression',
			'archived',
			'compressed'
		],
		description: 'A sheet of paper with a folded corner and a zipper, representing a compressed file.'
	},
	{
		oldName: 'file-video',
		name: 'file_video',
		purpose: 'single',
		usage: 'Used for files that contain video content (e.g., .mp4, .mov).',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'video',
			'movie',
			'video',
			'film',
			'motion picture',
			'clip',
			'media',
			'mp4',
			'avi',
			'mpeg',
			'mov'
		],
		description: 'A sheet of paper with a folded corner, a filmstrip, and a play button symbol.'
	},
	{
		oldName: 'file-audio',
		name: 'file_audio',
		purpose: 'single',
		usage: 'Used for files that contain audio content (e.g., .mp3, .wav).',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'audio',
			'sound',
			'music',
			'audio',
			'clip',
			'ton',
			'recording'
		],
		description: 'A sheet of paper with a folded corner and a speaker symbol.'
	},
	{
		oldName: 'file-server',
		name: 'file_server',
		purpose: 'single',
		usage: 'Used for files related to server configurations, logs, or data storage systems.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'server',
			'cloud',
			'hosted',
			'network',
			'remote',
			'storage'
		],
		description: 'A sheet of paper with a folded corner and server stack symbol.'
	},
	{
		oldName: 'file-refresh',
		name: 'file_refresh',
		purpose: 'multi',
		usage: 'Used for file refresh, synchronization, or reloading of file content.',
		category: 'Content and files',
		aliases: [
			'datei',
			'document',
			'dokument',
			'data',
			'record',
			'paper',
			'page',
			'sheet',
			'format',
			'aktualisieren',
			'update',
			'refresh',
			'reload',
			'neu',
			'laden',
			'update',
			'sync',
			'renew'
		],
		description: 'A sheet of paper with a folded corner and refresh arrows.'
	},
	{
		name: 'play',
		purpose: 'single',
		usage: 'Reserved for starting audio or video playback.',
		category: 'Media player',
		aliases: [
			'play',
			'abspielen',
			'starten',
			'wiedergeben',
			'play icon',
			'start',
			'wiedergabe starten',
			'rechtsgerichtetes dreieck',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'A right-pointing triangle representing the play button.'
	},
	{
		name: 'stop',
		purpose: 'single',
		usage: 'Reserved for stopping audio or video playback.',
		category: 'Media player',
		aliases: [
			'stop',
			'anhalten',
			'beenden',
			'stoppen',
			'stop icon',
			'square',
			'halt',
			'wiedergabe stoppen',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'A solid square representing the stop button.'
	},
	{
		name: 'pause',
		purpose: 'single',
		usage: 'Reserved for pausing audio or video playback in media players.',
		category: 'Media player',
		aliases: [
			'pause',
			'pausieren',
			'unterbrechen',
			'pause icon',
			'hold',
			'zwei vertikale balken',
			'wiedergabe pausieren',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'Two vertical bars representing the pause button.'
	},
	{
		name: 'fast-forward',
		purpose: 'single',
		usage: 'Reserved for increasing playback speed in media players.',
		category: 'Media player',
		aliases: [
			'fast forward',
			'vorspulen',
			'schneller Vorlauf',
			'skip ahead',
			'fast-forward icon',
			'doppelt rechts',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'Two right-pointing triangles indicating fast forward or skip ahead.'
	},
	{
		name: 'rewind',
		purpose: 'single',
		usage: 'Reserved for reversing playback in media players.',
		category: 'Media player',
		aliases: [
			'rewind',
			'zurückspulen',
			'rücklauf',
			'rewind icon',
			'doppelt links',
			'skip back',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'Two left-pointing triangles indicating rewind or skip back.'
	},
	{
		name: 'skip_back',
		purpose: 'single',
		usage: 'Reserved for jumping to the previous media track.',
		category: 'Media player',
		aliases: [
			'skip back',
			'vorheriger',
			'vorheriger titel',
			'zurückspringen',
			'skip previous',
			'skip to start',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'A left-pointing triangle with a vertical bar, indicating skip to previous.'
	},
	{
		name: 'skip_next',
		purpose: 'single',
		usage: 'Reserved for jumping to the next media track.',
		category: 'Media player',
		aliases: [
			'skip next',
			'nächster',
			'nächster Titel',
			'vorspringen',
			'skip forward',
			'rechts mit senkrechtem Strich',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'A right-pointing triangle with a vertical bar, indicating skip to next.'
	},
	{
		name: 'fullscreen',
		purpose: 'single',
		usage: 'Reserved to enter fullscreen mode in media players.',
		category: 'Media player',
		aliases: [
			'vollbild',
			'maximieren',
			'expandieren',
			'fullscreen icon',
			'outward arrows',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'A square frame formed by four outward-pointing arrows, representing fullscreen mode.'
	},
	{
		name: 'fullscreen_exit',
		purpose: 'single',
		usage: 'Reserved to exit fullscreen mode in media players.',
		category: 'Media player',
		aliases: [
			'exit fullscreen',
			'vollbild verlassen',
			'minimieren',
			'reduzieren',
			'fullscreen-exit icon',
			'inward arrows',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'Four inward-pointing arrows indicating exit from fullscreen mode.'
	},
	{
		name: 'hd',
		purpose: 'single',
		usage: 'Reserved for toggling high-definition (HD) video quality.',
		category: 'Media player',
		aliases: ['high definition', 'hochauflösend', 'videoqualität', 'auflösung', 'playback', 'video', 'audio', 'media', 'player'],
		description: 'The abbreviation HD for high-definition video quality, enclosed in a frame.'
	},
	{
		oldName: 'random',
		name: 'shuffle',
		purpose: 'multi',
		usage:
			'Used to indicate shuffle mode in media players (randomization or random selection).\nFor swapping items use the swap_vertical or swap_horizontal icons.',
		category: 'Media player',
		aliases: [
			'zufällig',
			'mischen',
			'randomize',
			'durcheinander',
			'mix',
			'random order',
			'jumble',
			'rearrange',
			'playback',
			'video',
			'audio',
			'media',
			'player'
		],
		description: 'Two arrows pointing right while crossing over one another.'
	},
	{
		name: 'ald',
		purpose: 'single',
		usage: 'Indicates the presence of assistive listening systems (e.g., induction loops).',
		category: 'Deprecated icons',
		description: 'An ear with a diagonal dots and a wave.'
	},
	{
		name: 'family',
		purpose: 'multi',
		usage: 'Used to represent a family.',
		category: 'Deprecated icons',
		description: 'A group of three simplified human figures — two representing adults and one representing a child.'
	}
];
