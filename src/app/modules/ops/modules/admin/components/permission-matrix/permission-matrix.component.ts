import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewChild,
	ViewContainerRef,
	ChangeDetectorRef,
	AfterViewInit,
	Inject
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../../components/user/user.service';
import { PermissionMatrixService } from './permission-matrix.service';
import { GlobalVariables } from 'src/app/global-variables.service';
import { BehaviorSubject } from 'rxjs';
import { AbstractControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import {ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { NameClass } from 'src/app/modules/ops/modules/admin/components/permission-matrix/name.model';
// import { MatSelectFilterModule } from 'mat-select-filter';

@Component({
	selector: 'app-permission-matrix',
	templateUrl: './permission-matrix.component.html',
	styleUrls: ['./permission-matrix.component.scss'],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
	}],
	// encapsulation: ViewEncapsulation.None,
})
export class PermissionMatrixComponent implements OnInit, AfterViewInit {

	
	@ViewChild('container', {static: false, read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
	/**
	 * Emitted when user presses cancel actionButton, indicating that no action should be taken by parent
	 */
	@Input() drawerType: any;
	// @Input() disableNonTranslateActions: boolean;
	@Input() drawerItemRecord: any;
	@Input() translateMode: boolean;
	@Output() cancelled: EventEmitter<any> = new EventEmitter();
	@Output() submitted: EventEmitter<any> = new EventEmitter();
	componentPortal: ComponentPortal<PermissionMatrixComponent>;
	templatePortal: TemplatePortal<any>;

	public viewTitle : { 'en': string; 'ar': string };
	jsonDemo = []


	selectedFields = []
	roleIdPartView: boolean;
	privilagePartView: boolean;
	public moduleId: any
	selectedModule: any
	selectedModuleTypes = []
	public workSpace: string
	public description: string
	moduleFields: any;
	lng: any;
	dataSource = new BehaviorSubject<AbstractControl[]>([]);
	isShowJson: boolean = false;
	permissionMetrix = [];
	permissionMetrixList: any[];
	nameClass:NameClass;
	displayedColumns: string[] = ['field_id', 'options'];
	public selectedTab: number;

	availableStages: any = [];
	availableStatuses: { 'id': number; 'name': { 'en': string; 'ar': string }; 'color': string; }[];
	availableModules: any = [];
	availableWorkspaces: any = [];
	availableModuleTypes: any = [];
	availableFields: any = [];
	availableFieldsStatic: any = [];
	availableFieldsNotConnectedWithModules: any = [];
	availableFieldsWithTableType: any = [];
	availableFieldsConnectedWithModules: any = [];
	availableFieldsConnectedWithModulesUnique: any = [];
	availableFieldTypes: any = [];
	availableIcons: any = [];
	availableFrontendFieldTypes: any = [];
	availableFrontendFieldValueFormats: any = [];
	availableUserRoles: { 'id': string; 'name': NameClass; }[];
	fieldsetFromModule: any = [];

	// basePermissionMatrix: BasePermissionMatrix;
	basePermissionMatrix: any;

	basicForm: FormGroup;
	statusForm: FormGroup;
	loadedModuleTypeAndGroupsForm: FormGroup;
	tableStructureForm: FormGroup;
	groupByForm: FormGroup;
	userRoleForm: FormGroup;
	permissionForm: FormGroup;

	focusedStep: number;
	maxReachStep: number;
	isLinear: boolean = false;
	savedViewPermissionData: any;
	selectedViewUserDataSet: any;
	debugMode: boolean = false;	//if it is true, API calls which will effect in database data will not be triggered
	// translateMode: boolean = false;	//if it is true, it'll hide all fields not related with translates
	// disableNonTranslateActions: boolean = !this.translateMode;	//if it is true, it'll hide all action buttons except of Translate
	disableNonTranslateActions: boolean;	//if it is true, it'll hide all action buttons except of Translate


	constructor(
		private ngxSpinner: NgxSpinnerService,
		private userService: UserService,
		private PermissionMatrixService: PermissionMatrixService,
		public globalVariables: GlobalVariables,
		// private _viewContainerRef: ViewContainerRef,
		private ref: ChangeDetectorRef,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private snackBarService: SnackbarService
	) {
	}

	ngOnInit() {
		this.ngxSpinner.show("permission");
		this.lng = this.globalVariables.LNG;
		this.disableNonTranslateActions = this.translateMode;	//if it is true, it'll hide all action buttons except of Translate

		console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);

		this.basePermissionMatrix = {
			name: {en: null, ar: null},
			description: null,
			workspace: null,
			module: null,
			permission_matrix: [],
			filters: [],
			sort_order: 0,
			is_system_view: null,
			status: null,
			deleted: null,
			icon: null,
		}
		
		this.availableStages = [
			{ name: this.globalVariables.translation['basic_details'], current: true, completed: false, formName: 'basicForm'},
			{ name: this.globalVariables.translation['status_n_other_details'], current: false, completed: false, formName: 'statusForm'},
			{ name: this.globalVariables.translation['types_n_groups'], current: false, completed: false, formName: 'loadedModuleTypeAndGroupsForm'},
			{ name: this.globalVariables.translation['table_structure'], current: false, completed: false, formName: 'tableStructureForm'},
			{ name: this.globalVariables.translation['group_by'], current: false, completed: false, formName: 'groupByForm'},
			{ name: this.globalVariables.translation['permissions'], current: false, completed: false, formName: 'permissionForm'},
			{ name: this.globalVariables.translation['user_roles'], current: false, completed: false, formName: 'userRoleForm'}
		];

		this.availableModules = [
			// { id: 39, name: {en: 'Requests', ar: 'Requests'}}
		];

		this.availableWorkspaces = [
			// { id: 5, name: {en: 'Planning', ar: 'Planning'}}
		];

		this.availableStatuses = [
			// { "id": 0, "name": { "en": "Draft", "ar": "" }, "color": "#9E9E9E" }
		];

		this.availableFields = [
			/*{
			  "name": {
				"en": "Created By",
				"ar": "انشئت من قبل"
			  },
			  "input_languages": [
				"en",
				"ar"
			  ],
			  "field_id": "created_by",
			  "data_type": "module-reference",
			  "reference_module_id": "2",
			  "reference_module_values": [
				"id",
				"name"
			  ],
			  "key_show": "name",
			  "is_system_column": "false",
			  "sort_order": 0
			}*/
		];

		this.availableFieldsStatic = [
			{
				"name": this.globalVariables.translation['ID'],
				"input_languages": [ "en", "ar" ],
				"field_id": "id",
				"data_type": "text",
				"is_system_column": "true",
				"sort_order": 0 
			},
			{
				"name": this.globalVariables.translation['created_by'],
				"input_languages": [ "en", "ar" ],
				"field_id": "created_by",
				"data_type": "text",
				"is_system_column": "true",
				"sort_order": 0 
			},
			{
				"name": this.globalVariables.translation['created_at'],
				"input_languages": [ "en", "ar" ],
				"field_id": "created_at",
				"data_type": "text",
				"is_system_column": "true",
				"sort_order": 0 
			},
			{
				"name": this.globalVariables.translation['updated_at'],
				"input_languages": [ "en", "ar" ],
				"field_id": "updated_at",
				"data_type": "text",
				"is_system_column": "true",
				"sort_order": 0 
			}
		];
		
		this.availableModuleTypes = [
			/*{
				"id": 0,
				"name": {
				  "en": "General Request",
				  "ar": ""
				},
				"icon": "",
				"forms": {
				  "groups": []
				},
				"status_stages": [],
				"process_flow": [],
				"flow_image": {
				  "en": "assets/process_flows/general_request_en.png",
				  "ar": "assets/process_flows/general_request_ar.png"
				}
			}*/
		];

		this.availableFieldTypes = [
			{ id: 1, name: this.globalVariables.translation['field_type__id'], field_id: 'id'},
			{ id: 2, name: this.globalVariables.translation['field_type__status'], field_id: 'status'},
			{ id: 3, name: this.globalVariables.translation['field_type__single'], field_id: 'single'},
			{ id: 4, name: this.globalVariables.translation['field_type__group'], field_id: 'group'},
			{ id: 5, name: this.globalVariables.translation['field_type__module_type_name'], field_id: 'frontend_module_type_name'},
			{ id: 6, name: this.globalVariables.translation['field_type__table'], field_id: 'table'},
			{ id: 7, name: this.globalVariables.translation['field_type__flag'], field_id: 'flag'},
			{ id: 8, name: this.globalVariables.translation['field_type__thumbnail'], field_id: 'thumbnail'}
		];

		this.availableIcons = this.globalVariables.availableIcons;

		this.availableFrontendFieldTypes = [
			{ id: 1, name: this.globalVariables.translation['frontend_field_type__icon'], field_id: 'icon'},
			{ id: 2, name: this.globalVariables.translation['frontend_field_type__chip'], field_id: 'chip'},
			{ id: 3, name: this.globalVariables.translation['frontend_field_type__text'], field_id: 'text'}
		];

		//Value Formats / Piping
		this.availableFrontendFieldValueFormats = [
			{ id: 1, name: this.globalVariables.translation['frontend_filter_type__date'], field_id: 'date'},
			{ id: 2, name: this.globalVariables.translation['frontend_filter_type__scale'], field_id: 'scale'},
			{ id: 3, name: this.globalVariables.translation['frontend_filter_type__number'], field_id: 'number'}
		];

		this.availableUserRoles = [
			// { id: '21', name: {en: 'Admin', ar: 'Admin'}}
		];
		
		this.focusedStep = 1;
		
		this.basicForm = this.createBasicForm();
		this.resetAllSteps();

		this.savedViewPermissionData = {};
		if(this.drawerType == 'edit'){
			this.selectedTab = 0; //viewUserList
			this.viewTitle = { 'en': this.drawerItemRecord.dataset.workspace.name.en+' / '+this.drawerItemRecord.dataset.name.en, 'ar': this.drawerItemRecord.dataset.workspace.name.ar+' / '+this.drawerItemRecord.dataset.name.ar };
		}
		else{
			this.selectedTab = 1; //Form
			// this.viewTitle = { 'en': "Permission Matrix", 'ar': "Permission Matrix" };
			this.viewTitle = this.globalVariables.translation['permission_matrix'];
		}

	}

	ngAfterViewInit() {
		this.componentPortal = new ComponentPortal(PermissionMatrixComponent);
		this.ref.detectChanges();

		// console.log('App ID', this.globalVariables.getCurrentApplicationID());
		//Load WorkSpaces
		// this.PermissionMatrixService.loadAllWorkSpaces(this.globalVariables.getCurrentApplicationID())
		this.PermissionMatrixService.loadAllWorkSpaces()
		.subscribe((data) => {
			this.availableWorkspaces = data.content;
		});

		//Load All Available Modules
		this.PermissionMatrixService.loadAllModules()
			.subscribe((data) => {
				this.availableModules = data.content_modified;
			});

		//Load All Available User Roles
		this.PermissionMatrixService.loadAllUserRoles()
			.subscribe((data) => {
				this.availableUserRoles = data.content;
			});

		this.ngxSpinner.hide("permission");
	}

	loadModuleAttributes(event?: any){

		// console.log('loadModuleAttributes', event);
		setTimeout(() => {
			// console.log(this.basicForm.value.module);
			// this.userService.fetchModuleMatrixData(this.basicForm.value.module)
			this.PermissionMatrixService.fetchModuleDefinitionData(this.basicForm.value.module)
				.subscribe((data) => {
					// console.log(data);
					if( data.content && data.content.columns){
						this.availableStatuses 		= data.content.columns.hasOwnProperty("module_statuses") && Array.isArray(data.content.columns.module_statuses)  ? data.content.columns.module_statuses : [];
						this.availableFields 		= data.content.columns.hasOwnProperty("module_fields") && Array.isArray(data.content.columns.module_fields)  ? data.content.columns.module_fields : [];
						this.availableModuleTypes 	= data.content.columns.hasOwnProperty("module_types") && Array.isArray(data.content.columns.module_types)  ? data.content.columns.module_types : [];

						// if(this.availableFields.length > 0){
							this.availableFields = this.availableFields.concat(this.availableFieldsStatic);

							//Add a STATUS field definition if not defined already and it have some list of statuses
							let statusFieldObject = this.availableFields.find(item => item.field_id == 'status');
							if(this.availableStatuses.length > 0 && typeof statusFieldObject == 'undefined'){
								this.availableFields = this.availableFields.concat({
									"name": {
									  "en": "Status",
									  "ar": "الحالة"
									},
									"input_languages": [
									  "en",
									  "ar"
									],
									"field_id": "status",
									"data_type": "status",
									"is_system_column": "false",
									"sort_order": 0
								  });
							}
						// }
						// console.log('this.availableStatuses', this.availableStatuses)
					}
					this.resetAllSteps();
				});
		}, 1);
		
	}

	resetAllSteps(){
		this.statusForm = this.createStatusForm();
		this.loadedModuleTypeAndGroupsForm = this.createModuleTypeandGroupForm();
		this.tableStructureForm = this.createTableStructure();
		this.groupByForm = this.createGroupByForm();
		this.userRoleForm = this.createUserRoleForm();
		this.permissionForm = this.createPermissionTable();

		this.availableFields.forEach((fieldObj, fieldIndex) => {
			(this.permissionForm.controls['fieldGroups'] as FormArray).push( this.createPermissionTableDefinition(fieldIndex, fieldObj.field_id, fieldObj.name) );
		});

		this.availableFieldsNotConnectedWithModules = this.availableFields.filter(item => !item.hasOwnProperty("data_type") || (item.data_type != 'module-reference'  && item.data_type != 'table'));
		this.availableFieldsWithTableType = this.availableFields.filter(item => item.hasOwnProperty("data_type") && item.data_type == 'table');
		let connectedModules = this.extractConnectedModules();
		// console.log('connectedModules__before', connectedModules);

		this.availableFieldsConnectedWithModules = connectedModules.connectedModulesAll;
		this.availableFieldsConnectedWithModulesUnique = connectedModules.connectedModulesDistincted;
		setTimeout(() => {
			this.getModulesArrayByIds();
		}, 200);
		// console.log('availableFields', this.availableFields);
		// console.log('connectedModules__after', this.availableFieldsConnectedWithModules);
		// console.log('availableFieldsWithTableType', this.availableFieldsWithTableType);

		this.createPermissionMatrix(this.availableFields);
	}


	/*  For Basic Form */
	createBasicForm(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),  
			description : [''],
			// workspace 	: ['', Validators.required],
			workspace 	: [''],
			module 		: ['', Validators.required],
			icon 		: [''],
			filters		: [''],
			sort_order 	: [''],
			is_system_view : ['false'],
			status		: ['true'],
			deleted		: ['false']
		});
	}


	/*  For Status Form */
	createStatusForm(){
		return this.fb.group({
			// statuses_ 	: this.fb.array(['', Validators.required]),
			statuses 		: [[], Validators.required],
			viewModes 		: [[ 
								this.globalVariables.translation['view_mode__list'][this.lng], 
								this.globalVariables.translation['view_mode__board'][this.lng], 
								this.globalVariables.translation['view_mode__dashboard'][this.lng], 
								this.globalVariables.translation['view_mode__calendar'][this.lng]
							]],
			allow_to_add 	: ['true'],
			allow_to_delete : ['false'],
			overview		: [''],
			edit_overview 	: ['']
		});
	}


	/*  For ModuleType & Group Form */
	createModuleTypeandGroupForm(){
		return this.fb.group({
			types 		: [[], Validators.required],
			typeGroups 	: this.fb.array([ this.createModuleTypeGroup() ])
		});
	}
	createModuleTypeGroup(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),  
			icon 		: [''],
			types 		: ['', Validators.required]
		});
	}
	addNewTypeGroup(){
		(this.loadedModuleTypeAndGroupsForm.controls['typeGroups'] as FormArray).push(this.createModuleTypeGroup());
		// (this.loadedModuleTypeAndGroupsForm.get('typeGroups') as FormArray).push(this.createModuleTypeGroup());
	}
	removeTypeGroup(index: number){
		console.log(index);
		(this.loadedModuleTypeAndGroupsForm.controls['typeGroups'] as FormArray).removeAt(index);
	}
	modifyTableStructureFormObject(event: any){
		return false;
		setTimeout(() => {
			this.tableStructureForm = this.createTableStructure();
			// let tmpArray = this.fb.group({});

			this.loadedModuleTypeAndGroupsForm.value.types.forEach((typeObj, typeIndex) => {
				// if(typeIndex == 2) typeObj.icon = 'car';
				(this.tableStructureForm.controls['typeGroups'] as FormArray).push( this.createTableStructureDefinition(typeObj) );
			});
		}, 1);
		
	}
	modifyTableStructureFormObjectAdvanced(event: any){
		// event.source.value - the field_id value
		// event.source.selected - the selection status
		if(!event.isUserInput) {
			// console.log('modifyTableStructureFormObjectAdvanced: isUserInput - false');
			return false;
		}
		// else
		// 	console.log('modifyTableStructureFormObjectAdvanced: isUserInput - true');

		// console.log('modifyTableStructureFormObjectAdvanced', event, event.source.value, event.source.selected);
		setTimeout(() => {

			if(Array.isArray(this.loadedModuleTypeAndGroupsForm.value.types) && this.loadedModuleTypeAndGroupsForm.value.types.length == 0 )
				this.tableStructureForm = this.createTableStructure();
			else{
				//Newly selected
				if(event.source.selected){
					let currectKeyIndex = this.loadedModuleTypeAndGroupsForm.value.types.findIndex(item => item.id == event.source.value.id);
					if(currectKeyIndex > -1)
						(this.tableStructureForm.controls['typeGroups'] as FormArray).insert(currectKeyIndex, this.createTableStructureDefinition(event.source.value));
				}
				// Removed
				else{
					let currectKeyIndex = this.tableStructureForm.value.typeGroups.findIndex(item => item.type_id == event.source.value.id);
					if(currectKeyIndex > -1){
						(this.tableStructureForm.controls['typeGroups'] as FormArray).removeAt(currectKeyIndex);
					}
				}
			}
		}, 100);
		
	}


	/*  For Table Structure Form */
	createTableStructure(){
		return this.fb.group({
			// typeGroups 	: this.fb.array([ this.createTableStructureDefinition() ])
			typeGroups 	: this.fb.array([  ])
		});
	}
	createTableStructureDefinition(typeObj: any){
		// console.log('typeObj___', typeObj)
		let moduleUsedFieldIndxs = this.getAllFieldIndexedUsedInModuleType(typeObj);
		// console.log('moduleUsedFieldIndxs__', moduleUsedFieldIndxs)
		// console.log('__availableFieldsWithTableType', this.availableFieldsWithTableType)
		// console.log('_availableFields', this.availableFields)

		let moduleUsedFieldsNormal = []
		let moduleUsedFieldsRef = []
		let moduleUsedFieldsTable = []
		moduleUsedFieldIndxs.forEach((fieldVal, fieldIndex) => {
			if(typeof this.availableFields[fieldVal] != 'undefined'){
				if(this.availableFields[fieldVal].hasOwnProperty("data_type") && this.availableFields[fieldVal].data_type == 'module-reference'){
					let foundField = this.availableFieldsConnectedWithModules.find(t => t.field_id === this.availableFields[fieldVal].field_id);
					if(typeof foundField != 'undefined'){
						moduleUsedFieldsRef.push(foundField);
					}
				}
				else if(this.availableFields[fieldVal].hasOwnProperty("data_type") && this.availableFields[fieldVal].data_type == 'table'){
					let foundField = this.availableFieldsWithTableType.find(t => t.field_id === this.availableFields[fieldVal].field_id);
					if(typeof foundField != 'undefined'){
						moduleUsedFieldsTable.push(foundField);
					}
				}
				//Plain Field
				else
					moduleUsedFieldsNormal.push(this.availableFields[fieldVal]);
			}
		});
		// if(moduleUsedFieldsNormal.length > 0){
			//if "status" is defined in the modulefields and we are not using in this module type, we are keeping it as default
			let foundStatusFieldInAllModuleFields = this.availableFields.find(t => t.field_id === "status");
			let foundStatusFieldInCurrentModuleFields = moduleUsedFieldsNormal.find(t => t.field_id === "status");
			if(typeof foundStatusFieldInAllModuleFields != 'undefined' && typeof foundStatusFieldInCurrentModuleFields == 'undefined'){
				moduleUsedFieldsNormal.push(foundStatusFieldInAllModuleFields);
			}
			//use "created_by", "created_at", "updated_at" as default fields
			moduleUsedFieldsNormal = moduleUsedFieldsNormal.concat(this.availableFieldsStatic);

		// }
		// console.log('moduleUsedFieldsNormal__', moduleUsedFieldsNormal);
		// console.log('moduleUsedFieldsRef__', moduleUsedFieldsRef);
		// console.log('moduleUsedFieldsTable__', moduleUsedFieldsTable);

		return this.fb.group({
			type_id 		: [typeObj.id],
			type_name 		: [typeObj.name],
			type_icon 		: [typeObj.icon],
			type_columns 	: this.fb.array([ this.createTableStructureGroupColumn() ]),
			// type_columns 	: this.fb.array([])
			avail_fields	: this.fb.group({
				normalFields: [moduleUsedFieldsNormal],
				refFields	: [moduleUsedFieldsRef],
				tableFields : [moduleUsedFieldsTable]
			}),
		});
	}
	createTableStructureGroupColumn(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),  
			field_id 	: ['', Validators.required],
			keys 		: ['', Validators.required],
			// keys 	: this.fb.array([  ]),
			field_type 	: ['', Validators.required],
			table_key_indexes 			: [[]],
			table_columns_available 	: [[]],
			front_end_types 			: this.fb.array([])
		});
	}
	createTableStructureGroupColumnFrontEndTypeField(field_key?: any, field_key_name?: any){
		return this.fb.group({
			field_id		: [field_key],
			name 			: [field_key_name],
			// parent_name		: [field_key_parent_name],
			type 			: [''],  	//possible values (chip/text/icon)
			field_type 		: [''],  // Possible values : Date/ None <-- Mainly used for piping (value formating)
			is_new_line 	: [false],
			icon_name 		: [''],
			icon_position 	: ['before'],
			tooltip 		: this.fb.group({en: [''], ar: ['']}),

			selected_field_l0 	: [field_key],
			selected_field_l1 	: [''],
			selected_field_l2 	: [''],
			available_child_fields_l1	: [[]],
			available_child_fields_l2	: [[]],
		});
	}
	addNewTypeGroupColumn(type_index){
		// (typeGroup.controls["type_columns"].controls.push(this.createTableStructureGroupColumn()))		//has some problem to use this
		(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns'] as FormArray).push( this.createTableStructureGroupColumn() );

		// console.log(typeGroup)
		// console.log('__1', typeGroupIndex);
		// console.log('__2', this.tableStructureForm);
		// console.log('__3', this.tableStructureForm.controls['typeGroups']);
		// console.log('__4', this.tableStructureForm.controls['typeGroups']['controls'][typeGroupIndex]);
		// console.log('__5', this.tableStructureForm.controls['typeGroups']['controls'][typeGroupIndex].value['type_columns']);
		// // console.log((this.tableStructureForm.controls['typeGroups'] as FormArray));
		// // console.log((this.tableStructureForm.controls['typeGroups'] as FormArray)[0]);
		// // (this.tableStructureForm.controls['typeGroups']['controls'][typeGroupIndex].controls['type_columns'] as FormArray).push(this.createTableStructureGroupColumn());
		// // (this.tableStructureForm.controls['typeGroups']['controls'][typeGroupIndex].get('type_columns') as FormArray).push(this.createTableStructureGroupColumn());
		// // (this.tableStructureForm.get('typeGroups') as FormArray).push(this.createModuleTypeGroup());
		
		// console.log('__6', this.tableStructureForm.controls['typeGroups']['controls'][typeGroupIndex].value['type_columns']);
		// console.log('__6.1', this.tableStructureForm.controls['typeGroups']['controls'][typeGroupIndex].controls['type_columns']);
		// console.log('__7', this.tableStructureForm.value);
		// console.log('__8', this.tableStructureForm);
	}
	removeTypeGroupColumn(type_index, column_index){
		// console.log(this.tableStructureForm);
		(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns'] as FormArray).removeAt(column_index);
	}
	modifyParentColumnType(event: any, type_index, column_index){
		// console.log('field_type', this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type);
		// console.log('keys', this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys);

		setTimeout(() => {
			if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type == 'group')
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue([]);
				// this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys = [];
			else if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type == 'frontend_module_type_name'){
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['field_id']).setValue("type_name");
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(["type_id"]);
			}
			else if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type == 'thumbnail'){
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['field_id']).setValue("thumbnail");
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(["id"]);
			}
			else
				// this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys = "";
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue("");
				
				// console.log('keys after', this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys);

			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();
			if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type == 'id' || this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type == 'status' || this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].field_type == 'single'){
				this.addNewFrontEndTypesObject(type_index, column_index)
			}
		}, 100);
	}
	modifyFrontEndTypesObjectAdvanced(event: any, type_index, column_index){
		// event.source.value - the field_id value
		// event.source.selected - the selection status
		if(!event.isUserInput) {
			// console.log('modifyFrontEndTypesObjectAdvanced: isUserInput - false');
			return false;
		}
		// else
		// 	console.log('modifyFrontEndTypesObjectAdvanced: isUserInput - true');

		// console.log('modifyFrontEndTypesObjectAdvanced', event, event.source.value, event.source.selected);
		setTimeout(() => {
			if(Array.isArray(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys) ){
				//Newly selected
				if(event.source.selected){
					let currectKeyIndex = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys.findIndex(item => item == event.source.value);
					if(currectKeyIndex > -1){
						let field = event.source.value;
						let indexOfDot = field.lastIndexOf(".");
						if (indexOfDot > -1) {
							let parent_modulekey = field.substring(0, indexOfDot);
							let child_fieldkey = field.substring(indexOfDot+1);
							// console.log('parent_modulekey____', parent_modulekey, 'child_fieldkey____', child_fieldkey);

							let parentFieldObject = this.availableFieldsConnectedWithModules.find(item => item.field_id == parent_modulekey);
							if(typeof parentFieldObject != 'undefined'){
								// console.log('parentFieldObject____', parentFieldObject);
								// console.log('parentFieldObject.moduleDefinition____', parentFieldObject.moduleDefinition);
								let normalFieldObject = parentFieldObject.moduleDefinition.find(item => item.field_id == child_fieldkey);
								// console.log('normalFieldObject____', normalFieldObject);
								if(typeof normalFieldObject != 'undefined'){
									(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).insert(currectKeyIndex, this.createTableStructureGroupColumnFrontEndTypeField(field, normalFieldObject.name));
								}
							}
						} else {
							let normalField = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == field);
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).insert(currectKeyIndex, this.createTableStructureGroupColumnFrontEndTypeField(field, normalField.name));
						}
						
					}
				}
				// Removed
				else{
					let currectKeyIndex = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].front_end_types.findIndex(item => item.field_id == event.source.value);
					if(currectKeyIndex > -1){
						(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).removeAt(currectKeyIndex);
					}
				}
			}
			else if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys != ""){
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();

				//Newly selected
				if(event.source.selected){
					let currectKeyIndex = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys.findIndex(item => item == event.source.value);
					if(currectKeyIndex > -1){
						let field = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys;
						let indexOfDot = field.lastIndexOf(".");
						if (indexOfDot > -1) {
							let parent_modulekey = field.substring(0, indexOfDot);
							let child_fieldkey = field.substring(indexOfDot+1);
							// console.log('parent_modulekey____', parent_modulekey, 'child_fieldkey____', child_fieldkey);

							let parentFieldObject = this.availableFieldsConnectedWithModules.find(item => item.field_id == parent_modulekey);
							if(typeof parentFieldObject != 'undefined'){
								// console.log('parentFieldObject____', parentFieldObject);
								// console.log('parentFieldObject.moduleDefinition____', parentFieldObject.moduleDefinition);
								let normalFieldObject = parentFieldObject.moduleDefinition.find(item => item.field_id == child_fieldkey);
								// console.log('normalFieldObject____', normalFieldObject);
								if(typeof normalFieldObject != 'undefined'){
									(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalFieldObject.name) );
								}
							}
						} else {
							let normalField = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == field);
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalField.name) );
						}
					}
				}
				// Removed
				else{
					//Already cleared the list, so nothing needed to do extras
				}
			}
		}, 100);
	}
	modifyFrontEndTypesObject(event: any, type_index, column_index){
		return false;
		console.log('modifyFrontEndTypesObject', event, event.value, event.source.value, event.source.selected, type_index, column_index)
		// console.log(event.value)
		// console.log(event.source.value, event.source.selected);
		// this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns'] = this.createTableStructureGroupColumnFrontEndTypeField();
		// this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls = [];
		setTimeout(() => {
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();

			if(Array.isArray(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys) ){
				this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys.forEach((field, fieldIndex) => {
					//check the field_id are come from the reference module ( means it'll be goto reference_keys)
					/*if(field.hasOwnProperty("parent"))
						(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field.parent.field_id + '.' + field.value.field_id, field.value.name) );
					else //( means it'll be goto straight_keys)
						(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field.field_id, field.name) );
					*/

					let indexOfDot = field.lastIndexOf(".");
					if (indexOfDot > -1) {
						let parent_modulekey = field.substring(0, indexOfDot);
						let child_fieldkey = field.substring(indexOfDot+1);
						// console.log('parent_modulekey____', parent_modulekey, 'child_fieldkey____', child_fieldkey);

						let parentFieldObject = this.availableFieldsConnectedWithModules.find(item => item.field_id == parent_modulekey);
						if(typeof parentFieldObject != 'undefined'){
							// console.log('parentFieldObject____', parentFieldObject);
							// console.log('parentFieldObject.moduleDefinition____', parentFieldObject.moduleDefinition);
							let normalFieldObject = parentFieldObject.moduleDefinition.find(item => item.field_id == child_fieldkey);
							// console.log('normalFieldObject____', normalFieldObject);
							if(typeof normalFieldObject != 'undefined'){
								(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalFieldObject.name) );
							}
						}
					} else {
						let normalField = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == field);
						(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalField.name) );
					}
				});
			}
			else if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys != ""){
				let field = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys;
				/*if(field.hasOwnProperty("parent"))
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field.parent.field_id + '.' + field.value.field_id, field.value.name) );
				else //( means it'll be goto straight_keys)
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field.field_id, field.name) );
				*/
				let indexOfDot = field.lastIndexOf(".");
				if (indexOfDot > -1) {
					let parent_modulekey = field.substring(0, indexOfDot);
					let child_fieldkey = field.substring(indexOfDot+1);
					// console.log('parent_modulekey____', parent_modulekey, 'child_fieldkey____', child_fieldkey);

					let parentFieldObject = this.availableFieldsConnectedWithModules.find(item => item.field_id == parent_modulekey);
					if(typeof parentFieldObject != 'undefined'){
						// console.log('parentFieldObject____', parentFieldObject);
						// console.log('parentFieldObject.moduleDefinition____', parentFieldObject.moduleDefinition);
						let normalFieldObject = parentFieldObject.moduleDefinition.find(item => item.field_id == child_fieldkey);
						// console.log('normalFieldObject____', normalFieldObject);
						if(typeof normalFieldObject != 'undefined'){
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalFieldObject.name) );
						}
					}
				} else {
					let normalField = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == field);
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalField.name) );
				}
			}
		}, 100);
	}
	modifyFrontEndTypesObjectForTableField(event: any, type_index, column_index){
		return false;
		setTimeout(() => {
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();

			let field = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys;
			let tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == field);

			if(typeof tableFieldObject != 'undefined' && tableFieldObject.hasOwnProperty("columns") && Array.isArray(tableFieldObject.columns)){
				this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].table_key_indexes.forEach((fieldInd, fieldIndex) => {
					let tableField = tableFieldObject.columns[fieldInd];
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(tableField.field_id, tableField.name) );
				});
			}
		}, 100);
	}
	modifyFrontEndTypesObjectForTableFieldAdvanced(event: any, type_index, column_index){
		if(!event.isUserInput) {
			// console.log('modifyFrontEndTypesObjectForTableFieldAdvanced: isUserInput - false');
			return false;
		}
		// else
		// 	console.log('modifyFrontEndTypesObjectForTableFieldAdvanced: isUserInput - true');
		
		// console.log('modifyFrontEndTypesObjectForTableFieldAdvanced', event, event.source.value, event.source.selected);
		setTimeout(() => {
			// (this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();

			if(Array.isArray(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].table_key_indexes) && this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].table_key_indexes.length == 0 )
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();
			else{
				let field = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys;
				let tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == field);

				if(typeof tableFieldObject != 'undefined' && tableFieldObject.hasOwnProperty("columns") && Array.isArray(tableFieldObject.columns)){
					let tableField = tableFieldObject.columns[event.source.value];

					//Newly selected
					if(event.source.selected){
						let currectKeyIndex = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].table_key_indexes.findIndex(item => item == event.source.value);
						if(currectKeyIndex > -1){
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).insert(currectKeyIndex,  this.createTableStructureGroupColumnFrontEndTypeField(tableField.field_id, tableField.name) );
						}
					}
					// Removed
					else{
						let currectKeyIndex = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].front_end_types.findIndex(item => item.field_id == tableField.field_id);
						if(currectKeyIndex > -1){
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).removeAt(currectKeyIndex);
						}
					}
				}
			}
		}, 100);
	}
	loadTableFieldColumns(event: any, type_index, column_index){
		setTimeout(() => {
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).clear();
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['table_key_indexes']).setValue([]);
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['table_columns_available']).setValue([]);
			

			if(this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys != ""){
				let field = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys;
				let tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == field);
				if(typeof tableFieldObject != 'undefined' && tableFieldObject.hasOwnProperty("columns") && Array.isArray(tableFieldObject.columns)){
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['table_columns_available']).setValue(tableFieldObject.columns);
				}
				// (this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(field, normalField.name) );
			}
		}, 100);
	}
	updateFieldKey(columnField) {
		try {
			return columnField.get('field_id').setValue(columnField.value.name.en.toLowerCase().split(' ').join('_'));
		} catch (exception) {
			return "";
		}
	}
	getAllFieldIndexedUsedInModuleType(typeObj: any){
		let usedFieldIndxes = [];
		if(typeObj.forms && typeObj.forms.groups && Array.isArray(typeObj.forms.groups) && typeObj.forms.groups.length > 0 ){
			typeObj.forms.groups.forEach((grpVal, grpIndex) => {
				if(grpVal.fields && Array.isArray(grpVal.fields) && grpVal.fields.length > 0 ){
					grpVal.fields.forEach((fieldVal, fieldIndex) => {
						usedFieldIndxes.push(fieldVal);
					});
				}
			});
		}
		//unique the array values
		usedFieldIndxes = usedFieldIndxes.filter((thing, i, arr) => {
			return arr.indexOf(arr.find(t => t === thing)) === i;
		});
		// console.log('usedFieldIndxes__', usedFieldIndxes)
		return usedFieldIndxes;
	}
	modifyFrontEndTypesObjectFieldLevel0(event: any, type_index, column_index, field_index){
		setTimeout(() => {
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['selected_field_l1']).setValue("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['selected_field_l2']).setValue("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l1']).setValue([]);
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l2']).setValue([]);

			let selectedL0Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l0;
			// console.log('selectedL0Field', selectedL0Field);
			let foundField0 = this.availableFields.find(t => t.field_id === selectedL0Field);
			if(typeof foundField0 != 'undefined'){
				let current_keys = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].keys;
				if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'id' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'status' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'single'){
					current_keys = selectedL0Field;
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_keys);
				}
				else{
					current_keys[field_index] = selectedL0Field;
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_keys[field_index]);
				}
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(current_keys);

				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['name']).setValue(foundField0.name[this.globalVariables.LNG]);

				if(foundField0.hasOwnProperty("data_type") && foundField0.data_type == 'module-reference'){
					/*let foundFieldL1 = this.availableFieldsConnectedWithModules.find(t => t.field_id === selectedL0Field);
					if(typeof foundFieldL1 != 'undefined'){
						console.log('foundFieldL1', foundFieldL1);
						(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l1']).setValue(foundFieldL1.moduleDefinition);
					}*/
					this.getModulesDataById(foundField0.reference_module_id).then(foundFieldL1 => {
						console.log('foundFieldL1', foundFieldL1);
						if(typeof foundFieldL1 != 'undefined' && foundFieldL1.columns && foundFieldL1.columns.module_fields)
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l1']).setValue(foundFieldL1.columns.module_fields);
					});
				}
			}
		}, 100);
	}
	modifyFrontEndTypesObjectFieldLevel1(event: any, type_index, column_index, field_index){
		setTimeout(() => {
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['selected_field_l2']).setValue("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l2']).setValue([]);

			let selectedL0Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l0;
			let foundField0 = this.availableFields.find(t => t.field_id === selectedL0Field);

			let selectedL1Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l1;
			// console.log('selectedL1Field', selectedL1Field);
			let foundField1 = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].available_child_fields_l1.find(t => t.field_id === selectedL1Field);
			if(typeof foundField1 != 'undefined'){
				let current_keys = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].keys;
				if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'id' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'status' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'single'){
					current_keys = selectedL0Field+'.'+selectedL1Field;
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_keys);
				}
				else{
					current_keys[field_index] = selectedL0Field+'.'+selectedL1Field;
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_keys[field_index]);
				}
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(current_keys);

				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['name']).setValue(foundField0.name[this.globalVariables.LNG] + ' / ' + foundField1.name[this.globalVariables.LNG]);

				if(foundField1.hasOwnProperty("data_type") && foundField1.data_type == 'module-reference'){
					this.getModulesDataById(foundField1.reference_module_id).then(foundFieldL2 => {
						// console.log('foundFieldL2', foundFieldL2);
						if(typeof foundFieldL2 != 'undefined' && foundFieldL2.columns && foundFieldL2.columns.module_fields)
							(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l2']).setValue(foundFieldL2.columns.module_fields);
					});
				}
			}
		}, 100);
	}
	modifyFrontEndTypesObjectFieldLevel2(event: any, type_index, column_index, field_index){
		setTimeout(() => {
			let selectedL0Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l0;
			let foundField0 = this.availableFields.find(t => t.field_id === selectedL0Field);
			
			let selectedL1Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l1;
			let foundField1 = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].available_child_fields_l1.find(t => t.field_id === selectedL1Field);

			let selectedL2Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l2;
			let foundField2 = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].available_child_fields_l2.find(t => t.field_id === selectedL2Field);
			if(typeof foundField2 != 'undefined'){
				let current_keys = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].keys;
				if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'id' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'status' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'single'){
					current_keys = selectedL0Field+'.'+selectedL1Field+'.'+selectedL2Field;
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_keys);
				}
				else{
					current_keys[field_index] = selectedL0Field+'.'+selectedL1Field+'.'+selectedL2Field;
					(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_keys[field_index]);
				}
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(current_keys);

				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['name']).setValue(foundField0.name[this.globalVariables.LNG] + ' / ' + foundField1.name[this.globalVariables.LNG] + ' / ' + foundField2.name[this.globalVariables.LNG]);
			}
		}, 100);
	}
	addNewFrontEndTypesObject(type_index, column_index){
		if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'group'){
			let current_keys = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].keys;
			current_keys = current_keys.concat("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(current_keys);
		}
		else if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'table'){
			let current_table_key_indexes = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].table_key_indexes;
			current_table_key_indexes = current_table_key_indexes.concat("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['table_key_indexes']).setValue(current_table_key_indexes);
		}
		else if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'id' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'status' || this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'single'){
			//do nothing
		}
		(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).push(this.createTableStructureGroupColumnFrontEndTypeField());
	}
	removeFrontEndTypesObject(type_index, column_index, field_index){
		if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'group'){
			let current_keys = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].keys;
			current_keys.splice(field_index, 1);
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue(current_keys);
		}
		else if(this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].field_type == 'table'){
			let current_table_key_indexes = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].table_key_indexes;
			current_table_key_indexes.splice(field_index, 1);
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['table_key_indexes']).setValue(current_table_key_indexes);
		}
		(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types'] as FormArray).removeAt(field_index);
	}
	modifyFrontEndTypesObjectFieldLevel0ForTable(event: any, type_index, column_index, field_index){
		setTimeout(() => {
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['selected_field_l1']).setValue("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['selected_field_l2']).setValue("");
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l1']).setValue([]);
			(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['available_child_fields_l2']).setValue([]);

			let selectedL0Field = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].front_end_types[field_index].selected_field_l0;

			let field = this.tableStructureForm.value.typeGroups[type_index]['type_columns'][column_index].keys;
			let tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == field);
			if(typeof tableFieldObject != 'undefined' && tableFieldObject.hasOwnProperty("columns") && Array.isArray(tableFieldObject.columns) && selectedL0Field > -1){
				let tableField = tableFieldObject.columns[selectedL0Field];

				let current_table_key_indexes = this.tableStructureForm.value.typeGroups[type_index].type_columns[column_index].table_key_indexes;
				current_table_key_indexes[field_index] = selectedL0Field;
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['table_key_indexes']).setValue(current_table_key_indexes);

				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['name']).setValue(tableField.name[this.globalVariables.LNG]);
				(this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['front_end_types']['controls'][field_index].controls['field_id']).setValue(current_table_key_indexes[field_index]);
			}
		}, 100);
	}


	/*  For Group By Form */
	createGroupByForm(){
		return this.fb.group({
			// groupBy 	: this.fb.array([ this.createGroupByDefinition() ])
			groupBy 	: this.fb.array([  ])
		});
	}
	createGroupByDefinition(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),
			field_id 		: ['', Validators.required]
		});
	}
	addNewGroupBy(){
		(this.groupByForm.controls['groupBy'] as FormArray).push( this.createGroupByDefinition() );
	}
	removeGroupBy(index){
		(this.groupByForm.controls['groupBy'] as FormArray).removeAt(index);
	}
	

	/*  For User Role Form */
	createUserRoleForm(){
		return this.fb.group({
			roles 	: [[], Validators.required],
		});
	}

	
	/*  For Permission Form */
	createPermissionTable(){
		return this.fb.group({
			// fieldGroups 	: this.fb.array([ this.createPermissionTable() ])
			fieldGroups 	: this.fb.array([  ])
		});
	}
	createPermissionTableDefinition(field_id: any, field_key: any, field_name: any){
		return this.fb.group({
			field_id 		: [field_id],
			field_key 		: [field_key],
			field_name 		: [field_name],
			userRoles 		: this.fb.array([])
		});
	}
	createPermissionTableUserLevelDefinition(role_id: any, name_obj: any){
		return this.fb.group({
			user_id 		: [role_id],
			user_name 		: [name_obj],
			view 			: [true],
			edit 			: [true]
		});
	}


	/* For Managing Available Fields (both direct and module reference keys) */
	extractConnectedModules(){
		let connectedModules = [];
		let connectedModulesDistincted = [];

		this.availableFields.forEach((field, index) => {
			if(field.hasOwnProperty("data_type") && field.data_type == 'module-reference'){
				connectedModules.push({
					id 					: index,
					field_id 			: field.field_id,
					name 				: field.name,
					reference_module_id : field.reference_module_id,
					moduleDefinition 	: []
				});
			}
		});
		
		connectedModulesDistincted = connectedModules.filter((thing, i, arr) => {
			return arr.indexOf(arr.find(t => t.reference_module_id === thing.reference_module_id)) === i;
		});
		
		// console.log('connectedModules', connectedModules);
		// console.log('connectedModulesDistincted', connectedModulesDistincted);

		return { 'connectedModulesAll' : connectedModules, 'connectedModulesDistincted' : connectedModulesDistincted};
	}
	getModuleDataById(moduleId, index) {
		this.userService.fetchModuleMatrixData(moduleId)
			.subscribe((data) => {
				// console.log(data.content.columns.module_fields);
				// console.log(data);
				// return data.content.columns.module_fields;

				// ***************** Putting the module definition in the unique field set (connected with modules)
				this.availableFieldsConnectedWithModulesUnique[index]['moduleDefinition'] = data.content.columns.module_fields;
				// console.log(data);

				// ***************** Putting the module definition in all field set (connected with modules)
				// let availableFieldsNotConnectedWithModules__ = this.availableFieldsConnectedWithModules.some(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id);
				// let availableFieldsNotConnectedWithModules__ = this.availableFieldsConnectedWithModules.find(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id);
				let availableFieldsNotConnectedWithModules__ = this.availableFieldsConnectedWithModules.filter(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id);
				// console.log('availableFieldsNotConnectedWithModules', this.availableFieldsConnectedWithModulesUnique[index].reference_module_id, ' => ', availableFieldsNotConnectedWithModules__)
				availableFieldsNotConnectedWithModules__.forEach((field, i) => {
					let _temp_index = this.availableFieldsConnectedWithModules.findIndex(item => item.id == field.id);
					this.availableFieldsConnectedWithModules[_temp_index]['moduleDefinition'] = data.content.columns.module_fields;
					// console.log(field.id, _temp_index);
				});
				// console.log(this.availableFieldsConnectedWithModules.map(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id));
				// console.log(this.availableFieldsConnectedWithModules.map(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id).indexOf(true));
				// console.log(this.availableFieldsConnectedWithModules.map(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id).filter(item => true));
			});
	}
	getModulesDataByIds(moduleIds) {
		if(moduleIds.length > 0){
			let moduleIdsString = moduleIds.join(',');
			// console.log('moduleIdsString', moduleIdsString);
			this.PermissionMatrixService.fetchModuleMatrixDataByIds(moduleIdsString)
				.subscribe((data) => {
					console.log('getModulesDataByIds', data.content);
					if(data.content && Array.isArray(data.content) && data.content.length > 0){

						data.content.forEach((module_, index) => {
							let have_definition_already = this.fieldsetFromModule.find(item => item.id == module_.id);
							if(typeof have_definition_already == 'undefined'){
								this.fieldsetFromModule.push(module_);
							}
						});

						this.availableFieldsConnectedWithModulesUnique.forEach((field, index) => {
							// field.reference_module_id
							let __module_def = data.content.find(item => item.id == field.reference_module_id);
							if(typeof __module_def != 'undefined'){
								// ***************** Putting the module definition in the unique field set (connected with modules)
								this.availableFieldsConnectedWithModulesUnique[index]['moduleDefinition'] = __module_def.columns.module_fields;
								
								// ***************** Putting the module definition in all field set (connected with modules)
								let availableFieldsNotConnectedWithModules__ = this.availableFieldsConnectedWithModules.filter(item => item.reference_module_id == this.availableFieldsConnectedWithModulesUnique[index].reference_module_id);
								// console.log('availableFieldsNotConnectedWithModules', this.availableFieldsConnectedWithModulesUnique[index].reference_module_id, ' => ', availableFieldsNotConnectedWithModules__)
								availableFieldsNotConnectedWithModules__.forEach((field, i) => {
									let _temp_index = this.availableFieldsConnectedWithModules.findIndex(item => item.id == field.id);
									this.availableFieldsConnectedWithModules[_temp_index]['moduleDefinition'] = __module_def.columns.module_fields;
									// console.log(field.id, _temp_index);
								});

								// this.fieldsetFromModule
							}

						});
					}
				});
		}
	}
	async getModulesDataById(moduleId) {
		let have_definition_already = this.fieldsetFromModule.find(item => item.id == moduleId);
		if(typeof have_definition_already != 'undefined'){
			return have_definition_already;
		}
		else {
			let have_definition_already = {};
			// console.log('this.fieldsetFromModule before', this.fieldsetFromModule)
			var data = await this.PermissionMatrixService.fetchModuleMatrixDataById(moduleId);
			if(data.content && Array.isArray(data.content) && data.content.length > 0){
				data.content.forEach((module_, index) => {
					this.fieldsetFromModule.push(module_);
					have_definition_already = module_;
				});
			}
			// console.log('this.fieldsetFromModule after', this.fieldsetFromModule)
			return have_definition_already;
		}
	}

	getModulesArrayByIds(){
		
		let __list_of_modules_ids= [];

		this.availableFieldsConnectedWithModulesUnique.forEach((field, index) => {
			// connectedModulesDistincted[index].moduleDefinition = this.getModuleDataById(field.reference_module_id);
			// let __test_ = connectedModulesDistincted[index];
			// __test_['moduleDefinition'] =  this.getModuleDataById(field.reference_module_id);
			__list_of_modules_ids.push(field.reference_module_id);

			// __test.push(__test_);
			// this.availableFieldsConnectedWithModules[index]['moduleDefinition_'] =  this.getModuleDataById(field.reference_module_id);
			// this.getModuleDataById(field.reference_module_id, index);
		});
		console.log('__list_of_modules_ids', __list_of_modules_ids);
		// return connectedModulesDistincted;
		// return __test;
		if(__list_of_modules_ids.length > 0)
			this.getModulesDataByIds(__list_of_modules_ids);
	}

	createPermissionMatrix(moduleFields) {
		this.permissionMetrixList = [];
		// console.log('moduleFields', moduleFields);
		moduleFields.forEach((field, index) => {
			this.permissionMetrixList.push({
				id 	: index,
				field_id	: field.field_id,
				name: field.name,
				view: true, 
				edit: true
			})
		});

		/*this.permissionMetrixList.forEach((field, index) => {
			// this.availableUserRoles.forEach(role => {
			if(Array.isArray(this.userRoleForm.value.roles) ){
				this.userRoleForm.value.roles.forEach(role => {
					this.permissionMetrixList[index][role.name] = { view: true, edit: true }
					// this.permissionMetrixList[index][role.id] = { view: true, edit: true }
				});
			}
		});*/
		this.dataSource.next(this.permissionMetrixList);
		// this.isShowTable = true;
		// console.log(this.permissionMetrixList);
	}

	update(el, event, type) {
		const copy = this.dataSource.value.slice()
		el[type] = event;
		this.dataSource.next(copy);
	}

	eventCancelledDrawer() {
		this.cancelled.emit("cancelled");
	}
	eventSubmittedDrawer(data, mode) {
		this.submitted.emit({'mode': mode, 'data': data});
	}

	gotoStatusStage(){
		console.log('Reached StatusStage');
		console.log(this.basicForm.value);
		
		// this.stages[0].current = true;
		// this.availableStages[0].completed = true;
		// this.availableStages[1].current = true;
		// this.focusedStep = 2;
		// this.maxReachStep = 2;

		this.basePermissionMatrix 			= {};
		this.basePermissionMatrix.name 		= this.basicForm.value.name;
		this.basePermissionMatrix.workspace = this.basicForm.value.workspace;
		this.basePermissionMatrix.module 	= this.basicForm.value.module;
		this.basePermissionMatrix.description 		= this.basicForm.value.description;
		this.basePermissionMatrix.filters 	= this.globalVariables.IsJsonString(this.basicForm.value.filters) ? JSON.parse(this.basicForm.value.filters) : [];
		this.basePermissionMatrix.sort_order= this.basicForm.value.sort_order;
		this.basePermissionMatrix.is_system_view 	= this.basicForm.value.is_system_view;
		this.basePermissionMatrix.status 	= this.basicForm.value.status;
		this.basePermissionMatrix.deleted 	= this.basicForm.value.deleted;
		this.basePermissionMatrix.icon 		= this.basicForm.value.icon;

		console.log('basePermissionMatrix', this.basePermissionMatrix);

	}
	gotoTypesNGroupsStage(){
		console.log('Reached TypesNGroupsStage');
		console.log('basicForm', this.basicForm.value);
		console.log('statusForm', this.statusForm.value);
		
		// this.stages[1].current = true;
		// this.availableStages[1].completed = true;
		// this.availableStages[2].current = true;
		// this.focusedStep = 3;
		// this.maxReachStep = 3;

		
		this.basePermissionMatrix 			= {};
		this.basePermissionMatrix.permission_matrix 		= [];

		if(Array.isArray(this.userRoleForm.value.roles) ){
			this.userRoleForm.value.roles.forEach(element => {
				let user_permission_attributes = {};
				user_permission_attributes['allowed_statuses'] 	= this.statusForm.value.statuses;
				user_permission_attributes['role'] 				= element['id'];
				user_permission_attributes['add'] 				= this.statusForm.value.allow_to_add;
				user_permission_attributes['delete'] 			= this.statusForm.value.allow_to_delete;
				user_permission_attributes['modes'] 			= this.statusForm.value.viewModes;
				user_permission_attributes['overview'] 			= this.globalVariables.IsJsonString(this.statusForm.value.overview) ? JSON.parse(this.statusForm.value.overview) : [];
				user_permission_attributes['edit_overview'] 	= this.globalVariables.IsJsonString(this.statusForm.value.edit_overview) ? JSON.parse(this.statusForm.value.edit_overview) : [];

				let users_permission_attributes = {};
				users_permission_attributes[element['id']] = [ user_permission_attributes ] ;
				
				this.basePermissionMatrix.permission_matrix.push(users_permission_attributes)
			});
		};
		
		console.log('basePermissionMatrix', this.basePermissionMatrix);
	}
	gotoTableStructure(){
		console.log('Reached gotoTableStructure');
		console.log('basicForm', this.basicForm.value);
		console.log('statusForm', this.statusForm.value);
		console.log('loadedModuleTypeAndGroupsForm', this.loadedModuleTypeAndGroupsForm.value);
		
		// this.stages[1].current = true;
		// this.availableStages[2].completed = true;
		// this.availableStages[3].current = true;
		// this.focusedStep = 3;
		// this.maxReachStep = 3;

		this.basePermissionMatrix 			= {};
		this.basePermissionMatrix.permission_matrix 		= [];

		if(Array.isArray(this.userRoleForm.value.roles) ){
			this.userRoleForm.value.roles.forEach(element => {
				let user_permission_attributes = {};
				user_permission_attributes['type_groups'] 		= [];

				this.loadedModuleTypeAndGroupsForm.value.typeGroups.forEach(tg => {
					user_permission_attributes['type_groups'].push( {
						"name" 	: tg.name,
						"icon" 	: tg.icon,
						"values": tg.types
					});
				})

				let users_permission_attributes = {};
				users_permission_attributes[element['id']] = [ user_permission_attributes ] ;
				
				this.basePermissionMatrix.permission_matrix.push(users_permission_attributes)
			});
		};

		console.log('basePermissionMatrix', this.basePermissionMatrix);
	}
	goto___(){
		console.log('Reached goto___');
		console.log('basicForm', this.basicForm.value);
		console.log('statusForm', this.statusForm.value);
		console.log('loadedModuleTypeAndGroupsForm', this.loadedModuleTypeAndGroupsForm.value);
		console.log('tableStructureForm', this.tableStructureForm.value);
		console.log('groupByForm', this.groupByForm.value);
		// console.log('userRoleForm', this.userRoleForm.value);
		console.log('permissionMetrixList', this.permissionMetrixList);
		// console.log('tableStructureForm - JSON', JSON.stringify(this.tableStructureForm.value.typeGroups[0].type_columns[1].keys));
		// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['field_type']).setValue(col.type);

	}

	generateView(){
		console.log('Reached goto___');
		console.log('basicForm', this.basicForm.value);
		console.log('statusForm', this.statusForm.value);
		console.log('loadedModuleTypeAndGroupsForm', this.loadedModuleTypeAndGroupsForm.value);
		console.log('tableStructureForm', this.tableStructureForm.value);
		console.log('groupByForm', this.groupByForm.value);
		console.log('userRoleForm', this.userRoleForm.value);
		// console.log('permissionForm', this.permissionForm.value);
		console.log('permissionMetrixList', this.permissionMetrixList);

		
		this.basePermissionMatrix 			= {};
		this.isShowJson 					= false;
		
		//From Basic Form
		this.basePermissionMatrix.name 		= this.basicForm.value.name;
		this.basePermissionMatrix.workspace = this.basicForm.value.workspace;
		this.basePermissionMatrix.module 	= this.basicForm.value.module;
		this.basePermissionMatrix.description 		= this.basicForm.value.description;
		this.basePermissionMatrix.filters 	= this.globalVariables.IsJsonString(this.basicForm.value.filters) ? JSON.parse(this.basicForm.value.filters) : [];
		this.basePermissionMatrix.sort_order= this.basicForm.value.sort_order == "" ? 0 : +this.basicForm.value.sort_order; ;
		this.basePermissionMatrix.is_system_view 	= this.basicForm.value.is_system_view;
		this.basePermissionMatrix.status 	= this.basicForm.value.status;
		this.basePermissionMatrix.deleted 	= this.basicForm.value.deleted;
		this.basePermissionMatrix.icon 		= this.basicForm.value.icon;

		this.basePermissionMatrix.permission_matrix 		= [];

		if(Array.isArray(this.userRoleForm.value.roles) ){
			this.userRoleForm.value.roles.forEach(element => {
				let user_permission_attributes = {};

				//From Status Form
				user_permission_attributes['allowed_statuses'] 	= this.statusForm.value.statuses;
				user_permission_attributes['role'] 				= element['id'];
				user_permission_attributes['add'] 				= this.statusForm.value.allow_to_add;
				user_permission_attributes['delete'] 			= this.statusForm.value.allow_to_delete;
				user_permission_attributes['modes'] 			= this.statusForm.value.viewModes;
				user_permission_attributes['overview'] 			= this.globalVariables.IsJsonString(this.statusForm.value.overview) ? JSON.parse(this.statusForm.value.overview) : [];
				user_permission_attributes['edit_overview'] 	= this.globalVariables.IsJsonString(this.statusForm.value.edit_overview) ? JSON.parse(this.statusForm.value.edit_overview) : [];

				//From Types & Groups Form
				user_permission_attributes['type_groups'] 		= [];
				this.loadedModuleTypeAndGroupsForm.value.typeGroups.forEach(tg => {
					user_permission_attributes['type_groups'].push( {
						"name" 	: tg.name,
						"icon" 	: tg.icon,
						"values": tg.types
					});
				});

				//From Group By Form
				user_permission_attributes['group_by'] 		= [];
				this.groupByForm.value.groupBy.forEach(grp => {
					user_permission_attributes['group_by'].push( {
						"name" 	: grp.name,
						"field_id" 	: grp.field_id
					});
				});

				
				//From Table Structure Form
				user_permission_attributes['type'] 		= {};
				user_permission_attributes['straight_keys'] 		= [];
				user_permission_attributes['reference_keys'] 		= [];
				// let user_permission_attributes_reference_keys_unique= [];
				this.tableStructureForm.value.typeGroups.forEach(modType => {
					let module_type_group_columns = [];

					modType.type_columns.forEach(colElement => {
						let fld_column_object = {};
						fld_column_object['name']		= colElement.name;
						fld_column_object['type']		= colElement.field_type;
						fld_column_object['field_id']	= colElement.field_id;
						fld_column_object['keys']		= [];
						fld_column_object['front_end_type']	= [];

						if(colElement.field_type == 'frontend_module_type_name'){
							fld_column_object['field_id']	= 'type_name';
							fld_column_object['keys']		= ['type_id'];
						}
						else if(colElement.field_type == 'thumbnail'){
							fld_column_object['field_id']	= 'thumbnail';
							fld_column_object['keys']		= ['id'];
						}
						else if(colElement.field_type == 'flag'){
							fld_column_object['field_id']	= 'on_hold';
							fld_column_object['keys']		= ['on_hold'];

							let exist_flag = user_permission_attributes['straight_keys'].some(item => item == "on_hold");
							if(!exist_flag) user_permission_attributes['straight_keys'].push("on_hold");
						}
						else if(colElement.field_type == 'table'){
							fld_column_object['indexes'] = colElement.table_key_indexes ? colElement.table_key_indexes : [];
							// fld_column_object['keys'].push(colElement.keys);
							fld_column_object['keys']	= [colElement.keys];
						}
						else{
							if(Array.isArray(colElement.keys)){
								colElement.keys.forEach(colElementKey => {
									fld_column_object['keys'].push(colElementKey);
								});
							}
							else if(colElement.keys != "")
								fld_column_object['keys'].push(colElement.keys);
						}

						// if(colElement.field_type != 'frontend_module_type_name' && colElement.field_type != 'flag' && colElement.field_type != 'thumbnail'){
						if(colElement.field_type == 'group' || colElement.field_type == 'table'){
							colElement.front_end_types.forEach(colElementKey => {
								// if(colElement.field_type != 'table')
								// 	fld_column_object['keys'].push(colElementKey.field_id);

								// if(colElement.field_type == 'group' || colElement.field_type == 'table'){
									let fld_frondend_field_object = {};
									fld_frondend_field_object['type'] 		= colElementKey.type;
									fld_frondend_field_object['icon'] 		= {'name': colElementKey.icon_name, 'position': colElementKey.icon_position};
									fld_frondend_field_object['tooltip'] 	= colElementKey.tooltip;
									fld_frondend_field_object['newline'] 	= colElementKey.is_new_line;
									fld_frondend_field_object['field_type'] = colElementKey.field_type;
									fld_column_object['front_end_type'].push(fld_frondend_field_object);
								// }
								// else
								// 	fld_column_object['front_end_type'] = [];
							});
						}
	
						module_type_group_columns.push(fld_column_object);

						//if the field_type is not 'group', then "colElement.keys" will not be an array, so always we need to change "colElement.keys" to an array
						if(!Array.isArray(colElement.keys) && colElement.keys != '' ){
							colElement.keys = [ colElement.keys ];
						}
						else if(!Array.isArray(colElement.keys) && colElement.keys == '' ){
							colElement.keys = [  ];
						}

						colElement.keys.forEach(colElementKey => {

							let keySplit = colElementKey.split(".");
							if(keySplit.length === 1){
								let exist_flag = user_permission_attributes['straight_keys'].some(item => item == keySplit[0]);
								if(!exist_flag)
									user_permission_attributes['straight_keys'].push(keySplit[0]);
							}
							else if(keySplit.length > 1){
								let fieldKeyL0 			= keySplit[0];
								let fieldKeyL1 			= keySplit[1];
								let fieldObjectL0 		= this.availableFieldsConnectedWithModules.find(item => item.field_id == fieldKeyL0);
								if(typeof fieldObjectL0 != 'undefined'){
									let fieldObjectL1 = fieldObjectL0.moduleDefinition.find(item => item.field_id == fieldKeyL1);
									if(typeof fieldObjectL1 != 'undefined'){
										// let exist_flag = user_permission_attributes_reference_keys_unique.some(item => item == fieldKeyL0);
										// if(!exist_flag){
											let exist_index = user_permission_attributes['reference_keys'].findIndex(item => item.field_id == fieldKeyL0);
										
											if (exist_index > -1) {
												let exist_index_display_field = user_permission_attributes['reference_keys'][exist_index].display_fields.findIndex(item => item == fieldKeyL1);
												if (exist_index_display_field == -1)
													user_permission_attributes['reference_keys'][exist_index].display_fields.push(fieldKeyL1);
											}
											else{
												let fld_frondend_ref_field 						= {};
												fld_frondend_ref_field['field_id'] 				= fieldKeyL0;
												fld_frondend_ref_field['module_reference_id'] 	= fieldObjectL0.reference_module_id;
												fld_frondend_ref_field['display_fields'] 		= [ fieldKeyL1 ];
												user_permission_attributes['reference_keys'].push(fld_frondend_ref_field);
											}

											if(keySplit.length === 3 && keySplit[2] != "" && fieldObjectL1.hasOwnProperty("data_type") && fieldObjectL1.data_type == 'module-reference'){
												let fieldKeyL2 			= keySplit[2];

												let exist_index_l1 = user_permission_attributes['reference_keys'].findIndex(item => item.field_id == fieldKeyL0+"."+fieldKeyL1);
												if (exist_index_l1 > -1) {
													let exist_index_l1_display_field = user_permission_attributes['reference_keys'][exist_index_l1].display_fields.findIndex(item => item == fieldKeyL2);
													if (exist_index_l1_display_field == -1)
														user_permission_attributes['reference_keys'][exist_index_l1].display_fields.push(fieldKeyL2);
												}
												else{
													let fld_frondend_ref_field_join 					= {};
													fld_frondend_ref_field_join['field_id'] 			= fieldKeyL0+"."+fieldKeyL1;
													fld_frondend_ref_field_join['module_reference_id'] 	= fieldObjectL1.reference_module_id;
													fld_frondend_ref_field_join['inner_query'] 			= true;
													fld_frondend_ref_field_join['inner_query_key'] 		= "id";

													// if(keySplit.length === 3 && fieldKeyL2 != "")
														fld_frondend_ref_field_join['display_fields'] 		= [ fieldKeyL2 ];
													// else
														// fld_frondend_ref_field_join['display_fields'] 		= [ fieldObjectL1.key_show ];
													user_permission_attributes['reference_keys'].push(fld_frondend_ref_field_join);
												}
											}

											// user_permission_attributes_reference_keys_unique.push(colElementKey);
										// }
									}
								}
							}
						});
					});

					//Add Id and type_id as the default columns always
					let fld_column_object = {};
					fld_column_object['name']	= this.globalVariables.translation['field_name__id'];
					fld_column_object['type']	= "id";
					fld_column_object['field_id']	= "id";
					fld_column_object['keys']	= ["id"];
					fld_column_object['front_end_type']	= [];
					module_type_group_columns.push(fld_column_object);
					fld_column_object = {};
					fld_column_object['name']	= this.globalVariables.translation['field_name__type_id'];
					fld_column_object['type']	= "id";
					fld_column_object['field_id']	= "type_id";
					fld_column_object['keys']	= ["type_id"];
					fld_column_object['front_end_type']	= [];
					module_type_group_columns.push(fld_column_object);
					let exist_flag = user_permission_attributes['straight_keys'].some(item => item == "id");
					if(!exist_flag) user_permission_attributes['straight_keys'].push("id");
					exist_flag = user_permission_attributes['straight_keys'].some(item => item == "type_id");
					if(!exist_flag) user_permission_attributes['straight_keys'].push("type_id");

					user_permission_attributes['type'][modType['type_id']] = module_type_group_columns ;
				});

				
				//From Permission Form
				user_permission_attributes['form_fields'] 		= [];
				this.permissionMetrixList.forEach(pm => {
					user_permission_attributes['form_fields'].push( {
						"id" 	: pm.id,
						"field_id" 	: pm.field_id,
						"view" 	: pm.view,
						"edit" 	: pm.edit
					});
				});

				let users_permission_attributes = {};
				users_permission_attributes[element['id']] = [ user_permission_attributes ];
		
				this.basePermissionMatrix.permission_matrix.push(users_permission_attributes)
			});
		};


		console.log('basePermissionMatrix', this.basePermissionMatrix);
		// return false;

		//Edit an user view
		if(this.drawerType == 'edit' && this.selectedViewUserDataSet.userRole != null){
			const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
				data: {
					message: this.globalVariables.translation['confirm_message_are_you_sure_to_edit_an_user_permission_matrix_in_a_view'][this.lng],
				}
			});
			dialogRef.afterClosed().subscribe((param) => {
				if (param) {
					console.log('param', param);
					this.isShowJson = true;
					if(!this.debugMode)
						this.editUserPermissionView();
				}
			});
		}
		//Add an user to the existing view
		else if(this.drawerType == 'edit' && this.selectedViewUserDataSet.userRole == null){
			const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
				data: {
					message: this.globalVariables.translation['confirm_message_are_you_sure_to_add_an_user_permission_matrix_to_a_view'][this.lng],
				}
			});
			dialogRef.afterClosed().subscribe((param) => {
				if (param) {
					console.log('param', param);
					this.isShowJson = true;
					if(!this.debugMode)
						this.addUserIntoView();
				}
			});
		}
		//Create a new view
		else if(this.drawerType != 'edit'){
			const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
				data: {
					message: this.globalVariables.translation['confirm_message_are_you_sure_to_create_a_new_view'][this.lng],
				}
			});
			dialogRef.afterClosed().subscribe((param) => {
				if (param) {
					console.log('param', param);
					this.isShowJson = true;
					if(!this.debugMode)
						this.createNewView();
					// this.eventSubmittedDrawer({'hello': 'test'}, 'CREATE_NEW_VIEW');
				}
			});
		}
	}

	UpdatedTranslates(){
		console.log('basicForm', this.basicForm.value);
		// console.log('statusForm', this.statusForm.value);
		console.log('loadedModuleTypeAndGroupsForm', this.loadedModuleTypeAndGroupsForm.value);
		console.log('tableStructureForm', this.tableStructureForm.value);
		console.log('groupByForm', this.groupByForm.value);
		console.log('userRoleForm', this.userRoleForm.value);
		// console.log('permissionForm', this.permissionForm.value);
		// console.log('permissionMetrixList', this.permissionMetrixList);
		console.log('savedViewPermissionData - Before', this.savedViewPermissionData);

		
		this.basePermissionMatrix 			= {};
		this.isShowJson 					= false;
		
		//From Basic Form
		this.savedViewPermissionData.name 		= this.basicForm.value.name;

		let savedUserPermissionSubset = null;
		let selectedUserId = null;

		if(Array.isArray(this.userRoleForm.value.roles) ){
			this.userRoleForm.value.roles.forEach(element => {
				if(this.savedViewPermissionData.permission_matrix[0][element['id']].length > 0){
					selectedUserId = element['id'];
					savedUserPermissionSubset = this.savedViewPermissionData.permission_matrix[0][element['id']][0];
				}
			});
		};


		if(savedUserPermissionSubset !== null){

			if(savedUserPermissionSubset.hasOwnProperty("type_groups") && Array.isArray(savedUserPermissionSubset.type_groups) && savedUserPermissionSubset.type_groups.length > 0){
				savedUserPermissionSubset.type_groups.forEach((tg, index) => {
					savedUserPermissionSubset.type_groups[index]['name'] = this.loadedModuleTypeAndGroupsForm.value.typeGroups[index].name;
				});
			}

			//From Group By Form
			if(savedUserPermissionSubset.hasOwnProperty("group_by") && Array.isArray(savedUserPermissionSubset.group_by) && savedUserPermissionSubset.group_by.length > 0){
				savedUserPermissionSubset.group_by.forEach((tg, index) => {
					savedUserPermissionSubset.group_by[index]['name'] = this.groupByForm.value.groupBy[index].name;
				});
			}
			
			//From Table Structure Form
			if(savedUserPermissionSubset.hasOwnProperty("type")){
				this.tableStructureForm.value.typeGroups.forEach(modType => {

					if(savedUserPermissionSubset.type[modType.type_id]){
						modType.type_columns.forEach(colElement => {
							let fieldColIndex = savedUserPermissionSubset.type[modType.type_id].findIndex(item => item.field_id == colElement.field_id);
							if (fieldColIndex > -1) {
								savedUserPermissionSubset.type[modType.type_id][fieldColIndex]['name']	= colElement.name;

								if(savedUserPermissionSubset.type[modType.type_id][fieldColIndex].hasOwnProperty("front_end_type") && Array.isArray(savedUserPermissionSubset.type[modType.type_id][fieldColIndex].front_end_type) && savedUserPermissionSubset.type[modType.type_id][fieldColIndex].front_end_type.length > 0){
									savedUserPermissionSubset.type[modType.type_id][fieldColIndex].front_end_type.forEach((tg, index) => {
										savedUserPermissionSubset.type[modType.type_id][fieldColIndex].front_end_type[index]['tooltip'] = colElement.front_end_types[index]['tooltip'];
									});
								}
							}
						});
					}
				});
			}

			this.savedViewPermissionData.permission_matrix[0][selectedUserId][0] = savedUserPermissionSubset;
		}

		console.log('savedViewPermissionData - After', this.savedViewPermissionData);
		this.basePermissionMatrix = this.savedViewPermissionData;
		// console.log('basePermissionMatrix', this.basePermissionMatrix);
		
		// this.isShowJson = true;

		const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
			data: {
				message: this.globalVariables.translation['confirm_message_are_you_sure_to_update_translates'][this.lng],
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				console.log('param', param);
				this.isShowJson = true;
				if(!this.debugMode)
					this.editUserPermissionView();
			}
		});
	}

	chooseSavedUserRole(userRole){
		console.log('userRole', userRole);
		this.ngxSpinner.show("permission");
		// console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);
		this.selectedTab = 1;
		this.selectedViewUserDataSet = {
			'view_id' 	: this.drawerItemRecord.id,
			'userRole' 	: userRole,
			'module'	: this.drawerItemRecord.dataset.module,
			'workspace'	: this.drawerItemRecord.dataset.workspace
		};

		this.PermissionMatrixService.fetchViewPermissionData(this.drawerItemRecord.id, userRole.id)
		.subscribe((data) => {
			console.log('fetchViewPermissionData', data.content.values);
			if(data.content.values){
				this.savedViewPermissionData = data.content.values;

				// (this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue([]);
				//Basic Form
				(this.basicForm.controls['name']).setValue(this.savedViewPermissionData.name);
				(this.basicForm.controls['description']).setValue(this.savedViewPermissionData.description);
				(this.basicForm.controls['workspace']).setValue(+this.savedViewPermissionData.workspace);
				(this.basicForm.controls['module']).setValue(+this.savedViewPermissionData.module);
				(this.basicForm.controls['icon']).setValue(this.savedViewPermissionData.icon);
				(this.basicForm.controls['filters']).setValue(this.savedViewPermissionData.filters && this.globalVariables.IsJsonString(JSON.stringify(this.savedViewPermissionData.filters)) && JSON.stringify(this.savedViewPermissionData.filters) != '[]' ? JSON.stringify(this.savedViewPermissionData.filters) : '');
				(this.basicForm.controls['sort_order']).setValue(this.savedViewPermissionData.sort_order);
				(this.basicForm.controls['is_system_view']).setValue(this.savedViewPermissionData.is_system_view);
				(this.basicForm.controls['status']).setValue(this.savedViewPermissionData.status);
				(this.basicForm.controls['deleted']).setValue(this.savedViewPermissionData.deleted);

				this.loadModuleAttributes();
				setTimeout(() => {

					let userRoleSubset = this.savedViewPermissionData.permission_matrix[0][userRole.id][0];
					console.log('userRoleSubset', userRoleSubset);

					//Status Form
					(this.statusForm.controls['statuses']).setValue(userRoleSubset.allowed_statuses);
					(this.statusForm.controls['viewModes']).setValue(userRoleSubset.modes);
					(this.statusForm.controls['allow_to_add']).setValue(userRoleSubset.add);
					(this.statusForm.controls['allow_to_delete']).setValue(userRoleSubset.delete);
					(this.statusForm.controls['overview']).setValue(userRoleSubset.overview && this.globalVariables.IsJsonString(JSON.stringify(userRoleSubset.overview)) && JSON.stringify(userRoleSubset.overview) != '[]' ? JSON.stringify(userRoleSubset.overview) : '');
					(this.statusForm.controls['edit_overview']).setValue(userRoleSubset.edit_overview && this.globalVariables.IsJsonString(JSON.stringify(userRoleSubset.edit_overview)) && JSON.stringify(userRoleSubset.edit_overview) != '[]' ? JSON.stringify(userRoleSubset.edit_overview) : '');
	

					//ModuleType & Group Form
					let savedModuleTypeIds = userRoleSubset.type ? Object.keys(userRoleSubset.type) : [];
					// console.log('userRoleSubset.type', userRoleSubset.type);
					let selectedModuleType = [];
					for ( let index = 0; index < savedModuleTypeIds.length; index++ ) {
						let moduleDef = this.availableModuleTypes.find(item => item.id == savedModuleTypeIds[index]);
						selectedModuleType.push(moduleDef);
					}
					(this.loadedModuleTypeAndGroupsForm.controls['types']).setValue(selectedModuleType);
					
					if(userRoleSubset.type_groups && userRoleSubset.type_groups.length > 0){
						(this.loadedModuleTypeAndGroupsForm.controls['typeGroups'] as FormArray).clear();
						userRoleSubset.type_groups.forEach((typeG, index) => {
							this.addNewTypeGroup();
							(this.loadedModuleTypeAndGroupsForm.controls['typeGroups']['controls'][index].controls['name']).setValue(typeG.name);
							(this.loadedModuleTypeAndGroupsForm.controls['typeGroups']['controls'][index].controls['icon']).setValue(typeG.icon);
							(this.loadedModuleTypeAndGroupsForm.controls['typeGroups']['controls'][index].controls['types']).setValue(typeG.values);
						});
					}

					//Table Structure Form
					this.tableStructureForm = this.createTableStructure();
					this.loadedModuleTypeAndGroupsForm.value.types.forEach((typeObj, typeIndex) => {
						(this.tableStructureForm.controls['typeGroups'] as FormArray).push( this.createTableStructureDefinition(typeObj) );
						(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns'] as FormArray).clear();

						let moduleTableDef = userRoleSubset.type[typeObj.id];
						console.log('moduleTableDef____', typeObj.id, moduleTableDef);
						// console.log('this.availableFieldsNotConnectedWithModules____', this.availableFieldsNotConnectedWithModules);
						// console.log('this.availableFieldsConnectedWithModules____', this.availableFieldsConnectedWithModules);
						let created_column_index = 0;
						if(typeof moduleTableDef != 'undefined' && Array.isArray(moduleTableDef)){
							moduleTableDef.forEach((col, colIndex) => {
								// console.log('col____', col, colIndex);
								if(!(col.type == 'id' && col.field_id == 'id' && col.keys.length == 1 && col.keys[0] == 'id') && !(col.type == 'id' && col.field_id == 'type_id' && col.keys.length == 1 && col.keys[0] == 'type_id')){
									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns'] as FormArray).push( this.createTableStructureGroupColumn() );

									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['name']).setValue(col.name);
									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['field_id']).setValue(col.field_id);
									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['field_type']).setValue(col.type);

									// console.log('col.keys____', col.keys);
									let selectedColumnKeys = [];
									col.keys.forEach((colField, colFieldIndex) => {
										// console.log('colField____', colField);
										// let indexOfDot = colField.lastIndexOf(".");
										// console.log('indexOfDot____', indexOfDot);
										selectedColumnKeys.push(colField);
										/*if (indexOfDot > -1) {
											let parent_modulekey = colField.substring(0, indexOfDot);
											let child_fieldkey = colField.substring(indexOfDot+1);
											console.log('parent_modulekey____', parent_modulekey);
											console.log('child_fieldkey____', child_fieldkey);

											let parentFieldObject = this.availableFieldsConnectedWithModules.find(item => item.field_id == parent_modulekey);
											if(typeof parentFieldObject != 'undefined'){
												console.log('parentFieldObject____', parentFieldObject);
												console.log('parentFieldObject.moduleDefinition____', parentFieldObject.moduleDefinition);
												let normalFieldObject = parentFieldObject.moduleDefinition.find(item => item.field_id == child_fieldkey);
												console.log('normalFieldObject____', normalFieldObject);
												if(typeof normalFieldObject != 'undefined'){
													selectedColumnKeys.push({'parent': parentFieldObject, 'value': normalFieldObject});
												}
											}
										} else {
											let normalField = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == colField);
											selectedColumnKeys.push(normalField);
										}*/
									});
									// console.log('selectedColumnKeys____', selectedColumnKeys);
									if(col.type == 'group')
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['keys']).setValue(selectedColumnKeys);
									else if(col.type == 'table'){
										let fieldKey = selectedColumnKeys.length > 0 ? selectedColumnKeys[0] : '';

										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['keys']).setValue(fieldKey);

										let tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == fieldKey);
										if(typeof tableFieldObject != 'undefined' && tableFieldObject.hasOwnProperty("columns") && Array.isArray(tableFieldObject.columns))
											(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['table_columns_available']).setValue(tableFieldObject.columns);
										else
											(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['table_columns_available']).setValue([]);
											
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['table_key_indexes']).setValue(col.indexes ? col.indexes : []);
									}
									else
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['keys']).setValue(selectedColumnKeys.length > 0 ? selectedColumnKeys[0] : '');

									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']  as FormArray).clear();

									if(col.front_end_type && col.front_end_type.length > 0){
										// console.log('col.front_end_type If block')
										let tableFieldObject = undefined;
										if(col.type == 'table'){
											let fieldKey = selectedColumnKeys.length > 0 ? selectedColumnKeys[0] : '';
											tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == fieldKey);
											console.log('tableFieldObject', tableFieldObject)
										}
										col.front_end_type.forEach((colFront, colFrontIndex) => {
											let colField = undefined;
											if(col.type == 'table' && typeof tableFieldObject != 'undefined'){
												// colField = tableFieldObject.columns[colFrontIndex];
												colField = tableFieldObject.columns[col.indexes[colFrontIndex]];
												// colField = tableFieldObject.columns.find(item => item.field_id == colFront.field_id);
												// console.log('tableFieldObject colField', colFront, colField)
											}
											else
												colField = col.keys[colFrontIndex];
											if(typeof colField != 'undefined'){
												let colFieldKey = "";
												let colFieldNameObj = "";
												// let colFieldParentNameObj = null;

												if(col.type == 'table'){
													// colFieldKey = colField.field_id;
													colFieldKey = col.indexes[colFrontIndex];
													colFieldNameObj = colField.name[this.globalVariables.LNG];
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colFieldKey, colFieldNameObj) );
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(colFieldKey);
												}
												else {
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colField) );

													let keySplit = colField.split(".");
													// console.log('keySplit', colField, keySplit)
													if(keySplit.length === 1){
														colFieldKey = keySplit[0];
														let normalFieldObject = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == colFieldKey);
														if(typeof normalFieldObject != 'undefined'){
															colFieldNameObj = normalFieldObject.name[this.globalVariables.LNG];
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(colFieldKey);
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
														}
													}
													else if(keySplit.length > 1){
														let fieldKeyL0 			= keySplit[0];
														let fieldKeyL1 			= keySplit[1];
														let fieldObjectL0 		= this.availableFieldsConnectedWithModules.find(item => item.field_id == fieldKeyL0);
														if(typeof fieldObjectL0 != 'undefined'){
															colFieldNameObj = fieldObjectL0.name[this.globalVariables.LNG];
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(fieldKeyL0);
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l1']).setValue(fieldObjectL0.moduleDefinition);
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
															let fieldObjectL1 = fieldObjectL0.moduleDefinition.find(item => item.field_id == fieldKeyL1);
															if(typeof fieldObjectL1 != 'undefined'){
																colFieldNameObj += ' / ' +fieldObjectL1.name[this.globalVariables.LNG];
																(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l1']).setValue(fieldKeyL1);
																(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);

																// console.log('Second level', keySplit.length, keySplit[2], fieldObjectL1.reference_module_id, fieldObjectL1.data_type);
																if(keySplit.length === 3 && keySplit[2] != "" && fieldObjectL1.hasOwnProperty("data_type") && fieldObjectL1.data_type == 'module-reference'){
																	// console.log('Third level');
																	let fieldKeyL2 			= keySplit[2];
																	(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l2']).setValue(fieldKeyL2);
																	let created_column_index__ = created_column_index;	//store the column index seperately, it'll be updated once the response get from api
																	this.getModulesDataById(fieldObjectL1.reference_module_id).then(moduleObjectL1 => {
																		// console.log('moduleObjectL1', moduleObjectL1)
																		if(typeof moduleObjectL1 != 'undefined' && moduleObjectL1.columns && moduleObjectL1.columns.module_fields){
																			// console.log('moduleObjectL1.columns.module_fields', fieldKeyL2, moduleObjectL1.columns.module_fields);
																			// console.log('fieldObjectL2__', typeIndex, created_column_index__, colFrontIndex);
																			(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l2']).setValue(moduleObjectL1.columns.module_fields);

																			let fieldObjectL2 = moduleObjectL1.columns.module_fields.find(t => t.field_id === fieldKeyL2);
																			// console.log('fieldObjectL2', fieldObjectL2, typeIndex, created_column_index__, colFrontIndex);
																			if(typeof fieldObjectL2 != 'undefined'){
																				colFieldNameObj += ' / ' +fieldObjectL2.name[this.globalVariables.LNG];
																				(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
																			}
																		}
																	});
																}
															}

														}
													}
												}
												// console.log('front_end_type______', colFrontIndex, colField);
												// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colFieldKey, colFieldNameObj, colFieldParentNameObj) );
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['type']).setValue(colFront.type ? colFront.type : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['field_type']).setValue(colFront.field_type ? colFront.field_type : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['is_new_line']).setValue(colFront.newline);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['icon_name']).setValue(colFront.icon && colFront.icon.name ? colFront.icon.name : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['icon_position']).setValue(colFront.icon && colFront.icon.position ? colFront.icon.position : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['tooltip']).setValue(colFront.tooltip ? colFront.tooltip : {});
											}
										});
									}
									else if(col.type == 'id' || col.type == 'status' || col.type == 'single'){
										// console.log('col.front_end_type Else (id | status | single) block')
										let colFieldKey = "";
										let colFieldNameObj = "";
										let colFrontIndex= 0;
										let colField = col.keys[colFrontIndex];
										// console.log('front_end_type______fixedIndex', colFrontIndex, colField);
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colField) );

										let keySplit = colField.split(".");
										if(keySplit.length === 1){
											colFieldKey = keySplit[0];
											// console.log('availableFieldsNotConnectedWithModules', colFieldKey, this.availableFieldsNotConnectedWithModules)
											let normalFieldObject = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == colFieldKey);
											if(typeof normalFieldObject != 'undefined'){
												colFieldNameObj = normalFieldObject.name[this.globalVariables.LNG];
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(colFieldKey);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
											}
										}
										else if(keySplit.length > 1){
											let fieldKeyL0 			= keySplit[0];
											let fieldKeyL1 			= keySplit[1];
											let fieldObjectL0 		= this.availableFieldsConnectedWithModules.find(item => item.field_id == fieldKeyL0);
											if(typeof fieldObjectL0 != 'undefined'){
												colFieldNameObj = fieldObjectL0.name[this.globalVariables.LNG];
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(fieldKeyL0);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l1']).setValue(fieldObjectL0.moduleDefinition);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
												let fieldObjectL1 = fieldObjectL0.moduleDefinition.find(item => item.field_id == fieldKeyL1);
												if(typeof fieldObjectL1 != 'undefined'){
													colFieldNameObj += ' / ' +fieldObjectL1.name[this.globalVariables.LNG];
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l1']).setValue(fieldKeyL1);
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);

													if(keySplit.length === 3 && keySplit[2] != "" && fieldObjectL1.hasOwnProperty("data_type") && fieldObjectL1.data_type == 'module-reference'){
														let fieldKeyL2 			= keySplit[2];
														(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l2']).setValue(fieldKeyL2);
														let created_column_index__ = created_column_index;	//store the column index seperately, it'll be updated once the response get from api
														this.getModulesDataById(fieldObjectL1.reference_module_id).then(moduleObjectL1 => {
															if(typeof moduleObjectL1 != 'undefined' && moduleObjectL1.columns && moduleObjectL1.columns.module_fields){
																(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l2']).setValue(moduleObjectL1.columns.module_fields);

																let fieldObjectL2 = moduleObjectL1.columns.module_fields.find(t => t.field_id === fieldKeyL2);
																if(typeof fieldObjectL2 != 'undefined'){
																	colFieldNameObj += ' / ' +fieldObjectL2.name[this.globalVariables.LNG];
																	(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
																}
															}
														});
													}
												}

											}
										}
									}
									created_column_index++;
								}
							});
						}
					});
					
					//Group By Form
					if(userRoleSubset.group_by && userRoleSubset.group_by.length > 0){
						userRoleSubset.group_by.forEach((gb, index) => {
							this.addNewGroupBy();
							(this.groupByForm.controls['groupBy']['controls'][index].controls['name']).setValue(gb.name);
							(this.groupByForm.controls['groupBy']['controls'][index].controls['field_id']).setValue(gb.field_id);
						});
					}

					//Permission Form 
					if(userRoleSubset.form_fields && userRoleSubset.form_fields.length > 0){
						userRoleSubset.form_fields.forEach((ff, index) => {
							let fieldPermissionIndex = this.permissionMetrixList.findIndex(item => item.id == ff.id);
							if (fieldPermissionIndex > -1) {
								this.permissionMetrixList[fieldPermissionIndex]['view'] = ff.view;
								this.permissionMetrixList[fieldPermissionIndex]['edit'] = ff.edit;
								// console.log(fieldPermissionIndex, this.permissionMetrixList[fieldPermissionIndex]['field_id']);
							}
						});
					}

					//User roles Form 
					let selectedUserRoles = [];
					let userDef = this.availableUserRoles.find(item => item.id == userRole.id);
					selectedUserRoles.push(userDef);
					(this.userRoleForm.controls['roles']).setValue(selectedUserRoles);

					this.ngxSpinner.hide("permission");
					// console.log('tableStructureForm', this.tableStructureForm.value);
				}, 4000);
			}
		});
	}
	addNewUserRole(){
		this.ngxSpinner.show("permission");
		// console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);
		this.selectedTab = 1;
		this.selectedViewUserDataSet = {
			'view_id' 	: this.drawerItemRecord.id,
			'userRole' 	: null,
			'module'	: this.drawerItemRecord.dataset.module,
			'workspace'	: this.drawerItemRecord.dataset.workspace
		};

		// console.log('fetchViewPermissionData', this.drawerItemRecord.dataset);
		if(this.drawerItemRecord.dataset){
			this.savedViewPermissionData = this.drawerItemRecord.dataset;
			// if(this.savedViewPermissionData.hasOwnProperty('user_roles_permission_matrix'))
			// 	delete this.savedViewPermissionData.user_roles_permission_matrix;

			// (this.tableStructureForm.controls['typeGroups']['controls'][type_index].controls['type_columns']['controls'][column_index].controls['keys']).setValue([]);
			//Basic Form
			(this.basicForm.controls['name']).setValue(this.savedViewPermissionData.name);
			(this.basicForm.controls['description']).setValue(this.savedViewPermissionData.description);
			(this.basicForm.controls['workspace']).setValue(+this.savedViewPermissionData.workspace.id);
			(this.basicForm.controls['module']).setValue(+this.savedViewPermissionData.module.id);
			(this.basicForm.controls['icon']).setValue(this.savedViewPermissionData.view_icon);
			(this.basicForm.controls['filters']).setValue(this.savedViewPermissionData.filters && this.globalVariables.IsJsonString(JSON.stringify(this.savedViewPermissionData.filters)) && JSON.stringify(this.savedViewPermissionData.filters) != '[]' ? JSON.stringify(this.savedViewPermissionData.filters) : '');
			(this.basicForm.controls['sort_order']).setValue(this.savedViewPermissionData.sort_order);
			(this.basicForm.controls['is_system_view']).setValue(this.savedViewPermissionData.is_system_view);
			(this.basicForm.controls['status']).setValue(this.savedViewPermissionData.status);
			(this.basicForm.controls['deleted']).setValue(this.savedViewPermissionData.deleted);

			this.loadModuleAttributes();

			//remove created user entries from available_users list
			// console.log('this.availableUserRoles - before', this.availableUserRoles.length, this.availableUserRoles);
			(this.userRoleForm.controls['roles']).setValue([]);
			if(this.savedViewPermissionData.hasOwnProperty('user_roles_permission_matrix')){
				this.savedViewPermissionData.user_roles_permission_matrix.forEach((userRole, index) => {
					let userDefIndex = this.availableUserRoles.findIndex(item => item.id == userRole.id);
					if(userDefIndex > -1){
						// delete this.availableUserRoles[userDefIndex];
						this.availableUserRoles.splice(userDefIndex, 1);
					}
				});
			}
			// console.log('this.availableUserRoles - after', this.availableUserRoles.length, this.availableUserRoles)

			setTimeout(() => {
				this.ngxSpinner.hide("permission");
				// console.log('tableStructureForm', this.tableStructureForm.value);
			}, 500);
		}
	}
	chooseSavedUserRoleForTranslate(userRole){
		console.log('userRole', userRole);
		this.ngxSpinner.show("permission");
		// console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);
		this.selectedTab = 1;
		this.selectedViewUserDataSet = {
			'view_id' 	: this.drawerItemRecord.id,
			'userRole' 	: userRole,
			'module'	: this.drawerItemRecord.dataset.module,
			'workspace'	: this.drawerItemRecord.dataset.workspace
		};
		// this.translateMode = true;

		this.PermissionMatrixService.fetchViewPermissionData(this.drawerItemRecord.id, userRole.id)
		.subscribe((data) => {
			console.log('fetchViewPermissionData', data.content.values);
			if(data.content.values){
				this.savedViewPermissionData = data.content.values;

				//Basic Form
				(this.basicForm.controls['name']).setValue(this.savedViewPermissionData.name);
				(this.basicForm.controls['description']).setValue(this.savedViewPermissionData.description);
				(this.basicForm.controls['workspace']).setValue(+this.savedViewPermissionData.workspace);
				(this.basicForm.controls['module']).setValue(+this.savedViewPermissionData.module);
				(this.basicForm.controls['icon']).setValue(this.savedViewPermissionData.icon);
				(this.basicForm.controls['filters']).setValue(this.savedViewPermissionData.filters && this.globalVariables.IsJsonString(JSON.stringify(this.savedViewPermissionData.filters)) && JSON.stringify(this.savedViewPermissionData.filters) != '[]' ? JSON.stringify(this.savedViewPermissionData.filters) : '');
				(this.basicForm.controls['sort_order']).setValue(this.savedViewPermissionData.sort_order);
				(this.basicForm.controls['is_system_view']).setValue(this.savedViewPermissionData.is_system_view);
				(this.basicForm.controls['status']).setValue(this.savedViewPermissionData.status);
				(this.basicForm.controls['deleted']).setValue(this.savedViewPermissionData.deleted);

				this.loadModuleAttributes();
				// this.resetAllSteps();
				setTimeout(() => {

					let userRoleSubset = this.savedViewPermissionData.permission_matrix[0][userRole.id][0];
					console.log('userRoleSubset', userRoleSubset);

					//Status Form
					(this.statusForm.controls['statuses']).setValue(userRoleSubset.allowed_statuses);
					(this.statusForm.controls['viewModes']).setValue(userRoleSubset.modes);
					(this.statusForm.controls['allow_to_add']).setValue(userRoleSubset.add);
					(this.statusForm.controls['allow_to_delete']).setValue(userRoleSubset.delete);
					(this.statusForm.controls['overview']).setValue(userRoleSubset.overview && this.globalVariables.IsJsonString(JSON.stringify(userRoleSubset.overview)) && JSON.stringify(userRoleSubset.overview) != '[]' ? JSON.stringify(userRoleSubset.overview) : '');
					(this.statusForm.controls['edit_overview']).setValue(userRoleSubset.edit_overview && this.globalVariables.IsJsonString(JSON.stringify(userRoleSubset.edit_overview)) && JSON.stringify(userRoleSubset.edit_overview) != '[]' ? JSON.stringify(userRoleSubset.edit_overview) : '');
	

					//ModuleType & Group Form
					let savedModuleTypeIds = userRoleSubset.type ? Object.keys(userRoleSubset.type) : [];
					// console.log('userRoleSubset.type', userRoleSubset.type);
					let selectedModuleType = [];
					for ( let index = 0; index < savedModuleTypeIds.length; index++ ) {
						let moduleDef = this.availableModuleTypes.find(item => item.id == savedModuleTypeIds[index]);
						selectedModuleType.push(moduleDef);
					}
					(this.loadedModuleTypeAndGroupsForm.controls['types']).setValue(selectedModuleType);
					
					(this.loadedModuleTypeAndGroupsForm.controls['typeGroups'] as FormArray).clear();
					if(userRoleSubset.type_groups && userRoleSubset.type_groups.length > 0){
						userRoleSubset.type_groups.forEach((typeG, index) => {
							this.addNewTypeGroup();
							(this.loadedModuleTypeAndGroupsForm.controls['typeGroups']['controls'][index].controls['name']).setValue(typeG.name);
							(this.loadedModuleTypeAndGroupsForm.controls['typeGroups']['controls'][index].controls['icon']).setValue(typeG.icon);
							(this.loadedModuleTypeAndGroupsForm.controls['typeGroups']['controls'][index].controls['types']).setValue(typeG.values);
						});
					}

					//Table Structure Form
					this.tableStructureForm = this.createTableStructure();
					this.loadedModuleTypeAndGroupsForm.value.types.forEach((typeObj, typeIndex) => {
						(this.tableStructureForm.controls['typeGroups'] as FormArray).push( this.createTableStructureDefinition(typeObj) );
						(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns'] as FormArray).clear();

						let moduleTableDef = userRoleSubset.type[typeObj.id];
						// console.log('moduleTableDef____', typeObj.id, moduleTableDef);
						// console.log('this.availableFieldsNotConnectedWithModules____', this.availableFieldsNotConnectedWithModules);
						// console.log('this.availableFieldsConnectedWithModules____', this.availableFieldsConnectedWithModules);
						let created_column_index = 0;
						if(typeof moduleTableDef != 'undefined' && Array.isArray(moduleTableDef)){
							moduleTableDef.forEach((col, colIndex) => {
								// console.log('col____', col, colIndex);
								if(!(col.type == 'id' && col.field_id == 'id' && col.keys.length == 1 && col.keys[0] == 'id') && !(col.type == 'id' && col.field_id == 'type_id' && col.keys.length == 1 && col.keys[0] == 'type_id')){
									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns'] as FormArray).push( this.createTableStructureGroupColumn() );

									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['name']).setValue(col.name);
									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['field_id']).setValue(col.field_id);
									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['field_type']).setValue(col.type);

									// console.log('col.keys____', col.keys);
									let selectedColumnKeys = [];
									col.keys.forEach((colField, colFieldIndex) => {
										selectedColumnKeys.push(colField);
									});
									// console.log('selectedColumnKeys____', selectedColumnKeys);
									if(col.type == 'group')
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['keys']).setValue(selectedColumnKeys);
									else if(col.type == 'table'){
										let fieldKey = selectedColumnKeys.length > 0 ? selectedColumnKeys[0] : '';

										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['keys']).setValue(fieldKey);

										let tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == fieldKey);
										if(typeof tableFieldObject != 'undefined' && tableFieldObject.hasOwnProperty("columns") && Array.isArray(tableFieldObject.columns))
											(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['table_columns_available']).setValue(tableFieldObject.columns);
										else
											(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['table_columns_available']).setValue([]);
											
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['table_key_indexes']).setValue(col.indexes ? col.indexes : []);
									}
									else
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['keys']).setValue(selectedColumnKeys.length > 0 ? selectedColumnKeys[0] : '');

									(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']  as FormArray).clear();
									if(col.front_end_type  && col.front_end_type.length > 0){
										let tableFieldObject = undefined;
										if(col.type == 'table'){
											let fieldKey = selectedColumnKeys.length > 0 ? selectedColumnKeys[0] : '';
											tableFieldObject = this.availableFieldsWithTableType.find(item => item.field_id == fieldKey);
										}
										col.front_end_type.forEach((colFront, colFrontIndex) => {
											let colField = undefined;
											if(col.type == 'table' && typeof tableFieldObject != 'undefined'){
												colField = tableFieldObject.columns[colFrontIndex];
											}
											else
												colField = col.keys[colFrontIndex];
											if(typeof colField != 'undefined'){
												let colFieldKey = "";
												let colFieldNameObj = "";
												// let colFieldParentNameObj = null;

												if(col.type == 'table'){
													colFieldKey = colField.field_id;
													colFieldNameObj = colField.name[this.globalVariables.LNG];
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colFieldKey, colFieldNameObj) );
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(colFieldKey);
												}
												else {
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colField) );

													let keySplit = colField.split(".");
													if(keySplit.length === 1){
														colFieldKey = keySplit[0];
														let normalFieldObject = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == colFieldKey);
														if(typeof normalFieldObject != 'undefined'){
															colFieldNameObj = normalFieldObject.name[this.globalVariables.LNG];
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(colFieldKey);
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
														}
													}
													else if(keySplit.length > 1){
														let fieldKeyL0 			= keySplit[0];
														let fieldKeyL1 			= keySplit[1];
														let fieldObjectL0 		= this.availableFieldsConnectedWithModules.find(item => item.field_id == fieldKeyL0);
														if(typeof fieldObjectL0 != 'undefined'){
															colFieldNameObj = fieldObjectL0.name[this.globalVariables.LNG];
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(fieldKeyL0);
															// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l1']).setValue(fieldObjectL0.moduleDefinition);
															(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
															let fieldObjectL1 = fieldObjectL0.moduleDefinition.find(item => item.field_id == fieldKeyL1);
															if(typeof fieldObjectL1 != 'undefined'){
																colFieldNameObj += ' / ' +fieldObjectL1.name[this.globalVariables.LNG];
																(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l1']).setValue(fieldKeyL1);
																(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);

																// console.log('Second level', keySplit.length, keySplit[2], fieldObjectL1.reference_module_id, fieldObjectL1.data_type);
																if(keySplit.length === 3 && keySplit[2] != "" && fieldObjectL1.hasOwnProperty("data_type") && fieldObjectL1.data_type == 'module-reference'){
																	// console.log('Third level');
																	let fieldKeyL2 			= keySplit[2];
																	(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l2']).setValue(fieldKeyL2);
																	let created_column_index__ = created_column_index;	//store the column index seperately, it'll be updated once the response get from api
																	this.getModulesDataById(fieldObjectL1.reference_module_id).then(moduleObjectL1 => {
																		// console.log('moduleObjectL1', moduleObjectL1)
																		if(typeof moduleObjectL1 != 'undefined' && moduleObjectL1.columns && moduleObjectL1.columns.module_fields){
																			// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l2']).setValue(moduleObjectL1.columns.module_fields);

																			let fieldObjectL2 = moduleObjectL1.columns.module_fields.find(t => t.field_id === fieldKeyL2);
																			// console.log('fieldObjectL2', fieldObjectL2, typeIndex, created_column_index__, colFrontIndex);
																			if(typeof fieldObjectL2 != 'undefined'){
																				colFieldNameObj += ' / ' +fieldObjectL2.name[this.globalVariables.LNG];
																				(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
																			}
																		}
																	});
																}
															}

														}
													}
												}
												// console.log('front_end_type______', colFrontIndex, colField);
												// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colFieldKey, colFieldNameObj) );
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['type']).setValue(colFront.type ? colFront.type : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['field_type']).setValue(colFront.field_type ? colFront.field_type : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['is_new_line']).setValue(colFront.newline);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['icon_name']).setValue(colFront.icon && colFront.icon.name ? colFront.icon.name : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['icon_position']).setValue(colFront.icon && colFront.icon.position ? colFront.icon.position : '');
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['tooltip']).setValue(colFront.tooltip ? colFront.tooltip : {});
											}
										});
									}
									else if(col.type == 'id' || col.type == 'status' || col.type == 'single'){

										let colFieldKey = "";
										let colFieldNameObj = "";
										let colFrontIndex= 0;
										let colField = col.keys[colFrontIndex];
										// console.log('front_end_type______fixedIndex', colFrontIndex, colField);
										(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types'] as FormArray).push( this.createTableStructureGroupColumnFrontEndTypeField(colField) );

										let keySplit = colField.split(".");
										if(keySplit.length === 1){
											colFieldKey = keySplit[0];
											// console.log('availableFieldsNotConnectedWithModules', colFieldKey, this.availableFieldsNotConnectedWithModules)
											let normalFieldObject = this.availableFieldsNotConnectedWithModules.find(item => item.field_id == colFieldKey);
											if(typeof normalFieldObject != 'undefined'){
												colFieldNameObj = normalFieldObject.name[this.globalVariables.LNG];
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(colFieldKey);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
											}
										}
										else if(keySplit.length > 1){
											let fieldKeyL0 			= keySplit[0];
											let fieldKeyL1 			= keySplit[1];
											let fieldObjectL0 		= this.availableFieldsConnectedWithModules.find(item => item.field_id == fieldKeyL0);
											if(typeof fieldObjectL0 != 'undefined'){
												colFieldNameObj = fieldObjectL0.name[this.globalVariables.LNG];
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l0']).setValue(fieldKeyL0);
												// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l1']).setValue(fieldObjectL0.moduleDefinition);
												(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
												let fieldObjectL1 = fieldObjectL0.moduleDefinition.find(item => item.field_id == fieldKeyL1);
												if(typeof fieldObjectL1 != 'undefined'){
													colFieldNameObj += ' / ' +fieldObjectL1.name[this.globalVariables.LNG];
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l1']).setValue(fieldKeyL1);
													(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);

													if(keySplit.length === 3 && keySplit[2] != "" && fieldObjectL1.hasOwnProperty("data_type") && fieldObjectL1.data_type == 'module-reference'){
														let fieldKeyL2 			= keySplit[2];
														(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index].controls['front_end_types']['controls'][colFrontIndex].controls['selected_field_l2']).setValue(fieldKeyL2);
														let created_column_index__ = created_column_index;	//store the column index seperately, it'll be updated once the response get from api
														this.getModulesDataById(fieldObjectL1.reference_module_id).then(moduleObjectL1 => {
															if(typeof moduleObjectL1 != 'undefined' && moduleObjectL1.columns && moduleObjectL1.columns.module_fields){
																// (this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['available_child_fields_l2']).setValue(moduleObjectL1.columns.module_fields);

																let fieldObjectL2 = moduleObjectL1.columns.module_fields.find(t => t.field_id === fieldKeyL2);
																if(typeof fieldObjectL2 != 'undefined'){
																	colFieldNameObj += ' / ' +fieldObjectL2.name[this.globalVariables.LNG];
																	(this.tableStructureForm.controls['typeGroups']['controls'][typeIndex].controls['type_columns']['controls'][created_column_index__].controls['front_end_types']['controls'][colFrontIndex].controls['name']).setValue(colFieldNameObj);
																}
															}
														});
													}
												}

											}
										}
									}
									created_column_index++;
								}
							});
						}
					});
					
					//Group By Form
					if(userRoleSubset.group_by && userRoleSubset.group_by.length > 0){
						userRoleSubset.group_by.forEach((gb, index) => {
							this.addNewGroupBy();
							(this.groupByForm.controls['groupBy']['controls'][index].controls['name']).setValue(gb.name);
							(this.groupByForm.controls['groupBy']['controls'][index].controls['field_id']).setValue(gb.field_id);
						});
					}

					//Permission Form 
					if(userRoleSubset.form_fields && userRoleSubset.form_fields.length > 0){
						userRoleSubset.form_fields.forEach((ff, index) => {
							let fieldPermissionIndex = this.permissionMetrixList.findIndex(item => item.id == ff.id);
							if (fieldPermissionIndex > -1) {
								this.permissionMetrixList[fieldPermissionIndex]['view'] = ff.view;
								this.permissionMetrixList[fieldPermissionIndex]['edit'] = ff.edit;
								// console.log(fieldPermissionIndex, this.permissionMetrixList[fieldPermissionIndex]['field_id']);
							}
						});
					}

					//User roles Form 
					let selectedUserRoles = [];
					let userDef = this.availableUserRoles.find(item => item.id == userRole.id);
					selectedUserRoles.push(userDef);
					(this.userRoleForm.controls['roles']).setValue(selectedUserRoles);

					this.ngxSpinner.hide("permission");
					// console.log('tableStructureForm', this.tableStructureForm.value);
				}, 4000);
			}
		});
	}

	createNewView() {
		if(!this.globalVariables.IsEmptyObject(this.basePermissionMatrix)){
			this.ngxSpinner.show("permission");
			this.PermissionMatrixService.createNewView(this.basePermissionMatrix)
				.subscribe((data) => {
					console.log('createNewView Response ', data);
					this.ngxSpinner.hide("permission");
					if(data.success && data.success === true)
						this.eventSubmittedDrawer(data, 'CREATE_NEW_VIEW');
					else
						this.snackBarService.open(this.globalVariables.translation["snack_alert_error_view_creation"][this.globalVariables.LNG], "", 2000);
				});
		}
		else{
			console.log('createNewView Error in Dataset');
		}
	}
	addUserIntoView() {
		if(!this.globalVariables.IsEmptyObject(this.basePermissionMatrix) && this.selectedViewUserDataSet.view_id != ''){
			this.ngxSpinner.show("permission");
			this.PermissionMatrixService.addUserIntoView(this.basePermissionMatrix, this.selectedViewUserDataSet.view_id)
				.subscribe((data) => {
					console.log('addUserIntoView Response ', data);
					this.ngxSpinner.hide("permission");
					if(data.success && data.success === true)
						this.eventSubmittedDrawer(data, 'ADD_USER_TO_VIEW');
					else
						this.snackBarService.open(this.globalVariables.translation["snack_alert_error_while_adding_user_into_view"][this.globalVariables.LNG], "", 2000);
				});
		}
		else{
			console.log('addUserIntoView Error in Dataset');
		}
	}
	editUserPermissionView() {
		if(!this.globalVariables.IsEmptyObject(this.basePermissionMatrix) && this.selectedViewUserDataSet.view_id != ''){
			this.ngxSpinner.show("permission");
			this.PermissionMatrixService.editUserPermissionView(this.basePermissionMatrix, this.selectedViewUserDataSet.view_id)
				.subscribe((data) => {
					console.log('editUserPermissionView Response ', data);
					this.ngxSpinner.hide("permission");
					if(data.success && data.success === true)
						this.eventSubmittedDrawer(data, 'EDIT_USER_VIEW');
					else
						this.snackBarService.open(this.globalVariables.translation["snack_alert_error_view_modification"][this.globalVariables.LNG], "", 2000);
				});
		}
		else{
			console.log('editUserPermissionView Error in Dataset');
		}
	}
	removeUserViewMatrix(userRole){
		// console.log('removeUserViewMatrix clicked');
		// console.log('userRole', userRole);

		const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
			data: {
				message: this.globalVariables.translation['confirm_message_are_you_sure_to_delete_an_user_permission_matrix_from_this_view'][this.lng],
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				console.log('param', param);
				if(!this.debugMode)
					this.deleteUserPermissionView(userRole);
			}
		});
	}

	deleteUserPermissionView(userRole) {
		console.log('view ID: ', this.drawerItemRecord.id, 'UserRole ID:', userRole.id);
		if(this.drawerItemRecord.id != '' && userRole.id != ''){
			this.ngxSpinner.show("permission");
			this.PermissionMatrixService.deleteUserViewPermissionMatrix(this.drawerItemRecord.id, userRole.id)
				.subscribe((data) => {
					console.log('deleteUserPermissionView Response ', data);
					this.ngxSpinner.hide("permission");
					if(data.success && data.success === true)
						this.eventSubmittedDrawer(data, "DELETE_USER_FROM_VIEW");
					else
						this.snackBarService.open(this.globalVariables.translation["snack_alert_error_view_deletion"][this.globalVariables.LNG], "", 2000);
				});
		}
		else{
			console.log('deleteUserPermissionView Error in Dataset');
		}
	}

	cloneUserViewMatrix(userRole){
		console.log('userRole', userRole);
		console.log('drawerItemRecord', this.drawerItemRecord);
		// console.log('availableUserRoles', this.availableUserRoles);
		/*
		this.selectedViewUserDataSet = {
			'view_id' 	: this.drawerItemRecord.id,
			'userRole' 	: userRole,
			'module'	: this.drawerItemRecord.dataset.module,
			'workspace'	: this.drawerItemRecord.dataset.workspace
		};*/

		let availUserRoles__ = this.availableUserRoles.slice(0);	//use slice to remove the bidirectional data binding even if you copy 
		if(this.drawerItemRecord.dataset.hasOwnProperty('user_roles_permission_matrix')){
			this.drawerItemRecord.dataset.user_roles_permission_matrix.forEach((userRole, index) => {
				let userDefIndex = availUserRoles__.findIndex(item => item.id == userRole.id);
				if(userDefIndex > -1){
					availUserRoles__.splice(userDefIndex, 1);
				}
			});
		}

		const dialogRef = this.dialog.open(CloneDialogPermission, {
			data: {
				selectedView	: this.viewTitle,
				cloneFromUser	: userRole,
				module 			: this.drawerItemRecord.dataset.module,
				availUserRoles	: availUserRoles__
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param.action) {
				console.log('param', param);
				console.log('userRole', userRole);
				console.log('drawerItemRecord', this.drawerItemRecord);
				if(!this.debugMode){
					this.ngxSpinner.show("permission");
					this.PermissionMatrixService.fetchViewPermissionData(this.drawerItemRecord.id, userRole.id)
					.subscribe((data) => {
						console.log('fetchViewPermissionData', data.content.values);
						if(data.content.values){
							let savedViewPermissionData = data.content.values;
							let userRoleSubset = savedViewPermissionData.permission_matrix[0][userRole.id][0];
							if(typeof userRoleSubset != "undefined" && this.globalVariables.isObject(userRoleSubset)){
								savedViewPermissionData.permission_matrix[0][param.newRole.id] = []
								userRoleSubset.role = param.newRole.id;
								savedViewPermissionData.permission_matrix[0][param.newRole.id].push(userRoleSubset);

								delete savedViewPermissionData.permission_matrix[0][userRole.id];	// delete the old user data set
								console.log('fetchViewPermissionData- After', savedViewPermissionData);

								this.PermissionMatrixService.addUserIntoView(savedViewPermissionData, this.drawerItemRecord.id)
									.subscribe((data) => {
										console.log('addUserIntoView Response ', data);
										this.ngxSpinner.hide("permission");
										if(data.success && data.success === true)
											this.eventSubmittedDrawer(data, 'CLONE_USER_TO_VIEW');
										else
											this.snackBarService.open(this.globalVariables.translation["snack_alert_error_while_cloning_user_view_permission_matrix"][this.globalVariables.LNG], "", 2000);
									});
							}
							else
								console.log('clone userViewMatrix Error in Dataset');
						}
						else{
							console.log('clone userViewMatrix Error in Dataset - Cannot fetch parent record');
						}
					});
				}
			}
		});
	}

}

@Component({
	selector: 'confirmation-dialog-permission-matrix',
	templateUrl: 'confirmation-dialog-permission-matrix.html',
})
export class ConfirmationDialogPermission {
	
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ConfirmationDialogPermission>,
		public globalVars: GlobalVariables) {
	}
	
	onYesClick(str): void {
		this.dialogRef.close(true);
		console.log('onYesClick');
	}
	
	onNoClick(str) {
		this.dialogRef.close(false);
		console.log('onNoClick');
	}
}
@Component({
	selector: 'clone-dialog-permission-matrix',
	templateUrl: 'clone-dialog-permission-matrix.html',
})
export class CloneDialogPermission {
	
	cloneUserRoleForm: FormGroup;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<CloneDialogPermission>,
		public globalVars: GlobalVariables,
		private fb: FormBuilder) {
			this.cloneUserRoleForm = this.fb.group({
				role : ['', Validators.required]
			});
	}
	
	onYesClick(str): void {
		this.dialogRef.close({action: true, newRole: this.cloneUserRoleForm.value.role});
		console.log('onYesClick');
	}
	
	onNoClick(str) {
		this.dialogRef.close({action: false});
		console.log('onNoClick');
	}
}
