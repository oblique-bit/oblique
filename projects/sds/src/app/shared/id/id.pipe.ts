import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'id'})
export class IdPipe implements PipeTransform {
	transform(idPrefix: string, idParts: (number | string)[]): string {
		let idPrefixPlusId = idPrefix;

		if (idParts.length > 0) {
			idPrefixPlusId += `--${idParts[0]}`;

			idParts.slice(1).forEach(id => {
				idPrefixPlusId += `-${id}`;
			});
		}

		return idPrefixPlusId;
	}
}
