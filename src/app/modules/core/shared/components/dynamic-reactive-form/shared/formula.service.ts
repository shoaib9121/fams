import {Injectable} from '@angular/core';
import {MathService} from '.';
import { DynamicService } from './dynamic.service';

@Injectable({
	providedIn: 'root'
})
export class FormulaService {
	
	constructor(
		private mathService: MathService,
		private dynamicService: DynamicService
	) {
	}
	
	
	/**
	 * Hangling formulas
	 *
	 */
	manageFormula(allGroups, allFormGroups) {
		if(allGroups == null){
			return;
		}
		let val;
		this.mathService.groups = allGroups;
		this.mathService.formGroups = allFormGroups;
		
		allGroups.forEach(element => {
			if (!element.subGroups) {
				element.fields.forEach(field => {
					if (field.math) {
						//TODO REFACTORCODE
						let tempCheck = this.tempCheck(field.col);
						let type = this.getFieldType(field.col);
						val = this.mathService.runFormula(field.math, type, field.allFormulaFieldsRequired,tempCheck);
						if (type == '_days') {
							val = this.getNumberOfDays(val);
						} else if (type == '_date') {
							val = this.getDateString(val);
						} else {
							val = +val;
							val = val.toFixed(2);
						}
						field.value = val;
						let formControl;
						formControl = this.dynamicService.findFormGroup(allFormGroups.controls, field.col);
						this.setValue(formControl, field, val);
					}
				});
			}
			
			if (element.subGroups) {
				element.subGroups.forEach(element => {
					element.fields.forEach(subField => {
						if (subField.math) {
							//TODO REFACTORCODE
							// val = eval(subField.math);
							let tempCheck = this.tempCheck(subField.col);
							let type = this.getFieldType(subField.col);
							val = this.mathService.runFormula(subField.math, type, subField.allFormulaFieldsRequired,tempCheck);
							if (type == '_days') {
								val = this.getNumberOfDays(val);
							} else if (type == '_date') {
								val = this.getDateString(val);
							} else {
								val = +val;
								val = val.toFixed(2);
							}
							val = val ? val.toString() : "0";
							subField.value = [val];
							let formControl;
							
							formControl = this.dynamicService.findFormGroup(allFormGroups.controls, subField.col);
							this.setValue(formControl, subField, val);
						}
					});
					
				});
			}
		});
	}
	
	/**
	 * Convert number back to date
	 *
	 * */
	getFieldType(col) {
		return col.substr(col.length - 5);
	}


		/**
	 * Convert number back to date
	 *
	 * */
	tempCheck(col) {
		let result;
		result =  col.substr(col.length - 4);

		if(result == 'cost'){
			return true; 
		} 
		result =  col.substr(col.length - 6);
		if(result == 'amount' && col != "vehicle_refund_amount"){
			return true; 
		} 
		result =  col.substr(col.length - 5);
		if(result == 'hours'){
			return true; 
		} 
		return false;
	}
	
	
	
	/**
	 * Convert number back to date
	 *
	 * */
	getDateString(val) {
		let dd;
		let mm;
		const abc = new Date(+val).toDateString();
		const date = new Date(abc);
		dd = date.getDate();
		mm = date.getMonth() + 1;
		const yyyy = date.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		;
		const d = mm + '/' + dd + '/' + yyyy;
		return d;
	}
	
	
	/**
	 * Convert number back to date
	 *
	 * */
	getNumberOfDays(val) {
		return Math.floor(val / (1000 * 3600 * 24));
	}
	
	/**
	 * Set values to form control
	 *
	 */
	public setValue(formControl, field, val) {
		if (formControl.controls[field.col]) {
			formControl.controls[field.col].setValue(this.checkValue(val));
			formControl.value[field.col] = this.checkValue(val);
			setTimeout(() => {
				if (formControl.value[field.col] != this.checkValue(val)) {
					formControl.controls[field.col].markAsDirty();
				}	
			}, 10);
			
		}
	}
	
	/**
	 * check setting values integer or string
	 *
	 */
	checkValue(val) {
		if (!isNaN(val) && val != "") {
			val = +val;
		} else if (val) {
			val = val.toString();
		}
		return val;
	}
	
	
}


//sub(add(mul(6,5,10),div(19,5)),div(54,5))
