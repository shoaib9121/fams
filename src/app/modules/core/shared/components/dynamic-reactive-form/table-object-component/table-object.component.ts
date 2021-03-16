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
import { DynamicService } from '../shared/dynamic.service';

@Component({
	selector: 'app-table-object',
	templateUrl: './table-object.component.html',
	styleUrls: ['./table-object.component.scss']
})
export class TableObjectComponent implements OnInit {
	
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
		private dynamicService: DynamicService,
		private dialog: MatDialog,
		private userService: UserService) {
		console.log("global_", globalVariables);
	}
	
	columns: any;
	footer: any;
	delete = {
		col: 'actions',
		label: {'en': ''}
	};
	
	NEWJSON = [
		[
			{ "part_id": 22, "batch_id": 22 },
			{ "part_id": 22, "batch_id": 22 },
			{ "part_id": 22, "batch_id": 22, "prevent_modification": true }
		]
	]
	
	ngOnInit() {
		this.columns = [];
		this.initTable();
		this.dataService.checkResetTable.subscribe((data) => {
			this.columns = [];
			if (data.resetFields.find(col => col == this.field.col)) {
				this.initTable(true, data);
			}
		});
	}
	
	
	initTable(reinit?, filterValue?) {
		this.columns = this.field.columns;
		if(this.field.update == undefined){
			this.field.update = true;
		}
		console.log(this.columns);
		if (!reinit) {
			let found = this.columns.find(column => column.col == 'actions');
			if (!found) {
				this.columns.push(this.delete);
			}
		}
		this.displayedColumns = [];
		this.displayedColumns = this.columns.map(col => col.col);
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
		if (!this.field.update) {
			column.update = false;
		}
		column.value =  value;
		return column;
	}

	getGroup(controls, col) {
		console.log("");
	}
	
	loadGroup(data, filterValue) {
		const formArray = <FormArray>this.formGroup.get('formArray');
		if (typeof data != "string") {
			data.forEach((value, index) => {
				let formGroup = new FormGroup({});
				this.columns.forEach((column, i) => {
					this.addFilterToFields(filterValue, column);
					const control = this.formBuilder.control({
						value: value[column.col],
						disabled:  !this.field.update,
					});
					
					formGroup.addControl(column.col, control);
				});

				formGroup.valueChanges.subscribe(val => {
					this.saveItem();
				});
				formGroup["index"] = index; // With this we prevent the updation of other fields with the same col/field_id
				formArray.push(formGroup);
			});
		}

		let dataSource = new MatTableDataSource<FormArray>([this.formArray]);
		this.dataSource.next(dataSource.filteredData[0].controls);

	}

	addGroup(filterValue?) {
		const formArray = <FormArray> this.formGroup.get('formArray');
		let formGroup = new FormGroup({});
		this.columns.forEach((column, index) => {
			let value;
			// If the column purpose is sequence - we increase the sequence number
			if (column.col == 'sq') {
				value = formArray.length + 1;
			}
			
			if (filterValue) {
				this.addFilterToFields(filterValue, column);
			}
			
			const control = this.formBuilder.control(
				{
					value: column.col === 'total_amount' ? '0' : value,
					disabled: !this.field.update,
				},
			);
			formGroup.addControl(column.col, control);
		});
		formGroup.valueChanges.subscribe(val => {
			this.saveItem();
		});
		formGroup["index"] = formArray.length; // With this we prevent the updation of other fields with the same col/field_id
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
		let item = [];

		this.formArray.controls.forEach((element, index) => {
			let formGroup = new FormGroup({});
			formGroup = element as FormGroup;
			let obj = {};
			this.columns.forEach(col => {
				if (col.col != 'actions') {
					if (typeof formGroup.controls[col.col].value != 'undefined' && formGroup.controls[col.col].value !== "") {
				
						try {
							if (col.update) {
								obj[col.col] = formGroup.controls[col.col].value;
							}
						} catch{ }
						
					} else {
						if (col.update) {
							obj[col.col] = null;
						}
					}
				}
			});
			values.push(obj);
		});
		
		this.group.controls[this.field.col].setValue(values);
		this.field.value = values;
		console.log(this.field.value)
		this.group.controls[this.field.col].markAsDirty();
	}
	
	calculatePrice(formGroup: FormGroup) {
		let value = 1;
		this.columns.forEach(column => {
			if (column.calculation) {
				let keys = Object.keys(column.formula);
				keys.forEach(col => {
					if (col == 'mul') {
						column.formula[col].forEach(control => {
							value = value * (formGroup.get(control).value ? formGroup.get(control).value : 0);
						});
					}
				});
				formGroup.patchValue({
					[column.col]: value
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
	
	getTotalValue(col) {
		let add = 0;
		let formGroups = this.formArray.controls;
		formGroups.forEach(formGroup => {
			if (formGroup.get(col).value) {
				add = (+add) + (+formGroup.get(col).value);
			}
		});
		return add;
	}
	
	checkKey(footerColumn, fKey) {
		let value = false;
		if (footerColumn.calculation) {
			let keys = Object.keys(footerColumn.formula);
			keys.forEach(col => {
				if (col === 'total') {
					footerColumn.formula[col].forEach(val => {
						if (val === fKey) {
							value = true;
						}
					});
				}
			});
		}
		return value;
	}

}
