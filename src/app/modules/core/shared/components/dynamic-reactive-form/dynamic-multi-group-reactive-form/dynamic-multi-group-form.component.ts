import { Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, ApplicationRef, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { FieldConfig } from "../shared";
import { DataService } from "src/app/shared/service/data.service";
import { GlobalVariables } from "src/app/global-variables.service";
import { InputComponent } from "../input/input.component";
import { ModuleDataService } from "src/app/modules/ops/components/user/module-data/module-data.service";
import { group } from "@angular/animations";
import { UserService } from 'src/app/modules/ops/components/user/user.service';

@Component({
	selector: "app-multi-group-dynamic-form",
	templateUrl: "./dynamic-multi-group-form.component.html",
	styleUrls: ["./dynamic-multi-group-form.component.scss"],
})
export class DynamicMultiGroupFormComponent implements OnInit {
	@Input() fields: FieldConfig[] = [];
	@Input() groups: any;
	@Input() isEdit: boolean = false;
	@Output() checkIsFormDirty: EventEmitter<any> = new EventEmitter<any>();
	@Output() submit: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild(InputComponent, {static: false}) inputForm: InputComponent;
	
	formGroups: FormArray;
	lng: string;
	isShow: boolean;
	multiGroupData: any;
	
	constructor (
		private fb: FormBuilder,
		private dataService: DataService,
		public globalVariables: GlobalVariables,
		private applicationref: ApplicationRef,
		private moduleDataService: ModuleDataService,
		private userService: UserService,
		private cd: ChangeDetectorRef

	) {
		if (this.isEdit) {
			this.isShow = false;
		}
		
		this.formGroups = new FormArray([]);
	}
	
	ngOnInit () {
		this.lng = this.globalVariables.LNG;
		this.multiGroupData = JSON.parse(JSON.stringify(this.groups));
		this.checkTableObject();
		this.groups = [];
		// if (this.isEdit) {
		if (true) {
			// TODO: subcribe to different service
			this.dataService.multiEditFields.subscribe(data => {
				/*this.groups = data;
				this.formGroups = new FormArray(this.generateFormArray());
				this.isShow = true;*/
				// this.cd.detectChanges();
				
				if (data.isChecked) {
					this.addFormGroup(data);
				} else if (data.isChecked == false) {
					this.removeFormGroup(data.id);
				} else {
					this.groups = data;
					this.formGroups = new FormArray(this.generateFormArray());
					this.isShow = true;
				}
			});
		} else {
			this.formGroups = new FormArray(this.generateFormArray());
		}
		
		// this.issueDetail();
	}
	checkTableObject() {
		// this.multiGroupData.forEach(element => {
		// 	element.fields.forEach(field => {
		// 		if (field.type == "table_object") {
		// 			field.columns = field.columns.map((columnField) => this.userService.transformToFormField(columnField, false));
		// 		}
		// 	});
			
		// });
			

	}
	
	issueDetail () {
		this.dataService.multiIssues.subscribe(data => {
			console.log(data);
			if (data.isChecked) {
				this.addFormGroup(data);
			} else {
				this.removeFormGroup(data);
			}
		});
	}
	
	removeFormGroup (id) {
		let index = this.formGroups.controls.findIndex(x => x["group_name"] == id);
		if (index > -1) {
			this.formGroups.removeAt(index);
		}
	}
	
	
	removeGroup (i: number, formGroup: any) {
		this.formGroups.removeAt(i);
		this.dataService.multiGroupsData.emit(formGroup);
	}
	
	// region generating form array
	addFormGroup (data?) {
		if (this.multiGroupData && this.multiGroupData.length > 0) {
			let newGroups = JSON.parse(JSON.stringify(this.multiGroupData));
			let fGroup = [];

			newGroups.forEach((groupValue) => {
				if (data) {
					groupValue.frontend_id = data.content.values.id;
					groupValue.fields.forEach(field => {
						if (data.content.values[field.col] !== undefined) {
							field.value = data.content.values[field.col];
						}
					});


				}
				groupValue = this.checkForSubGroup(groupValue);
				this.groups.push(groupValue);
				let newFormGroup = this.generateFormGroup(groupValue);
				if (!data)
					newFormGroup.addControl("frontend_is_new", this.fb.control(true)); // marking it as new
				if (data) {
					newFormGroup["group_name"] = data.content.id;
				}

				this.formGroups.push(newFormGroup);
				// this.cd.detectChanges();

			});
			
			// fGroup.forEach(formGroup => this.formGroups.push(formGroup));
			// this.formGroups.controls.concat(fGroup);// TODO Not sure if working
		}
	}
	
	generateFormArray (isAddFromGroup?): Array<any> {
		let fGroup = [];
		
		this.groups.forEach((groupValue, index) => {
			groupValue = this.checkForSubGroup(groupValue);
			fGroup.push(this.generateFormGroup(groupValue));
		});
		
		return fGroup;
	}
	
	/**
	 * if we have subGroup elements we modify the subGroups by adding an isChild key -> helps us with placement for checkbox
	 *
	 * @param groupValue
	 */
	private checkForSubGroup (groupValue) {
		if (groupValue.subGroups !== undefined) {
			groupValue.subGroups.forEach((childGroup, index) => {
				childGroup.isChild = true;
				
				childGroup.fields.forEach((formField, index) => {
					if (childGroup.optional && formField.value != "" && formField.value != null) {
						childGroup.isEnable = true;
					}
					formField.originalUpdate = formField.update;
					if (formField.type == "select") {
					}
				});
			});
		}
		
		return groupValue;
	}
	
	private generateFormGroup (groupValue) {
		let formGroup = new FormGroup({});
		
		formGroup.addControl("type_id", this.fb.control(groupValue.type_id));
		formGroup.addControl("frontend_meta_data", this.fb.group({
			"linkedKey": groupValue.linked_key,
			"moduleId": groupValue.module_id,
			"frontend_id": groupValue.hasOwnProperty("frontend_id") ? groupValue.frontend_id : undefined
		}));
		// Used for updating, where we need the id
		
		
		if (groupValue.fields != undefined) {
			groupValue.fields.forEach((field, fieldIndex) => {
				if (groupValue.optional && field.value != "" && field.value != null) {
					groupValue.isEnable = true;
				}
				
				if (field.col == "status" && field.value == "" || field.value == null) {
					field.value = 0;
					field.options = [this.moduleDataService.modules[groupValue.module_id].columns.module_statuses[0]];
				} else if (field.col == "status" && field.value > 0 && (!field.options || !field.options.length)) {
					field.options = [this.moduleDataService.modules[groupValue.module_id].columns.module_statuses[field.value]];
				}
				
				formGroup.addControl(field.col, this.generateFormControl(field));
			});
		}
		if (groupValue.subGroups != undefined) {
			groupValue.subGroups.forEach((subGroup, fieldIndex) => {
				subGroup.fields.forEach((field, fieldIndex) => {
					formGroup.addControl(field.col, this.generateFormControl(field));
				});
				
			});
		}
		
		return formGroup;
	}
	
	/**
	 * Generates a form control from provided {@param field}
	 *
	 * @param field
	 */
	private generateFormControl (field: FieldConfig) {
		const control = this.fb.control(
			{
				value: field.value,
				disabled: !field.update
			},
			this.bindValidations(field.validations || [])
		);
		control.valueChanges.subscribe(val => {
			this.markAsDirty(true);
		});
		return control;
	}
	
	// endregion
	
	/**
	 * Emits event that control is dirty now
	 *
	 * @param val
	 */
	markAsDirty (val) {
		this.checkIsFormDirty.emit(val);
	}
	
	/**
	 * Bind validation to field
	 *
	 */
	bindValidations (validations: any) {
		if (validations.length > 0) {
			const validList = [];
			validations.forEach(valid => {
				switch (valid.name) {
					case "required":
						validList.push(Validators.required);
						break;
					case "pattern":
						validList.push(Validators.pattern(valid.validator));
						break;
					default:
						
						break;
				}
			});
			return Validators.compose(validList);
		}
		return null;
	}
	
	/**
	 * Bind validation to field
	 *
	 */
	validateAllFormFields (formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			control.markAsTouched({onlySelf: true});
		});
	}
	
	/**
	 * Enable/Disable through checkbox of subgroup
	 */
	updateSubGroup (group, formGroup, event, i) {
		group.fields.forEach((formField, index) => {
			group.isEnable = event.checked;
			formField.isChild = false;
		});
		this.validateAllFormFields(formGroup);
		this.applicationref.tick();
	}
	
	/**
	 * Enable/Disable through checkbox of subgroup
	 *
	 */
	updateGroup (group, formGroup, event, i) {
		group.isEnable = event.checked;
		this.validateAllFormFields(formGroup);
	}
	
	/**
	 * Transforms and returns value of form array in format for sending to backend
	 */
	getFormValue () {
		let value = [];
		// TODO: If sub_groups -> whole object has to be flattened
		this.formGroups.controls.forEach(group => {
			let groupValue = group.value;
			let linkedKey = groupValue.frontend_meta_data.linkedKey;
			let moduleId = groupValue.frontend_meta_data.moduleId;
			
			let valueToPush: any = {
				linkedKey: linkedKey,
				// moduleId: (groupValue.frontend_is_new || !this.isEdit) ? moduleId : undefined,
				moduleId: (groupValue.frontend_is_new) ? moduleId : undefined,
			};
			
			if (groupValue.frontend_meta_data.frontend_id) {
				valueToPush.id = groupValue.frontend_meta_data.frontend_id;
			}
			
			let isNew = groupValue.frontend_is_new;
			delete groupValue.frontend_is_new;
			delete groupValue.frontend_is_new;
			delete groupValue.frontend_meta_data;
			
			// TODO: Add get dirty values if record is not new
			valueToPush.value = groupValue;
			
			value.push(valueToPush);
		});
		
		return value;
	}
	
	/**
	 * Checking changes values of the form to send them to form
	 *
	 */
	public getDirtyValues () {
		const dirtyValues = {};
		this.formGroups.controls.forEach(cg => {
			Object.keys(cg["controls"]).forEach(c => {
				const currentControl = cg.get(c);
				let statusName;
				if (c == "status") {
					statusName = this.moduleDataService.moduleStatuses.find(x => x && x.id == currentControl.value).name["en"];
					if (statusName == "On Hold") {
						dirtyValues["on_hold"] = true;
					} else {
						if (currentControl.dirty) {
							dirtyValues["on_hold"] = false;
						}
					}
				}
				if (currentControl.dirty && statusName != "On Hold") {
					dirtyValues[c] = currentControl.value;
				}
			});
		});
		return dirtyValues;
	}
	
	/**
	 * Converting mutiple objects into one
	 *
	 */
	getFlattenObject () {
		const value = this.formGroups.value;
		let formArray = value.reduce(function (result, current) {
			return Object.assign(result, current);
		}, {});
		
		return formArray;
	}
}
