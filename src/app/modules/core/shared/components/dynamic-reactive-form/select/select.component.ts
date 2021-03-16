import { OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, Subject, of } from 'rxjs';
import { FieldConfig } from '../shared';
import { GlobalVariables } from "../../../../../../global-variables.service";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DataService } from "../../../../../../shared/service/data.service";
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { FormulaService } from '../shared/formula.service';
import { UserService } from 'src/app/modules/ops/components/user/user.service';
import { DynamicService } from '../shared/dynamic.service';
/**
 * @title Select 
 */
@Component({
	selector: 'app-select',
	templateUrl: 'select.component.html',
	styleUrls: ['select.component.scss'],
})
export class SelectComponent implements OnInit {
	@Input() group: FormGroup;
	@Input() field: FieldConfig;
	
	@Input() allGroups: any;
	// region multiselect
	@ViewChild('checkboxstatus', { static: false }) checkboxstatus: ElementRef<HTMLInputElement>;
	isMultiSelect: any;
	// endregion
	@ViewChild('ArrayInput', { static: false }) ArrayInput: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;

	selectedValue = [];
	getInputOption: any[] = [];
	singleFilteredOptions: any;   //filters options single select
	singleOptionsCtrl = new FormControl(); //single select control
	isId: boolean;
	isValue: boolean;

	private nextPage$ = new Subject();
	limit: number = 10;

	/**
	 * Used for avoid loop hole when setting form_default_values
	 */
	isUpdateEvent = false;
	isLoading: boolean = false;
	hideSearchIcon: boolean = false;
	isSelectData: boolean;

	constructor(
		private dataService: DataService,
		public globalVariables: GlobalVariables,
		private restApi: HttpClient,
		public sharedService: SharedService,
		private formulaService: FormulaService,
		private userService: UserService,
		private dynamicService: DynamicService) {
	}

	/**
	 * Filters getInputOption against value
	 *
	 * @param value
	 * @private
	 */
	private _filter(value: string): string[] {
		if (value) {
			value = value.toString();
			const filterValue = value.toLowerCase();

			const search = this.getInputOption.filter(x => x[Object.keys(x)[1]] ? (typeof x[Object.keys(x)[1]] == "object") ?
				x[Object.keys(x)[1]][this.globalVariables.LNG].toString().toLowerCase().indexOf(filterValue) === 0 :
				x[Object.keys(x)[1]].toString().toLowerCase().indexOf(filterValue) === 0 : x[Object.keys(x)[1]].toString().toLowerCase().indexOf(filterValue) === 0);
			this.singleFilteredOptions = search;
			return search;
		} else {
			this.singleFilteredOptions = this.getInputOption;
		}
	}

	/**
	 * Inits select 
	 */
	ngOnInit() {
		if (!this.field.update) {
			this.singleOptionsCtrl.disable();
		}
		if (this.field.default_value_editable === false) {
			this.singleOptionsCtrl.disable();
		}
	    this.getReferenceModuleValue();
		this.singleOptionsCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });

		if (this.field.value != null && this.field.value != "") {
			let option = this.getInputOption.find(x => x.id == this.field.value);
			this.singleOptionsCtrl.setValue(this.sharedService.getSelectValue(event, this.field));
		}
		let reference_module_id = this.field.reference_module_id;
		if (reference_module_id && reference_module_id >= 0) {
			this.isId = true;
			if (this.field.value != null && this.field.value != "") {
				this.getModuleValue();
			}
		} else {
			this.isValue = true;
			if (!this.field.async) {
				this.getInputOption = this.sharedService.copyFieldOptions(this.field.options);
				this.singleFilteredOptions = this.getInputOption;
			}
		}
		this.handleFormDefaultValues();
		/* Add scroll event to close Autocomplet on scroll */
		window.addEventListener('scroll', this.scroll, true);
	}

	/* Autocomplete close on scroll */
	scroll = (event): void => {
		if (!event.target.className.includes("mat-autocomplete")) {
			this.autocomplete.closePanel();
		}
	};

	/**
	 * Simulates option selection
	 * Used for form_default_values for select components
	 */
	handleFormDefaultValues() {
		this.dataService.fillFormDefaultValues.subscribe((data) => {
			if (data.disable === true && this.field.update === true && (this.field.col === data.col)) {
				this.singleOptionsCtrl.disable();
				this.hideSearchIcon = true;
				this.group.controls[this.field.col].setValue("");
					this.autocomplete.writeValue("");
				} else if (data.disable === false && this.field.update === true && (this.field.col === data.col)) {
				this.singleOptionsCtrl.enable();
				this.hideSearchIcon = false;
			}
			if (this.group['group_name'] == data.group_name || (data.group_name === undefined)) {
				if (this.field.col == data.col) {
					this.isUpdateEvent = true;
					this.autocomplete.writeValue(data.value);
					if ((!isNaN(parseInt(data.value)) && !Array.isArray(this.field.value)) && (this.field.reference_module_id && this.field.reference_module_id != "") && (this.field.reference_module_values)) {
						try {
							let obj: any = {};
							if (!isNaN(data.value)) {
								obj.id = +data.value;
							} else {
								obj.id = data.value;
								obj.value = data.value;
							}
							this.selected(obj, null, true);
						} catch (exception) {
						}
					} else {
						if (this.field.options) {
							let value = this.field.options.find(option => +option.id == data.value);
							this.selected(value, null, true);
							this.group.controls[data.col].setValue(data.value.toString());
						}
					}
				}
			}
		});
	}


	/**
	 * Sets Selected value
	 * Sets id (needed for backend insertion)
	 * Sets key_show attribute on input element to show to user
	 */
	selected(event: any, ev?: any, isPass?: any, isNotModule?: any) {
		if (!isPass) {
			if (ev && !ev.source.selected) {
				return;
			}
		}
		if (this.field.update) {
			this.group.controls[this.field.col].markAsDirty();
		}
		let eventValue = this.sharedService.checkEvent(event, this.isId, this.isValue);
		this.field.value = this.sharedService.checkValue(eventValue);
		this.group.controls[this.field.col].setValue(this.sharedService.checkValue(eventValue));
		this.singleOptionsCtrl.setValue(this.sharedService.getSelectValue(event, this.field));
		if (!isNotModule) {
			this.getModuleValue();
		}
		this.resetField();
	
	}

	getModuleValue() {
		if ((this.field.value && !Array.isArray(this.field.value)) && (this.field.reference_module_id && this.field.reference_module_id != "") && (this.field.reference_module_values)) {
			let val;
			if (Array.isArray(this.field.value)) {
				val = this.field.value[this.field.value.length - 1];
			} else if (typeof this.field.value == "object") {
				val = this.field.value.value;
			} else {
				val = this.field.value;
			}
			if (val != null && val != "") {
				let referenceModuleValues = JSON.parse(JSON.stringify(this.field.reference_module_values));
				referenceModuleValues.push(this.field.key_show);
				// this.field.reference_module_values
				if(this.field.form_default_values){
					this.field.form_default_values.forEach(element => {
						let index = referenceModuleValues.indexOf(element)
						if (index < 0) {
							referenceModuleValues.push(element);
						}
					});
				}
				let formData;
				if(this.dynamicService.rootFormValue.value != undefined){
					formData = this.dynamicService.rootFormValue.value;
				} else if(this.dynamicService.rootFormValue  != undefined){
					formData = this.dynamicService.rootFormValue;
				}
				this.userService.fetchModuleReferenceKeysValue(val, referenceModuleValues, this.field.reference_keys,  this.field.reference_value_api, formData)
					.subscribe((data) => {
						if (data.content && this.field.reference_module_values.length > 0) {
							let selectData;
							if(data.content && data.content.return_field_ids){
								selectData = data.content.return_field_ids;
							} else{
								selectData = data.content;
							}
							const setValueObj = Object.keys(selectData).reduce((object, field_id) => {
								if (field_id !== this.field.key_show) {
									object[field_id] = selectData[field_id];
								}
								return object;
							}, {});
							this.sharedService.setFormValue(setValueObj, this.dynamicService.allFormGroups, this.group, this.field, this.allGroups);
							this.formulaService.manageFormula(this.allGroups, this.dynamicService.allFormGroups);
							if (this.field.services_on_change) {
								this.sharedService.serviceChange(this.field, data.content[this.field.key_show]);
							}
							this.checkTableSelect(setValueObj);
						}
						this.isUpdateEvent = false;
						if (data.content && data.content[this.field.key_show] && data.content[this.field.key_show] != "") {
							this.autocomplete.writeValue(this.sharedService.getSelectValue(data.content, this.field));
						}
					});
			} else {
				this.sharedService.setFormNullValue(this.dynamicService.allFormGroups, this.group, this.field);
			}
		} else {
			setTimeout(() => {
				this.formulaService.manageFormula(this.allGroups, this.dynamicService.allFormGroups);
			}, 200);
		}

	}


	resetField() {
		if (this.field.resetFields && this.field.resetFields.length > 0) {
			this.dataService.resetField({ from: { col: this.field.col, value: this.field.value }, resetFields: this.field.resetFields });
		}
	}

	checkTableSelect(setValueObj) {
		if (setValueObj["status"] != undefined) {
			let data = { moduleId: this.field.reference_module_id, status: setValueObj["status"], index : this.group["index"] }
			this.dataService.tableStatusChange(data);
		} 
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
						this.selected(value, '', true, true);
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


	/**
	 * Scroll for multi-select loading
	 *
	 */
	onScroll() {
		this.nextPage$.next();
		this.limit += 10;
		this.singleOptionsCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
	}


	/**
	 * Scroll for multi-select loading
	 *
	 */
	getSelectData() {
		if (!this.isSelectData) {
			this.isSelectData = true;
			this.singleOptionsCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
		}
	}
	/**
	 * Filer select options
	 *
	 */
	getReferenceModuleValue() {
		this.limit = 10;
		if (this.field.inputType != "list" && this.field.reference_module_id && this.field.reference_module_id != "") {
			const inputValue = this.singleOptionsCtrl;
			inputValue!.valueChanges
				.pipe(
					debounceTime(1000),
					tap(() => {
						this.isLoading = true;
					}),
					switchMap((value) => {
						if(this.isSelectData){
						return this.restApi.post(
							`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchreferencevalue`,
							{
								"refModId": this.field.reference_module_id,
								"keyShow": this.field.key_show,
								"searchString": (this.singleOptionsCtrl.value == undefined ? '' : this.singleOptionsCtrl.value),
								"offset": 0,
								"limit": 10,
								"filter": JSON.stringify(this.field.filter)
							}
						

						)
							.pipe(
								finalize(() => {
									this.isLoading = false;
									setTimeout(() => {
										let d = document.getElementsByClassName('mat-autocomplete-panel');
										if (d && d[0] && d[0].scrollTop && this.limit > 10) {
											d[0].scrollTop = this.limit * 20;
										}
									}, 100);

								}),
							) 
						} else {
							return of('');
						  }
					})
				)
				.subscribe(data => {
					if (data["content"] == undefined) {
					} else {
						this.getInputOption = this.sharedService.copyFieldOptions(data["content"].values);
						this._filter(this.singleOptionsCtrl.value);
					}
				});
		}
	}

	/**
	 * Clears input field and option
	 */
	setSelectEmpty() {
		this.field.value = '';
		this.group.controls[this.field.col].markAsDirty();
		this.group.controls[this.field.col].setValue(this.field.value);
		this.getModuleValue();
		this.sharedService.setFormNullValue(this.dynamicService.allFormGroups, this.group, this.field);
	}

	/* Addondestory removing scroll event */
	ngOnDestroy() {
		window.removeEventListener('scroll', this.scroll, true);
	}
}

