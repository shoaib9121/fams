import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	OnInit,
	Output,
	TemplateRef,
	ViewChild,
	ViewContainerRef
} from "@angular/core";
import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DynamicReactiveFormComponent } from "src/app/modules/core/shared/components/dynamic-reactive-form/dynamic-reactive-form/dynamic-reactive-form.component";

import { ComponentPortal, TemplatePortal } from "@angular/cdk/portal";
import { EditItemService } from "./edit-item.service";
import { GlobalVariables } from "../../../../../global-variables.service";
import { DataService } from "src/app/shared/service/data.service";
import { SnackbarService } from "../../../../core/shared/services/snackbar/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { ButtonConfirmComponent } from "./buttonconfirmdialog/buttonconfirmdialog.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ModuleDataService } from "../module-data/module-data.service";
import { TableWidget } from "../../../../core/shared/widgets/table-widget/table.widget";
import { ActivatedRoute } from "@angular/router";
import { SharedService } from "src/app/modules/core/shared/components/dynamic-reactive-form/shared/shared.service";
import { ImageDialogComponent } from "src/app/modules/core/shared/components/dialogs/image-dialog/image-dialog.component";
import { SpinnerSnackbarService } from "../../../../core/shared/components/spinner-snackbar/spinner-snackbar.service";
import { timer } from "rxjs";
import { UserService } from "../user.service";
import { AlertDialog } from "../../../../core/shared/dialogs/alert-dialog/alert.dialog";

@Component({
	selector: 'app-edit-drawer',
	templateUrl: './edit-drawer.component.html',
	styleUrls: ['./edit-drawer.component.scss'],
	providers: [{
		provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
	}]
})
export class EditDrawerComponent implements OnInit, AfterViewInit {

	/**
	 * Data that is needed for selected item
	 */
	@Input() data: any;

	/**
	 * Field Definition for dynamic reactive form component
	 */
	@Input() fields: any;

	/**
	 * Provided if whe need to show an overview ("=small dashboard") in this component
	 */
	@Input() editOverview: any;

	/**
	 * When user presses save actionButton, this event will be emitted, indicating a reload
	 */
	@Output() submitted: EventEmitter<any> = new EventEmitter();

	/**
	 * Emitted when user presses cancel actionButton, indicating that no action should be taken by parent
	 */
	@Output() cancelled: EventEmitter<any> = new EventEmitter();

	/**
	 * All moduleStatuses of module are passed here
	 */
	@Input() moduleStatuses: any;

	/**
	 * Button Actions at the step of editing: User is able to perform certain actions
	 */
	@Input() actionButtons: any[];
	/**
	 * Button Actions at the step of editing: User is able to perform certain actions
	 */
	@Input() statusView: any;

	/*
	 * Data get to store cards
	 */
	@Input() cardData: any;

	/**
	 * Title that is shown in the top bar
	 */
	public drawerTitle: string;

	/**
	 * Attachments of item
	 */
	public attachments: any;

	/**
	 * Log of item
	 */
	public itemLog: any;

	/**
	 * cdk Portal
	 */
	@ViewChild('templatePortalContent', {static: false}) templatePortalContent: TemplateRef<any>;
	componentPortal: ComponentPortal<EditDrawerComponent>;

	/**
	 * cdk Portal
	 */
	templatePortal: TemplatePortal<any>;
	@ViewChild(DynamicReactiveFormComponent, {static: false}) form: DynamicReactiveFormComponent;

	/**
	 * Comments of item
	 */
	public comments: any;

	/**
	 * FormGroup for attachment form
	 */
	public attachmentForm: FormGroup;

	/**
	 * Form Group for chat form
	 */
	public chatForm: FormGroup;

	fileListForDownload: any = [];

	@ViewChild('scrollMe', {static: false}) myScrollContainer: ElementRef;

	// Setting properties to avoid method calls in template
	userName: any;
	name: any;
	currentApplicationName: any;

	statusArray: any = [];
	keys: any;

	/**
	 * Stores structure, data & moduleStatuses for list view
	 */
	public subTableTitle: String;
	public viewData: any = [];
	public columnStructure: any;
	public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
		typeStructure: object,
	};
	/**
	 * Current View ID - extracted from the route
	 */
	public viewId: number;

	/**
	 * Current Module ID - extracted from the route
	 */
	public moduleId: number;

	/**
	 * Current Role ID - extracted from the route
	 */
	public roleId: number;

	@ViewChild('tableWidget', {static: false}) tableWidget: TableWidget;
	downloadFileUrl: string;
	downloadFilename: any;
	sideDrawerWidth: string;

	constructor(private formBuilder: FormBuilder,
	            private editItemService: EditItemService,
	            private _viewContainerRef: ViewContainerRef,
	            private ref: ChangeDetectorRef,
	            public globalVars: GlobalVariables,
	            private dialog: MatDialog,
	            private ngxSpinner: NgxSpinnerService,
	            public snackBarService: SnackbarService,
	            public moduleDataService: ModuleDataService,
	            private dataService: DataService,
				private route: ActivatedRoute,
				public formSharedService: SharedService,
				public spinnerSnackBarService: SpinnerSnackbarService,
				private userService: UserService
				) {
		this.drawerTitle = this.globalVars.translation["Update_" + this.globalVars.getCurrentApplicationName()][this.globalVars.LNG];
		this.comments = [];

		// TODO: @SMDN: Why we need this?
		this.route.paramMap.subscribe(paramMap => {
			this.moduleId = +paramMap.get("moduleId");
			this.viewId = +paramMap.get("viewId");
			this.roleId = +paramMap.get("roleId");
		});
	}

	ngOnInit() {
		this.ngxSpinner.show("edit");
		this.createAttachmentForm();
		this.createChatForm();
		this.userName = JSON.parse(window.localStorage.getItem("user_info")).username;
		this.name = JSON.parse(window.localStorage.getItem("user_info")).name;
		this.currentApplicationName = this.globalVars.getCurrentApplicationName();

		console.log('Application Name', this.currentApplicationName);
		this.checkDrawerWidth();
	}

	ngAfterViewInit() {
		this.componentPortal = new ComponentPortal(EditDrawerComponent);
		this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
		this.ref.detectChanges();
		this.fetchItemDetails();
		this.fetchComments();
		this.fetchLog();
		try {
			timer(0).subscribe(() => {
				this.data.statusStages = this.moduleDataService.getModuleTypeStatusStages(this.data.type_id)
			});
		} catch (exception) {

		}

		/* SMSDN starts */
		console.log('this.viewId', this.viewId);
		if (this.viewId == 249) { //Load the Child components only if the view is VEHICLE LIST (Hardcoded One Req by Shaju)
			this.subTableTitle = 'Child Components';
			this.columnStructure = [{
				"name": {"en": "Equipment Type", "ar": "Equipment Type"},
				"input_languages": ["en", "ar"],
				"field_id": "equipment_type",
				"keys": ["equipment_type"],
				"data_type": "text-json",
				"type": "single",
				"validation": [],
				"is_system_column": 0,
				"sort_order": 0,
				"deleted": 0
			}, {
				"name": {"en": "Manufacturer", "ar": "Manufacturer"},
				"input_languages": ["en", "ar"],
				"field_id": "manufacturer_id",
				"keys": ["manufacturer_name"],
				"data_type": "text-json",
				"type": "single",
				"validation": [],
				"is_system_column": 0,
				"sort_order": 0,
				"deleted": 0
			}, {
				"name": {"en": "Model", "ar": "Model"},
				"input_languages": ["en", "ar"],
				"field_id": "model_id",
				"keys": ["model_id"],
				"data_type": "text-json",
				"type": "single",
				"validation": [],
				"is_system_column": 0,
				"sort_order": 0,
				"deleted": 0
			}, {
				"name": {"en": "Model Year", "ar": "Model Year"},
				"input_languages": ["en", "ar"],
				"field_id": "model_year",
				"keys": ["model_year"],
				"data_type": "text-json",
				"type": "single",
				"validation": [],
				"is_system_column": 0,
				"sort_order": 0,
				"deleted": 0
			}];
			//this.viewData = [{"data":[{"id":"2143","type_id":"0","equipment_type":"Test 1","manufacturer_id":"Suzuki","model_id":"G3","model_year":"2019"},{"id":"1640","type_id":"0","equipment_type":"Test 2","manufacturer_id":"Honda","model_id":"KUIU87","model_year":2018},{"id":"2149","type_id":"0","equipment_type":"Test 3","manufacturer_id":"Audi","model_id":"YED252","model_year":2000},{"id":"2152","type_id":"0","equipment_type":"Test 4","manufacturer_id":"Hitachi","model_id":"UUE87","model_year":2020},{"id":"2148","type_id":"0","equipment_type":"Tes 5","manufacturer_id":"Philips","model_id":"KKLKSD","model_year":2001},{"id":"2159","type_id":"0","equipment_type":"Test 6","manufacturer_id":"Samsung","model_id":"OOES30","model_year":2006},{"id":"2157","type_id":"0","equipment_type":"Test 8","manufacturer_id":"Apple","model_id":"ECC3948","model_year":1998},{"id":"2182","type_id":"0","equipment_type":"Test 15","manufacturer_id":"Nokia","model_id":"TC93","model_year":2009}]}];
			this.fetchChildRecordsBasedOnParentID(this.data.id, this.moduleId);
		}
		/* SMSDN Endz */

	}

	ngOnDestroy() {
		// this.editItemService.shouldRefreshViewOnClose = false;
	}

	/**
	 * drawer width
	 */
	checkDrawerWidth(){
		let viewpermission = this.moduleDataService.getViewPermissions();
		try{
		  this.sideDrawerWidth =  viewpermission.drawer_templates.edit_template.side_drawer.width;
		  this.sideDrawerWidth = this.userService.responsiveDrawerWidth('edit', this.sideDrawerWidth, true);
		}catch{
			this.sideDrawerWidth = this.userService.responsiveDrawerWidth('edit', '20vw', true);
		}
	}

	/**
	 * getStatusLog
	 */
	getStatusLog() {
		if (!this.editOverview || (this.editOverview && this.editOverview.length == 0)) {
			return;
		}

		let cloneEditOverView = this.editOverview.slice();

		let vlogStatus2: any = [];

		if (cloneEditOverView[0].overview.type == "diff_date") {
			let cloneParameter = cloneEditOverView[0].overview.parameters.slice();

			//extracting status object form statuses array

			/**
			 * getting value loges form array
			 */
			for (let index = 0; index < cloneParameter.length; index++) {

				for (let j = 0; j < this.itemLog.length; j++) {
					if (this.itemLog[j].updatedValue.status == cloneParameter[index]) {
						let obj = {
							id: this.itemLog[j].id,
							createdAt: this.itemLog[j].createdAt,
							status: cloneParameter[index]
						};

						vlogStatus2.push(obj);
					}
				}
			}

			this.atttachToStatusToTime(cloneParameter, vlogStatus2);
		}
	}

	atttachToStatusToTime(cloneParameter, vlogStatus2) {
		let vlogStatus: any = [];
		for (let index = 0; index < cloneParameter.length; index++) {
			for (let k = 0; k < this.moduleStatuses.length; k++) {
				if (this.moduleStatuses[k].id == cloneParameter[index]) {

					let obj = {
						status: this.compileStatus(this.moduleStatuses[k]),
						timeSpent: vlogStatus2.filter(f => f.status == this.moduleStatuses[k].id),

					};

					vlogStatus.push(obj);
				}

			}

		}

		this.getTotalTimeSpent(vlogStatus);

		this.statusArray = vlogStatus;
		for (let index = 0; index < this.statusArray.length; index++) {
			const element = this.statusArray[index];
			element.startDate=this.getStartEndDate(element.timeSpent,'s');
			element.endDate=this.getStartEndDate(element.timeSpent,'e');
			element.offDays=this.isWeekend(element.startDate,element.endDate);

		}
// console.log("status list",this.moduleStatuses[2]);
		console.log("status list", this.statusArray);

	}

	getStartEndDate(dateArray:any,datetype:any){
		let result:any;
		let onlyDates=dateArray.map(d=>(new Date(d.createdAt).getTime()/1000));
		if(datetype=='s')
		result=Math.min(...onlyDates);
		else
		result=Math.max(...onlyDates);

		// result=this.formatDate(new Date(result*1000))

		return (isNaN(new Date(result*1000).getTime())?false:this.formatDate(new Date(result*1000)));
	}

	isWeekend(date1, date2) {
		var d1 = new Date(date1),
			d2 = new Date(date2),
			isWeekend = false;
		var totalOffDays=0;

		while (d1 < d2) {
			var day = d1.getDay();
			isWeekend = (day === 6) || (day === 5);
			if (isWeekend) { totalOffDays++ } // return immediately if weekend found
			d1.setDate(d1.getDate() + 1);
		}
		return totalOffDays;
	}

	formatDate(date) {
		var monthNames = [
		  "January", "February", "March",
		  "April", "May", "June", "July",
		  "August", "September", "October",
		  "November", "December"
		];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	  }

	compileStatus(sttusObj) {
		let obj = {
			id: sttusObj.id,
			name: sttusObj.name,
			color: sttusObj.color
		};

		return obj;
	}

	getTotalTimeSpent(vlogStatusArray) {
		let vlogStatus = vlogStatusArray;


		for (let index = 0; index < vlogStatus.length; index++) {
			const element = vlogStatus[index].timeSpent;
			// element.totalTimeSpent = 0;
			let totalTimeSpent = 0;

			// =element.map((a,b)=>this.getTimeDifference(a.createdAt,b.createdAt))
			for (let k = 0; k < element.length - 1; k++) {
				// console.log('time',element[k])
				if (element[k]) {
					let a = element[k].createdAt ? element[k].createdAt : new Date().getTime();
					let b = element[k + 1].createdAt ? element[k + 1].createdAt : new Date().getTime();
					// console.log('time',element[k])
					// element.totalTimeSpent = element.totalTimeSpent + this.getTimeDifference(a, b);
					totalTimeSpent = totalTimeSpent + this.getTimeDifference(a, b);

					vlogStatus[index].totalTimeSpent = totalTimeSpent
				}
			}

		}
		// console.log("vlog status list after calculation",vlogStatus)
	}


	getTimeDifference(date1, date2) {
		date1 = new Date(date1);
		date2 = new Date(date2);
		var difference = 0;
		if(date1<date2)
		difference = date2.getTime() - date1.getTime();
		else
		difference =  date1.getTime() - date2.getTime();

		//     var daysDifference = Math.floor(difference/1000/60/60/24);
		//     difference -= daysDifference*1000*60*60*24;

		var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
		difference -= hoursDifference * 1000 * 60 * 60;

		var minutesDifference = Math.floor(difference / 1000 / 60);
		// difference -= minutesDifference*1000*60

		// var secondsDifference = Math.floor(difference/1000);


		return hoursDifference;
	}


	DacCalculater(hoursDifference,offDays=0) {
		var Days = Math.floor(hoursDifference / 24);
		var Remainder = hoursDifference % 24;
		var Hours = Math.floor(Remainder);
		let result = hoursDifference < 24 ? hoursDifference + 'd' : Days-offDays + 'd';
		return result?result:0;
	}



	downloadAttachmentAsZip() {
		this.downloadFile( this.DownloadNowURI(), 'files.zip');

		// this.editItemService.downloadFilesAsZip('http:' + this.DownloadNowURI(), this.data.id, "").subscribe(response => {
		// 	this.downloadFile(response.url, 'files.zip');
		// }), error => console.log('Error downloading the file'),
		// 	() => console.info('File downloaded successfully');
	}
	public multiGroups;
	/**
	 * Fetches Item Details
	 */
	fetchItemDetails() {
		this.editItemService.fetchItemDetails(this.data.id)
		.subscribe((data) => {
			let preventModification = this.checkPreventModification(data.content.values);
			this.updateEditForm(data.content.values, preventModification);
			this.dataService.editFieldsChange(this.fields);
			// Set Action Buttons
			this.setActionButtons(data.content.values);
			this.formSharedService.setItemData(data.content.values);

			// check if multiforms - make api call then and inside make like dataservice.editfieldschange
			let multiGroupsData = this.moduleDataService.getMultiGroups(data.content.values.type_id)
			if (multiGroupsData) {
				this.multiGroups = JSON.parse(JSON.stringify(multiGroupsData));
			} else {
				this.multiGroups = multiGroupsData;
			}
			if (this.multiGroups) {
				let multiData = [];

				this.multiGroups.forEach((multiGroup, multiGroupIndex) => {
					this.editItemService.fetchLinkedItems(multiGroup.module_id, data.content.values.id, multiGroup.linked_key)
						.subscribe((data) => {
							if (data.content && data.content.values && Object.keys(data.content.values).length > 0) {
								data.content.values.forEach((value) => {
									value.frontend_meta_data = {
										linkedKey: multiGroup.linked_key,
										moduleId: multiGroup.module_id,
										frontend_id: value.id,
									};

									this.updateMultiEditForm(value, this.checkPreventModification(value, multiGroup.module_id), multiGroup.module_id);
									let multiGroupsData = JSON.parse(JSON.stringify(multiGroup));
									multiData.push(multiGroupsData);
								});
								this.dataService.multiEditFieldsChange(multiData);
							}
						});


				});
				// this.editItemService.fetchLinkedItems()
			}

			this.ngxSpinner.hide("edit");
		});
	}


	setMultiGroupValues(newGroups, value) {
		newGroups.forEach((groupValue) => {
			if (value) {
				groupValue.fields.forEach(field => {
					if (value[field.col] !== undefined) {
						field.value = value[field.col];
					}
				});
			}
		})
	}

	setActionButtons(data) {
		if (! data.hasOwnProperty("status")) {
			return;
		}
		let actionButtons = this.moduleDataService.getActionButtons(data.type_id, data.status);
		this.setActionButtonsEnableDisableState(actionButtons);
	}

	setActionButtonsEnableDisableState(actionButtons) {
		this.resetActionButtons();
		if (actionButtons) {
			actionButtons.forEach((button, i) => {
				if ( button.hasOwnProperty("conditionAPI") && button.conditionAPI != "" && button.type != "conditional_update_json_values_b4_action"  && button.type != "conditional_update_item_b4_action") {
					// In case of conditional_update_json_values_b4_action/conditional_update_item_b4_action, we do not want to call the condition API immediately.
					// For that type: Before we want to call the "conditionAPI" we want to update the module value
					this.editItemService.getActionButtonEnableDisableState(button.conditionAPI, this.data.id)
						.subscribe(data => {
							if (data.content) {
								button.state = {
									canPress: data.content.canPress == "true",
									message: data.content.message || ""
								};
							}
							this.actionButtons.push(button);
						});
				} else {
					this.actionButtons.push(button);
				}
			});
		}
	}

	resetActionButtons() {
		this.actionButtons = [];
	}

	checkPreventModification(data, moduleId?) {
		try {
			let preventModification = data.prevent_modification || this.moduleDataService.shouldPreventModification(data.status, moduleId);
			if (preventModification) {
				if (typeof preventModification == "string") {
					preventModification = JSON.parse(preventModification);
				}
			}
			return preventModification;
		} catch (exception) {
			return false;
		}
	}

	/**
	 * Creates Form Control for attachment form
	 */
	createAttachmentForm() {
		this.attachmentForm = this.formBuilder.group({
			fileTitle: ['', Validators.required],
			file: ['', Validators.required]
		});
	}

	/**
	 * Creates Form Control for chat form
	 */
	createChatForm() {
		this.chatForm = this.formBuilder.group({
			comment: ['']
		});
	}

	@Output() ifDirtyValues: EventEmitter<any> = new EventEmitter();

	checkIsFormDirty(val) {
		this.ifDirtyValues.emit(val);
	}

	/**
	 * Fills Edit Form with values
	 *
	 * @param itemDetails
	 * @param preventModification
	 */
	updateEditForm(itemDetails: any, preventModification) {
		let keys = Object.keys(itemDetails);
		this.fields.forEach((groups, groupsIndex) => {
			keys.forEach((field_id, index) => {
				let keyFound = false;
				groups.fields.forEach((field, fieldIndex) => {
					this.setEditFormValues(field_id, field, itemDetails, preventModification);
				});
				if (groups.subGroups) {
					groups.subGroups.forEach(subGroup => {
						subGroup.fields.forEach((field, fieldIndex) => {
							this.setEditFormValues(field_id, field, itemDetails, preventModification);
						});
					});
				}
			});
		});
	}

	/**
	 * Fills Edit Form with values
	 *
	 * @param itemDetails
	 * @param preventModification
	 * @param moduleId
	 */
	updateMultiEditForm(itemDetails: any, preventModification, moduleId?) {
		let keys = Object.keys(itemDetails);
		this.multiGroups.forEach((multiGroup, groupsIndex) => {
			multiGroup.frontend_id = itemDetails.id;
			keys.forEach((field_id, index) => {
				let keyFound = false;
				multiGroup.fields.forEach((field, fieldIndex) => {
					this.setEditFormValues(field_id, field, itemDetails, preventModification, moduleId);
				});
				if (multiGroup.subGroups) {
					multiGroup.subGroups.forEach(subGroup => {
						subGroup.fields.forEach((field, fieldIndex) => {
							this.setEditFormValues(field_id, field, itemDetails, preventModification, moduleId);
						});
					});
				}
			});
		});
	}

	/**
	 * Gets module status statuses
	 *
	 * @param val
	 * @param type_id
	 */
	getModuleStatusUpdates(val, type_id) {
		let updates = [];
		let processFlow = this.moduleDataService.getProcessFlow(type_id);
		const status = processFlow.find(x => x.status == val.id);
		if (status && status.flow && this.moduleDataService.isAllowedToUpdateStatus()) {
			status.flow.forEach(element => {
				let status_val = this.moduleStatuses.find(x => x.id == element);
				if (status_val) {
					updates.push(status_val);
				}
			});
		}

		return updates;
	}

	/**
	 * Sets the value
	 *
	 * @param field_id
	 * @param field
	 * @param itemDetails
	 * @param preventModification
	 * @param moduleId
	 */
	setEditFormValues(field_id, field, itemDetails, preventModification, moduleId?) {
		if (field_id == "created_date" && field.col == "create_date" && itemDetails["created_date"]) {
			field.value = itemDetails["created_date"];
			field.update = false;
		}
		if (field_id === field.col) {
			if (this.moduleDataService.viewId == 233 || this.moduleDataService.viewId == 232) {
				if (field_id == "name" && field.inputType != "name-object") {
					field.value = itemDetails.name[this.globalVars.LNG];
				}  else if (field_id != "name" ||  field.inputType == "name-object") {
					field.value = itemDetails[field_id];
				}
			} else if (field_id === "claim_no") {
				field.value = [itemDetails[field_id].number.toString() + "/" + itemDetails[field_id].year.toString()];
				field.update = false;
			} else if (field_id === "status" || field_id == "on_hold") {
				if (!moduleId) {
					let val = this.moduleStatuses[+itemDetails[field_id]];
					field.value = this.moduleStatuses[+itemDetails[field_id]].id;

					val.updates = this.moduleDataService.getModuleStatusUpdates(moduleId, val, itemDetails.type_id);
					field.options = this.compileOptions(field.value, val.updates);
					if (itemDetails['on_hold'] == true) {
						let status_id;
						let status = this.moduleStatuses.find(x => x.name['en'] == 'On Hold');
						if (status) {
							field.value = status.id;
							// field.options = val.updates;
						}
					} else {
						field.value = this.moduleStatuses[+itemDetails[field_id]].id;
						field.options = this.compileOptions(field.value, val.updates);
					}
					field.update = true;
				} else {
					// Multi groups
					let statuses = this.moduleDataService.getModuleStatuses(moduleId);
					let val = statuses[+itemDetails[field_id]];
					field.value = val.id;

					val.updates = this.moduleDataService.getModuleStatusUpdates(moduleId, val, itemDetails.type_id);
					field.options = this.compileModuleOptions(moduleId, field.value, val.updates);
					field.update = true;

				}
			} else if (field.type == "table" || field.type == "table_object") {
				field.value = eval(itemDetails[field_id]);
				if(field.type == "table_object" && preventModification){
					field.columns.forEach((col, colindex) => {
						col.update = false;
					});
				}
			} else {
				if (itemDetails[field_id] && (field.type == "input" || (field.type == "select" && !field.multiple)) && Array.isArray(itemDetails[field_id])) {
					let val = itemDetails[field_id].toString();
					field.value = this.checkValue(val);
				} else if (itemDetails[field_id] && field.type == "select" && field.multiple) {
					let val = itemDetails[field_id];
					let count = val.length;
					for (let i = 0; i < count; i++) {
						if (val[0] && Array.isArray(val[0])) {
							val = val[0];
							count++;
						} else {
							break;
						}
					}
					if (val.length > 0) {
						field.value = this.checkValue(val);
					} else {
						field.value = "";
					}
				} else {
					field.value = this.checkValue(itemDetails[field_id]);
					if (field.isDefault && field.isDefault === true) {
						field.isDefault = false;
					}
					// TO REMOVED AFTER TESTING // field.update = true;
				}
			}
		}
		if (preventModification) {
			field.update = false;
		}
	}

	/**
	 * Appends current status of item into updates array for this item
	 * WHY:		Current status object was missing in updates array for i have to apply this logic to
	 * 			show users all options in dropdown in edit drawer component in status filed,
	 *
	 * **/
	compileOptions(id, updates) {
		if (!updates) {
			return;
		}
		let update = updates.slice();
		let selectedOption = this.moduleStatuses.filter(f => f.id == id);
		update.unshift(selectedOption[0]);
		return update;

	}

	compileModuleOptions(moduleId, id, updates) {
		if (!updates) {
			return;
		}
		let update = updates.slice();
		let selectedOption = this.moduleDataService.getModuleStatuses(moduleId).filter(f => f.id == id);
		update.unshift(selectedOption[0]);
		return update;

	}

	checkValue(val) {
		if (!isNaN(val) && val != "") {
			val = +val;
		}
		return val;
	}

	public fileData: File = null;
	ifFile: boolean;

	onSelectedFilesChanged(files) {
		if (files) {
			(<HTMLInputElement> document.getElementById("chooseFile")).innerHTML = files[0].name;
			this.ifFile = true;
			this.fileData = <File> files[0];
			this.attachmentForm.patchValue({
				file: this.fileData
			});

		} else {
			this.ifFile = false;
			this.attachmentForm.patchValue({
				file: null
			});
		}
	}

	removeFile() {
		this.ifFile = false;
		(<HTMLInputElement> document.getElementById("chooseFile")).innerHTML = this.globalVars.translation["Choose File"][this.globalVars.LNG];
		this.attachmentForm.patchValue({
			file: null
		});
	}
	

	scrollToBottom() {
		// this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
	}

	fetchComments() {
		this.editItemService.getChatList(this.data.id)
		.subscribe((data) => {
			if (data.status == 200) {
				this.comments = data.content;
			}
			this.scrollToBottom();
		});
	}

	fetchLog() {
		this.editItemService.getLogList(this.data.id)
		.subscribe((data) => {
			if (data.status == 200) {
				this.itemLog = data.content;
				console.log('log', this.itemLog);

				this.getStatusLog();
				// console.log('overall data',this.data);
			}
		});
	}

	onBasicDetailsSubmit(): any {

	}

	getSelectedStepperState() {
		let stepIndex = 0;

		if (!this.data.statusStages || this.data.statusStages.length <= 0) {
			return false;
		}

		this.data.statusStages.forEach((step, index) => {
			if (step.current) {
				stepIndex = index;
			}
		});
		return stepIndex;
	}
	
	isChecked() {
		return this.fileListForDownload.length === this.attachments.length;
	};

	exists(attachment) {
		return this.fileListForDownload.find(c => {
			return c.id === attachment.id;
		}) != undefined;
	};

	/**
	 * DownloadNowURI();
		WHY:we have two different URI to download zip file
			a) all files at once /attachment/modulevalue/downloadAsZip/MODULE_VALUE_ID
			b) selected files /attachment/modulevalue/downloadAsZip?id=MODULE_VALUE_ID&fileIds=ATTACHMENT_IDS
	 */
	DownloadNowURI() {
		let filedsArray = this.fileListForDownload.map(m => m.id);
		if (filedsArray.length > 0 && filedsArray.length < this.attachments.length) {
			return (`${this.globalVars.getAPIBaseUrl()}/attachment/modulevalue/downloadAsZip?id=${this.data.id}&fileIds=${filedsArray.join(',')}`);
		} else {
			return (`${this.globalVars.getAPIBaseUrl()}/attachment/modulevalue/downloadAsZip/${this.data.id}`);
		}

	}

	// region output events

	/**
	 * Updates item and emits submitted event to close drawer after successful response
	 */
	eventSubmitted() {
		this.ngxSpinner.show("edit");
		let formGroups: any = this.form.getDirtyValues(this.moduleStatuses);

		if (this.isEmpty(formGroups)) {
			if (!(this.form.multiForms && this.form.multiForms.formGroups)) {
				this.submitted.emit(this.data);
				this.ngxSpinner.hide("edit");
				return;
			}
		}

		// check for trigger
		let triggerConfig: any = {};
		if (this.moduleDataService.typeHasTrigger(this.data.type_id)) {
			triggerConfig.trigger = true;
			triggerConfig.typeId  = this.data.type_id;
		}

		let multiFormObjects = [];
		if (this.form.multiForms && this.form.multiForms.formGroups) {
			multiFormObjects = this.form.multiForms.getFormValue();
		}
		this.editItemService.updateItem(this.data.id, formGroups, multiFormObjects, triggerConfig)
		.subscribe((data) => {
			this.submitted.emit(this.data);
			this.ngxSpinner.hide("edit");
		});
		this.fetchLog();
	}
	
	isEmpty (obj) {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	}
	
	updateEmptyModel : UpdateEmptyModel ={
		value: {}
	}

	checkForName(formObject) {
		if (this.moduleDataService.viewId == 233 || this.moduleDataService.viewId == 232) {
			formObject.name = {
				en: formObject.name,
				ar: formObject.name,
			};
		}

		return formObject;
	}

	eventCancelledDrawer() {
		if(this.editItemService.shouldRefreshViewOnClose){
			this.submitted.emit(this.data);
		}else{
			this.cancelled.emit("cancelled");
		}
	}

	// endregion

	getObject(formGroups) {
		const value = formGroups.value;
		let formArray = value.reduce(function(result, current) {
			return Object.assign(result, current);
		}, {});

		return formArray;
	}

	getKeys(element) {
		return Object.keys(element);
	}

	getKeyNames(field_id) {
		var keyName = this.moduleDataService.getKeyName(field_id)[this.globalVars.LNG];
	}

	checkKeyStatus(element) {
		return element.hasOwnProperty("status");
	}

	checkOnlyStatus(element) {
		let isStatus = element.hasOwnProperty("status");
		let fieldLength = Object.keys(element).length;
		if (isStatus && fieldLength == 1) {
			return false;
		}
		return true;
	}

	getValidFields(element1, element2) {
		let keys = Object.keys(element1);
		let count = 0;
		keys.forEach(function(value) {
			if (value != 'status') {
				if (element1[value] != '' && element2[value] != '') {
					count++;
				}
			}
		});
		return count;
	}

	handleActionButton(actionButton) {
		if (actionButton.message != undefined) {
			// If actionButton has a message - show the user a dialog and get his confirmation before performing the action
			const dialogRef = this.dialog.open(ButtonConfirmComponent, {
				data: {
					buttonMessage: actionButton.message,
					button: actionButton.type
				}
			});
			dialogRef.afterClosed().subscribe((param) => {
				if (param) {
					this.actionButtonsApiCall(actionButton);
					// this.getActionButton(param);
				}
			});
		} else {
			this.actionButtonsApiCall(actionButton);
		}
	}

	actionButtonsApiCall(actionButton) {
		this.ngxSpinner.show('edit');
		this.editItemService.shouldRefreshViewOnClose = true;
		switch (actionButton.type) {
			case "pdf":
				this.actionButtonsPdfApiCall(actionButton);
				break;
			case "update_json_values":
				this.actionButtonUpdateJsonValue(actionButton);
				break;
			case "update_item":
				this.postActionButton(actionButton);
				break;
			case "conditional_update_json_values_b4_action":
				this.actionButtonConditionalUpdate(actionButton, 'update_json_value');
				break;
			case "conditional_update_item_b4_action":
					this.actionButtonConditionalUpdate(actionButton, 'update_item');
					break;
			default:
				this.getActionButton(actionButton);
				break;
		}
	}
	
	/**
	 * POSTs modulevalue and calls the conditionalAPI.
	 * If "canPress" parameter of the conditionalAPI is true, "api" with "parameters" (if any) gets called
	 *
	 * @param actionButton
	 */
	actionButtonConditionalUpdate(actionButton, type) {
		this.ngxSpinner.show("edit");
		let dirtyValues: any = this.form.getDirtyValues(this.moduleStatuses);
		
		if (this.isEmpty(dirtyValues)) {
			if (!(this.form.multiForms && this.form.multiForms.formGroups)) {
				// If the form has not been updated and there are no multiForms, we call the API direct
				// in this case we do not need to update the modulevalue
				this.conditionalAPIWithDialog(actionButton, type);
				this.ngxSpinner.hide("edit");
				return;
			}
		}
		
		// check for trigger
		let triggerConfig: any = {};
		if (this.moduleDataService.typeHasTrigger(this.data.type_id)) {
			triggerConfig.trigger = true;
			triggerConfig.typeId  = this.data.type_id;
		}
		
		let multiFormObjects = [];
		if (this.form.multiForms && this.form.multiForms.formGroups) {
			multiFormObjects = this.form.multiForms.getFormValue();
		}
		
		this.editItemService.updateItem(this.data.id, dirtyValues, multiFormObjects, triggerConfig)
			.subscribe((data: any) => {
				if (data.status === 200) {
					// After updating the item we manage the "conditionalAPI" - based on which the "api" is being called
					this.conditionalAPIWithDialog(actionButton, type);
					this.fetchLog();
				}
				this.ngxSpinner.hide("edit");
			});
	}
	
	/**
	 * Calls "conditionalAPI" of a button.
	 * If "canPress" is true - "api" is executed with "parameters" (if provided)
	 * If "canPress" is false - a dialog is shown with the message retrieved from the backend
	 *
	 * @param actionButton
	 */
	conditionalAPIWithDialog(actionButton, type) {
		this.editItemService.getActionButtonEnableDisableState(actionButton.conditionAPI, this.data.id)
			.subscribe(data => {
				if (data.status === 200) {
					if (data.content.canPress === "true" || data.content.canPress === true) {
						// If canPress is true it means we can go ahead and perform the action we wanted to perform = call the API
						if(type === 'update_json_value')
							this.actionButtonUpdateJsonValue(actionButton);
						else if(type === 'update_item')
							this.postActionButton(actionButton);
					} else {
						// If canPress is false - we cannot perform the action - but we want to show the user in an alert the message
						// we are receiving from the backend
						
						// We don't subscribe to the dialog closing event - we just want to show the dialog
						this.dialog.open(AlertDialog, {
							data: {
								title: this.globalVars.translation["Action cannot be performed"][this.globalVars.LNG],
								body: data.content.message ? data.content.message[this.globalVars.LNG] : "",
								actions: [
									{
										label: this.globalVars.translation["OK"][this.globalVars.LNG],
										result: false
									}
								]
							}
						});
					}
				}
			});
	}
	
	actionButtonUpdateJsonValue(actionButton) {
		this.editItemService.updateItem(this.data.id, actionButton.parameters[0].value) // TODO: use paramter
			.subscribe((data: any) => {
				if (data.hasOwnProperty("status") && data.status === 200) {
					this.ngAfterViewInit();
					this.snackBarService.open(`${this.globalVars.translation["Successfully Updated"][this.globalVars.LNG]} ${this.moduleDataService.getTypeName(this.data.type_id)[this.globalVars.LNG]}`);
				}
				this.ngxSpinner.hide("edit");
			});

		// this.editItemService.updateItem(actionButton)
	}

	eventButtonAction(buttons) {
		if (buttons.message != undefined) {
			const dialogRef = this.dialog.open(ButtonConfirmComponent, {
				data: {
					buttonMessage: buttons.message,
					button: buttons.type
				}
			});
			dialogRef.afterClosed().subscribe((param) => {
				if (param) {
					//   this.getActionButton()
				}
			});
		} else {
			return;
		}
	}

	getActionButton(param) {
		this.editItemService.getACtionButton(param.api, this.data.id).subscribe(data => {
			this.ngxSpinner.hide('edit');
			console.log(data);
			if (data.status == 200) {
				this.ngAfterViewInit();
				this.snackBarService.open(data.content[this.globalVars.LNG]);
			}
		});
	}

	postActionButton(param) {
		this.editItemService.postActionButton(param.api, this.data.id).subscribe(data => {
			this.ngxSpinner.hide('edit');
			console.log(data);
			if (data.hasOwnProperty("status") && data.status === 200) {
				this.ngAfterViewInit();
				this.snackBarService.open(data.content[this.globalVars.LNG]);
			}
		});
	}

	actionButtonsPdfApiCall(param) {
		let urlParameters = "";
		if (param.parameters) {
			for (let parameter of param.parameters) {
				if (parameter.type == "language-preference" && parameter.value == "frontend_LNG") {
					urlParameters += this.globalVars.LNG;
				}
			}
		}

		/*** Download file by creating link Global function */
		//  let downloadFileUrl = `${this.globalVars.getAPIBaseUrl()  + param.api}` + this.data.id + "/" + urlParameters;
		// this.globalVars.downloadFile(document, downloadFileUrl);

		/*** Download file using download file dierective to pass token through intercepter*/

		let downloadFileUrl = `${this.globalVars.getAPIBaseUrl()}${param.api}${this.data.id}/${urlParameters}`;
		this.downloadFile(downloadFileUrl);
	}

	downloadFile(downloadFileUrl, name?) {
		this.downloadFileUrl = downloadFileUrl;
		this.downloadFilename = name;
		this.spinnerSnackBarService.open(this.globalVars.translation['Downloading'][this.globalVars.LNG]);
		setTimeout(() => {
			this.editItemService.downloadFile(this.downloadFileUrl).subscribe( _ => {
				document.getElementById('downloadPdf').click();
				this.ngAfterViewInit();
				this.ngxSpinner.hide('edit');
			})
		}, 100);
	}

	getUpdatedBy(updatedBy) {
		if (updatedBy == this.name[this.globalVars.LNG].toLowerCase()) {
			return this.globalVars.translation["You"][this.globalVars.LNG];
		}

		return updatedBy;
		//return  (updatedBy === this.userName[this.globalVars.LNG].toLowerCase()) ? this.globalVars.translation["You"][this.globalVars.LNG] : updatedBy;
	}

	fetchChildRecordsBasedOnParentID(parent_id, module_id) {
		this.editItemService.getChildRecordsBasedOnParentID(parent_id, module_id)
		.subscribe((data) => {
			// console.log('fetchChildRecordsBasedOnParentID', data)
			this.viewData = data.content_modified;
			// console.log('fetchChildRecordsBasedOnParentID--After', data.content_modified)
			// console.log(JSON.stringify(this.viewData));

			this.tableWidgetData = {
				columnStructure: this.columnStructure,
				data: this.viewData,
				typeStructure: {
					0: this.columnStructure,
					1: this.columnStructure,
				}
			};
		});
	}

	openImagePopup(image_path){
		const dialogRef = this.dialog.open(ImageDialogComponent, {
			data: {
				// title: "Test Title",
				image_path: image_path,
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				console.log('param', param);
			}
		});
	}

}

export interface UpdateEmptyModel {
	value: object;
}
