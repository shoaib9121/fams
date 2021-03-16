import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, ApplicationRef, ChangeDetectorRef,} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormArray} from '@angular/forms';
import {FieldConfig} from '../shared';
import {DataService} from 'src/app/shared/service/data.service';
import {GlobalVariables} from 'src/app/global-variables.service';
import {InputComponent} from '../input/input.component';
import {ModuleDataService} from 'src/app/modules/ops/components/user/module-data/module-data.service';
import {DynamicMultiGroupFormComponent} from "../dynamic-multi-group-reactive-form/dynamic-multi-group-form.component";
import { SharedService } from '../shared/shared.service';
import { DynamicService } from '../shared/dynamic.service';
import { AttachmentsService } from "../attachments/attachments.service";
import { FormulaService } from '../shared/formula.service';

@Component({
	selector: 'app-reactive-dynamic-form',
	templateUrl: './dynamic-reactive-form.component.html',
	styleUrls: ['./dynamic-reactive-form.component.scss'],
})
export class DynamicReactiveFormComponent implements OnInit, AfterViewInit {
	@Input() fields: FieldConfig[] = [];
	@Input() groups: any;
	// @Input() showProcessFlowDiagram: any;
	@Input() isEdit: boolean = false;
	@Input() typeId: boolean = false;
	@Input() multiGroups: any;
	@Output() checkIsFormDirty: EventEmitter<any> = new EventEmitter<any>();
	@Output() submit: EventEmitter<any> = new EventEmitter<any>();
	@ViewChild(InputComponent, {static: false}) inputForm: InputComponent;
	@ViewChild(DynamicMultiGroupFormComponent, {static: false}) multiForms: DynamicMultiGroupFormComponent;

	formGroups: FormArray;
	lng: string;
	isShow: boolean;
	
	constructor(
		private fb: FormBuilder,
		private dataService: DataService,
		public globalVariables: GlobalVariables,
		private applicationref: ApplicationRef,
		private moduleDataService: ModuleDataService,
		private dynamicService: DynamicService,
		public attachmentsService: AttachmentsService,
		private formulaService : FormulaService,
		private cd: ChangeDetectorRef
	) {
		if (this.isEdit) {
			this.isShow = false;
		}
	}
	
	ngOnInit() {
		this.lng = this.globalVariables.LNG;
		if (this.isEdit) {
			this.dataService.editFields.subscribe(data => {
				this.groups = data;
				this.formGroups = new FormArray(this.createControl());
				this.isShow = true;
				if (this.groups) {
					// this.multiGroups = this.moduleDataService.getMultiGroups(+this.typeId);//this.groups[0].multiGroups;
				}
				this.dynamicService.allFormGroups = this.formGroups;
				this.dynamicService.rootFormValue = this.formGroups.value;

				setTimeout(() => {
					this.checkOptionalFields();
				}, 100);
			});
		} else {
			this.formGroups = new FormArray(this.createControl());
			this.dynamicService.allFormGroups = this.formGroups;
			this.dynamicService.rootFormValue = this.formGroups.value;
		}



		// this.showProcessFlowDiagram = true;
	}

	checkOptionalFields() {
		this.groups.forEach((group, index) => {
			if (group.optional && group.frontend_is_checked == false) {
				this.disableFormGroup(group, this.formGroups.controls[index], true);
			}
			if (group.subGroups) {
				group.subGroups.forEach((subGroup, subindex) => {
					let subFormGroupName = this.dynamicService.getSubFromGroupName(subGroup.groupName);
					let formControl = this.formGroups ? this.formGroups.controls[index]["controls"][subFormGroupName] : undefined;
					if (formControl) {
						if ((group.optional && group.frontend_is_checked == false) || (subGroup.optional && subGroup.frontend_is_checked == false)) {
							this.disableFormGroup(subGroup, formControl, true);
						}
					}
				});
			}

		});
	}

	ngAfterViewInit() {
		if (!this.isEdit) {
			this.checkOptionalFields();
		}
		 this.cd.detectChanges();
	}
	
	createControl(): Array<any> {
		let fGroup = [];
		
		this.groups.forEach((groupValue, index) => {
			if(groupValue.optional){
				groupValue.frontend_is_checked = false;
			}
			// if we have subGroup elements we modify the subGroups by adding an isChild key -> helps us with placement for checkbox
			if (groupValue.subGroups !== undefined) {
				groupValue.subGroups.forEach((childGroup, index) => {
					childGroup.isChild = true;
					if (childGroup.optional) {
						childGroup.frontend_is_checked = false;
					}
					childGroup.fields.forEach((formField, index) => {
						if (childGroup.optional && formField.value != "" && formField.value != null) {
							childGroup.isEnable = true;
							childGroup.frontend_is_checked = true;
							if (groupValue.optional) {
								if (!groupValue.frontend_is_checked) {
									childGroup.isEnable = false;
									childGroup.frontend_is_checked = false;
								}
							}
						}

						formField.originalUpdate = formField.update;
						if (formField.type == 'select') {
						}
					});
				});
			}
			
			let formGroup = new FormGroup({});
			
			if (groupValue.fields != undefined) {
				groupValue.fields.forEach((field, fieldIndex) => {
					if (groupValue.optional && field.value != "" && field.value != null) {
						groupValue.isEnable = true;
						groupValue.frontend_is_checked = true;
					}
					const control = this.fb.control(
						{
							value: field.value,
							disabled: !field.update || (field.default_value_editable === false)
						},
						this.bindValidations(field.validations || [])
					);
					control.valueChanges.subscribe(val => {
						this.checkValueChanges(true);
					});
					formGroup.addControl(field.col, control);
				});
			}
			if (groupValue.subGroups != undefined) {
				groupValue.subGroups.forEach((subgroup, fieldIndex) => {
				
					//#endregion
					let subFormGroup = new FormGroup({});
					subgroup.fields.forEach((field, fieldIndex) => {
						const control = this.fb.control(
							{
								value: field.value,
								disabled: !field.update || (field.default_value_editable === false)
							},
							this.bindValidations(field.validations || [])
						);
						control.valueChanges.subscribe(val => {
							this.checkValueChanges(true);
						});

						// sub_group : this.fb.group(
						//  controlsConfig:{
						// 	control
						// })
						subFormGroup.addControl(field.col, control);
					});
					let subFormGroupName = this.dynamicService.getSubFromGroupName(subgroup.groupName);
					formGroup.addControl(subFormGroupName, subFormGroup);
				});
			}
			formGroup['group_name'] = index;
			fGroup.push(formGroup);
		});
		return fGroup;
		//see comment1
		
	}
	
	checkValueChanges(val) {
		this.checkIsFormDirty.emit(val);
		this.dynamicService.rootFormValue = this.formGroups;
	}
	
	/**
	 * Bind validation to field
	 *
	 */
	bindValidations(validations: any) {
		if (validations.length > 0) {
			const validList = [];
			validations.forEach(valid => {
				switch (valid.name) {
					case 'required':
						validList.push(Validators.required);
						break;
					case 'pattern':
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
	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			control.markAsTouched({onlySelf: true});
		});
	}
	
	/**
	 * Enable/Disable through checkbox of subgroup
	 *
	 */
	updateSubGroup(group, formGroup, event, i) {
		group.fields.forEach((formField, index) => {
			group.isEnable = event.checked;
			formField.isChild = false;
		});
		let subFormGroupName = this.dynamicService.getSubFromGroupName(group.groupName);
		group.frontend_is_checked = event.checked;
		formGroup = formGroup.controls[subFormGroupName]
		this.disableFormGroup(group, formGroup, !event.checked);
		this.validateAllFormFields(formGroup);
		this.applicationref.tick();
		if (!event.checked) {
			this.emptyGroupValueOnUnCheck(group,formGroup );
			this.formulaService.manageFormula(this.groups, this.formGroups);
		}
	}
	
	/**
	 * Enable/Disable through checkbox of subgroup
	 *
	 */
	updateGroup(group, formGroup, event, i) {
		group.isEnable = event.checked;
		this.disableFormGroup(group, formGroup, !event.checked);
		group.frontend_is_checked = event.checked;
		this.validateAllFormFields(formGroup);

		if (!event.checked) {
			this.emptyGroupValueOnUnCheck(group,formGroup );
		}

		if (group.subGroups && event.checked == false) {
			group.subGroups.forEach(subGroup => {
				if (subGroup.isEnable && subGroup.isEnable == true) {
					subGroup.isEnable = false
					subGroup.frontend_is_checked = false;
					let subFormGroupsubGroup = formGroup.controls[this.dynamicService.getSubFromGroupName(subGroup.groupName)];
					this.disableFormGroup(subGroup, subFormGroupsubGroup, true);
				}
				if (!event.checked) {
					let subFormGroupsubGroup = formGroup.controls[this.dynamicService.getSubFromGroupName(subGroup.groupName)];
					this.emptyGroupValueOnUnCheck(subGroup,subFormGroupsubGroup );
				}
			});
		}
	}

	emptyGroupValueOnUnCheck(group, formGroup) {
		group.fields.forEach(field => {
			let controlField = formGroup.controls[field.col];
			if (controlField != null && controlField != "") {
				controlField.setValue("");
				controlField.markAsDirty();
			}
		});
	}

	/**
	 * Converting mutiple objects into one
	 *
	 */
	getFlattenObject() {
		const value = this.formGroups.value;
		let formArray = value.reduce(function(result, current) {
			return Object.assign(result, current);
		}, {});
		
		return formArray;
	}

	disableFormGroup(group, formGroup, disable) {
		let controls = Object.keys(formGroup.controls);
		for (let j = 0; j < controls.length; j++) {
			let field = group.fields.find(x => x.col == controls[j]);
			if (field && field.update) {
				let formGroupName = controls[j];
				if (disable) {
					formGroup.controls[formGroupName].disable();
				} else {
					formGroup.controls[formGroupName].enable();
				}
				if (field.inputType != 'text') {
					this.dataService.eventFillFormDefaultValues(formGroupName, null, null, disable);
				}
			}
		}
	}


	/**
	 * Checking changes values of the form to send them to form
	 *
	 */
	public getDirtyValues(moduleStatuses) {
		const dirtyValues = {};
		let currentControl;
		this.formGroups.controls.forEach((cg, index) => {
			Object.keys(cg["controls"]).forEach((c, subIndex) => {
				currentControl = cg.get(c);
				let statusName;
				if (c == "status") {
					statusName = moduleStatuses.find(x => x.id == currentControl.value).name['en'];
					if (statusName == "On Hold") {
						dirtyValues["on_hold"] = true;
					} else {
						if (currentControl.dirty) {
							dirtyValues["on_hold"] = false;
						}
					}
				}
				const isDefault = this.checkDefaultValue(this.groups, index, c);
				if ((currentControl.dirty || isDefault) && !currentControl.controls && statusName != "On Hold") {
					dirtyValues[c] = currentControl.value;
				}
				if (currentControl.controls) {
					this.subGroupsField(currentControl, dirtyValues, true, this.groups[index].subGroups);
				}
			});
		});
		return dirtyValues;
	}


	checkDefaultValue(groups, index, c,subFormGroupName?) {
		let isDefault = false;
		if (subFormGroupName) {
			for (let i = 0; i < subFormGroupName.length; i++) {
				const subGroups = subFormGroupName[i];
				const field = subGroups.fields? subGroups.fields.find(x => x.col == c) : undefined;
				if (field && field.isDefault) {
					isDefault = true;
					break;
				}
			}
		} else {
			const field = groups[index].fields? groups[index].fields.find(x => x.col == c): undefined;
			if (field && field.isDefault) {
				isDefault = true;
			}
		}
		return isDefault;
	}

	subGroupsField(formControl, dirtyValues, frontendIsChecked, subGroup) {
		let controls = Object.keys(formControl.controls);
		for (let j = 0; j < controls.length; j++) {
			let subFormGroupName = controls[j];
				const isDefault = this.checkDefaultValue(subGroup, j, subFormGroupName,subGroup);
				if ((formControl.controls[subFormGroupName].dirty || isDefault) && frontendIsChecked) {
				dirtyValues[subFormGroupName] = formControl.controls[subFormGroupName].value;
			}
		}
	}
	

	getFlatObject() {
		let currentControl: any;
		const flatObject = {};
		let frontendIsChecked ;
		this.formGroups.controls.forEach((cg, index) => {
			frontendIsChecked = false
			if (this.groups[index].optional) {
				if (this.groups[index].frontend_is_checked) {
					frontendIsChecked = true;
				}
			} else {
				frontendIsChecked = true;
			}
			Object.keys(cg["controls"]).forEach((c, subIndex) => {
				currentControl = cg.get(c);
				if (!currentControl.controls) {
					let field = this.groups[index].fields.find(x => x.col == c);
					if (field && field.update && frontendIsChecked) {
						flatObject[c] = currentControl.value;
					} else {
						flatObject[c] = "";
					}
					// flatObject[c] = currentControl.value;
				} else if (currentControl.controls) {
					let controls = Object.keys(currentControl.controls);
					this.groups[index].subGroups.forEach(subGroup => {
						for (let j = 0; j < controls.length; j++) {
							let subFrontendIsChecked = false;
							if (subGroup && subGroup.optional) {
								if (subGroup.frontend_is_checked) {
									subFrontendIsChecked = true;
								}
							} else {
								subFrontendIsChecked = true;
							}
							let subControlName = controls[j];
							let subField = subGroup ? subGroup.fields.find(x => x.col == subControlName) : undefined;
							if (subField && subField.update && frontendIsChecked && subFrontendIsChecked) {
								flatObject[subControlName] = currentControl.value[subControlName];
							} 

							// flatObject[subControlName] = currentControl.value[subControlName];
						}
					});

				}
			});
		});
		return flatObject;

	}

}


/* comment1
 const group = this.fb.group({});
 this.fields.forEach(field => {
   if (field.type === "actionButton")
   {

     return;
   }
   const control = this.fb.control(
     field.value,
     this.bindValidations(field.validations || [])
   );
   group.addControl(field.name, control);
 });
 return group;*/
