import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAccountService } from './user-account.service';
import { MatSidenav, MatDialog, MatStepper } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { PermissionMatrixService } from '../permission-matrix/permission-matrix.service';
import { ConfirmationDialogPermission } from '../permission-matrix/permission-matrix.component';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { timer } from 'rxjs';
// import { DynamicFieldDirective } from 'src/app/modules/core/shared/components/dynamic-reactive-form/dynamic-field/dynamic-field.directive';

@Component({
	selector: 'app-user-account',
	templateUrl: './user-account.component.html',
	styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements  OnInit, AfterViewInit {

	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	public viewTitle: { en: string, ar: string };
	public hasNoData: boolean;
	public viewData: [];
	public columnStructure: any;
	public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
		statusInfoNChanges?: object,
		typeStructure: object,
		configuration: object
	};

	public drawerTitle: { en: string, ar: string } = { en: "", ar: "" };
	public drawerType: string = "ADD";
	public drawerItemRecord = null;
	lng: any;
	typeForm: FormGroup;
	basicForm: FormGroup;
	permissionForm: FormGroup;
	availableStages: any = [];
	availableStatuses: { 'id': number; 'name': { 'en': string; 'ar': string }; 'color': string; }[];
	availableFields: any = [];
	availableModuleTypes: any = [];
	availableModuleTypesUpdated: any = [];
	availableApplications: any = [];
	availableUserRoles: any = [];
	availableWorkspaces: any = [];

	availableFieldsConnectedWithModules: any = [];
	availableFieldsConnectedWithModulesUnique: any = [];
	availableFieldsConnectedWithModulesUniqueIndexed: any = {};

	debugMode: boolean = false;	//if it is true, API calls which will effect in database data will not be triggered
	// translateMode: boolean;	//if it is true, it'll hide all fields not related with translates
	stepperIndex = 0;
	isLinear = false;
	loadAllReferenceModuleRecords = true;	//if it is true, then load all records related to form fields which is "module-reference" type

	constructor(public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService,
		private UserAccountService: UserAccountService,
		private fb: FormBuilder,
		private PermissionMatrixService: PermissionMatrixService,
		private dialog: MatDialog,
		private snackBarService: SnackbarService) {
		this.viewTitle = this.globalVars.translation["user_accounts"];
		this.hasNoData = false;
		// this.translateMode = this.globalVars.defaultTranslateMode;
	}

	ngOnInit() {
		this.lng = this.globalVars.LNG;
		this.columnStructure = [{
			"name": this.globalVars.translation['ID'],
			"field_id": "id",
			"type": "single"
		}, {
			"name": this.globalVars.translation['Name'],
			"field_id": "name",
			"type": "single"
		}, {
			"name": this.globalVars.translation['username'],
			"field_id": "username",
			"type": "single",
		}, {
			"name": this.globalVars.translation['Email'],
			"field_id": "email",
			"type": "single",
		}, {
			"name": this.globalVars.translation['phone'],
			"field_id": "phone",
			"type": "single",
		}];
		this.fetchAllUserAccountRecords();

		this.availableStages = [
			{ name: this.globalVars.translation['user_type_details'], current: true, completed: false, formName: 'typeForm'},
			{ name: this.globalVars.translation['basic_details'], current: true, completed: false, formName: 'basicForm'},
			{ name: this.globalVars.translation['permissions'], current: false, completed: false, formName: 'permissionForm'}
		];
		
		this.resetFormDatas();
		this.loadUserModuleAttributes();
	}

	resetFormDatas(){
		this.typeForm = this.createTypeForm();
		this.basicForm = this.fb.group({ });
		this.permissionForm = this.createPermissionForm();
	}

	ngAfterViewInit() {
		
		//Load All Available User roles
		this.PermissionMatrixService.loadAllWorkSpaces()
			.subscribe((data) => {
				this.availableWorkspaces = data.content && Array.isArray(data.content) ? data.content : [];
				// console.log('availableWorkspaces', this.availableWorkspaces);
			});

		//Load All Available Applications
		this.UserAccountService.getAllApplications()
			.subscribe((data) => {
				this.availableApplications = data.content && Array.isArray(data.content) ? data.content : [];

				setTimeout(() => {
					this.availableApplications.forEach((app, appInd) => {
						if(app.menus && app.menus.length > 0){
							app.menus.forEach((menu, menuInd) => {
								if(menu.workspaces && menu.workspaces.length > 0){
									let workspacesModified = [];
									menu.workspaces.forEach((workspace, workspaceInd) => {
										let wDef = this.availableWorkspaces.find(item => item.id == workspace);
										if(typeof wDef != "undefined")
											workspacesModified.push(wDef);
									}); 
									menu.workspaces = workspacesModified;
								}
							}); 
						}
					}); 
					// console.log('availableApplicationsUpdated', this.availableApplications);
				}, 1500);
			});
		
		//Load All Available User roles
		this.UserAccountService.getAllUserRoles()
			.subscribe((data) => {
				this.availableUserRoles = data.content && Array.isArray(data.content) ? data.content : [];
			});
		
	}

	loadUserModuleAttributes(){
		this.UserAccountService.fetchModuleDefinitionData(this.globalVars.systemModuleConstants.USER)
			.subscribe((data) => {
				// console.log('loadUserModuleAttributes', data);
				if( data.content && data.content.columns){
					this.availableStatuses 		= data.content.columns.hasOwnProperty("module_statuses") && Array.isArray(data.content.columns.module_statuses)  ? data.content.columns.module_statuses : [];
					this.availableFields 		= data.content.columns.hasOwnProperty("module_fields") && Array.isArray(data.content.columns.module_fields)  ? data.content.columns.module_fields : [];
					this.availableModuleTypes 	= data.content.columns.hasOwnProperty("module_types") && Array.isArray(data.content.columns.module_types)  ? data.content.columns.module_types : [];

					this.availableModuleTypesUpdated = this.availableModuleTypes;
					this.availableModuleTypesUpdated.forEach((mt, mti) => {
						this.availableModuleTypesUpdated[mti].forms.groupsUpdated = [];
						mt.forms.groups.forEach((mtg, mtgi) => {
							let objMTFieldsUpdated = [];
							mtg.fields.forEach((mtf, mtfi) => {
								objMTFieldsUpdated.push(this.availableFields[mtf]);
							}); 

							this.availableModuleTypesUpdated[mti].forms.groupsUpdated.push({ 'groupName': mtg.name , 'fields': objMTFieldsUpdated, 'optional': false });
						}); 
					});  
					// console.log('availableModuleTypesUpdated', this.availableModuleTypesUpdated);

					if(this.loadAllReferenceModuleRecords)
						this.extractConnectedModules();
				}
			});
	}

	createTypeForm(){
		return this.fb.group({
			type 		: ['', Validators.required]
		});
	}

	modifyUserType(event: any){
		
		let selectedType = this.availableModuleTypes.find(item => item.id == event.source.value);
		console.log('selectedType', selectedType);
		if(typeof selectedType != "undefined"){
			this.basicForm = this.fb.group({ });

			if(this.drawerType != 'EDIT'){
				this.basicForm.addControl('username', new FormControl('', Validators.required));
				this.basicForm.addControl('password', new FormControl('', Validators.required));
			}
			selectedType.forms.groupsUpdated.forEach((mtg, mtgi) => {
				mtg.fields.forEach((mtf, mtfi) => {

					// if(mtf.optional && mtf.optional == true)
						this.basicForm.controls['']
						if(mtf.data_type && mtf.data_type === 'name-object')
							this.basicForm.addControl(mtf.field_id, this.fb.group({en: [''], ar: ['']}));
						else
							this.basicForm.addControl(mtf.field_id, new FormControl(''));
					// else
					// 	this.basicForm.addControl(mtf.field_id, new FormControl('', Validators.required));
				}); 
			}); 
		}
	}

	createBasicForm(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),  
			application	: ['', Validators.required],
			modules 	: [[]],
			icon 		: [''],
			sort_order 	: [''],
			type 		: ['user'],
			status		: ['true']
		});
	}

	createPermissionForm(){
		return this.fb.group({
			apps 	: this.fb.array([ this.createAppDefinitionForPermissionForm() ])
		});
	}
	createAppDefinitionForPermissionForm(appObj?: any){
		return this.fb.group({
			app_id 			: [''],
			app_name 		: this.fb.group({en: [''], ar: ['']}),
			available_menus	: [[]],
			// menus 			: this.fb.array([ this.createAppMenuForPermissionForm() ])
			menus 			: this.fb.array([ ])
		});
	}
	createAppMenuForPermissionForm(){
		return this.fb.group({
			menu_route 		: [''],
			menu_name 		: this.fb.group({en: [''], ar: ['']}),
			available_workspaces	: [[]],
			// workspaces 		: this.fb.array([ this.createAppMenuWorkspacesForPermissionForm() ])
			workspaces 		: this.fb.array([  ])
		});
	}
	createAppMenuWorkspacesForPermissionForm(){
		return this.fb.group({
			workspace 	: ['', Validators.required],
			role 		: ['', Validators.required]
		});
	}

	addApps(){
		(this.permissionForm.controls['apps'] as FormArray).push( this.createAppDefinitionForPermissionForm() );
	}
	removeApp(app_index){
		(this.permissionForm.controls['apps'] as FormArray).removeAt(app_index);
	}
	modifyAppName(event: any, app_index){
		// console.log('modifyAppName', event.source.value);

		let selectedApp = this.availableApplications.find(item => item.id == event.source.value);
		// console.log('selectedApp', selectedApp);

		if(typeof selectedApp != "undefined"){
			// (this.permissionForm.controls['apps']['controls'][app_index].controls['app_id']).setValue(event.source.value.id);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['app_name']).setValue(selectedApp.name);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['available_menus']).setValue(selectedApp.menus);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']  as FormArray).clear();
		}
	}
	modifyAppNameAdvanced(event: any, app_index){
		return false;
		console.log('modifyAppName', event.source.selected, event.source.value);
		// event.source.value - the field_id value
		// event.source.selected - the selection status
		if(!event.isUserInput) {
			return false;
		}

		if(event.source.selected){
			console.log('selected');
			(this.permissionForm.controls['apps']['controls'][app_index].controls['app_id']).setValue(event.source.value.id);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['app_name']).setValue(event.source.value.name);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['available_menus']).setValue(event.source.value.menus);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']  as FormArray).clear();
		}
		// console.log('modifyAppNameAdvanced', event.source.value, event.source.selected);
	}

	addMenus(app_index){
		(this.permissionForm.controls['apps']['controls'][app_index].controls['menus'] as FormArray).push( this.createAppMenuForPermissionForm() );
	}
	removeMenu(app_index, menu_index){
		(this.permissionForm.controls['apps']['controls'][app_index].controls['menus'] as FormArray).removeAt(menu_index);
	}
	modifyMenuName(event: any, app_index, menu_index){
		
		let selectedMenu = this.permissionForm.value.apps[app_index].available_menus.find(item => item.route == event.source.value);

		if(typeof selectedMenu != "undefined"){
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['menu_name']).setValue(selectedMenu.Name);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['available_workspaces']).setValue(selectedMenu.workspaces);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['workspaces']  as FormArray).clear();
		}
		// console.log('modifyAppNameAdvanced', event.source.value, event.source.selected);
	}
	modifyMenuNameAdvanced(event: any, app_index, menu_index){
		return false;
		// event.source.value - the field_id value
		// event.source.selected - the selection status
		if(!event.isUserInput) {
			return false;
		}
		if(event.source.selected){
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['menu_route']).setValue(event.source.value.route);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['menu_name']).setValue(event.source.value.Name);
			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['available_workspaces']).setValue(event.source.value.workspaces);

			(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['workspaces']  as FormArray).clear();
		}
		// console.log('modifyAppNameAdvanced', event.source.value, event.source.selected);
	}
	
	addWorkspaces(app_index, menu_index){
		(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['workspaces'] as FormArray).push( this.createAppMenuWorkspacesForPermissionForm() );
	}
	removeWorkspace(app_index, menu_index, workspace_index){
		(this.permissionForm.controls['apps']['controls'][app_index].controls['menus']['controls'][menu_index].controls['workspaces'] as FormArray).removeAt(workspace_index);
	}

	@ViewChild("tableWidget", {static: false}) tableWidgetComponent: TableWidget;
	@ViewChild('stepper', {static: false}) stepper: MatStepper;
	
	fetchAllUserAccountRecords() {

		this.ngxSpinner.show("user-account-list");
		this.tableWidgetData = null;
		this.UserAccountService.loadAllUserAccounts()
		.subscribe((data) => {
			// console.log('data', data);
			this.viewData = data.content_modified ? data.content_modified : [];
			this.tableWidgetData = {
				columnStructure: this.columnStructure,
				data: this.viewData,
				typeStructure: {
					0: this.columnStructure
				},
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
				this.tableWidgetComponent.initTableData();
			});

			this.hasNoData = this.viewData.length == 0 ? true : false;
			this.ngxSpinner.hide("user-account-list");
		});
	}
	openDrawerComponent(row?) {

		// this.stepperIndex = 1;
		this.stepper.reset()
		// reset
		// this.basicForm = this.fb.group({ });
		this.resetFormDatas();
		if (row) {
			this.drawerTitle = this.globalVars.translation["edit_user_account"];
			this.drawerType = 'EDIT';
			this.drawerItemRecord = row;
		} else {
			this.drawerTitle = this.globalVars.translation["create_new_user_account"];
			this.drawerType = 'ADD';
			this.drawerItemRecord = null;
		}
		this.drawer.toggle();
	}
	openedDrawerComponent() {
		// this.loadDrawerComponents();
		if(this.drawerType == 'EDIT'){
			this.initEditState();
		}
		else{
			(this.typeForm.controls['type']).setValue("");
		}
	}
	eventCancelledDrawer() {
		this.drawer.toggle();
	}

	rowClicked(row) {
		console.log(row);
		this.openDrawerComponent(row);
	}

	loadDrawerComponents(){
	}

	initEditState(){
		this.ngxSpinner.show("user-account-drawer");
		// console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);
		this.UserAccountService.getUserAccountByID(this.drawerItemRecord.id)
		.subscribe((data) => {
			this.ngxSpinner.hide("user-account-drawer");
			console.log('getUserAccountByID', data.content);
			if(data.content){
				let record = data.content;
				// let selectedUserType = record.type_id ? record.type_id : '';
				// let selectedUserType = +this.drawerItemRecord.type_id;
				let selectedUserType = +record.type_id;
				// console.log('selectedUserType', selectedUserType);
				(this.permissionForm.controls['apps'] as FormArray).clear();

				if(selectedUserType > -1){
					let selectedType = this.availableModuleTypes.find(item => +item.id === +selectedUserType);
					console.log('selectedType', selectedType);
					if(typeof selectedType != "undefined"){
						this.basicForm = this.fb.group({ });

						selectedType.forms.groupsUpdated.forEach((mtg, mtgi) => {
							mtg.fields.forEach((mtf, mtfi) => {
								let fieldVal = record[mtf.field_id] ? record[mtf.field_id] : "";
								// if(mtf.optional && mtf.optional == true)
									if(mtf.data_type && mtf.data_type === 'name-object')
										this.basicForm.addControl(mtf.field_id, this.fb.group({en: [fieldVal.en], ar: [fieldVal.ar]}));
									// else if(mtf.data_type && mtf.data_type === 'date' && fieldVal != '')
									// 	this.basicForm.addControl(mtf.field_id, new FormControl(fieldVal));
									else
										this.basicForm.addControl(mtf.field_id, new FormControl(fieldVal));
								// else
								// 	this.basicForm.addControl(mtf.field_id, new FormControl(fieldVal, Validators.required));
							}); 
						}); 
					}
				}
				(this.typeForm.controls['type']).setValue(+selectedUserType);

				let permissionMatrixV2Apps = record.permission_matrixV2 ? Object.keys(record.permission_matrixV2) : [];
				if(permissionMatrixV2Apps.length > 0){
					for ( let index = 0; index < permissionMatrixV2Apps.length; index++ ) {
						let app_id = permissionMatrixV2Apps[index];
						let app = record.permission_matrixV2[app_id];
						if(app_id != ''){

							(this.permissionForm.controls['apps'] as FormArray).push( this.createAppDefinitionForPermissionForm() );
							let selectedApp = this.availableApplications.find(item => item.id == app_id);
							if(typeof selectedApp != "undefined"){
								(this.permissionForm.controls['apps']['controls'][index].controls['app_id']).setValue(app_id);
								(this.permissionForm.controls['apps']['controls'][index].controls['app_name']).setValue(selectedApp.name);
								(this.permissionForm.controls['apps']['controls'][index].controls['available_menus']).setValue(selectedApp.menus);
								(this.permissionForm.controls['apps']['controls'][index].controls['menus']  as FormArray).clear();

								if(app.menus && app.menus.length > 0){
									app.menus.forEach((menu, menuInd) => {
										let menuRoute 	= menu.route;

										(this.permissionForm.controls['apps']['controls'][index].controls['menus'] as FormArray).push( this.createAppMenuForPermissionForm() );
										let selectedMenu = this.permissionForm.value.apps[index].available_menus.find(item => item.route == menuRoute);
										if(typeof selectedMenu != "undefined"){
											(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['menu_route']).setValue(menuRoute);
											(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['menu_name']).setValue(selectedMenu.Name);
											(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['available_workspaces']).setValue(selectedMenu.workspaces);
											(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['workspaces']  as FormArray).clear();

											
											if(menu.workspaces && menu.workspaces.length > 0){
												menu.workspaces.forEach((ws, wsInd) => {
													let workspace	= ws.workspace;
													let role		= ws.role;

													(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['workspaces'] as FormArray).push( this.createAppMenuWorkspacesForPermissionForm() );
													(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['workspaces']['controls'][wsInd].controls['workspace']).setValue(workspace);
													(this.permissionForm.controls['apps']['controls'][index].controls['menus']['controls'][menuInd].controls['workspaces']['controls'][wsInd].controls['role']).setValue(role);
												}); 
											}
										}
									});
								}
							}
						}
					}
				}
			}
		});
	}

	saveFormDialog(){
		console.log('typeForm', this.typeForm.value);
		console.log('basicForm', this.basicForm.value);
		console.log('permissionForm', this.permissionForm.value);
		// return false;

		let msg = "";
		if(this.drawerType == 'EDIT')
			msg = this.globalVars.translation['confirm_message_are_you_sure_to_edit_an_user_account'][this.lng];
		else	//ADD
			msg = this.globalVars.translation['confirm_message_are_you_sure_to_create_a_new_user_account'][this.lng];
		const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
			data: {
				message: msg,
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				console.log('param', param);
				if(!this.debugMode){
					let saveObject 		= this.basicForm.value;
					let selectedApps 	= [];
					let permission_matrix = {};
					let permission_matrixV2 = {};
					if(this.permissionForm.value.apps && this.permissionForm.value.apps.length > 0){
						this.permissionForm.value.apps.forEach((app, appInd) => {
							if(app.app_id != ''){
								selectedApps.push(+app.app_id);

								if(!permission_matrix.hasOwnProperty(app.app_id)){
									permission_matrix[app.app_id] = [];
								}
								if(!permission_matrixV2.hasOwnProperty(app.app_id)){
									permission_matrixV2[app.app_id] = {};
								}
								if(app.menus.length > 0){
									let menusForV2 	= [];
									app.menus.forEach((menu, menuInd) => {
										let menuForV2 	= {};
										menuForV2['route'] 		= menu.menu_route;
										menuForV2['workspaces'] = [];

										if(menu.workspaces.length > 0){
											menu.workspaces.forEach((ws, wsInd) => {
												permission_matrix[app.app_id].push({
														"application"	: app.app_id,
														"role"			: ws.role,
														"workspace"		: ws.workspace
													});
												
												menuForV2['workspaces'].push({
													"workspace"		: ws.workspace,
													"role"			: ws.role
												});
											}); 
										}
										menusForV2.push(menuForV2);
									}); 

									permission_matrixV2[app.app_id]['menus'] = menusForV2;
								}
							}
						}); 
					}
					saveObject['application'] 			= selectedApps;
					saveObject['department'] 			= [];
					saveObject['defaultApplication'] 	= selectedApps.length > 0 ? selectedApps[0] : "";
					saveObject['permission_matrix'] 	= Object.keys(permission_matrix).length > 0 ? [ permission_matrix ] : [];
					saveObject['permission_matrixV2'] 	= permission_matrixV2;
					saveObject['type_id'] 				= this.typeForm.value.type;
					saveObject['status'] 				= 0;
			
					console.log('saveObject JSON: ', saveObject);

					this.saveForm(saveObject);
				}
			}
		});

	}

	saveForm(saveObject) {
		if(this.drawerType == 'EDIT' && this.drawerItemRecord.id != ''){
			this.ngxSpinner.show("user-account-drawer");
			this.UserAccountService.editUserAccount(saveObject, +this.drawerItemRecord.id)
				.subscribe((data) => {
					console.log('saveForm Response ', data);
					this.ngxSpinner.hide("user-account-drawer");
					if(data.success && data.success === true){
						this.drawer.toggle();
						this.fetchAllUserAccountRecords();
						console.log('Reloading fetchAllUserAccountRecords()');
						this.snackBarService.open(this.globalVars.translation["snack_alert_modified_user_account"][this.globalVars.LNG], "", 2000);
					}
					else if(data.status && data.status === 400 && data.error && this.globalVars.isObject(data.error) && data.error.error && data.error.error !== ""){
						this.snackBarService.open(data.error.error, "", 2000);
					}
					else
						this.snackBarService.open(this.globalVars.translation["snack_alert_error_user_account_modification"][this.globalVars.LNG], "", 2000);
				});
		}
		else if(this.drawerType == 'ADD'){
			this.ngxSpinner.show("user-account-drawer");
			this.UserAccountService.createUserAccount(saveObject)
				.subscribe((data) => {
					console.log('saveForm Response ', data);
					this.ngxSpinner.hide("user-account-drawer");

					if(data.success && data.success === true){
						this.drawer.toggle();
						this.fetchAllUserAccountRecords();
						console.log('Reloading fetchAllUserAccountRecords()');
						this.snackBarService.open(this.globalVars.translation["snack_alert_created_new_user_account"][this.globalVars.LNG], "", 2000);
					}
					else if(data.status && data.status === 400 && data.error && this.globalVars.isObject(data.error) && data.error.error && data.error.error !== ""){
						this.snackBarService.open(data.error.error, "", 2000);
					}
					else
						this.snackBarService.open(this.globalVars.translation["snack_alert_error_user_account_creation"][this.globalVars.LNG], "", 2000);
				});
		}
		else{
			console.log('saveForm UserAccount Error in Dataset');
		}
	}

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
					reference_module_values : field.reference_module_values,
					key_show 			: field.key_show,
					moduleRecords 	: []
				});
			}
		});
		
		connectedModulesDistincted = connectedModules.filter((thing, i, arr) => {
			return arr.indexOf(arr.find(t => t.reference_module_id === thing.reference_module_id)) === i;
		});
		
		// console.log('connectedModules', connectedModules);
		console.log('connectedModulesDistincted', connectedModulesDistincted);

		// return { 'connectedModulesAll' : connectedModules, 'connectedModulesDistincted' : connectedModulesDistincted};

		this.availableFieldsConnectedWithModules = connectedModules;
		this.availableFieldsConnectedWithModulesUnique = connectedModulesDistincted;
		setTimeout(() => {
			this.availableFieldsConnectedWithModulesUnique.forEach((field, index) => {
				this.getModulesValuesByIds(field.reference_module_id, field.key_show);
			});
		}, 200);
	}
	getModulesValuesByIds(moduleId, key_show) {
		this.UserAccountService.fetchModuleValuesByModuleId(moduleId, key_show)
			.subscribe((data) => {
				// console.log(data.content);
				if(data.content && data.content.values && Array.isArray(data.content.values) && data.content.values.length > 0){

					let _temp_index = this.availableFieldsConnectedWithModulesUnique.findIndex(item => item.reference_module_id == moduleId);
					if(_temp_index > -1){
						this.availableFieldsConnectedWithModulesUnique[_temp_index].moduleRecords = data.content.values;
						this.availableFieldsConnectedWithModulesUniqueIndexed[moduleId] = data.content.values;

						console.log('availableFieldsConnectedWithModulesUnique', moduleId, key_show, this.availableFieldsConnectedWithModulesUnique[_temp_index]);
					}
				}
			});
	}
	getFieldValue(field: any) {
		if (this.globalVars.isNameObject(field)) {
			try {
				return JSON.parse(field)[this.globalVars.LNG];
			} catch {
				return field[this.globalVars.LNG];
			}
		} else if (this.globalVars.isObject(field)) {
			// if it is an object, we don't know what we have to show
			return field[Object.keys(field)[0]];
		} else if (field === null || field === "null") {
			return "";
		} else if (!this.globalVars.isObject(field)) {
			return field;
		}
		
		return field;
	}
}
