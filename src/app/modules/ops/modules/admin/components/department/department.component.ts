import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { WorkspaceService } from '../workspace/workspace.service';
import { DepartmentService } from './department.service';
import { MatSidenav, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmationDialogPermission } from '../permission-matrix/permission-matrix.component';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { timer } from 'rxjs';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, AfterViewInit {

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
	basicForm: FormGroup;
	availableApplications: any = [];

	debugMode: boolean = false;	//if it is true, API calls which will effect in database data will not be triggered
	translateMode: boolean;	//if it is true, it'll hide all fields not related with translates

	constructor(public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService,
		private WorkspaceService: WorkspaceService,
		private DepartmentService: DepartmentService,
		private fb: FormBuilder,
		private dialog: MatDialog,
		private snackBarService: SnackbarService) {
		this.viewTitle = this.globalVars.translation["departments"];
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
		this.fetchAllDepartmentRecords();
		
		this.basicForm = this.createBasicForm();
	}

	ngAfterViewInit() {
		
		//Load All Available Applications
		this.WorkspaceService.getAllApplications()
			.subscribe((data) => {
				this.availableApplications = data.content && Array.isArray(data.content) ? data.content : [];
			});
	}

	createBasicForm(){
		return this.fb.group({
			name 		: this.fb.group({en: ['', Validators.required], ar: ['', Validators.required]}),  
			code		: ['', Validators.required],
			application	: ['', Validators.required],
			status		: ['1']
		});
	}

	@ViewChild("tableWidget", {static: false}) tableWidgetComponent: TableWidget;
	
	fetchAllDepartmentRecords() {
		this.ngxSpinner.show("department-list");
		this.DepartmentService.loadAllDepartments()
		.subscribe((data) => {
			console.log('data', data);
			this.viewData = data.content_modified ? data.content_modified : [];
			// console.log('fetchChildRecordsBasedOnParentID--After', data.content_modified)
			
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
			this.ngxSpinner.hide("department-list");
		});
	}
	openDrawerComponent(row?) {
		this.basicForm = this.createBasicForm();
		if (row) {
			this.drawerTitle = this.globalVars.translation["edit_department"];
			this.drawerType = 'EDIT';
			this.drawerItemRecord = row;
		} else {
			this.drawerTitle = this.globalVars.translation["create_new_department"];
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
		this.ngxSpinner.show("department-drawer");
		// console.log('drawerType', this.drawerType);
		console.log('drawerItemRecord', this.drawerItemRecord);
		this.DepartmentService.getDepartmentsByID(this.drawerItemRecord.id)
		.subscribe((data) => {
			this.ngxSpinner.hide("department-drawer");
			console.log('DepartmentFetchByID', data.content);
			if(data.content){
				let record = data.content;
				(this.basicForm.controls['name']).setValue(record.name);
				(this.basicForm.controls['code']).setValue(record.deptCode);
				(this.basicForm.controls['application']).setValue(+record.applicationId);
				(this.basicForm.controls['status']).setValue(record.status);
			}
		});
	}

	saveFormDialog(){

		let msg = "";
		if(this.drawerType == 'EDIT')
			msg = this.globalVars.translation['confirm_message_are_you_sure_to_edit_a_department'][this.lng];
		else	//ADD
			msg = this.globalVars.translation['confirm_message_are_you_sure_to_create_a_new_department'][this.lng];
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
						saveObject['dept_code'] 	= this.basicForm.value.code;
						saveObject['application_id']= this.basicForm.value.application;
						saveObject['status'] 		= this.basicForm.value.status;
					}
					else {
						saveObject['name'] 			= this.basicForm.value.name;
						saveObject['dept_code']		= this.drawerItemRecord.dataset.deptCode;
						saveObject['application_id']= +this.drawerItemRecord.dataset.applicationId;
						saveObject['status'] 		= this.drawerItemRecord.dataset.status;
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
			this.ngxSpinner.show("department-drawer");
			this.DepartmentService.editDepartment(saveObject, +this.drawerItemRecord.id)
				.subscribe((data) => {
					console.log('saveForm Response ', data);
					this.ngxSpinner.hide("department-drawer");
					if(data.success && data.success === true){
						this.drawer.toggle();
						this.fetchAllDepartmentRecords();
						console.log('Reloading fetchAllDepartmentRecords()');
						this.snackBarService.open(this.globalVars.translation["snack_alert_modified_department"][this.globalVars.LNG], "", 2000);
					}
					else
						this.snackBarService.open(this.globalVars.translation["snack_alert_error_department_modification"][this.globalVars.LNG], "", 2000);
				});
		}
		else if(this.drawerType == 'ADD' && !this.translateMode){
			this.ngxSpinner.show("department-drawer");
			this.DepartmentService.createDepartment(saveObject)
				.subscribe((data) => {
					console.log('saveForm Response ', data);
					this.ngxSpinner.hide("department-drawer");

					if(data.success && data.success === true){
						this.drawer.toggle();
						this.fetchAllDepartmentRecords();
						console.log('Reloading fetchAllDepartmentRecords()');
						this.snackBarService.open(this.globalVars.translation["snack_alert_created_new_department"][this.globalVars.LNG], "", 2000);
					}
					else
						this.snackBarService.open(this.globalVars.translation["snack_alert_error_department_creation"][this.globalVars.LNG], "", 2000);
				});
		}
		else{
			console.log('saveForm Department Error in Dataset');
		}
	}

}
