import { AfterViewInit, Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { PermissionMatrixComponent } from '../permission-matrix/permission-matrix.component';
import { GlobalVariables } from 'src/app/global-variables.service';
import { ViewPrivilegeService } from './view-privilege.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { timer } from 'rxjs';

@Component({
  selector: 'app-view-privilege',
  templateUrl: './view-privilege.component.html',
  styleUrls: ['./view-privilege.component.scss']
})
export class ViewPrivilegeComponent implements OnInit, AfterViewInit {

	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	@ViewChild('container', {static: false, read: ViewContainerRef}) viewContainerRef: ViewContainerRef;

	public viewTitle: { en: string, ar: string };
	// public drawerVw: number;

	jsonDemo = []

	selectedFields = []
	roleIdPartView: boolean;
	privilagePartView: boolean;
	permissionMetrix=[]
	public roleId: any
	selectedModule: any
	selectedModuleTypes = []
	public workSpace:string
	public description:string

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
	public drawerType: string = "add";
	public drawerItemRecord = null;
	translateMode: boolean;	//if it is true, it'll hide all action buttons except of Translate
	prohibitedViewIDs = [];	// this view id cannot be allow to open for an edit
	

	constructor(private componentFactoryResolver: ComponentFactoryResolver, 
		private snackBarService: SnackbarService,
		private ngxSpinner: NgxSpinnerService,
		private _viewContainerRef: ViewContainerRef,
		public globalVars: GlobalVariables,
		private ViewPrivilegeService: ViewPrivilegeService) {
		// this.viewTitle = { en: "View Privileges", ar: "View Privileges" };
		this.viewTitle = this.globalVars.translation['view_privileges'];
		this.hasNoData = false;
		// this.tableWidgetData = null;
		this.translateMode = this.globalVars.defaultTranslateMode;
	}
	
	ngOnInit() {
		this.columnStructure = [{
			"name": this.globalVars.translation['ID'],
			"field_id": "id",
			"type": "single"
		}, {
			"name": this.globalVars.translation['view_name'],
			"field_id": "view_name",
			"type": "single"
		}, {
			"name": this.globalVars.translation['module_name'],
			"field_id": "module",
			"type": "single",
		}, /*{
			"name": this.globalVars.translation['workspace_name'],
			"field_id": "workspace",
			"type": "single",
		}, */{
			"name": this.globalVars.translation['user_roles'],
			"field_id": "user_roles",
			"type": "table",
			"front_end_type": [
				{
					type: "chip",
					icon: {name: "account", position: "before"},
					tooltip: {en: "User", ar: "User"},
					newline: true
				}
			]
		}];
		this.fetchAllViewRecords();
	}
	ngAfterViewInit() {

	}

	openDrawerComponent(type) {
		this.viewContainerRef.clear();
		// this.drawerVw = 80;
		this.drawerType = type;
		if(type == 'add'){
			this.drawerItemRecord = null;
		}
		this.drawer.toggle();
	}

	openedDrawerComponent(type?: string, data?: any) {
		let permissionDrawerFactory 		= this.componentFactoryResolver.resolveComponentFactory(PermissionMatrixComponent);
		let permissionDrawer 				= this.viewContainerRef.createComponent(permissionDrawerFactory).instance;

		permissionDrawer.drawerType 		= this.drawerType;
		permissionDrawer.drawerItemRecord 	= this.drawerItemRecord;
		permissionDrawer.translateMode 		= this.translateMode;

		permissionDrawer.submitted.subscribe((data) => {
			console.log('permissionDrawer.submitted', data);
			this.drawer.toggle();
			this.viewContainerRef.clear();
			this.fetchAllViewRecords();
			console.log('Reloading fetchAllViewRecords()');
			let snackBarMsg = "";
			switch(data.mode){
				case 'CREATE_NEW_VIEW'		: snackBarMsg = this.globalVars.translation["snack_alert_created_new_view"][this.globalVars.LNG]; break;
				case 'ADD_USER_TO_VIEW'		: snackBarMsg = this.globalVars.translation["snack_alert_added_new_user_into_view"][this.globalVars.LNG]; break;
				case 'EDIT_USER_VIEW'		: snackBarMsg = this.globalVars.translation["snack_alert_modified_user_permission_matrix_in_view"][this.globalVars.LNG]; break;
				case 'DELETE_USER_FROM_VIEW': snackBarMsg = this.globalVars.translation["snack_alert_deleted_user_from_view"][this.globalVars.LNG]; break;
				case 'CLONE_USER_TO_VIEW'	: snackBarMsg = this.globalVars.translation["snack_alert_cloned_user_view_permission_matrix"][this.globalVars.LNG]; break;
			}
			this.snackBarService.open(snackBarMsg, "", 2000);
		});
		permissionDrawer.cancelled.subscribe((data) => {
			this.drawer.toggle();
			this.viewContainerRef.clear();
		});
	}
	/*permissionDrawerSubmitted(data){
		console.log('testing permissionDrawerSubmitted');
		this.drawer.toggle();
		this.fetchAllViewRecords();
		console.log('Reloading fetchAllViewRecords()');
		let snackBarMsg = "";
		switch(data.mode){
			case 'CREATE_NEW_VIEW'		: snackBarMsg = this.globalVars.translation["snack_alert_created_new_view"][this.globalVars.LNG]; break;
			case 'ADD_USER_TO_VIEW'		: snackBarMsg = this.globalVars.translation["snack_alert_added_new_user_into_view"][this.globalVars.LNG]; break;
			case 'EDIT_USER_VIEW'		: snackBarMsg = this.globalVars.translation["snack_alert_modified_user_permission_matrix_in_view"][this.globalVars.LNG]; break;
			case 'DELETE_USER_FROM_VIEW': snackBarMsg = this.globalVars.translation["snack_alert_deleted_user_from_view"][this.globalVars.LNG]; break;
		}
		this.snackBarService.open(snackBarMsg, "", 2000);
	}
	permissionDrawerCancelled(data){
		console.log('testing permissionDrawerCancelled');
		this.drawer.toggle();
	}*/

	@ViewChild("tableWidget", {static: false}) tableWidgetComponent: TableWidget;
	
	fetchAllViewRecords() {
		this.ngxSpinner.show("views-list");
		this.tableWidgetData = null;
		this.ViewPrivilegeService.loadAllViews(this.globalVars.getCurrentApplicationID())
		.subscribe((data) => {
			// console.log('data', data);
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
			this.ngxSpinner.hide("views-list");
		});

		/*let data = this.ViewPrivilegeService.loadAllViews();
		// console.log('data___', data)
		this.viewData = data['content_modified'] ? data['content_modified'] : [];
		// console.log('viewData', this.viewData);
		this.tableWidgetData = {
			columnStructure: this.columnStructure,
			data: this.viewData,
			typeStructure: {
				0: this.columnStructure
			}
		};
		this.hasNoData = this.viewData.length == 0 ? true : false;
		this.ngxSpinner.hide("views-list");*/

	}

	rowClicked(row) {
		console.log(row);

		if (row && this.prohibitedViewIDs.some(x => x === row.id)) {
			this.snackBarService.open(this.globalVars.translation["prohibited_to_open"][this.globalVars.LNG], null, 4000);
		}
		else{
			this.openDrawerComponent("edit");
			this.drawerItemRecord = row;
		}
	}
}
