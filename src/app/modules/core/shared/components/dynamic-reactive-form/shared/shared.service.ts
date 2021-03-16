import { Injectable, Output, EventEmitter } from '@angular/core';
import { MathService } from '.';
import { GlobalVariables } from 'src/app/global-variables.service';
import { DataService } from 'src/app/shared/service/data.service';
import { FormulaService } from './formula.service';
import { UserService } from 'src/app/modules/ops/components/user/user.service';
import { DynamicService } from './dynamic.service';

@Injectable({
	providedIn: 'root'
})
export class SharedService {
	/**
	 * Stores Data of item that is being edited
	 */
	public itemData: any;
	/**
	 * Stores Type Id of item that is being edited/created
	 */
	public itemTypeId: number;
	public imageEmitter: EventEmitter<any>;
	constructor(
		private globalVariables: GlobalVariables,
		private dataService: DataService,
		private formulaService: FormulaService,
		private dynamicService: DynamicService,
		private userService: UserService) {
		this.imageEmitter = new EventEmitter<any>();
	}


	/**
	 *  Call data service to fire side issues
	 */
	serviceChange(field, value) {
		field.services_on_change.forEach(element => {
			if (element == "publish_form_value") {
				let val = {};
				val[field.col] = value;
				this.dataService.serviceChange(val);
			}
		});
	}

	setItemData(data) {
		this.itemData = data;
		if (data.hasOwnProperty("type_id")) {
			this.itemTypeId = data.type_id;
		}
	}

	setTypeId(typeId) {
		this.itemTypeId = typeId;
	}

	/**
	 * Sends images (FieldConfig) to tab component
	 * Used for reported images tab
	 *
	 * @param fieldConfig
	 */
	fireImageEvent(fieldConfig) {
		this.imageEmitter.emit(fieldConfig);
	}


	/**
	 * Check vaklue string or number
	 * 
	 */
	checkValue(val) {
		if (!isNaN(val) && val != "") {
			val = +val;
		} else {
			val = val.toString();
		}
		return val;
	}

	/**
	 * Get selcetion option object value
	 *
	 */
	getSelectValue(option, field) {
		let selectValue;
		let value: any;
		try {
			selectValue = option[field.key_show];
			if (typeof selectValue == "object") {
				selectValue = selectValue[this.globalVariables.LNG];
			}
		} catch (exception) {

		}
		return selectValue;
	}

	/**
	 * Clears input field and option
	 */
	setSelectEmpty(field, group) {
		field.value = '';
		group.controls[field.col].setValue(field.value);
	}

	/**
	 * Detach object/array from reference type
	 */
	detachObject(object) {
		return JSON.parse(JSON.stringify(object));
	}


	/**
	* Returns id (in case of reference_module_id field) or first field_id of object
	*/
	checkEvent(event, isId, isValue) {
		if (isId) {
			return +event.id;
		} else if (isValue) {
			return event[Object.keys(event)[0]];
		}
	}


	/**
	 * Copies field option to new array and returns it
	 */
	copyFieldOptions(options): any[] {
		let inputOptions: any = [];
		for (let i in options) {
			if (options[i]) {
				try {
					options[i].name = JSON.parse(options[i].name);
				} catch (e) {
				}
			}
			inputOptions.push(options[i]);
		}

		return inputOptions;
	}


	staticSearch(getInputOption, field, value) {
		value = value.toString();
		const filterValue = value.toLowerCase();

		return getInputOption.filter(x => x.name ?
			(typeof x.name == "object") ? x.name[this.globalVariables.LNG] ?
				x.name[this.globalVariables.LNG].toString().toLowerCase().indexOf(filterValue) === 0 :
				x.name.toString().toLowerCase().indexOf(filterValue) === 0 :
				x.name.toString().toLowerCase().indexOf(filterValue) === 0 :
			(typeof x.values == "object" && x.values && x.values[field.key_show]) ? x.values[field.key_show][this.globalVariables.LNG] ?
				x.values[field.key_show][this.globalVariables.LNG].toString().toLowerCase().indexOf(filterValue) === 0 :
				x.values[field.key_show].toString().toLowerCase().indexOf(filterValue) === 0 :
				x.values[field.key_show] ? x.values[field.key_show].toString().toLowerCase().indexOf(filterValue) === 0 : ''
		);
	}

	
	/**
	 * Finds autofill fields to update them
	 * Transforms {@param content} to needed format for autofilling field
	 *
	 * @param content
	 */
	setFormValue(content, allFormGroups, group, field,allGroups?) {
		for (let field_id in content) {
			let formControl;
			formControl = this.dynamicService.findFormGroup(allFormGroups.controls, field_id);
			let val: any = "";
			if (Array.isArray(content[field_id]) && content[field_id].length > 0) {
				val = content[field_id][0];
			} else if (typeof content[field_id] == "string") {
				val = content[field_id];
			} else if (typeof content[field_id] === "object") {
				if (field.reference_keys && field.reference_keys.reference_keys.find(x => x.field_id == field_id)) {
					let field_key_show = field.reference_keys.reference_keys.find(x => x.field_id == field_id).key_show;

					let key_field = JSON.parse(content[field_id][field_key_show]);
					if (key_field[this.globalVariables.LNG]) {
						val = key_field[this.globalVariables.LNG];
					} else {
						val = key_field;
					}
				}
			} else if (!Array.isArray(content[field_id])) {
				val = JSON.stringify(content[field_id]);
			}
			let groupField;
			if (allGroups) {
				groupField = this.findGroupField(group, allGroups, field_id);
			}
			this.setValue(formControl, field_id, val, group, field,groupField);
		}
	}


	/**
	 * Autofills reference_module_values of current field
	 * In case of form_default_values it passes the field_id and selected Value (id) on
	 * to dataService, which will then emit an event that simulates an option selection
	 *
	 * @param formControl
	 * @param field_id
	 * @param val
	 */
	public setValue(formCtr, field_id, val, group, field, groupField) {
		let formControl;
		if (formCtr && formCtr.controls[field_id] && val != undefined) {
			formControl = formCtr;
		} else if (group && group.controls[field_id]) {
			formControl = group;
		} else {
			return;
		}
		if (formControl && formControl.controls[field_id] && val != undefined) {
			formControl.controls[field_id].setValue(val.toString());
			/**  In case of form_default_values an event has to be emitted to tell that particular field to fetch the selected value*/
			if (field.shouldAutofillGlobally) {
				this.dataService.eventFillFormDefaultValues(field_id, val);
			} else {
				this.dataService.eventFillFormDefaultValues(field_id, val, group.group_name);
			}

			if (groupField && groupField.update) {
				formControl.controls[field_id].markAsDirty();
			}
		}
	}


	findGroupField(group, allGroups, field_id) {
		let field: any;
		if (!isNaN(group.group_name)) {
			//TODO: Check field dirty form table elements
			const groupIndex = +group.group_name;
			if (allGroups[groupIndex]) {
				field = allGroups[groupIndex].fields.find(x => x.col == [field_id]);
			} 
		}
		return field;
	}

		/**
	 * Clears all reference_module_values (= autofill values)
	 * Called when user unselects selected value
	 */
	setFormNullValue(allFormGroups, group, field,) {
		if (field.reference_module_values) {
			let arr;
			arr = field.reference_module_values;
			arr = arr.reduce((a, b) => (a[b] = '', a), {});
			this.setFormValue(arr, allFormGroups, group, field);
		}
	}

	/**
	 * Fetches details for selected option
	 * "Preparing for autofill"
	 */
	getSetModuleValue(allFormGroups,allGroups,group,field,autocomplete ) {
		if ((field.value && !Array.isArray(field.value)) && (field.reference_module_id && field.reference_module_id != "") && (field.reference_module_values)) {
			let val;
			if (Array.isArray(field.value)) {
				val = field.value[field.value.length - 1];
			} else if (typeof field.value == "object") {
				val = field.value.value;
			} else {
				val = field.value;
			}
			if (val != null && val != "") {
				let referenceModuleValues = JSON.parse(JSON.stringify(field.reference_module_values));
				referenceModuleValues.push(field.key_show);
				// field.reference_module_values
				this.userService.fetchModuleReferenceKeysValue(val, referenceModuleValues, field.reference_keys)
					.subscribe((data) => {
						if (data.content && field.reference_module_values.length > 0) {
							const setValueObj = Object.keys(data.content).reduce((object, field_id) => {
								if (field_id !== field.key_show) {
									object[field_id] = data.content[field_id];
								}
								return object;
							}, {});
							this.setFormValue(setValueObj, allFormGroups, group, field);
							this.formulaService.manageFormula(allGroups, allFormGroups);
						}
						if (data.content && data.content[field.key_show] && data.content[field.key_show] != "") {
							autocomplete.writeValue(this.getSelectValue(data.content, field));
						}
					});
			} else {
				this.setFormNullValue(allFormGroups, group, field);
			}
		} else{
			setTimeout(() => {
				this.formulaService.manageFormula(allGroups, allFormGroups);
			}, 200);
		}

	}


}
