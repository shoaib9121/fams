import {Injectable, EventEmitter, Output} from '@angular/core';
import {FieldConfig} from '.';
import {FormArray} from '@angular/forms';
import { DynamicService } from './dynamic.service';

@Injectable({
	providedIn: 'root'
})
export class MathService {
	field: FieldConfig;
	groups: any;
	value: any = [];
	formGroups: any;
	type: any;
	allFormulaFieldsRequired: any;
	returnVal: any = null;
	tempCheck: any;
	
	constructor(
		private dynamicService: DynamicService
	) {
		this.value = [];
	}
	
	runFormula(formula: string, type, allFormulaFieldsRequired, tempCheck) {
		this.type = type;
		this.allFormulaFieldsRequired = allFormulaFieldsRequired
		let result = eval(formula);
		this.tempCheck = tempCheck;
		return result;
	}
	
	sub() {
		this.value = [];
		let result = 0;
		this.getValuesArray(arguments);
		if (this.value.length <= 1 && (this.type == '_days' || this.type == '_date')) {
			return this.returnVal;
		}	if ( this.hasZeroInValue(this.value) || this.hasZeroInValue(arguments)) {
			return this.returnVal;
		}
		 else {
			for (let i = 0; i < this.value.length; i++) {
				if (i == 0) {
					result = this.value[i];
				} else {
					
					result -= this.value[i];
				}
			}
			return result.toString();
		}
	}
	
	add() {
		this.value = [];
		let result = 0;
		this.getValuesArray(arguments);
		if ( this.hasZeroInValue(this.value) || this.hasZeroInValue(arguments)) {
			return this.returnVal;
		}
		
		for (let i = 0; i < this.value.length; i++) {
			result = result + +this.value[i];
		}
		return result;
	}
	
	mul() {
		this.value = [];
		let result;
		this.getValuesArray(arguments);
		
		if ( this.hasZeroInValue(this.value) || this.hasZeroInValue(arguments)) {
			return this.returnVal;
		}
		for (let i = 0; i < this.value.length; i++) {
			if (i == 0) {
				result = +this.value[i];
			} else {
				result = result * +this.value[i];
			}
		}
		return result;
	}
	
	div() {
		this.value = [];
		let result;
		this.getValuesArray(arguments);
		
		if ( this.hasZeroInValue(this.value) || this.hasZeroInValue(arguments)) {
			return this.returnVal;
		}
		
		for (let i = 0; i < this.value.length; i++) {
			if (i == 0) {
				result = this.value[i];
			} else {
				result = result / this.value[i];
			}
		}
		return result;
	}
	
	getValuesArray(argument) {
		let colvalue;
		for (let i = 0; i < argument.length; i++) {
			if (!isNaN(argument[i])) {
				this.setValue(argument[i]);
			} else {
				
				// for (let j = 0; j < this.formGroups.value.length; j++) {
				if (argument[i] == 'vehicle_percentage') {
					// debugger;
				}
				let val = this.dynamicService.findFormGroup(this.formGroups.controls, argument[i]);
				
				if (val) {
					if (val.controls[argument[i]].value != null && val.controls[argument[i]].value !== "") {
						colvalue = val.controls[argument[i]].value;
						if (colvalue == 0) {
							colvalue = colvalue.toString();
						}
						this.setValue(colvalue);
					} else{
						this.setValue(null);
					}   
				}
				// }
			}
		}
	}
	
	setValue(colvalue) {
		if (colvalue) {
			if (!isNaN(colvalue)) {
				this.value[this.value.length] = +colvalue;
			} else {
				if (Date.parse(colvalue)) {
					let val: any;
					val = eval("new Date(colvalue)") - 0;
					this.value[this.value.length] = val;
				} else {
					this.value[this.value.length] = null;
				}
			}
		} else {
			this.value[this.value.length] = null;
		}
	}
	
	/**
	 * Checks if a value in the array is 0
	 */
	hasZeroInValue(value) {
		if (this.allFormulaFieldsRequired && !this.tempCheck) {
			for (let i = 0; i < value.length; i++) {
				if (value[i] == null) {
					return true;
				}
			}
		} else {
			return false;
		}
	}
	
}
