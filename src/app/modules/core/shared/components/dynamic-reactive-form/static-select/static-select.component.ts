import { OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Component} from '@angular/core';
import { FormControl } from '@angular/forms';
import {  FieldConfig } from '../shared';
import { GlobalVariables } from "../../../../../../global-variables.service";
import { SharedService } from '../shared/shared.service';
import { MatAutocompleteTrigger } from '@angular/material';

@Component({
	selector: 'app-static-select',
	templateUrl: 'static-select.component.html',
	styleUrls: ['static-select.component.scss'],
})
export class StaticSelectComponent implements OnInit {
	public isLoading = false;
	@Input() group: FormGroup;
	form: FormGroup;
	@Input() field: FieldConfig;
	
	selectedValue = [];
	getInputOption: any[] = [];
	singleFilteredOptions: any;
	OptionsCtrl = new FormControl();
	singleOptionsCtrl = new FormControl();
	isId: boolean;
	isValue: boolean;
	@ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;

	constructor(
		public globalVariables: GlobalVariables,
		public  sharedService: SharedService) {
		this.filterStaticOption();
	}
	/**
	 * Filtertion of static select
	 *
	 */
	filterStaticOption() {
		this.singleOptionsCtrl.valueChanges.subscribe(val => {
			this._staticFilter(this.singleOptionsCtrl.value);
		});
	}

	private _staticFilter(value: string): string[] {
		if (!value) {
			this.singleFilteredOptions = this.getInputOption;
			return;
		}
		const search = this.sharedService.staticSearch(this.getInputOption, this.field, value);
		this.singleFilteredOptions = search;
		return search;
	}

	/**
	 * Static select init
	 */
	ngOnInit() {
		let reference_module_id = this.field.reference_module_id;
		if (reference_module_id && reference_module_id >= 0) {
			this.isId = true;
		} else {
			this.isValue = true;
		}

		if (!this.field.update) {
			this.singleOptionsCtrl.disable();
		}
		this.getInputOption = this.sharedService.copyFieldOptions(this.field.options);
		this.singleFilteredOptions = this.getInputOption;

		if (this.field.value !== "") {
			let option = this.getInputOption.find(x => x.id == this.field.value);
			this.singleOptionsCtrl.setValue(this.sharedService.getSelectValue(option, this.field));
		}
		this.resetValue();
	}


	/**
	 * Set selected value
	 */
	selected(event: any, ev?: any, isPass?: boolean) {
		if (!isPass) {
			if (ev && !ev.source.selected) {
				return;
			}
		}
		let eventValue = this.sharedService.checkEvent(event, this.isId, this.isValue);
		this.group.controls[this.field.col].markAsDirty();
		if (this.field.value && this.field.value[0] == event) {
		} else {
			this.field.value = this.sharedService.checkValue(eventValue);
			this.group.controls[this.field.col].setValue(this.sharedService.checkValue(eventValue));
		}

		if(isPass){
			this.autocomplete.writeValue(this.sharedService.getSelectValue(event, this.field));
		}

		this.resetValue();
	}

	resetValue() {
		setTimeout(() => {
			this.singleFilteredOptions = this.getInputOption;
		}, 10);
	}


	setSelectEmpty() {
		this.field.value = '';
		this.group.controls[this.field.col].setValue(this.field.value);
		this.group.controls[this.field.col].markAsDirty()
	}

		/**
	 * Handles empty Input
	 *
	 * @param event
	 */
	handleEmptyInput(event: any) {
		setTimeout(() => {
			if (typeof this.field.value != "object") {
				if (event.target.value !== '') {
					const value = this.getInputOption.find(x => x.id == this.field.value);
					if (value) {
						this.selected(value, '', true);
					} else {
						this.autocomplete.writeValue('');
						this.setSelectEmpty();
					}
				} else {
					this.setSelectEmpty();
				}
			}
		}, 100);
	}


}
