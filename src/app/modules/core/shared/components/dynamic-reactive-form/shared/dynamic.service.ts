import {Injectable} from '@angular/core';
import {MathService} from '.';
import {validateBasis} from '@angular/flex-layout';
import { SharedService } from './shared.service';

@Injectable({
	providedIn: 'root'
})
export class DynamicService {
	allFormGroups: any;
	rootFormValue: any;
	
	constructor(
	) {
	}
	
	
	getSubFromGroupName(groupName) {
		return groupName['en'].replace(/ /g, '_').toLowerCase();
	}

	/**
	 * Find field formcontrol
	 *
	 */
	findFormGroup(formControl: any, field) {
		for (let i = 0; i < formControl.length; i++) {
			if (formControl[i].controls[field] != undefined) {
				return formControl[i];
			} else {
				let controls = Object.keys(formControl[i].controls);
				for (let j = 0; j < controls.length; j++) {
					let subFormGroupName = controls[j];
					if (formControl[i].controls[subFormGroupName].controls) {
						if (formControl[i].controls[subFormGroupName].controls && formControl[i].controls[subFormGroupName].controls[field] != undefined) {
							return formControl[i].controls[subFormGroupName];
						}
					}
				}
			}
		}
	}

}