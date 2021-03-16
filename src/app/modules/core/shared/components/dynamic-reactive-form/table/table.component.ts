import {Component, OnInit, Input, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, AbstractControl} from '@angular/forms';
import {MatTableDataSource, MatDialog} from '@angular/material';
import {BehaviorSubject} from 'rxjs';
import {FieldConfig} from '../shared';
import {GlobalVariables} from "../../../../../../global-variables.service";
import {async} from '@angular/core/testing';
import {SelectComponent} from '../select/select.component';
import {DataService} from 'src/app/shared/service/data.service';
import { DynamicReactiveFormDialogComponent } from '../dynamic-reactive-form-dialog/dynamic-reactive-form-dialog.component';
import { UserService } from 'src/app/modules/ops/components/user/user.service';

@Component({
	selector: 'app-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
	
	formGroup: FormGroup;
	formArray: FormArray;
	@Input() field: FieldConfig;
	@Input() group: any;
	dataSource = new BehaviorSubject<AbstractControl[]>([]);
	totalQuantity: number = 0;
	totalAmount: number = 0;
	displayedColumns: any;
	
	constructor(
		private formBuilder: FormBuilder,
		public globalVariables: GlobalVariables,
		private dataService: DataService,
		private dialog: MatDialog,
		private userService: UserService) {
		console.log("global_", globalVariables);
	}
	
	columns: any;
	footer: any;
	delete = {
		field_id: 'actions',
		name: {'en': ''}
	};
	
	JSON = [[1, 'aaa', 12, 12, 144],
		[2, 'bbb', 13, 13, 169],
		[3, 'ccc', 14, 14, 194]];
	
	ngOnInit() {
		this.columns = [];
		this.initTable();
		this.dataService.checkResetTable.subscribe((data) => {
			this.columns = [];
			if (data.resetFields.find(field_id => field_id == this.field.col)) {
				this.initTable(true, data);
			}
		});
	}
	
	
	initTable(reinit?, filterValue?) {
		this.columns = this.field.columns;
		if(this.field.update == undefined){
			this.field.update = true;
		}
		// this.columns.push({
		// 	field_id: "search",
		// 	name: {
		// 		en: "Search Box",
		// 		ar: "Search Box"
		// 	},
		// 	read_only: false,
		// 	reference_module_id: 41,
		// 	key_show: "equipment_number",
		// })
		console.log(this.columns);
		if (!reinit) {
			let found = this.columns.find(column => column.field_id == 'actions');
			if (!found) {
				this.columns.push(this.delete);
			}
		}
		this.displayedColumns = this.columns.map(col => col.field_id);
		this.footer = this.field.footer;
		this.formGroup = this.formBuilder.group({
			formArray: this.formBuilder.array([])
		});
		this.formArray = <FormArray> this.formGroup.get('formArray');
		if (this.field.value && this.field.value.length > 0 && !reinit) {
			this.loadGroup(this.field.value, filterValue);
		} else if (this.field.update) {
			this.addGroup(filterValue);
		}
	}
	
	getField(column, value) {
		return {
			key_show: column.key_show,
			reference_module_values: [],
			label: column.name,
			reference_module_id: column.reference_module_id,
			col: column.field_id,
			async: true,
			update: true,
			value: value,
			filter: column.filter
		};
	}
	
	getGroup(controls, col) {
		console.log("");
	}
	
	loadGroup(data, filterValue) {
		const formArray = <FormArray>this.formGroup.get('formArray');
		if (typeof data != "string") {
			data.forEach(value => {
				let formGroup = new FormGroup({});
				this.columns.forEach((column, i) => {
					this.addFilterToFields(filterValue, column);
					const control = this.formBuilder.control({
						value: value[i],
						disabled: column.read_only || this.field.update === false ? true : false,
					});
					formGroup.addControl(column.field_id, control);
				});

				formGroup.valueChanges.subscribe(val => {
					this.saveItem();
				});
				formArray.push(formGroup);
			});
		}

		let dataSource = new MatTableDataSource<FormArray>([this.formArray]);
		this.dataSource.next(dataSource.filteredData[0].controls);

	}

	addGroup(filterValue?) {
		const formArray = <FormArray> this.formGroup.get('formArray');
		let formGroup = new FormGroup({});
		this.columns.forEach(column => {
			let value;
			if (column.field_id == 'sq') {
				value = formArray.length + 1;
			}
			
			if (filterValue) {
				this.addFilterToFields(filterValue, column);
			}
			
			const control = this.formBuilder.control(
				{
					value: column.field_id === 'total_amount' ? '0' : value,
					disabled: column.read_only,
				},
			);
			formGroup.addControl(column.field_id, control);
		});
		formGroup.valueChanges.subscribe(val => {
			this.saveItem();
		});
		
		formArray.push(formGroup);
		let dataSource = new MatTableDataSource<FormArray>([this.formArray]);
		this.dataSource.next(dataSource.filteredData[0].controls);
	}
	
	/**
	 * Adds Filter to fields
	 *
	 * @param filterValue
	 * @param column
	 */
	addFilterToFields(filterValue, column) {
		// TODO: Check if filter value has a certain type, only then method should be executed
		if (filterValue && column.filter && column.filter.length > 0) {
			column.filter.forEach(filter => {
				filter.values = "";
				if (filter.value && filter.value.length > 0) {
					filter.value.forEach(element => {
						if (filterValue.from.col == element) {
							if (filter.values && filter.values) {
								filter.values += ',' + filterValue.from.value;
							} else {
								filter.values = filterValue.from.value;
							}
						}
					});
				}
			});
		}
	}
	
	saveItem() {
		let values = [];
		this.formArray.controls.forEach(element => {
			let formGroup = new FormGroup({});
			formGroup = element as FormGroup;
			let item = [];
			this.columns.forEach(col => {
				if (col.field_id != 'actions') {
					// console.log(col.field_id , "___", formGroup.controls[col.field_id].value)
					if (formGroup.controls[col.field_id].value) {
						item.push(formGroup.controls[col.field_id].value);
					} else {
						item.push(null);
					}
				}
			});
			values.push(item);
		});
		values.forEach(item => {
			let nullCheck = item.filter(i => i == null);
			if (nullCheck.length == item.length) {
				let index = values.indexOf(item);
				values.splice(index, 1);
			}
		});
		this.group.controls[this.field.col].setValue(JSON.stringify(values));
		this.field.value = JSON.stringify(values);
		console.log(this.field.value)
		this.group.controls[this.field.col].markAsDirty();
	}
	
	calculatePrice(formGroup: FormGroup) {
		let value = 1;
		this.columns.forEach(column => {
			if (column.calculation) {
				let keys = Object.keys(column.formula);
				keys.forEach(field_id => {
					if (field_id == 'mul') {
						column.formula[field_id].forEach(control => {
							value = value * (formGroup.get(control).value ? formGroup.get(control).value : 0);
						});
					}
				});
				formGroup.patchValue({
					[column.field_id]: value
				});
			}
		});
	}
	
	removeGroup(formGroup: FormGroup) {
		if (this.formArray.controls.length > 1) {
			let group = this.formArray.controls.find(i => i === formGroup);
			const index = this.formArray.controls.indexOf(group);
			this.formArray.controls.splice(index, 1);
			this.setIndex();
			let dataSource = new MatTableDataSource<FormArray>([this.formArray]);
			this.dataSource.next(dataSource.filteredData[0].controls);
			this.saveItem();
		}
	}
	
	setIndex() {
		this.formArray.controls.forEach((contorl, i) => {
			let formGroup = new FormGroup({});
			formGroup = contorl as FormGroup;
			if (formGroup.controls['sq']) {
				formGroup.controls['sq'].setValue(i + 1);
			}
			
		});
	}
	
	getTotalValue(field_id) {
		let add = 0;
		let formGroups = this.formArray.controls;
		formGroups.forEach(formGroup => {
			if (formGroup.get(field_id).value) {
				add = (+add) + (+formGroup.get(field_id).value);
			}
		});
		return add;
	}
	
	checkKey(footerColumn, fKey) {
		let value = false;
		if (footerColumn.calculation) {
			let keys = Object.keys(footerColumn.formula);
			keys.forEach(field_id => {
				if (field_id === 'total') {
					footerColumn.formula[field_id].forEach(val => {
						if (val === fKey) {
							value = true;
						}
					});
				}
			});
		}
		return value;
	}

	// raiseDialog(formGroup: FormGroup, field: any) {
	// 	console.log('formGroup__', formGroup);
	// 	console.log('formGroup__', formGroup.value);
	// 	console.log('field__', field);

	// 	const dialogRef = this.dialog.open(DynamicReactiveFormDialogComponent, {
	// 		data: {
	// 			formGroup: formGroup
	// 		}
	// 	});
	// 	dialogRef.afterClosed().subscribe((param) => {
	// 		if (param && param.action) {
	// 			if (field.dialog_return_value_data_type && field.dialog_return_value_data_type == 'module-reference') {
	// 				this.getModuleValue(field, param[field.dialog_return_value], formGroup, param);
	// 			} else {
	// 				formGroup.controls[field.field_id].setValue(param[field.dialog_return_value]);
	// 			}
	// 		}
	// 	});
	// }

	// getModuleValue(field, val, formGroup, param) {
	// 	if (val != null && val != "") {
	// 		let referenceModuleValues = [];
	// 		referenceModuleValues.push(field.key_show);
	// 		let reference_keys;
	// 		this.userService.fetchModuleReferenceKeysValue(val, referenceModuleValues, reference_keys)
	// 			.subscribe((data) => {
	// 				if (data.content && referenceModuleValues.length > 0) {
	// 					formGroup.controls[field.field_id].setValue(data.content[field.dialog_return_value]);
	// 				}
	// 			});
	// 	}
	// }

}
