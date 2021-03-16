import { OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { map, startWith, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FieldConfig } from '../shared';
import { GlobalVariables } from "../../../../../../global-variables.service";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DataService } from "../../../../../../shared/service/data.service";
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../shared/shared.service';
import { DynamicService } from '../shared/dynamic.service';
/**
 * @title Multi Select Component
 */
@Component({
	selector: 'app-multi-select',
	templateUrl: 'multi-select.component.html',
	styleUrls: ['multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
	@Input() group: FormGroup;
	@Input() field: FieldConfig;
	
	@Input() allGroups: any;

	// region multiselect
	@ViewChild('checkboxstatus', { static: false }) checkboxstatus: ElementRef<HTMLInputElement>;
	multiFilteredOptions: Observable<any[]>;   //filters options multi select
	// endregion

	@ViewChild('ArrayInput', { static: false }) ArrayInput: ElementRef<HTMLInputElement>;
	@ViewChild(MatAutocompleteTrigger, { static: false }) autocomplete: MatAutocompleteTrigger;

	separatorKeysCodes: number[] = [ENTER, COMMA];
	selectedValue = [];
	getInputOption: any[] = [];
	optionsCtrl = new FormControl(); //multi select control
	isId: boolean;
	isValue: boolean;
	removable = true;

	private nextPage$ = new Subject();
	limit: number = 10;

	/**
	 * Used for avoid loop hole when setting form_default_values
	 */
	isLoading: boolean = false;
	isLoad: boolean;

	constructor(
		private dataService: DataService,
		public globalVariables: GlobalVariables,
		private restApi: HttpClient,
		public sharedService: SharedService,
		private dynamicService: DynamicService) {
		this.filterOption();
	}

	/**
	 * Filters select and multi select
	 *
	 */
	filterOption() {
		this.multiFilteredOptions = this.optionsCtrl.valueChanges.pipe(
			startWith(null),
			map(x => x ? this._filter(x) : this.getInputOption.slice()));
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
			return search;
		}
	}


	/**
	 * Inits select and multiselect
	 */
	ngOnInit() {
		this.isLoad = true;
		if (!this.field.update) {
			this.optionsCtrl.disable();
		}
		let reference_module_id = this.field.reference_module_id;
		if (reference_module_id && reference_module_id >= 0) {
			this.isId = true;
			if (this.field.value.length > 0) {
				this.getModuleValue();
			}
		} else {
			this.isValue = true;
		}
		this.getReferenceModuleValue();
		this.optionsCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });

		if (this.field.value.length > 0) {
			// this.setMultiSelectValue(this.field.value);
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

	focused(trg: MatAutocompleteTrigger) {
		setTimeout(() => {
			trg.openPanel();
		});
	}

	/**
	 * Sets Selected value
	 * Sets id (needed for backend insertion)
	 * Sets key_show attribute on input element to show to user
	 */
	selected(event: any, ev?: any, isPass?: any) {
		if (!isPass) {
			if (ev && !ev.source.selected) {
				return;
			}
		}
		this.group.controls[this.field.col].markAsDirty();
		const index: number = this.selectedValue.findIndex(x => x.id == event.id);
		if (index < 0) {
			event = this.removeIsCheck(event);
			if (typeof this.field.value != "object" || this.field.value == null || this.field.value == "") {
				this.field.value = [];
			}

			// let option = this.getInputOption.find(x => x.id == event.id);
			// if (option) {
			// 	option.isCheck = true;
			// }

			//checkoption
			let fieldEvent = this.sharedService.checkEvent(event, this.isId, this.isValue);
			this.field.value.push(fieldEvent);
			this.selectedValue.push({ "id": event.id, "value": this.sharedService.getSelectValue(event, this.field) });
			this.group.controls[this.field.col].setValue(this.field.value);
			this.ArrayInput.nativeElement.value = '';
			this.optionsCtrl.setValue(null);
			this.optionChecked();
		}
		this.getModuleValue();
		this.resetField();
	}

	optionChecked() {
		this.selectedValue.forEach(event => {
			let option = this.getInputOption.find(x => x.id == event.id);
			if (option && !option.isCheck) {
				option.isCheck = true;
			}
		});
	}

	getModuleValue() {
		this.sharedService.getSetModuleValue(this.dynamicService.allFormGroups, this.allGroups, this.group, this.field, this.autocomplete);
	}

	resetField() {
		if (this.field.resetFields && this.field.resetFields.length > 0) {
			this.dataService.resetField({ from: { col: this.field.col, value: this.field.value }, resetFields: this.field.resetFields });
		}
	}

	/**
	 * Simulates option selection
	 * Used for form_default_values for select components
	 */
	handleFormDefaultValues() {
		this.dataService.fillFormDefaultValues.subscribe((data) => {
			if (this.field.col == data.col) {
				this.autocomplete.writeValue(data.value);
				if (!this.field.update) {
					// Try to find id in options
					try {
						this.selected(this.field.options.find(option => +option.id == data.value), null, true);
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
		});
	}

	/**
	 * Set Multiselect values
	 *
	 */
	setMultiSelectValue(fieldArray) {
		fieldArray.forEach(id => {
			this.isLoad = false;
			let val = this.getInputOption.find(x => x.id == id);
			const index: number = this.selectedValue.findIndex(x => x.id == id);
			if (index < 0) {
				if (val) {
					val.isCheck = true;
					this.selectedValue.push({ "id": val.id, "value": this.sharedService.getSelectValue(val, this.field) });
				}
			}
		});
	}

	/**
	 * Remove multiselect is check
	 */
	removeIsCheck(eventObj: any) {
		const prop = 'isCheck';
		const newEvent = Object.keys(eventObj).reduce((object, field_id) => {
			if (field_id !== prop) {
				object[field_id] = eventObj[field_id];
			}
			return object;
		}, {});
		return newEvent;
	}

	/**
	 * Remove multiselect is element
	 *
	 */
	removeElement(options: any) {
		const index: number = this.selectedValue.findIndex(x => x.id == options.id);
		if (index !== -1) {
			let option = this.getInputOption.find(x => x.id == options.id);
			if (option) {
				option.isCheck = false;
			}
			this.selectedValue.splice(index, 1);
			this.field.value.splice(index, 1);
		}
		this.getModuleValue();
	}


	onScroll() {
		this.nextPage$.next();
		this.limit += 10;
		this.optionsCtrl.updateValueAndValidity({ onlySelf: true, emitEvent: true });
	}

	/**
	 * Filer select options
	 *
	 */
	getReferenceModuleValue() {
		this.limit = 10;
		if (this.field.inputType != "list" && this.field.reference_module_id && this.field.reference_module_id != "") {
			const inputValue = this.optionsCtrl;
			inputValue!.valueChanges
				.pipe(
					debounceTime(1000),
					tap(() => {
						this.isLoading = true;
					}),
					switchMap(value =>
						this.restApi.post(
							`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchreferencevalue`,
							{
								"refModId": this.field.reference_module_id,
								"keyShow": this.field.key_show,
								"searchString": (this.optionsCtrl.value == undefined ? '' : this.optionsCtrl.value),
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
					)
				)
				.subscribe(data => {
					if (data["content"] == undefined) {
					} else {
						this.getInputOption = this.sharedService.copyFieldOptions(data["content"].values);
						this.optionChecked();
						if (this.isLoad && this.field.value.length > 0) {
							this.setMultiSelectValue(this.field.value);
						}
						this._filter(this.optionsCtrl.value);
					}
				});
		}
	}

	/**
	 * Clears input field and option
	 */
	setSelectEmpty() {
		this.field.value = '';
		this.group.controls[this.field.col].setValue(this.field.value);
		this.getModuleValue();
		this.sharedService.setFormNullValue(this.dynamicService.allFormGroups, this.group, this.field);
	}

	/* Addondestory removing scroll event */
	ngOnDestroy() {
		window.removeEventListener('scroll', this.scroll, true);
	}

}

