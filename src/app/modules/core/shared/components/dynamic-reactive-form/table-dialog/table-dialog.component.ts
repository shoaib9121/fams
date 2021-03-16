import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, AbstractControl, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FieldConfig } from '../shared';
import { GlobalVariables } from "../../../../../../global-variables.service";
import { DynamicReactiveFormDialogComponent } from '../dynamic-reactive-form-dialog/dynamic-reactive-form-dialog.component';
import { UserService } from 'src/app/modules/ops/components/user/user.service';
import { MatDialog } from '@angular/material';
import { DynamicService } from '../shared/dynamic.service';

@Component({
	selector: 'app-table-dialog',
	templateUrl: './table-dialog.component.html',
	styleUrls: ['./table-dialog.component.scss']
})
export class TableDialogComponent implements OnInit {

	formGroup: FormGroup;
	formArray: FormArray;
	@Input() field: any;
	@Input() group: any;
	@Input() update: any;
	dataSource = new BehaviorSubject<AbstractControl[]>([]);
	totalQuantity: number = 0;
	totalAmount: number = 0;
	displayedColumns: any;

	constructor(
		public globalVariables: GlobalVariables,
		private dialog: MatDialog,
		private userService: UserService,
		private dynamicService: DynamicService) {
		console.log("global_", globalVariables,);
	}


	ngOnInit() {
	
		this.setvalues();

	}

	setvalues() {
		Object.keys(this.group.value).forEach(element => {
			if(element == this.field.col && this.field.dialog_return_value_data_type == "module-reference" ){
				this.getModuleValue(this.field,this.group.value[element]);
			}
		});
	}

	tableDialogForm = new FormGroup({
		field_show: new FormControl(''),
	});

	raiseDialog(formGroup: FormGroup, field: any) {
		console.log('formGroup__', formGroup);
		console.log('formGroup__', formGroup.value);
		console.log('field__', field);
		let data;
		let allFormGroups = JSON.parse(JSON.stringify(this.dynamicService.allFormGroups.value));
		if (allFormGroups.length > 0) {
			data = allFormGroups;
			data.push(formGroup.value);
		} else {
			data = formGroup;
		}

		const dialogRef = this.dialog.open(DynamicReactiveFormDialogComponent, {
			data: {
				allFormGroups: data,
				formGroup: formGroup,
				field: field
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param && param.action) {
				if (field.dialog_return_value_data_type && field.dialog_return_value_data_type == 'module-reference') {
					formGroup.controls[field.col].setValue(param[field.dialog_return_value]);
					if(param[field.dialog_return_value]){
						formGroup.controls[field.col].markAsDirty();
					}
					this.getModuleValue(field, param[field.dialog_return_value]);
				} else {
						this.tableDialogForm.controls['field_show'].setValue(param[field.dialog_return_value]);
						formGroup.controls[field.col].setValue(param[field.dialog_return_value]);
				}
			}
		});
	}

	getModuleValue(field, val) {
		if (val != null && val != "") {
			let referenceModuleValues = [];
			referenceModuleValues.push(field.key_show);
			let reference_keys;
			this.userService.fetchModuleReferenceKeysValue(val, referenceModuleValues, reference_keys)
				.subscribe((data) => {
					if (data.content && referenceModuleValues.length > 0) {
						this.tableDialogForm.controls['field_show'].setValue(data.content[field.key_show]);
					}
				});
		}
	}

}
