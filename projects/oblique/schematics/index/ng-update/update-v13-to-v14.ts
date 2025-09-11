import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addImport, applyInTree, createSafeRule, infoMigration, readFile, removeImport, replaceInFile, warnIfStandalone} from '../utils';
import {ObIMigrations} from './ng-update.model';

export interface IUpdateV14Schema {}

export class UpdateV13toV14 implements ObIMigrations {
	dependencies = {};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(options: IUpdateV14Schema): Rule {
		return (tree: Tree, context: SchematicContext) =>
			chain([
				warnIfStandalone(),
				this.renameIcons(),
				this.migrateAccessibilityStatementContactInfo(),
				this.addMissingAccessibilityStatementProperties(),
				this.migrateServiceNavigationContactInfo(),
				this.removeObPaginator(),
				this.removeFocusableFragments(),
				this.migrateColumnLayoutColumnsState()
			])(tree, context);
	}

	private renameIcons(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Rename icons');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /svgIcon="family"/g, 'svgIcon="person_group"');
				replaceInFile(tree, filePath, /ObEIcon\.FAMILY/g, 'ObEIcon.PERSON_GROUP');
				replaceInFile(tree, filePath, /svgIcon="ald"/g, 'svgIcon="hard-of-hearing"');
				replaceInFile(tree, filePath, /ObEIcon\.ALD/g, 'ObEIcon.HARD_OF_HEARING');

				replaceInFile(tree, filePath, /svgIcon="unlink"/g, 'svgIcon="link_disconnect"');
				replaceInFile(tree, filePath, /ObEIcon\.UNLINK/g, 'ObEIcon.LINK_DISCONNECT');
				replaceInFile(tree, filePath, /svgIcon="external"/g, 'svgIcon="link_external"');
				replaceInFile(tree, filePath, /ObEIcon\.EXTERNAL/g, 'ObEIcon.LINK_EXTERNAL');
				replaceInFile(tree, filePath, /svgIcon="more"/g, 'svgIcon="more_vertical"');
				replaceInFile(tree, filePath, /ObEIcon\.MORE/g, 'ObEIcon.SHOW_MORE_VERTICAL');
				replaceInFile(tree, filePath, /svgIcon="alternate-arrow"/g, 'svgIcon="scroll_horizontal"');
				replaceInFile(tree, filePath, /ObEIcon\.ALTERNATE_ARROW/g, 'ObEIcon.SCROLL_HORIZONTAL');
				replaceInFile(tree, filePath, /svgIcon="alternate-arrow"/g, 'svgIcon="scroll_horizontal"');
				replaceInFile(tree, filePath, /ObEIcon\.ALTERNATE_ARROW/g, 'ObEIcon.SCROLL_HORIZONTAL');
				replaceInFile(tree, filePath, /svgIcon="exchange"/g, 'svgIcon="swap_horizontal"');
				replaceInFile(tree, filePath, /ObEIcon\.EXCHANGE/g, 'ObEIcon.SWAP_HORIZONTAL');
				replaceInFile(tree, filePath, /svgIcon="repeat"/g, 'svgIcon="arrow_clockwise"');
				replaceInFile(tree, filePath, /ObEIcon\.REPEAT/g, 'ObEIcon.ARROW_CLOCKWISE');
				replaceInFile(tree, filePath, /svgIcon="arrow-up"/g, 'svgIcon="arrow_up"');
				replaceInFile(tree, filePath, /svgIcon="arrow-up-left"/g, 'svgIcon="arrow_up-left"');
				replaceInFile(tree, filePath, /svgIcon="arrow-up-right"/g, 'svgIcon="arrow_up-right"');
				replaceInFile(tree, filePath, /svgIcon="arrow-down"/g, 'svgIcon="arrow_down"');
				replaceInFile(tree, filePath, /svgIcon="arrow-down-left"/g, 'svgIcon="arrow_down-left"');
				replaceInFile(tree, filePath, /svgIcon="arrow-down-right"/g, 'svgIcon="arrow_down-right"');
				replaceInFile(tree, filePath, /svgIcon="arrow-right"/g, 'svgIcon="arrow_right"');
				replaceInFile(tree, filePath, /svgIcon="arrow-left"/g, 'svgIcon="arrow_left"');
				replaceInFile(tree, filePath, /svgIcon="chevron-left"/g, 'svgIcon="chevron_left"');
				replaceInFile(tree, filePath, /svgIcon="chevron-small-left"/g, 'svgIcon="chevron_left-small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_SMALL_LEFT/g, 'ObEIcon.CHEVRON_LEFT_SMALL');
				replaceInFile(tree, filePath, /svgIcon="chevron-double-left"/g, 'svgIcon="chevron_double-left"');
				replaceInFile(tree, filePath, /svgIcon="chevron-line-left"/g, 'svgIcon="chevron_left-to-line"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_LINE_LEFT/g, 'ObEIcon.CHEVRON_LEFT_TO_LINE');
				replaceInFile(tree, filePath, /svgIcon="chevron-right"/g, 'svgIcon="chevron_right"');
				replaceInFile(tree, filePath, /svgIcon="chevron-small-right"/g, 'svgIcon="chevron_right-small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_SMALL_RIGHT/g, 'ObEIcon.CHEVRON_RIGHT_SMALL');
				replaceInFile(tree, filePath, /svgIcon="chevron-double-right"/g, 'svgIcon="chevron_double-right"');
				replaceInFile(tree, filePath, /svgIcon="chevron-line-right"/g, 'svgIcon="chevron_right-to-line"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_LINE_RIGHT/g, 'ObEIcon.CHEVRON_RIGHT_TO_LINE');
				replaceInFile(tree, filePath, /svgIcon="chevron-down"/g, 'svgIcon="chevron_down"');
				replaceInFile(tree, filePath, /svgIcon="chevron-small-down"/g, 'svgIcon="chevron_down-small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_SMALL_DOWN/g, 'ObEIcon.CHEVRON_DOWN_SMALL');
				replaceInFile(tree, filePath, /svgIcon="chevron-up"/g, 'svgIcon="chevron_up"');
				replaceInFile(tree, filePath, /svgIcon="chevron-small-up"/g, 'svgIcon="chevron_up-small"');
				replaceInFile(tree, filePath, /ObEIcon\.CHEVRON_SMALL_UP/g, 'ObEIcon.CHEVRON_UP_SMALL');
				replaceInFile(tree, filePath, /svgIcon="cog"/g, 'svgIcon="settings"');
				replaceInFile(tree, filePath, /ObEIcon\.COG/g, 'ObEIcon.SETTINGS');
				replaceInFile(tree, filePath, /svgIcon="filter-descending"/g, 'svgIcon="sort-list_descending"');
				replaceInFile(tree, filePath, /ObEIcon\.FILTER_DESCENDING/g, 'ObEIcon.SORT_LIST_DESCENDING');
				replaceInFile(tree, filePath, /svgIcon="filter-descending"/g, 'svgIcon="sort-list_descending"');
				replaceInFile(tree, filePath, /ObEIcon\.FILTER_DESCENDING/g, 'ObEIcon.SORT_LIST_DESCENDING');
				replaceInFile(tree, filePath, /svgIcon="filter-ascending"/g, 'svgIcon="sort-list_ascending"');
				replaceInFile(tree, filePath, /ObEIcon\.FILTER_ASCENDING/g, 'ObEIcon.SORT_LIST_ASCENDING');
				replaceInFile(tree, filePath, /svgIcon="compress"/g, 'svgIcon="collapse"');
				replaceInFile(tree, filePath, /ObEIcon\.COMPRESS/g, 'ObEIcon.COLLAPSE');
				replaceInFile(tree, filePath, /svgIcon="pen"/g, 'svgIcon="pencil"');
				replaceInFile(tree, filePath, /ObEIcon\.PEN/g, 'ObEIcon.PENCIL');
				replaceInFile(tree, filePath, /svgIcon="printer"/g, 'svgIcon="print"');
				replaceInFile(tree, filePath, /ObEIcon\.PRINTER/g, 'ObEIcon.PRINT');
				replaceInFile(tree, filePath, /svgIcon="trash"/g, 'svgIcon="delete"');
				replaceInFile(tree, filePath, /ObEIcon\.TRASH/g, 'ObEIcon.DELETE');
				replaceInFile(tree, filePath, /svgIcon="zoom-in"/g, 'svgIcon="zoom_in"');
				replaceInFile(tree, filePath, /svgIcon="zoom-out"/g, 'svgIcon="zoom_out"');
				replaceInFile(tree, filePath, /svgIcon="text-area-left"/g, 'svgIcon="textarea_left"');
				replaceInFile(tree, filePath, /ObEIcon\.TEXT_AREA_LEFT/g, 'ObEIcon.TEXTAREA_LEFT');
				replaceInFile(tree, filePath, /svgIcon="text-area-right"/g, 'svgIcon="textarea_right"');
				replaceInFile(tree, filePath, /ObEIcon\.TEXT_AREA_RIGHT/g, 'ObEIcon.TEXTAREA_RIGHT');
				replaceInFile(tree, filePath, /svgIcon="wand"/g, 'svgIcon="magic-wand"');
				replaceInFile(tree, filePath, /ObEIcon\.WAND/g, 'ObEIcon.MAGIC_WAND');
				replaceInFile(tree, filePath, /svgIcon="eyedropper"/g, 'svgIcon="color-picker"');
				replaceInFile(tree, filePath, /ObEIcon\.EYEDROPPER/g, 'ObEIcon.COLOR_PICKER');
				replaceInFile(tree, filePath, /svgIcon="art"/g, 'svgIcon="palette"');
				replaceInFile(tree, filePath, /ObEIcon\.ART/g, 'ObEIcon.PALETTE');
				replaceInFile(tree, filePath, /svgIcon="plus-circle"/g, 'svgIcon="plus_circle"');
				replaceInFile(tree, filePath, /svgIcon="cards"/g, 'svgIcon="grid"');
				replaceInFile(tree, filePath, /ObEIcon\.CARDS/g, 'ObEIcon.GRID');
				replaceInFile(tree, filePath, /svgIcon="list-paragraph"/g, 'svgIcon="list_paragraph"');
				replaceInFile(tree, filePath, /svgIcon="lifering"/g, 'svgIcon="support"');
				replaceInFile(tree, filePath, /ObEIcon\.LIFERING/g, 'ObEIcon.SUPPORT');
				replaceInFile(tree, filePath, /svgIcon="language"/g, 'svgIcon="translate"');
				replaceInFile(tree, filePath, /ObEIcon\.LANGUAGE/g, 'ObEIcon.TRANSLATE');
				replaceInFile(tree, filePath, /svgIcon="envelope"/g, 'svgIcon="mail"');
				replaceInFile(tree, filePath, /ObEIcon\.ENVELOPE/g, 'ObEIcon.MAIL');
				replaceInFile(tree, filePath, /svgIcon="envelope-open"/g, 'svgIcon="mail_open"');
				replaceInFile(tree, filePath, /ObEIcon\.ENVELOPE_OPEN/g, 'ObEIcon.MAIL_OPEN');
				replaceInFile(tree, filePath, /svgIcon="mail-attachment"/g, 'svgIcon="mail_attachment"');
				replaceInFile(tree, filePath, /svgIcon="paper-plane"/g, 'svgIcon="send"');
				replaceInFile(tree, filePath, /ObEIcon\.PAPER_PLANE/g, 'ObEIcon.SEND');
				replaceInFile(tree, filePath, /svgIcon="bell"/g, 'svgIcon="notification"');
				replaceInFile(tree, filePath, /ObEIcon\.BELL/g, 'ObEIcon.NOTIFICATION');
				replaceInFile(tree, filePath, /svgIcon="bell-slash"/g, 'svgIcon="notification_off"');
				replaceInFile(tree, filePath, /ObEIcon\.BELL_SLASH/g, 'ObEIcon.NOTIFICATION_OFF');
				replaceInFile(tree, filePath, /svgIcon="map-marker"/g, 'svgIcon="location"');
				replaceInFile(tree, filePath, /ObEIcon\.MAP_MARKER/g, 'ObEIcon.LOCATION');
				replaceInFile(tree, filePath, /svgIcon="bullseye"/g, 'svgIcon="target"');
				replaceInFile(tree, filePath, /ObEIcon\.BULLSEYE/g, 'ObEIcon.TARGET');
				replaceInFile(tree, filePath, /svgIcon="balance"/g, 'svgIcon="justice-scales"');
				replaceInFile(tree, filePath, /ObEIcon\.BALANCE/g, 'ObEIcon.JUSTICE_SCALES');
				replaceInFile(tree, filePath, /svgIcon="balance-slash"/g, 'svgIcon="justice-scales_off"');
				replaceInFile(tree, filePath, /ObEIcon\.BALANCE_SLASH/g, 'ObEIcon.JUSTICE_SCALES_OFF');
				replaceInFile(tree, filePath, /svgIcon="scroll"/g, 'svgIcon="manuscript"');
				replaceInFile(tree, filePath, /ObEIcon\.SCROLL/g, 'ObEIcon.MANUSCRIPT');
				replaceInFile(tree, filePath, /svgIcon="university"/g, 'svgIcon="antique-building"');
				replaceInFile(tree, filePath, /ObEIcon\.UNIVERSITY/g, 'ObEIcon.ANTIQUE_BUILDING');
				replaceInFile(tree, filePath, /svgIcon="industry"/g, 'svgIcon="factory"');
				replaceInFile(tree, filePath, /ObEIcon\.INDUSTRY/g, 'ObEIcon.FACTORY');
				replaceInFile(tree, filePath, /svgIcon="bed"/g, 'svgIcon="accommodation"');
				replaceInFile(tree, filePath, /ObEIcon\.BED/g, 'ObEIcon.ACCOMMODATION');
				replaceInFile(tree, filePath, /svgIcon="fitness"/g, 'svgIcon="dumbbell"');
				replaceInFile(tree, filePath, /ObEIcon\.FITNESS/g, 'ObEIcon.DUMBBELL');
				replaceInFile(tree, filePath, /svgIcon="cloud-upload"/g, 'svgIcon="cloud_upload"');
				replaceInFile(tree, filePath, /svgIcon="code-branch"/g, 'svgIcon="branch"');
				replaceInFile(tree, filePath, /ObEIcon\.CODE_BRANCH/g, 'ObEIcon.BRANCH');
				replaceInFile(tree, filePath, /svgIcon="audio-low"/g, 'svgIcon="volume_low"');
				replaceInFile(tree, filePath, /ObEIcon\.AUDIO_LOW/g, 'ObEIcon.VOLUME_LOW');
				replaceInFile(tree, filePath, /svgIcon="audio-mute"/g, 'svgIcon="volume_muted"');
				replaceInFile(tree, filePath, /ObEIcon\.AUDIO_MUTE/g, 'ObEIcon.VOLUME_MUTED');
				replaceInFile(tree, filePath, /svgIcon="microphone-slash"/g, 'svgIcon="microphone_muted"');
				replaceInFile(tree, filePath, /ObEIcon\.MICROPHONE_SLASH/g, 'ObEIcon.MICROPHONE_MUTED');
				replaceInFile(tree, filePath, /svgIcon="unlock"/g, 'svgIcon="lock_open"');
				replaceInFile(tree, filePath, /ObEIcon\.UNLOCK/g, 'ObEIcon.LOCK_OPEN');
				replaceInFile(tree, filePath, /svgIcon="eye-slash"/g, 'svgIcon="eye_off"');
				replaceInFile(tree, filePath, /ObEIcon\.EYE_SLASH/g, 'ObEIcon.EYE_OFF');
				replaceInFile(tree, filePath, /svgIcon="bolt"/g, 'svgIcon="lightning"');
				replaceInFile(tree, filePath, /ObEIcon\.BOLT/g, 'ObEIcon.LIGHTNING');
				replaceInFile(tree, filePath, /svgIcon="thumbs-up"/g, 'svgIcon="thumbs_up"');
				replaceInFile(tree, filePath, /svgIcon="thumbs-down"/g, 'svgIcon="thumbs_down"');
				replaceInFile(tree, filePath, /svgIcon="smile"/g, 'svgIcon="happy"');
				replaceInFile(tree, filePath, /ObEIcon\.SMILE/g, 'ObEIcon.HAPPY');
				replaceInFile(tree, filePath, /svgIcon="frown"/g, 'svgIcon="sad"');
				replaceInFile(tree, filePath, /ObEIcon\.FROWN/g, 'ObEIcon.SAD');
				replaceInFile(tree, filePath, /svgIcon="heart-filled"/g, 'svgIcon="heart_filled"');
				replaceInFile(tree, filePath, /svgIcon="flag-filled"/g, 'svgIcon="flag_filled"');
				replaceInFile(tree, filePath, /svgIcon="star-filled"/g, 'svgIcon="star_filled"');
				replaceInFile(tree, filePath, /svgIcon="stop"/g, 'svgIcon="stop-gesture"');
				replaceInFile(tree, filePath, /ObEIcon\.STOP/g, 'ObEIcon.STOP_GESTURE');
				replaceInFile(tree, filePath, /svgIcon="info-circle"/g, 'svgIcon="info_circle"');
				replaceInFile(tree, filePath, /svgIcon="help"/g, 'svgIcon="question"');
				replaceInFile(tree, filePath, /ObEIcon\.HELP/g, 'ObEIcon.QUESTION');
				replaceInFile(tree, filePath, /svgIcon="help-circle"/g, 'svgIcon="question_circle"');
				replaceInFile(tree, filePath, /ObEIcon\.HELP_CIRCLE/g, 'ObEIcon.QUESTION_CIRCLE');
				replaceInFile(tree, filePath, /svgIcon="warning"/g, 'svgIcon="exclamation"');
				replaceInFile(tree, filePath, /ObEIcon\.WARNING/g, 'ObEIcon.EXCLAMATION');
				replaceInFile(tree, filePath, /svgIcon="warning-triangle"/g, 'svgIcon="exclamation_triangle"');
				replaceInFile(tree, filePath, /ObEIcon\.WARNING_TRIANGLE/g, 'ObEIcon.EXCLAMATION_TRIANGLE');
				replaceInFile(tree, filePath, /svgIcon="warning-circle"/g, 'svgIcon="exclamation_circle"');
				replaceInFile(tree, filePath, /ObEIcon\.WARNING_CIRCLE/g, 'ObEIcon.EXCLAMATION_CIRCLE');
				replaceInFile(tree, filePath, /svgIcon="warning-box"/g, 'svgIcon="exclamation_diamond"');
				replaceInFile(tree, filePath, /ObEIcon\.WARNING_BOX/g, 'ObEIcon.EXCLAMATION_DIAMOND');
				replaceInFile(tree, filePath, /svgIcon="checkmark-circle"/g, 'svgIcon="checkmark_circle"');
				replaceInFile(tree, filePath, /svgIcon="cancel"/g, 'svgIcon="xmark"');
				replaceInFile(tree, filePath, /ObEIcon\.CANCEL/g, 'ObEIcon.XMARK');
				replaceInFile(tree, filePath, /svgIcon="cancel-circle"/g, 'svgIcon="xmark_circle"');
				replaceInFile(tree, filePath, /ObEIcon\.CANCEL_CIRCLE/g, 'ObEIcon.XMARK_CIRCLE');
				replaceInFile(tree, filePath, /svgIcon="ban"/g, 'svgIcon="prohibition"');
				replaceInFile(tree, filePath, /ObEIcon\.BAN/g, 'ObEIcon.PROHIBITION');
				replaceInFile(tree, filePath, /svgIcon="user"/g, 'svgIcon="person"');
				replaceInFile(tree, filePath, /ObEIcon\.USER/g, 'ObEIcon.PERSON');
				replaceInFile(tree, filePath, /svgIcon="users"/g, 'svgIcon="person_group"');
				replaceInFile(tree, filePath, /ObEIcon\.USERS/g, 'ObEIcon.PERSON_GROUP');
				replaceInFile(tree, filePath, /svgIcon="user-checkmark"/g, 'svgIcon="person_checkmark"');
				replaceInFile(tree, filePath, /ObEIcon\.USER_CHECKMARK/g, 'ObEIcon.PERSON_CHECKMARK');
				replaceInFile(tree, filePath, /svgIcon="user-cog"/g, 'svgIcon="person_settings"');
				replaceInFile(tree, filePath, /ObEIcon\.USER_COG/g, 'ObEIcon.PERSON_SETTINGS');
				replaceInFile(tree, filePath, /svgIcon="user-pen"/g, 'svgIcon="person_pencil"');
				replaceInFile(tree, filePath, /ObEIcon\.USER_PEN/g, 'ObEIcon.PERSON_PENCIL');
				replaceInFile(tree, filePath, /svgIcon="user-brush"/g, 'svgIcon="person_brush"');
				replaceInFile(tree, filePath, /ObEIcon\.USER_BRUSH/g, 'ObEIcon.PERSON_BRUSH');
				replaceInFile(tree, filePath, /svgIcon="user-code"/g, 'svgIcon="person_code"');
				replaceInFile(tree, filePath, /ObEIcon\.USER_CODE/g, 'ObEIcon.PERSON_CODE');
				replaceInFile(tree, filePath, /svgIcon="doctor"/g, 'svgIcon="person_medic"');
				replaceInFile(tree, filePath, /ObEIcon\.DOCTOR/g, 'ObEIcon.PERSON_MEDIC');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-agender"/g, 'svgIcon="gender_agender"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_AGENDER/g, 'ObEIcon.GENDER_AGENDER');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-bigender"/g, 'svgIcon="gender_bigender"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_BIGENDER/g, 'ObEIcon.GENDER_BIGENDER');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-female"/g, 'svgIcon="gender_female"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_FEMALE/g, 'ObEIcon.GENDER_FEMALE');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-male"/g, 'svgIcon="gender_male"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_MALE/g, 'ObEIcon.GENDER_MALE');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-gender-expansive"/g, 'svgIcon="gender_transgender"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_GENDER_EXPANSIVE/g, 'ObEIcon.GENDER_TRANSGENDER');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-neutrois"/g, 'svgIcon="gender_neutrois"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_NEUTROIS/g, 'ObEIcon.GENDER_NEUTROIS');
				replaceInFile(tree, filePath, /svgIcon="gender-identity-non-binary"/g, 'svgIcon="gender_non-binary"');
				replaceInFile(tree, filePath, /ObEIcon\.GENDER_IDENTITY_NON_BINARY/g, 'ObEIcon.GENDER_NON_BINARY');
				replaceInFile(tree, filePath, /svgIcon="increase"/g, 'svgIcon="growth"');
				replaceInFile(tree, filePath, /ObEIcon\.INCREASE/g, 'ObEIcon.GROWTH');
				replaceInFile(tree, filePath, /svgIcon="decrease"/g, 'svgIcon="decline"');
				replaceInFile(tree, filePath, /ObEIcon\.DECREASE/g, 'ObEIcon.DECLINE');
				replaceInFile(tree, filePath, /svgIcon="chart-bar"/g, 'svgIcon="chart_bar_horizontal"');
				replaceInFile(tree, filePath, /ObEIcon\.CHART_BAR/g, 'ObEIcon.CHART_BAR_HORIZONTAL');
				replaceInFile(tree, filePath, /svgIcon="chart"/g, 'svgIcon="chart_bar_vertical"');
				replaceInFile(tree, filePath, /ObEIcon\.CHART/g, 'ObEIcon.CHART_BAR_VERTICAL');
				replaceInFile(tree, filePath, /svgIcon="chart-pie"/g, 'svgIcon="chart_pie"');
				replaceInFile(tree, filePath, /svgIcon="chart-line"/g, 'svgIcon="chart_line"');
				replaceInFile(tree, filePath, /svgIcon="chart-decrease"/g, 'svgIcon="chart_line_decline"');
				replaceInFile(tree, filePath, /ObEIcon\.CHART_DECREASE/g, 'ObEIcon.CHART_LINE_DECLINE');
				replaceInFile(tree, filePath, /svgIcon="increase"/g, 'svgIcon="chart_line_growth"');
				replaceInFile(tree, filePath, /ObEIcon\.CHART_INCREASE/g, 'ObEIcon.CHART_LINE_GROWTH');
				replaceInFile(tree, filePath, /svgIcon="chart-search"/g, 'svgIcon="search_insights"');
				replaceInFile(tree, filePath, /ObEIcon\.CHART_SEARCH/g, 'ObEIcon.SEARCH_INSIGHTS');
				replaceInFile(tree, filePath, /svgIcon="universal-access"/g, 'svgIcon="accessibility"');
				replaceInFile(tree, filePath, /ObEIcon\.UNIVERSAL_ACCESS/g, 'ObEIcon.ACCESSIBILITY');
				replaceInFile(tree, filePath, /svgIcon="blind"/g, 'svgIcon="visual-impairment"');
				replaceInFile(tree, filePath, /ObEIcon\.BLIND/g, 'ObEIcon.VISUAL_IMPAIRMENT');
				replaceInFile(tree, filePath, /svgIcon="deaf"/g, 'svgIcon="hard-of-hearing"');
				replaceInFile(tree, filePath, /ObEIcon\.DEAF/g, 'ObEIcon.HARD_OF_HEARING');
				replaceInFile(tree, filePath, /svgIcon="git-hub"/g, 'svgIcon="github"');
				replaceInFile(tree, filePath, /ObEIcon\.GIT_HUB/g, 'ObEIcon.GITHUB');
				replaceInFile(tree, filePath, /svgIcon="linked-in"/g, 'svgIcon="linkedin"');
				replaceInFile(tree, filePath, /ObEIcon\.LINKED_IN/g, 'ObEIcon.LINKEDIN');
				replaceInFile(tree, filePath, /svgIcon="folder-open"/g, 'svgIcon="folder_open"');
				replaceInFile(tree, filePath, /ObEIcon\.FOLDER_OPEN/g, 'ObEIcon.FOLDER_OPEN');
				replaceInFile(tree, filePath, /svgIcon="duplicate"/g, 'svgIcon="copy"');
				replaceInFile(tree, filePath, /ObEIcon\.DUPLICATE/g, 'ObEIcon.COPY');
				replaceInFile(tree, filePath, /svgIcon="archive"/g, 'svgIcon="archive-box"');
				replaceInFile(tree, filePath, /ObEIcon\.ARCHIVE/g, 'ObEIcon.ARCHIVE_BOX');
				replaceInFile(tree, filePath, /svgIcon="file-lines"/g, 'svgIcon="file_text"');
				replaceInFile(tree, filePath, /ObEIcon\.FILE_LINES/g, 'ObEIcon.FILE_TEXT');
				replaceInFile(tree, filePath, /svgIcon="file-bullet"/g, 'svgIcon="file_list"');
				replaceInFile(tree, filePath, /ObEIcon\.FILE_BULLET/g, 'ObEIcon.FILE_LIST');
				replaceInFile(tree, filePath, /svgIcon="file-checkmark"/g, 'svgIcon="file_checkmark"');
				replaceInFile(tree, filePath, /svgIcon="file-user"/g, 'svgIcon="file_person"');
				replaceInFile(tree, filePath, /ObEIcon\.FILE_USER/g, 'ObEIcon.FILE_PERSON');
				replaceInFile(tree, filePath, /svgIcon="file-plus"/g, 'svgIcon="file_add"');
				replaceInFile(tree, filePath, /ObEIcon\.FILE_PLUS/g, 'ObEIcon.FILE_ADD');
				replaceInFile(tree, filePath, /svgIcon="file-forward"/g, 'svgIcon="file_forward"');
				replaceInFile(tree, filePath, /svgIcon="file-image"/g, 'svgIcon="file_image"');
				replaceInFile(tree, filePath, /svgIcon="file-pdf"/g, 'svgIcon="file_pdf"');
				replaceInFile(tree, filePath, /svgIcon="file-epub"/g, 'svgIcon="file_epub"');
				replaceInFile(tree, filePath, /svgIcon="file-xml"/g, 'svgIcon="file_xml"');
				replaceInFile(tree, filePath, /svgIcon="file-csv"/g, 'svgIcon="file_csv"');
				replaceInFile(tree, filePath, /svgIcon="file-code"/g, 'svgIcon="file_code"');
				replaceInFile(tree, filePath, /svgIcon="file-json"/g, 'svgIcon="file_json"');
				replaceInFile(tree, filePath, /svgIcon="file-ppt"/g, 'svgIcon="file_powerpoint"');
				replaceInFile(tree, filePath, /ObEIcon\.FILE_PPT/g, 'ObEIcon.FILE_POWERPOINT');
				replaceInFile(tree, filePath, /svgIcon="file-word"/g, 'svgIcon="file_word"');
				replaceInFile(tree, filePath, /svgIcon="file-excel"/g, 'svgIcon="file_excel"');
				replaceInFile(tree, filePath, /svgIcon="file-zip"/g, 'svgIcon="file_zip"');
				replaceInFile(tree, filePath, /svgIcon="file-audio"/g, 'svgIcon="file_audio"');
				replaceInFile(tree, filePath, /svgIcon="file-video"/g, 'svgIcon="file_video"');
				replaceInFile(tree, filePath, /svgIcon="file-server"/g, 'svgIcon="file_server"');
				replaceInFile(tree, filePath, /svgIcon="file-refresh"/g, 'svgIcon="file_refresh"');
				replaceInFile(tree, filePath, /ObEIcon\.FILE_REFRESH/g, 'ObEIcon.FILE_REFRESH');
				replaceInFile(tree, filePath, /svgIcon="random"/g, 'svgIcon="shuffle"');
				replaceInFile(tree, filePath, /ObEIcon\.RANDOM/g, 'ObEIcon.SHUFFLE');
			};
			return applyInTree(tree, toApply, '*.{ts,html}');
		});
	}

	private migrateAccessibilityStatementContactInfo(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Migrate accessibility statement contact info');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('provideObliqueConfiguration(')) {
					const contacts: string[] = [];
					const emails = (/(?<=emails\s*:\s*\[).*?(?=\])/u.exec(content) ?? [])[0];
					if (emails?.length) {
						contacts.push(...emails.split(',').map(email => `{email: ${email.trim()}}`));
					}
					const phones = (/(?<=phones\s*:\s*\[).*?(?=\])/u.exec(content) ?? [])[0];
					if (phones?.length) {
						contacts.push(...phones.split(',').map(phone => `{phone: ${phone.trim()}}`));
					}
					replaceInFile(tree, filePath, /(?<=contact\s*:\s*)\{.*?}/, `[${contacts.join(', ')}]`);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private addMissingAccessibilityStatementProperties(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Add missing accessibility statement properties');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('provideObliqueConfiguration(')) {
					if (!content.includes('conformity')) {
						replaceInFile(
							tree,
							filePath,
							/(?<=accessibilityStatement\s*:\s*\{)/,
							`\n\t\t\t\tconformity: '${this.getConformity(content)}',`
						);
					}
					if (!content.includes('createdOn')) {
						const createdOn = new Date().toISOString().split('T')[0];
						replaceInFile(tree, filePath, /(?<=accessibilityStatement\s*:\s*\{)/, `\n\t\t\t\tcreatedOn: new Date('${createdOn}'),`);
					}
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}
	private getConformity(content: string): string {
		if (content.includes('exceptions')) {
			return 'partial';
		}

		return content.includes('createdOn') ? 'full' : 'none';
	}

	private migrateServiceNavigationContactInfo(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Migrate service navigation contact info');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('header.serviceNavigation.infoContact')) {
					tree.overwrite(
						filePath,
						content.replace(/(?<prefix>header\.serviceNavigation\.infoContact\s*=\s*{.*)tel(?<suffix>.*})/s, '$<prefix>phone$<suffix>')
					);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private removeObPaginator(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Replace ObPaginatorModule with MatPaginatorModule');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('ObPaginatorModule')) {
					removeImport(tree, filePath, 'ObPaginatorModule', '@oblique/oblique');
					addImport(tree, filePath, 'MatPaginatorModule', '@angular/material');
					replaceInFile(tree, filePath, /ObPaginatorModule/g, 'MatPaginatorModule');
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private removeFocusableFragments(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Replace focusableFragments property');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				const regexp = /^\s*\w+\.focusableFragment\s*=\s*\[.*?\];/msu;
				if (regexp.test(content)) {
					replaceInFile(tree, filePath, regexp, '');
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		});
	}

	private migrateColumnLayoutColumnsState(): Rule {
		return createSafeRule((tree: Tree, context: SchematicContext) => {
			infoMigration(context, 'Migrate column layout columns state');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('<ob-column-layout')) {
					replaceInFile(tree, filePath, /(?<=\[left\]=")true(?=")/gu, "'OPENED'");
					replaceInFile(tree, filePath, /(?<=\[left\]=")false(?=)"/gu, "'NONE'");

					replaceInFile(tree, filePath, /(?<=\[right\]=")true(?=")/gu, "'OPENED'");
					replaceInFile(tree, filePath, /(?<=\[right\]=")false(?=)"/gu, "'NONE'");
				}
			};
			return applyInTree(tree, toApply, '*.html');
		});
	}
}
