import { Component, OnInit, Inject, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GlobalVariables } from 'src/app/global-variables.service';
import { DynamicReactiveFormComponent } from '../dynamic-reactive-form/dynamic-reactive-form.component';
import { DynamicService } from '../shared/dynamic.service';
import { ModuleDataService } from 'src/app/modules/ops/components/user/module-data/module-data.service';
import { SharedService } from '../shared/shared.service';

@Component({
	selector: 'app-dynamic-reactive-form-dialog',
	templateUrl: './dynamic-reactive-form-dialog.component.html',
	styleUrls: ['./dynamic-reactive-form-dialog.component.scss']
})
export class DynamicReactiveFormDialogComponent implements OnInit {

	dialogForm: FormGroup;
	dialoagFormData: any;// = JSON.parse('{"forms":{"title":{"en":"Part Details","ar":"تفاصيل الجزء"},"groups":[{"name":{"en":"Specify Part","ar":"حدد الجزء"},"fields":[{"name":{"en":"Equipment Number","ar":"عدد المعدات"},"field_id":"equipment_number","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"module-reference","deleted":false,"calculation":false,"validation":[{"type":"required","value":true,"message":{"en":"This field is required","ar":"This field is required"}}],"reference_module_id":41,"reference_module_values":["equipment_number","manufacturer_id","model_id","color","model_year","license_number"],"post_reference_values":true,"form_default_values_editable":false,"form_default_values":["manufacturer_id","model_id"],"key_show":"equipment_number"},{"name":{"en":"Work Accomplish","ar":"إنجاز العمل"},"field_id":"work_accomplish","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"module-reference","deleted":false,"calculation":false,"validation":[],"reference_module_id":71,"reference_module_values":["work_accomplish_code"],"key_show":"work_accomplish_code"}]},{"name":{"en":"Equipment History","ar":"تاريخ المعدات"},"fields":[{"name":{"en":"Date of Last Work","ar":"تاريخ آخر عمل"},"field_id":"date_last_work","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"text","deleted":false,"calculation":false,"validation":[]},{"name":{"en":"Last Replaced","ar":"تاريخ الاستبدال الأخيرل"},"field_id":"date_last_replaced","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"text","deleted":false,"calculation":false,"validation":[]},{"name":{"en":"Replaced Meter Reading","ar":"استبدال القراءة متررل"},"field_id":"replaced_meter_reading","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"text","deleted":false,"calculation":false,"validation":[]}]},{"name":{"en":"Warranty History","ar":"تاريخ الضمان"},"fields":[{"name":{"en":"warranty Starts","ar":"يبدأ الضمان"},"field_id":"warranty_start_date","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"text","deleted":false,"calculation":false,"validation":[]},{"name":{"en":"warranty Ends","ar":"الضمان ينتهي"},"field_id":"warranty_end_date","sort_order":0,"is_system_column":false,"input_languages":["en","ar"],"data_type":"text","deleted":false,"calculation":false,"validation":[]}]}]}}');
	groups: any;
	dialogTitle: string;

	@ViewChild(DynamicReactiveFormComponent, { static: false }) form: DynamicReactiveFormComponent;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DynamicReactiveFormDialogComponent>,
		public globalVars: GlobalVariables,
		private fb: FormBuilder,
		private sharedService: SharedService,
		private  dynamicService: DynamicService,
		private moduleDataService: ModuleDataService) {
		this.dialogForm = this.fb.group({
			role: ['']
		});
	}

	ngOnInit() {
		let typeId = this.sharedService.itemTypeId;
		this.dialoagFormData =  this.sharedService.detachObject(this.moduleDataService.getDialogTemplate(typeId, this.data.field.dialog));
		this.setDataValues(this.dialoagFormData );
		this.dialogTitle = this.dialoagFormData.title[this.globalVars.LNG];
		this.groups = this.dialoagFormData.groups;

	}

	setDataValues(dialoagFormData: any) {
		dialoagFormData.groups.forEach(group => {
		 	group.fields.forEach(field => {
				this.data.field.dialog_inputs.forEach(element => {
					// let control = this.dynamicService.findFormGroup(this.data.allFormGroups, element);
					this.data.allFormGroups.forEach(formvalue => {
						if(formvalue[element] != null && field.col == element){
							field.value = formvalue[element];
						}
					});
					// let control = this.data.formGroup.controls[element]
					// if (control != undefined) {
						
					// }
				});
			
			});
		});
	}


	@Output() ifDirtyValues: EventEmitter<any> = new EventEmitter();
	checkIsFormDirty(val) {
		this.ifDirtyValues.emit(val);
	}



	/**
	 * Updates item and emits submitted event to close drawer after successful response
	 */
	eventSubmitted() {
		let formObject = this.form.getFlatObject(); //this.getObject(this.form.formGroups);
		formObject['action'] = true;
		this.dialogRef.close(formObject);
	}


	

	onYesClick(str): void {
		this.dialogRef.close({ action: true });
		console.log('onYesClick');
	}

	onNoClick(str) {
		this.dialogRef.close({ action: false });
		console.log('onNoClick');
	}


}
