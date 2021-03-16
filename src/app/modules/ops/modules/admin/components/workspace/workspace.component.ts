import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkspaceService } from './workspace.service';
import { MatSidenav, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PermissionMatrixService } from '../permission-matrix/permission-matrix.service';
import { ConfirmationDialogPermission } from '../permission-matrix/permission-matrix.component';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { timer } from 'rxjs';

@Component({
	selector: 'app-workspace',
	templateUrl: './workspace.component.html',
	styleUrls: ['./workspace.component.scss']
})
export class WorkspaceComponent implements OnInit, AfterViewInit {

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
		configuration:  object
	};

	public drawerTitle: { en: string, ar: string } = { en: "", ar: "" };
	public drawerType: string = "ADD";
	public drawerItemRecord = null;
	lng: any;
	basicForm: FormGroup;
	availableIcons: any = [];
	// availableApplications: any = [];
	availableModules: any = [];
	// availableMenus: any = [];

	debugMode: boolean = false;	//if it is true, API calls which will effect in database data will not be triggered
	translateMode: boolean;	//if it is true, it'll hide all fields not related with translates

	constructor(public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService,
		private WorkspaceService: WorkspaceService,
		private fb: FormBuilder,
		private PermissionMatrixService: PermissionMatrixService,
		private dialog: MatDialog,
		private snackBarService: SnackbarService) {
		this.viewTitle = this.globalVars.translation["workspaces"];
		this.hasNoData = false;
		this.translateMode = this.globalVars.defaultTranslateMode;
	}

	ngOnInit() {
		this.lng = this.globalVars.LNG;
		this.columnStructure = [{
			"name": this.globalVars.translation['ID'],
			"field_id": "id",
			"type": "single"
		}, {
			"name": this.globalVars.translation['name_en'],
			"field_id": "name_en",
			"type": "single"
		}, {
			"name": this.globalVars.translation['name_ar'],
			"field_id": "name_ar",
			"type": "single",
		}];
		this.fetchAllWorkspaceRecords();
		
		this.basicForm = this.createBasicForm();

		this.availableIcons = this.globalVars.availableIcons;
	}

	ngAfterViewInit() {
		
		//Load All Available Modules
		this.PermissionMatrixService.loadAllModules()
			.subscribe((data) => {
				this.availableModules = data.content_modified;
			});

		//Load All Available Applications
		/*this.WorkspaceService.getAllApplications()
			.subscribe((data) => {
				this.availableApplications = data.content && Array.isArray(data.content) ? data.content : [];
			});*/
	}

	createBasicForm(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),  
			// application	: ['', Validators.required],
			// menu		: ['', Validators.required],
			modules 	: [[]],
			icon 		: [''],
			sort_order 	: [''],
			type 		: ['user'],
			status		: ['true']
		});
	}

	/*modifyAppName(event: any){
		// console.log('modifyAppName', event.source.value);

		let selectedApp = this.availableApplications.find(item => item.id == event.source.value);
		// console.log('selectedApp', selectedApp);

		if(typeof selectedApp != "undefined")
			this.availableMenus = selectedApp.menus;
		else
			this.availableMenus = [];
	}*/

	@ViewChild("tableWidget", {static: false}) tableWidgetComponent: TableWidget;
	
	fetchAllWorkspaceRecords() {
		this.ngxSpinner.show("workspace-list");
		this.tableWidgetData = null;
		this.WorkspaceService.loadAllWorkSpaces()
		.subscribe((data) => {
			console.log('data', data);
			this.viewData = data.content_modified ? data.content_modified : [];
			// console.log('fetchChildRecordsBasedOnParentID--After', data.content_modified)
			// console.log(JSON.stringify(this.viewData));
			// console.log('viewData', this.viewData);
			
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
			this.ngxSpinner.hide("workspace-list");
		});
	}
	openDrawerComponent(row?) {
		this.basicForm = this.createBasicForm();
		if (row) {
			this.drawerTitle = this.globalVars.translation["edit_workspace"];
			this.drawerType = 'EDIT';
			this.drawerItemRecord = row;
		} else {
			this.drawerTitle = this.globalVars.translation["create_new_workspace"];
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
		this.ngxSpinner.show("workspace-drawer");
		// console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);
		this.WorkspaceService.getWorkspaceByID(this.drawerItemRecord.id)
		.subscribe((data) => {
			this.ngxSpinner.hide("workspace-drawer");
			console.log('WorkspaceFetchByID', data.content);
			if(data.content){
				let record = data.content;

				// let selectedApp = this.availableApplications.find(item => item.id == +record.application.id);
				// this.availableMenus = selectedApp.menus;

				(this.basicForm.controls['name']).setValue(record.name);
				// (this.basicForm.controls['application']).setValue(+record.application.id);
				// (this.basicForm.controls['menu']).setValue(record.field_id);
				(this.basicForm.controls['modules']).setValue(JSON.parse(record.modules));
				(this.basicForm.controls['icon']).setValue(record.icon);
				(this.basicForm.controls['sort_order']).setValue(record.sortOrder);
				(this.basicForm.controls['type']).setValue(record.type);
				(this.basicForm.controls['status']).setValue(record.status);
				// console.log('JSON.parse(record.modules)', JSON.parse(record.modules));

			}
		});
	}

	saveFormDialog(){

		let msg = "";
		if(this.drawerType == 'EDIT')
			msg = this.globalVars.translation['confirm_message_are_you_sure_to_edit_a_workspace'][this.lng];
		else	//ADD
			msg = this.globalVars.translation['confirm_message_are_you_sure_to_create_a_new_workspace'][this.lng];
		const dialogRef = this.dialog.open(ConfirmationDialogPermission, {
			data: {
				message: msg,
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				console.log('param', param);
				if(!this.debugMode){
					let saveObject 				= {};

					if(!this.translateMode) {
						saveObject['name'] 			= this.basicForm.value.name;
						// saveObject['application'] 	= this.basicForm.value.application;
						// saveObject['modules'] 	= this.basicForm.value.module.join(',');
						// saveObject['modules'] 	= JSON.stringify(this.basicForm.value.modules);
						saveObject['modules'] 		= this.basicForm.value.modules;
						saveObject['sort_order']	= this.basicForm.value.sort_order.trim() == "" ? 1 : (this.globalVars.IsNumber(this.basicForm.value.sort_order.trim()) ? +(this.basicForm.value.sort_order.trim()) : 1);
						saveObject['type'] 			= this.basicForm.value.type;
						saveObject['status'] 		= this.basicForm.value.status;
						saveObject['icon'] 			= this.basicForm.value.icon;
						// saveObject['field_id'] 			= this.basicForm.value.menu;
					}
					else {
						saveObject['name'] 			= this.basicForm.value.name;
						// saveObject['application'] 	= +this.drawerItemRecord.dataset.application.id;
						saveObject['modules'] 		= this.globalVars.IsJsonString(this.drawerItemRecord.dataset.modules) ? JSON.parse(this.drawerItemRecord.dataset.modules) : [];
						saveObject['sort_order']	= +this.drawerItemRecord.dataset.sortOrder;
						saveObject['type'] 			= this.drawerItemRecord.dataset.type;
						saveObject['status'] 		= this.drawerItemRecord.dataset.status;
						saveObject['icon'] 			= this.drawerItemRecord.dataset.icon;
						// saveObject['field_id'] 			= this.basicForm.value.menu;
						console.log('translate mode is ON');
					}
			
					console.log('JSON', saveObject);

					this.saveForm(saveObject);
				}
			}
		});

	}

	saveForm(saveObject) {
		if(this.drawerType == 'EDIT' && this.drawerItemRecord.id != ''){
			this.ngxSpinner.show("workspace-drawer");
			this.WorkspaceService.editWorkspace(saveObject, +this.drawerItemRecord.id)
				.subscribe((data) => {
					console.log('saveWorkspace Response ', data);
					this.ngxSpinner.hide("workspace-drawer");
					if(data.success && data.success === true){
						this.drawer.toggle();
						this.fetchAllWorkspaceRecords();
						console.log('Reloading fetchAllWorkspaceRecords()');
						this.snackBarService.open(this.globalVars.translation["snack_alert_modified_workspace"][this.globalVars.LNG], "", 2000);
					}
					else
						this.snackBarService.open(this.globalVars.translation["snack_alert_error_workspace_modification"][this.globalVars.LNG], "", 2000);
				});
		}
		else if(this.drawerType == 'ADD' && !this.translateMode){
			this.ngxSpinner.show("workspace-drawer");
			this.WorkspaceService.createWorkspace(saveObject)
				.subscribe((data) => {
					console.log('saveWorkspace Response ', data);
					this.ngxSpinner.hide("workspace-drawer");

					if(data.success && data.success === true){
						this.drawer.toggle();
						this.fetchAllWorkspaceRecords();
						console.log('Reloading fetchAllWorkspaceRecords()');
						this.snackBarService.open(this.globalVars.translation["snack_alert_created_new_workspace"][this.globalVars.LNG], "", 2000);
					}
					else
						this.snackBarService.open(this.globalVars.translation["snack_alert_error_workspace_creation"][this.globalVars.LNG], "", 2000);
				});
		}
		else{
			console.log('saveForm Workspace Error in Dataset');
		}
	}
}
