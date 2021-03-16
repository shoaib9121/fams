import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {GlobalVariables} from "../../../../../../global-variables.service";
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatSidenav, MatStepper} from "@angular/material";
import {ModuleDefinitionService} from "./module-definition.service";
import {Observable, of, timer} from "rxjs";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {SnackbarService} from "../../../../../core/shared/services/snackbar/snackbar.service";
import {map, startWith} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {TableWidget} from "../../../../../core/shared/widgets/table-widget/table.widget";

@Component({
	selector: 'app-module-definition',
	templateUrl: './module-definition.component.html',
	styleUrls: ['./module-definition.component.scss'],
})
export class ModuleDefinitionComponent implements OnInit {
	public rootForm: FormGroup;
	public fieldTypeOptions: string[];
	public referenceModules: any[];
	public referenceModuleValues: object;
	public defaultFieldColumns: string[] = ["name", "field_id", "sort_order", "is_system_column", "input_languages", "data_type", "deleted", "calculation"];
	public defaultFieldValue: any = {
		input_languages: ["en", "ar"],
		sort_order: 0,
		is_system_column: false,
		deleted: false,
		calculation: false,
		validation: [],
	};
	public defaultValidationTypes: any[] = ["required", "pattern"];
	public userRoles: any[];
	public moduleFieldsList: any[] = [];
	public moduleFieldsListCopy: any[] = [];
	public separatorKeysCodes: number[] = [ENTER, COMMA];
	public statusList: any[] = [];
	public isLinear = false;
	public isInTranslationMode: boolean;
	public moduleDefinitionCopy: any;
	
	/**
	 * Decides whether module is being edited or created
	 */
	public IS_EDIT: boolean;
	@ViewChild("stepper", {static: false}) stepper: MatStepper;
	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	@ViewChild("tableWidget", {static: false}) tableWidget: TableWidget;
	@Input() moduleId: number;
	moduleFieldSearchCtrl: FormControl;
	moduleFieldsListOptions$: Observable<string[]>;
	public drawerTitle: string;
	
	constructor(private formBuilder: FormBuilder, public moduleService: ModuleDefinitionService, public globals: GlobalVariables, private snackbarService: SnackbarService, private ngxSpinner: NgxSpinnerService) {
		this.fieldTypeOptions = ["text", "module-reference", "date", "list", "table", "status", "auto-increment", "name-object", "textarea"];
		this.referenceModules = [];
		this.referenceModuleValues = {};
		this.moduleFieldSearchCtrl = new FormControl();
		this.drawerTitle = this.globals.translation["Create New Module"][this.globals.LNG];
		this.isInTranslationMode = true;
	}
	
	ngOnInit() {
		// this.moduleId = 69;
		
		this.initRootFormStructure();
		this.fetchModuleList();
		this.fetchUserRoles();
		
		this.moduleFieldsListOptions$ = this.moduleFieldSearchCtrl.valueChanges
		.pipe(
			startWith(""),
			map(value => this.filterModuleFieldSearch(value))
		);
	}
	
	openDrawer(row?) {
		this.stepper.reset();
		if (row && row.systemModule) {
			this.snackbarService.open(this.globals.translation["System Modules cannot be edited"][this.globals.LNG], null, 4000);
		} else if (row) {
			this.drawer.toggle().then((data) => {
				this.stepper.reset();
				this.initRootFormStructure();
				this.drawerTitle = this.globals.translation["Update Module"][this.globals.LNG] + " / " + row["name_" + (this.globals.LNG == "en" ? "english" : "arabic")][1];
				this.moduleId = row.id;
				this.IS_EDIT = true;
				this.initEditState();
			});
		} else {
			this.drawerTitle = this.globals.translation["Create New Module"][this.globals.LNG];
			this.ngxSpinner.show("module-definition");
			this.drawer.toggle().then((data) => {
				this.stepper.reset();
				this.initRootFormStructure();
				
				this.ngxSpinner.hide("module-definition");
			});
		}
	}
	
	cancelDrawer() {
		this.drawer.toggle();
		this.stepper.reset();
		this.drawerTitle = this.globals.translation["Create New Module"][this.globals.LNG];
		this.rootForm = null;
		this.initRootFormStructure();
	}
	
	disableIfInvalid(selectedIndex) {
		switch (selectedIndex) {
			case 0:
				return this.rootForm.get("name").valid && this.rootForm.get("nameArabic").valid;
			
			default:
				return true;
		}
	}
	
	// region table view
	
	public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
		statusInfoNChanges?: object,
		typeStructure: object,
		configuration: object
	};
	
	/**
	 * Creates Table Structure
	 *
	 * @param dataContent
	 */
	createTableStructure(dataContent) {
		let typeStructure = {
			0: [
				{
					type: "group",
					field_id: "name_english",
					name: this.globals.translation["Module Name"],
					front_end_type: [{type: "text", newline: false}, {type: "text", newline: false}]
				},
				{
					type: "single",
					field_id: "name_arabic",
					name: this.globals.translation["Module Name Arabic"]
				},
				{
					type: "single",
					field_id: "notes",
					name: this.globals.translation["Notes"]
				}
			]
		};
		
		let tableData = [];
		dataContent.forEach(module => {
			tableData.push({
				id: module.id,
				type_id: 0,
				name_english: [module.id, module.name],
				name_arabic: module.nameArabic,
				systemModule: module.systemModule,
				notes: module.notes,
			});
		});
		
		let group = tableData.reduce((r, a) => {
			r[a.systemModule] = [...r[a.systemModule] || [], a];
			return r;
		}, {});
		console.log("group", group);
		
		
		this.tableWidgetData = {
			columnStructure: typeStructure[0],
			//data: this.dataSource,
			data: [
				{
					group: {
						name: {
							en: "System Modules",
							ar: "System Modules",
						},
						color: "#64b5f6"
					},
					data: group.true
				},
				{
					group: {
						name: {
							en: "Application Modules",
							ar: "Application Modules",
						},
						color: "#81c784"
					},
					data: group.false
				}
			],
			typeStructure: typeStructure,
			configuration:  {
				globalHeaders: true,
				hasParentChildRelation: false,
				defaultPadding: true,
				showGroupFilter: true,
				haveSearch: false,
				search: {}
			}
		};
		
		timer(0).subscribe(() => {
			this.tableWidget.initTableData();
		})
	}
	
	// endregion
	
	// region Form Component
	
	/**
	 * Sets up form for edit stage
	 */
	initEditState() {
		this.ngxSpinner.show("module-definition")
		this.rootForm.addControl("id", this.formBuilder.control(this.moduleId));
		this.moduleService.fetchModuleDefinition(this.moduleId)
		.subscribe((data) => {
			this.moduleDefinitionCopy = this.setNullsToEmptyStrings(JSON.parse(JSON.stringify(data.content)));
			this.rootForm.patchValue(this.setNullsToEmptyStrings(data.content));
			if (Object.keys(data.content.columns).length == 0) {
			} else {
				
				// Generating & pre-filling fields
				if (data.content.columns.module_fields) {
					data.content.columns.module_fields.forEach((moduleFieldData, moduleFieldIndex) => {
						this.addModuleField();
						let moduleField = this.moduleFields.controls[this.moduleFields.controls.length - 1];
						
						moduleField.patchValue(moduleFieldData);
						
						this.generateTypeFields(moduleField, moduleFieldIndex);
						switch (moduleField.get("data_type").value) {
							case "table":
								moduleFieldData.columns.forEach((column) => {
									this.addColumnToTable(moduleField);
									
								});
								break;
							default:
								break;
						}
						// this.addValidationField(moduleField);
						
						moduleField.patchValue(moduleFieldData);
						
						this.fetchReferenceModuleValues(moduleFieldData.reference_module_id);
						
						moduleField.patchValue(moduleFieldData);
					});
				}
				// Generating & pre-filling types
				if (data.content.columns.module_types) {
					data.content.columns.module_types.forEach((moduleTypeData, moduleTypeIndex) => {
						this.addModuleType();
						let moduleType = this.moduleTypes.controls[this.moduleTypes.controls.length - 1];
						
						moduleTypeData.forms.groups.forEach((group, groupIndex) => {
							// @ts-ignore
							if (groupIndex > 0) {
								this.addTypeFormGroup(moduleType);
							}
							
							if (group.sub_group) {
								group.sub_group.forEach((subGroup, subGroupIndex) => {
									this.syncFields();
									let forms = moduleType.get("forms.groups") as FormArray;
									this.addSubFormGroup(forms.controls[forms.controls.length - 1]);
									forms.controls[forms.controls.length - 1].get("sub_group").patchValue(group.sub_group);
									// @ts-ignore
									// moduleType.get("forms.groups").controls[moduleType.get("forms.groups").length - 1].get("sub_group").controls[moduleType.get("forms.groups").controls[moduleType.get("forms.groups").length - 1].get("sub_group").controls.length - 1].patchValue(subGroup);
								});
							}
						});
						
						// Generating & pre-filling Process Flow
						moduleTypeData.process_flow.forEach((processFlow) => {
							this.addProcessFlow(moduleType);
						});
						
						// Generating & pre-filling status stages
						moduleTypeData.status_stages.forEach((statusStageData, statusStageDataIndex) => {
							if (statusStageDataIndex > 0) {
								this.addStatusStageFormGroup(moduleType);
							}
						});
						
						moduleType.patchValue(moduleTypeData);
					});
				}
				
				// Generating & pre-filling statuses
				if (data.content.columns.module_statuses) {
					data.content.columns.module_statuses.forEach((moduleStatus, moduleStatusIndex) => {
						this.addModuleStatus();
						this.moduleStatuses.controls[this.moduleStatuses.controls.length - 1].patchValue(moduleStatus);
					});
				}
			}
			
			this.rootForm.markAllAsTouched();
			
			timer(500)
				.subscribe((data) => {
					this.ngxSpinner.hide("module-definition")
				});
		});
	}
	
	/**
	 * Initializes Module Definition Structure
	 */
	initRootFormStructure() {
		this.rootForm = this.formBuilder.group({
			"name": ["", Validators.required],
			"nameArabic": ["", Validators.required],
			"notes": "",
			"moduleColumn": "",
			"systemModule": false,
			"showInViewCreation": false,
			"showInColumnReference": false,
			"allowUpdate": true,
			"deleted": false,
			"columns": this.generateFormArrays(["moduleStatus", "moduleField", "moduleType"])
		});
	}
	
	/**
	 * Saves the module definition in the database
	 */
	saveDefinition() {
		// this.ngxSpinner.show("module-definition");
		if (this.isInTranslationMode) {
			// get all language values from
			let moduleDefinitionForm = this.rootForm.value;
			this.moduleDefinitionCopy.name = this.rootForm.value.name;
			this.moduleDefinitionCopy.nameArabic = this.rootForm.value.nameArabic;
			this.moduleDefinitionCopy.notes = this.rootForm.value.notes;
			
			if (this.moduleDefinitionCopy.columns && Object.keys(this.moduleDefinitionCopy.columns).length > 0) {
				// get all fields
				moduleDefinitionForm.columns.moduleField.forEach((moduleField, moduleFieldIndex) => {
					// search for field_id in old form
					let foundField = this.moduleDefinitionCopy.columns.module_fields.find(field => field.field_id == moduleField.field_id);
					if (foundField && moduleField)
						foundField.name = moduleField.name;
				});
				
				// get module types
				moduleDefinitionForm.columns.moduleType.forEach((moduleType, moduleTypeIndex) => {
					// search for field_id in old form
					let foundType = this.moduleDefinitionCopy.columns.module_types.find(type => type.id == moduleType.id);
					foundType.name = moduleType.name;
					
					// groups - here is no id - same index will be used
					moduleType.forms.groups.forEach((formGroup, formGroupIndex) => {
						foundType.forms.groups[formGroupIndex].name = formGroup.name;
						
						// subgroups
						if (moduleType.forms.groups[formGroupIndex].sub_group) {
							moduleType.forms.groups[formGroupIndex].sub_group.forEach((subFormGroup, subFormGroupIndex) => {
								foundType.forms.groups[formGroupIndex].sub_group[subFormGroupIndex].name = subFormGroup.name;
							});
						}
					});
					
					// process flow
					foundType.process_flow = moduleType.process_flow;
					
					// stages
					if (foundType.status_stages && foundType.status_stages.length > 0) {
						moduleType.status_stages.forEach((statusStage, statusStageIndex) => {
							foundType.status_stages[statusStageIndex].name = statusStage.name;
						});
					}
				});
				
				// statuses
				this.moduleDefinitionCopy.columns.module_statuses = moduleDefinitionForm.columns.moduleStatus;
				
				// transform to backend format
				this.moduleDefinitionCopy.columns.moduleField = this.moduleDefinitionCopy.columns.module_fields;
				this.moduleDefinitionCopy.columns.moduleStatus = this.moduleDefinitionCopy.columns.module_statuses;
				this.moduleDefinitionCopy.columns.moduleType = this.moduleDefinitionCopy.columns.module_types;
				delete this.moduleDefinitionCopy.columns.module_fields;
				delete this.moduleDefinitionCopy.columns.module_statuses;
				delete this.moduleDefinitionCopy.columns.module_types;
			}
			
			delete this.moduleDefinitionCopy.type;
			delete this.moduleDefinitionCopy.values;
			
			try {
				window.localStorage.setItem("translation_" + this.moduleDefinitionCopy.name, JSON.stringify(this.moduleDefinitionCopy));
			} catch (exception) {
			}
			
			this.moduleService.putModuleDefinition(this.moduleId, this.moduleDefinitionCopy)
				.subscribe((data) => {
					if (data.status != 200) {
						this.snackbarService.open(this.globals.translation["Saving to local storage"][this.globals.LNG], null, 4000);
					} else {
						this.snackbarService.open(this.globals.translation["Updated successfully"][this.globals.LNG], null, 4000);
					}
					
					this.resetView();
				});
			
			console.log(this.moduleDefinitionCopy);
		} else if (this.IS_EDIT) {
			this.moduleService.putModuleDefinition(this.moduleId, this.rootForm.value)
				.subscribe((data) => {
					this.snackbarService.open(this.globals.translation["Updated successfully"][this.globals.LNG], null, 4000);
					this.resetView();
				});
		} else {
			this.moduleService.postModuleDefinition(this.rootForm.value)
				.subscribe((data) => {
					this.ngxSpinner.hide("module-definition");
					this.snackbarService.open(this.globals.translation["Saved successfully"][this.globals.LNG], null, 4000);
					this.resetView();
				});
		}
	}
	
	/**
	 * Resets View. Hides Spinners
	 */
	resetView() {
		this.ngxSpinner.hide("module-definition");
		this.ngxSpinner.hide("modules");
		if (this.drawer.opened) {
			this.drawer.toggle().then(() => {
				this.moduleDefinitionCopy = null;
				this.initRootFormStructure();
				this.fetchModuleList();
			});
		}
	}
	
	
	// region module statuses
	
	/**
	 * Adds a new status to module statuses and sets its default values
	 */
	addModuleStatus() {
		this.moduleStatuses.push(this.generateFormGroup(["id", "name", "color"]));
		this.moduleStatuses.controls[this.moduleStatuses.controls.length - 1].patchValue({
			id: this.moduleStatuses.controls.length - 1
		});
	}
	
	// endregion
	
	// region module types
	
	/**
	 * Adds a module type to module definition (columns.moduleType)
	 */
	addModuleType() {
		let typeFormGroup = this.generateFormGroup(["id", "name", "icon", "trigger", "trigger_config"]);
		typeFormGroup.addControl("process_flow", this.formBuilder.array([this.generateProcessFlow()]));
		typeFormGroup.addControl("status_stages", this.formBuilder.array([this.generateStatusStageFormGroup()]));
		typeFormGroup.addControl("flow_image", this.generateFormGroup(["en", "ar"], true));
		typeFormGroup.addControl(
			"forms",
			this.formBuilder.group({
				"groups": this.formBuilder.array([this.generateTypeFormGroup()])
			})
		);
		
		typeFormGroup.patchValue({
			id: this.moduleTypes.length,
			trigger: false,
		});
		
		
		this.moduleTypes.push(typeFormGroup);
	}
	
	/**
	 * Adds a new form group to module type
	 *
	 * @param moduleType
	 */
	addTypeFormGroup(moduleType) {
		(moduleType.get("forms.groups") as FormArray).push(this.generateTypeFormGroup());
	}
	
	renderTriggerConfigurationControl(moduleType) {
		if (moduleType.get("trigger").value) {
			moduleType.addControl("trigger_config", this.formBuilder.control("", Validators.required));
		}
	}
	
	/**
	 * Adds a field to fields (used for type creation)
	 *
	 * @param event
	 * @param formGroup
	 * @param input
	 */
	assignFieldToGroup(event: MatAutocompleteSelectedEvent, formGroup: AbstractControl, input: MatAutocompleteTrigger) {
		let fieldIndex = this.moduleFieldsListCopy.findIndex(moduleField => moduleField.field_id == [event.option.value.field_id]);
		formGroup.get("fields").value.push(fieldIndex);
		
		let indexToRemove = this.moduleFieldsList.findIndex(moduleField => moduleField.field_id == event.option.value.field_id);
		if (indexToRemove > -1) {
			this.moduleFieldsList.splice(indexToRemove, 1);
		}
		
		input.writeValue("");
		timer(0).subscribe(() => {
			input.openPanel();
		});
	}
	
	resetArrayValue(formControl: AbstractControl) {
		formControl.setValue([]);
	}
	
	removeField(fieldIndex, formControl: AbstractControl) {
		let foundIndex = formControl.value.findIndex(value => value == fieldIndex);
		if (foundIndex > -1) {
			formControl.value.splice(foundIndex, 1);
			
			let isInModuleFields = this.moduleFieldsList.findIndex(moduleField => moduleField.field_id == this.moduleFieldsListCopy[foundIndex].field_id);
			if (isInModuleFields < 0) {
				this.moduleFieldsList.push(this.moduleFieldsListCopy[foundIndex]);
			}
		}
	}
	
	/**
	 * Generates Form Group used for status stage
	 */
	generateStatusStageFormGroup() {
		let formGroup = this.generateFormGroup(["name", "icon", "statuses"], true);
		formGroup.patchValue({
			statuses: [],
		});
		return formGroup;
	}
	
	/**
	 * Adds status stage group to status_stages array
	 *
	 * @param moduleType
	 */
	addStatusStageFormGroup(moduleType) {
		(moduleType.get("status_stages") as FormArray).push(this.generateStatusStageFormGroup());
	}
	
	/**
	 * Generates Form Group that is for a module_type (forms.groups)
	 */
	generateTypeFormGroup() {
		let formGroup = this.generateFormGroup(["name", "optional", "fields"], true);
		formGroup.patchValue({"fields": [], "optional": false});
		
		return formGroup;
	}
	
	/**
	 * Adds sub form group to its array of its parent form
	 *
	 * @param formGroup
	 */
	addSubFormGroup(formGroup) {
		if (!formGroup.get("sub_group")) {
			formGroup.addControl("sub_group", this.formBuilder.array([this.generateTypeFormGroup()]));
		} else {
			(formGroup.get("sub_group") as FormArray).push(this.generateTypeFormGroup());
		}
	}
	
	/**
	 * Fields that are being used for dropdowns for example
	 */
	syncFields() {
		this.syncModuleFields();
		this.syncModuleStatuses();
	}
	
	/**
	 * Synchronizes all module fields (form control array) with moduleFieldsList.
	 * Used for module type creation
	 */
	syncModuleFields() {
		this.moduleFieldsList = JSON.parse(JSON.stringify(this.rootForm.value.columns.moduleField));
		this.moduleFieldsListCopy = JSON.parse(JSON.stringify(this.rootForm.value.columns.moduleField));
		
		this.moduleFieldsListOptions$ = of(this.moduleFieldsList);
	}
	
	/**
	 * Synchronizes all module statuses
	 */
	syncModuleStatuses() {
		this.statusList = this.rootForm.value.columns.moduleStatus;
	}
	
	/**
	 * Filters {moduleFieldsList} according to user's search string
	 *
	 * @param value
	 */
	filterModuleFieldSearch(value) {
		if (this.moduleFieldsList.length == 0) {
			this.syncFields();
		}
		let filterValue = "";
		try {
			filterValue = (value || "").toLowerCase();
		} catch (exception) {
			return this.moduleFieldsList;
		}
		
		if (filterValue == "") {
			return this.moduleFieldsList;
		}
		
		return this.moduleFieldsList.filter(option => option.field_id.toLowerCase().includes(filterValue));
	}
	
	/**
	 * Sets null values to empty strings
	 *
	 * @param object
	 */
	setNullsToEmptyStrings(object) {
		Object.keys(object).forEach(field => {
			if (object[field] == null) {
				object[field] = "";
			}
		});
		
		return object;
	}
	
	// region process flow
	
	/**
	 * Adds Process Flow to its form array
	 *
	 * @param moduleType
	 */
	addProcessFlow(moduleType) {
		(moduleType.get("process_flow") as FormArray).push(this.generateProcessFlow());
	}
	
	/**
	 * Creates Basic Object Structure
	 */
	generateProcessFlow() {
		let formGroup = this.generateFormGroup(["status", "flow", "roles", "actions"]);
		formGroup.patchValue({
			"flow": [],
			"roles": [],
			"actions": [],
		});
		
		return formGroup;
	}
	
	/**
	 * Adds a role to process flow that is being edited
	 *
	 * @param event
	 * @param processFlow
	 * @param input
	 */
	addRoleToProcessFlow(event: MatAutocompleteSelectedEvent, processFlow: AbstractControl, input: MatAutocompleteTrigger) {
		processFlow.get("roles").value.push(+event.option.value);
		
		input.writeValue("");
		timer(0).subscribe(() => {
			input.openPanel();
		});
	}
	
	/**
	 * Adds a status to status stages of type that is being edited
	 *
	 * @param event
	 * @param statusStage
	 * @param input
	 */
	addStatusToStage(event: MatAutocompleteSelectedEvent, statusStage: AbstractControl, input: MatAutocompleteTrigger) {
		statusStage.get("statuses").value.push(+event.option.value);
		
		input.writeValue("");
		timer(0).subscribe(() => {
			input.openPanel();
		});
	}
	
	/**
	 * Adds a status to process flow that is being edited
	 *
	 * @param event
	 * @param processFlow
	 * @param input
	 */
	addStatusToFlow(event: MatAutocompleteSelectedEvent, processFlow: AbstractControl, input: MatAutocompleteTrigger) {
		processFlow.get("flow").value.push(+event.option.value);
		
		input.writeValue("");
		timer(0).subscribe(() => {
			input.openPanel();
		});
	}
	
	// endregion
	
	// endregion
	
	// region module fields
	
	/**
	 * Adds new Field to module fields and sets its default values
	 */
	addModuleField() {
		let moduleField = this.generateFormGroup(this.defaultFieldColumns, true);
		moduleField.addControl("validation", this.formBuilder.array([this.generateValidationField()]));
		this.moduleFields.push(moduleField);
		this.moduleFields.controls[this.moduleFields.controls.length - 1].patchValue(this.defaultFieldValue);
	}
	
	/**
	 * Creates Form Group needed for validation
	 */
	generateValidationField() {
		return this.formBuilder.group({
			"type": ["", Validators.required],
			"value": ["", Validators.required],
			"message": this.generateFormGroup(["en", "ar"], true),
		});
	}
	
	/**
	 * Adds Validation form group to moduleField
	 *
	 * @param moduleField
	 */
	addValidationField(moduleField) {
		(moduleField.get("validation") as FormArray).push(this.generateValidationField());
	}
	
	/**
	 * Removes a Field
	 *
	 * @param moduleField
	 * @param index
	 */
	removeFormControl(moduleField, index) {
		moduleField.controls.splice(index, 1);
	}
	
	/**
	 * Generates needed fields depending on admin's selection of type
	 *
	 * @param moduleField
	 * @param moduleFieldIndex
	 */
	generateTypeFields(moduleField, moduleFieldIndex) {
		// Render new form elements depending on selected type
		switch (moduleField.controls["data_type"].value) {
			case "module-reference":
				moduleField.addControl("reference_module_id", this.formBuilder.control(''));
				moduleField.addControl("reference_module_values", this.formBuilder.control(""));
				moduleField.addControl("key_show", this.formBuilder.control(''));
				moduleField.patchValue({reference_module_values: []});
				if (moduleField.get("columns")) {
					moduleField.removeControl("columns");
				}
				break;
			
			case "table":
				if (moduleField.get("reference_module_id")) {
					moduleField.removeControl("reference_module_id");
					moduleField.removeControl("reference_module_values");
					moduleField.removeControl("key_show");
				}
				moduleField.addControl("columns", this.formBuilder.array([this.generateTableColumnFormGroup()]));
				break;
			
			default:
				break;
		}
		
	}
	
	/**
	 * Generates a Form Group for table column
	 */
	generateTableColumnFormGroup() {
		let formGroup = this.generateFormGroup(["field_id", "name", "calculation"], true);
		formGroup.patchValue({"calculation": false, "read_only": false});
		return formGroup;
	}
	
	/**
	 * Adds a Form Group to columns array (used for table)
	 *
	 * @param moduleField
	 */
	addColumnToTable(moduleField) {
		(moduleField.get("columns") as FormArray).push(this.generateTableColumnFormGroup());
	}
	
	/**
	 * Renders controls / sets default values if certain validation types are selected
	 *
	 * @param validationField
	 */
	generateValidationFields(validationField) {
		switch (validationField.get("type").value) {
			case "required":
				validationField.get("value").setValue(true);
				validationField.get("message").patchValue(this.globals.translation["This field is required"],);
				break;
			case "pattern":
				validationField.addControl("pattern", this.formBuilder.control(""));
				break;
			default:
				validationField.get("validation").value = [];
				break;
		}
	}
	
	/**
	 * Sets Field field_id automatically when user is creating field name
	 *
	 * @param moduleField
	 */
	updateFieldKey(moduleField) {
		try {
			return moduleField.get('field_id').setValue(moduleField.value.name.en.toLowerCase().split(' ').join('_'));
		} catch (exception) {
			return "";
		}
	}
	
	/**
	 * Adds/Removes Formula Control
	 *
	 * @param moduleField
	 */
	renderFormulaControl(moduleField) {
		if (moduleField.get("calculation").value) {
			moduleField.addControl("formula", this.formBuilder.control("", Validators.required));
		} else {
			// moduleField.removeControl("formula");
		}
	}
	
	// endregion
	
	// region reference module id & values
	
	/**
	 * Fetches Values of selected reference module id
	 * @param referenceModuleId
	 */
	fetchReferenceModuleValues(referenceModuleId) {
		if (!referenceModuleId || this.referenceModuleValues[referenceModuleId]) {
			return;
		}
		this.moduleService.fetchModuleDefinition(referenceModuleId)
		.subscribe((data) => {
			this.referenceModuleValues[referenceModuleId] = data.content.columns.module_fields;
		});
	}
	
	/**
	 * Sets reference module values
	 *
	 * @param event
	 * @param moduleField
	 * @param input
	 */
	setReferenceModuleValue(event: MatAutocompleteSelectedEvent, moduleField: AbstractControl, input: MatAutocompleteTrigger) {
		moduleField.get("reference_module_values").value.push(event.option.value);
		
		input.writeValue("pe");
		timer(0).subscribe(() => {
			input.openPanel();
		});
	}
	
	// endregion
	
	// region generating basic form groups & arrays
	
	/**
	 * Creates Form Group for attributes that have en, ar attributes
	 *
	 */
	generateLNGFormGroup() {
		return this.formBuilder.group({
			"en": ["", Validators.required],
			"ar": ["", Validators.required],
		});
	}
	
	/**
	 * Creates a new form group of {@param formControlNames}
	 * and validates with {@param validations}
	 *
	 * @param formControlNames      - FormControl Names of group that is being created
	 * @param areAllRequired
	 * @param validations
	 */
	generateFormGroup(formControlNames: string[], areAllRequired?: boolean, validations?: string[]) {
		let newFormGroup = this.formBuilder.group({});
		
		formControlNames.forEach((formControlName, index) => {
			if (formControlName == "name") {
				newFormGroup.addControl(
					formControlName, this.generateLNGFormGroup()
				);
			} else {
				newFormGroup.addControl(
					formControlName,
					this.formBuilder.control(
						"",
						areAllRequired ? Validators.required : (validations ? this.bindValidations(validations[index]) : null)
					)
				);
			}
		});
		
		return newFormGroup;
	}
	
	/**
	 * Creates a new form group with empty Form Arrays
	 *
	 * @param formArrayNames
	 */
	generateFormArrays(formArrayNames: string[]) {
		let formGroup = this.formBuilder.group({});
		
		formArrayNames.forEach((formArrayName, index) => {
			formGroup.addControl(
				formArrayName,
				this.formBuilder.array([])
			);
			
		});
		
		return formGroup;
	}
	
	/**
	 * Creates Validations for Form Control
	 *
	 * @param validations
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
	
	// endregion
	
	// endregion
	
	// region API CALLS
	
	/**
	 * Fetches Compact Module List
	 */
	fetchModuleList() {
		this.ngxSpinner.show("modules");
		this.moduleService.fetchModuleList()
		.subscribe((data) => {
			this.referenceModules = data.content;
			this.createTableStructure(data.content);
			this.ngxSpinner.hide("modules");
		});
	}
	
	/**
	 * Fetches User Roles
	 */
	fetchUserRoles() {
		this.moduleService.fetchRoles()
		.subscribe((data) => {
			this.userRoles = data.content;
		});
	}
	
	// endregion
	
	// region GETTERS
	
	get moduleFields() {
		return this.rootForm.controls["columns"].get("moduleField") as FormArray;
	}
	
	get moduleStatuses() {
		return this.rootForm.controls["columns"].get("moduleStatus") as FormArray;
	}
	
	get moduleTypes() {
		return this.rootForm.controls["columns"].get("moduleType") as FormArray;
	}
	
	// endregion
	
	// region helper functions
	
	/**
	 * Returns name of provided user role id
	 *
	 * @param userRoleId
	 */
	getUserRoleDescription(userRoleId) {
		try {
			return this.userRoles.find(role => role.id == userRoleId).name[this.globals.LNG];
		} catch (exception) {
			return userRoleId;
		}
	}
	
	/**
	 * Returns name of provided status id
	 *
	 * @param statusId
	 */
	getStatusName(statusId) {
		try {
			return this.rootForm.get("columns").get("moduleStatus").value.find(status => status.id == statusId).name[this.globals.LNG];
		} catch (exception) {
			return statusId;
		}
	}
	
	convertToJson(formControl) {
		try {
			formControl.setValue(JSON.parse(formControl.value));
		} catch (exception) {
		
		}
	}
	
	logFormState() {
		console.log(this.rootForm.value);
	}
	
	// endregion
	
}
