import { NotificationComponent } from './insurance/notification/notification.component';
import {
	Component,
	OnInit,
	ViewChild,
	ComponentFactoryResolver,
	ViewContainerRef,
	ViewChildren, QueryList, AfterViewInit, OnDestroy
} from "@angular/core";
import { MatSidenav, MatDialogRef, MatDialog, MatSnackBar, MAT_SNACK_BAR_DATA, MAT_DIALOG_DATA } from "@angular/material";
import { SnackbarService } from "../../../core/shared/services/snackbar/snackbar.service";
import { ActivatedRoute, Router, NavigationStart, NavigationError, NavigationEnd, Event, RouterEvent } from "@angular/router";
import { TableWidget } from "../../../core/shared/widgets/table-widget/table.widget";
import { EditDrawerComponent } from './edit-drawer/edit-drawer.component';
import { AddDrawerComponent } from './add-drawer/add-drawer.component';
import { UserService } from './user.service';
import { GlobalVariables } from "../../../../global-variables.service";
import { timer, Subscription } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";
import { ModuleDataService } from "./module-data/module-data.service";
import { FormGroup, FormBuilder } from '@angular/forms';
import { MdePopoverTrigger } from '@material-extended/mde';
import { AssetsReportComponent } from './assets-report/assets-report.component';
import { ConfirmationDialog } from "../../../core/shared/components/dialogs/confirmation-dialog/confirmation-dialog";
import { ValidationDialog } from "../shared/validation-dialog/validation.dialog";
import { StatusUpdateSnackbar } from "../shared/status-update-snackbar/status-update.snackbar";
import { StaticDataService } from "../../../core/shared/services/static-data/static-data.service";
import { TableWidgetModel } from "../../../core/shared/widgets/table-widget/table-widget.model";
import { NotificationService } from "./insurance/notification/notification.service";
import { FieldConfig } from "../../../core/shared/components/dynamic-reactive-form/shared";
import { BoardWidgetComponent } from "../../../core/shared/widgets/board-widget/board-widget.component";
import { DashboardService } from "./dashboard/dashboard.service";
import { SnackbarDrawerOpener } from "../shared/snackbar-drawer-opener/snackbar-drawer-opener";
import { SnackbarDrawerOpenerService } from "../shared/snackbar-drawer-opener/snackbar-drawer-opener.service";
import { EditItemService } from "./edit-drawer/edit-item.service";
import { SearchService } from '../../../core/shared/services/search/search.service';
import {DataService} from "../../../../shared/service/data.service";
import {BarcodeDialog} from "../../../core/shared/dialogs/barcode-dialog/barcode.dialog";
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-user',
	templateUrl: './user.component.html',
	styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy{
	@ViewChild('drawer', { static: false }) drawer: MatSidenav;
	@ViewChild('container', { static: false, read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
	@ViewChild('tableWidget', { static: false }) groupedTableWidget: TableWidget;
    @ViewChild("boardWidget", {static: false}) groupedBoardWidget: BoardWidgetComponent;
	@ViewChild( MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
	@ViewChild( 'notification', { static: false }) notification: NotificationComponent;
	@ViewChildren("tableWidget") tableWidget: QueryList<TableWidget>;
	@ViewChildren("boardWidget") boardWidget: QueryList<BoardWidgetComponent>;
	public isNotification;

	/**
	 * Defines previous route - we need to keep track so we could open edit drawer(from notification) if the current route is of same module type
	 */
	public previousRoute;

	/**
	 * Defines drawer width - changes depending on drawer type
	 */
	public drawerVw: number;

	/**
	 * Stores data about permissions (based on View)
	 * Permission Matrix
	 */
	public permissionData: any;

	/**
	 * Title of current view
	 */
	public viewTitle: { en: string, ar: string };

	/**
	 * Current View ID - getDialogFields from the route
	 */
	public viewId: number;

	/**
	 * Current Module ID - getDialogFields from the route
	 */
	public moduleId: number;

	/**
	 * Current Parent Module ID - needed for parent child relation
	 */
	public parentModuleId: number;

	/**
	 * Current Role ID - getDialogFields from the route
	 */
	public roleId: number;

	/**
	 * Shows KPIs at the top of the table
	 */
	public overview: any;

	/**
	 * Stores the structure for the table
	 */

	/**
	 * Column Structure for table-widget
	 */
	public columnStructure: any;

	/**
	 * Stores Information that is going to be displayed (list view, board view, etc.)
	 */
	public viewData: any;

	/**
	 * Stores Information that is going to be displayed in parent view.
	 * Property is only being used in case of a view having the childView attribute.
	 * In that case the matrix that has the childView attribute will be considered as the parentView
	 */
	public parentViewData: any = [];

	/**
	 * Stores process flow (moduleStatuses with updates) for each type - based on user permission
	 */
	public processFlows: any = [];

	/**
	 * Stores structure, data & moduleStatuses for list view
	 */
	public tableWidgetData: TableWidgetModel;

	/**
	 * Stores structures for creating all items based on their types
	 */
	public fieldsTemplates: any;

	/**
	 * Stores all (form) structure for all modules
	 */
	public moduleDefinition: any;

	/**
	 * Stores data about the module
	 */
	public moduleData: any;

	/**
	 * Stores Information about Status
	 */
	public viewStatus: any;

	/**
	 * Used for showing empty state if no items are present
	 */
	public hasNoData: boolean;

	/**
	 * Used for disabling board widget when there is no grouping in the view permission
	 */
	public hasBoard: boolean;

	/*
	 * Used for storing edit_editOverview from permissionmatrix
	 */
	public editOverview: any;

	/**
	 * Child Table Widget - used for reinitiating table data if some values change in the table
	 */
	overViewData: any[];

	/**
	 * Used for showing current year for insurence year
	 */
	currentYear = new Date().getFullYear().toString();

	notificationSubscription: Subscription;
	dashboardRecordSubscription: Subscription;

	isStatic = false;

	public showEmptyPlaceholder: boolean;
	drawerWidth: any;
	public isEmptyState: boolean;

	/**
	 * Floating Add button to open Add-Drawer. It holds the value whether to show/hide Add button
	 */
	public showAddButton: boolean;

	/**
	 * Stores the moduleStatuses along with the updates
	 */
	public statusInfoNChanges: any = {};

	/**
	 * Snackbar drawer opener subscription
	 */
	public snackbarDrawerOpenerSubscription: Subscription;

    /**
     * Saves the current mode (list, board, etc.)
     */
	public activeMode: any;

	public routerSubscription: any;

	constructor(private snackBarService: SnackbarService, private route: ActivatedRoute, private router: Router, private userService: UserService,
		private componentFactoryResolver: ComponentFactoryResolver, private dialog: MatDialog, public globalVars: GlobalVariables,
		private snackBar: MatSnackBar, private formBuilder: FormBuilder,
		private ngxSpinner: NgxSpinnerService, public moduleDataService: ModuleDataService,
		public staticDataService: StaticDataService, private _notificationService: NotificationService, private _dashboardService: DashboardService,
		private _snackbarDrawerOpenerService: SnackbarDrawerOpenerService, private editItemService: EditItemService, private searchService: SearchService
		) {
		this.drawerVw = 70;
		this.previousRoute = '';
		this.viewTitle = {
			en: "",
			ar: ""
		};
		this.hasNoData = false;
		this.fieldsTemplates = [];
		this.overview = [];
		this.route.paramMap.subscribe(paramMap => {
			if (paramMap.get("menu") && !paramMap.get("moduleId")) {
				let appStructure = this.globalVars.loadAppStructure();
				let app = appStructure.find(app => app.route == this.globalVars.getCurrentApplicationName());

				if (app) {
					let menu = app.menus.find(menu => menu.route == paramMap.get("menu"));
					if (menu) {
						this.router.navigate(
							["user" + "/" + menu.route + "/" + menu.workspaces[0].views[0].module + "/" + menu.workspaces[0].views[0].viewId + "/" + menu.workspaces[0].views[0].role],
							{ relativeTo: this.route.parent }
						);
					}
				}
			}
			this.moduleDataService.menu = paramMap.get("menu");
			this.moduleId = +paramMap.get("moduleId");
			this.viewId = +paramMap.get("viewId");
			this.roleId = +paramMap.get("roleId");

			this.parentModuleId = undefined; /* It's a fix for a bug i.e. Navigation from Classified issues to Reported issues and save new record. And you'll see the issue. */

			this.moduleDataService.moduleId = this.moduleId;
			this.moduleDataService.viewId = this.viewId;
			this.moduleDataService.roleId = this.roleId;
			this.moduleDataService.hasParentViewRelation = false;

			this.isNotification = false;

			this.setActiveMode("list");

			/* Empty search box, tableWidget when view changes. It is important to nullify tableWidgetData on each view change as Empty State data is appended to recent visited tableWidgetData. */
			if(this.tableWidget && this.tableWidget["_results"].length){
				this.tableWidget.first.searchQuery = '';
				this.tableWidgetData = null;
			}

			// Temporary hardcoded tables
			if (this.viewId == 257) {
				this.isStatic = true;
                this.hasBoard = false;
				this.tableWidgetData = null;
				this.hasNoData = true;
				timer(0).subscribe(() => {
					this.createFuelLog();
				});
			} else if (this.viewId == 251) {
				this.isStatic = true;
				this.hasBoard = false;
				this.tableWidgetData = null;
				this.hasNoData = true;
				timer(0).subscribe(() => {
					this.createTrafficFines();
				});
			} else {
				this.isStatic = false;
				// this.moduleId = 75; this.createModuleValueFromFrontend(this.moduleId);
				if (paramMap.get("moduleId")) {
                    this.fetchModuleData(this.moduleId, this.viewId);
                }
			}

			this.createSearchForm();
		});

	}

	ngOnInit() {
		this.createSearchForm();
		this.routerSubscription = this.router.events.pipe(
			filter((event: RouterEvent) => event instanceof NavigationEnd)
				).subscribe(() => {
					this.handleReferenceIds();
				});
	}

	ngOnDestroy() {
		this.resetDashboardServiceData();
		this.resetNotificationServiceData();

		if(this.snackbarDrawerOpenerSubscription){
			this.snackbarDrawerOpenerSubscription.unsubscribe();
		}

		if(this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}

	ngAfterViewInit() {
	}

	// region static pages

	createTrafficFines() {
		this.viewTitle = {
			en: "Traffic Fines",
			ar: "المخالفات المرورية"
		};

		this.tableWidgetData = this.staticDataService.trafficFinesTableWidgetData();
	}

	createFuelLog() {
		this.viewTitle = {
			en: "Fuel Logs",
			ar: "سجلات الوقود"
		};

		this.tableWidgetData = this.staticDataService.fuelLogTableWidgetData();
	}

	// endregion

	// region creating small modules from frontend

	/**
	 * Used when values against modueles have to be created from frontend
	 */
	createModuleValueFromFrontend(moduleId) {
		this.userService.fetchModuleData(moduleId)
			.subscribe((data) => {
				this.moduleData = data.content;
				this.moduleDataService.setModuleDefinition(data.content);

				this.viewTitle = {
					en: data.content.name,
					ar: data.content.nameArabic
				};

				this.moduleData.columns.module_types.forEach((moduleType, moduleTypeIndex) => {
					this.fieldsTemplates[moduleTypeIndex] = moduleType.forms.groups;
					this.moduleDataService.setFieldsTemplate(moduleTypeIndex, moduleType.forms.groups);
				});

				this.handleReferenceIds();
				this.ngxSpinner.hide("user");
			});
	}


	// endregion

	/**
	 * Fetches Module data
	 * All module structure with fields, columns, groups, types, status, stages, process_flow are defined here
	 */
	fetchModuleData(moduleId, viewId) {
		this.moduleId = moduleId;
		this.ngxSpinner.show("user");
		this.userService.fetchModuleData(moduleId || this.moduleId)
			.subscribe((data) => {
				this.moduleData = data.content;
				this.moduleDataService.modules[this.moduleId] = data.content;
				this.moduleDataService.resetMultiGroups();
				this.moduleDataService.setModuleDefinition(data.content);
				this.fetchPermissionMatrix(moduleId, viewId);
				this.handleMultiForms();
				this.handleDialogTemplates();
			});
	}

	public handleDialogTemplates() {
		this.moduleDataService.getModuleTypes().forEach((moduleType, moduleTypeId) => {
			if (moduleType.forms.dialogs) {
				let dialogNames = Object.keys(moduleType.forms.dialogs);
				dialogNames.forEach((dialogName) => {
					if (moduleType.forms.dialogs[dialogName].module_id != this.moduleId) {
						this.userService.fetchModuleData(moduleType.forms.dialogs[dialogName].module_id)
							.subscribe((data) => {
								this.moduleDataService.modules[moduleType.forms.dialogs[dialogName].module_id] = data.content;
								// this.getDialogFields(moduleType, dialogName);
								moduleType.forms.dialogs[dialogName].groups = this.getDialogFields(moduleType.forms.dialogs[dialogName].groups, dialogName, moduleType.forms.dialogs[dialogName].module_id);
								this.moduleDataService.setDialogTemplate(moduleTypeId, dialogName, moduleType.forms.dialogs[dialogName]);
							});
					}
				});
			}
		});
		// this.moduleDataService.setDialogTemplate(+index, this.alignDialogFieldsWithMatrix(this.moduleDataService.getType(+index).forms.dialogs, data.content.form_fields));
	}

	/**
	 * Transform DB Structure of dialogs into required Form Structure
	 *
	 * @param groups
	 * @param dialogName
	 * @param moduleId
	 */
	private getDialogFields (groups, dialogName: string, moduleId) {
		// this.moduleId = moduleId;
		groups.forEach((group) => {
			group.groupName = group.name;
			delete group.name;
			group.fields = group.fields.map((field) => this.userService.transformToFormField(this.moduleDataService.modules[moduleId].columns.module_fields[field], false, true));

			if (group.hasOwnProperty("sub_group") && group.sub_group.length > 0) {
				group.sub_group = this.getDialogFields(group.sub_group, dialogName, moduleId);
			}
		});

		return groups;
	}

	/**
	 * Handle Mutli Form Groups (multi_groups)
	 */
	handleMultiForms() {
		this.moduleDataService.getModuleDefinition().columns.module_types.forEach((moduleType, moduleTypeIndex) => {
			if (moduleType.forms.hasOwnProperty("multi_groups")) {
				moduleType.forms.multi_groups.forEach((multiGroup, multiGroupIndex) => {
					multiGroup.groupName = multiGroup.name;
					delete multiGroup.name;

					// If module is same as current or not present - load from current one
					if (!multiGroup.hasOwnProperty("module_id") || multiGroup.module_id == this.moduleId) {
						multiGroup.fields = multiGroup.fields.map((field) => this.userService.transformToFormField(this.moduleDataService.moduleFields[field], false));
						if (multiGroup.hasOwnProperty("sub_group")) {
							multiGroup.sub_group.forEach(subGroup => {
								subGroup.fields = subGroup.fields.map((field) => this.userService.transformToFormField(this.moduleDataService.moduleFields[field], false));
								subGroup.groupName = subGroup.name;
								delete subGroup.name;
							});
							multiGroup.subGroups = multiGroup.sub_group;
							delete multiGroup.sub_group;
						}

						this.moduleDataService.setMultiGroups(moduleType.id, multiGroup);
					} else {
						this.userService.fetchModuleData(multiGroup.module_id)
							.subscribe((data) => {
								this.moduleDataService.modules[multiGroup.module_id] = data.content;
								multiGroup.fields = multiGroup.fields.map((field) => this.userService.transformToFormField(data.content.columns.module_fields[field], false));
								if (multiGroup.hasOwnProperty("sub_group")) {
									multiGroup.sub_group.forEach(subGroup => {
										subGroup.fields = subGroup.fields.map((field) => this.userService.transformToFormField(data.content.columns.module_fields[field], false));
										subGroup.groupName = subGroup.name;
										delete subGroup.name;
									});
									multiGroup.subGroups = multiGroup.sub_group;
									delete multiGroup.sub_group;
								}

								this.moduleDataService.setMultiGroups(moduleType.id, multiGroup);
							});
					}
				});
			}
		});
	}

	/**
	 * Fetches Permission Matrix / View Settings for Current module based on user role
	 */
	changedStatusId: number;
	lastModifiedItemId: number;

	getColumnStructure(typeStructure) {
		let firstFieldId = Object.keys(typeStructure)[0];
		return typeStructure[firstFieldId];
	}

	isIncident = false;

	fetchPermissionMatrix(moduleId?, viewId?, searchStructure?, searchQuery?) {

		this.isEmptyState = false;
		this.ngxSpinner.show("user");

		this.userService.fetchPermissionMatrix(viewId || this.viewId, moduleId || this.moduleId, this.roleId, this.moduleDataService.moduleFields, null, null, searchStructure, searchQuery)
			.subscribe((data) => {
				if (data.content) {

					if (!this.moduleDataService.hasParentViewRelation) {
						this.viewTitle = data.content.viewName;
					}
					this.columnStructure = this.getColumnStructure(data.content.permissions.type);

					if (data.content.permissions.childView) {
						this.parentModuleId = this.moduleId || moduleId;
						this.parentViewData = data.content.tableData;
						this.moduleDataService.hasParentViewRelation = true;
						this.moduleDataService.setParentViewPermissions(data.content.permissions);
						this.alignProcessFlowWithPermissionMatrix(this.parentViewData, null, true);
						this.initParentTableData();
						this.fetchModuleData(data.content.permissions.childView.moduleId, data.content.permissions.childView.viewId);
					} else {
						this.moduleDataService.setViewPermissions(data.content.permissions);

						if (!this.moduleDataService.hasParentViewRelation) {
							this.viewData     = data.content.tableData;
							this.viewStatus   = this.moduleDataService.getEditOverview();
							this.overViewData = this.moduleDataService.getEditOverview();
							this.alignProcessFlowWithPermissionMatrix(this.viewData, null, false);

							if (this.moduleDataService.viewHasOverview()) {
								this.overview = this.generateDashboardOverview(this.viewData);
							}

							this.hasBoard = this.moduleDataService.hasGrouping();
						}

						this.generateFieldsTemplates(data);
						this.handleReferenceIds();

						if (!this.moduleDataService.hasParentViewRelation) {
							this.initTableData(searchQuery);
						}
					}

					if('add' in data.content.permissions){
						this.showAddButton = (data.content.permissions.add == 'true') ? true : false;
					}
					if('pagination_info' in data.content.permissions){
						this.moduleDataService.paginationInfo = data.content.permissions.pagination_info;
					}
				}
				this.ngxSpinner.hide("user");
			});
	}

	fetchDataOfPermissionMatrix(searchKeys, searchString) {
		this.ngxSpinner.show("user");

		this.userService.fetchPermissionMatrix(
			this.moduleDataService.parentViewPermissions.childView.viewId, this.moduleDataService.parentViewPermissions.childView.moduleId, this.roleId, this.moduleDataService.moduleFields, searchKeys, searchString
		)
			.subscribe((data) => {
				if (data.content) {

					this.viewData = data.content.tableData;

					this.alignProcessFlowWithPermissionMatrix(this.viewData, null, false); // CHECK: whether to pass true/false as 3rd param for isParentPermissionMatrix
					this.viewStatus   = this.moduleDataService.getEditOverview();
					this.overViewData = this.moduleDataService.getEditOverview();

					if (this.moduleDataService.viewHasOverview()) {
						this.overview = this.generateDashboardOverview(this.viewData);
					}
					this.initChildTableData();
				}
				this.ngxSpinner.hide("user");
			});
	}

	/**
	 * Generate Fields Templates based on types that are in view Permission
	 * If there is no type -- user will be able to create all module_types
	 *
	 * @param data
	 */
	private generateFieldsTemplates(data) {
		// If there are no defined types, we allow the user to create all types
		if ((!data.content.permissions.typeIds) || (data.content.permissions.typeIds && data.content.permissions.typeIds.length === 0)) {
			data.content.permissions.typeIds = Object.keys(this.moduleData.columns.module_types).map(type => +type);
			this.moduleData.columns.module_types.forEach((moduleType, moduleTypeIndex) => {
				this.fieldsTemplates[moduleTypeIndex] = moduleType.forms.groups;
				this.moduleDataService.setFieldsTemplate(moduleTypeIndex, moduleType.forms.groups);
			});
		} else {
			// Set field templates for allowed types
			data.content.permissions.typeIds.forEach((index) => {
				this.fieldsTemplates[+index] = (this.alignFieldsWithMatrix(this.moduleData.moduleDefinition[+index].forms.groups, data.content.form_fields));
				this.moduleDataService.setFieldsTemplate(+index, (this.alignFieldsWithMatrix(this.moduleData.moduleDefinition[+index].forms.groups, data.content.form_fields)));
				// this.moduleDataService.setDialogTemplate(+index, this.alignDialogFieldsWithMatrix(this.moduleDataService.getType(+index).forms.dialogs, data.content.form_fields));
				/*if(this.moduleData.moduleDefinition[+index].forms.multi_groups){
					this.moduleDataService.setMultiGroups(+index, (this.alignFieldsWithMatrix(this.moduleData.moduleDefinition[+index].forms.multi_groups, data.content.form_fields)))
					// this.fieldsTemplates[+index][0].multiGroups = (this.alignFieldsWithMatrix(this.moduleData.moduleDefinition[+index].forms.multi_groups, data.content.form_fields));
				}*/
			});
		}
	}

	/**
	 * Returns whether the provided dataObject matches the required validator
	 *
	 * @param dataObject
	 * @param validator
	 * @param overview
	 */
	overviewCriteriaMatches(dataObject, validator, overview): boolean {
		let val = false;

		if (validator.match_type == 'flag') {
			if (validator.value == dataObject[validator.match_key]) {
				val = true;
			}
		} else if (validator.type == "exclude") {
			validator.except.forEach(elem => {
				let value = overview[elem];
				if (value.match_type == 'flag' && value.value == dataObject[value.match_key]) {
					val = false;
				} else if (value.match_type == 'flag' && value.value != dataObject[value.match_key]) {
					let pre_value = overview[elem - 1];
					if (pre_value.value === dataObject[pre_value.match_type][pre_value.match_key]) {
						val = false;
					} else {
						val = true;
					}
				} else if (dataObject.hasOwnProperty(value.match_type)) {
					if (value.value === dataObject[value.match_type][value.match_key]) {
						val = false;
					}
				} else {
					val = true;
				}
			});
		} else if (validator.value === dataObject[validator.match_type][validator.match_key]) {
			val = true;
		}
		return val;
	}

	/**
	 * Generates small dashboard for the tab views
	 *
	 * @param viewData
	 */
	generateDashboardOverview(viewData) {
		if (!this.viewData) {
			return;
		}

		viewData.forEach(view => {
			view.data.forEach(data => {
				this.moduleDataService.viewPermissions.overview.forEach(overview => {
					overview.parameters.forEach(parameter => {
						if (this.overviewCriteriaMatches(data, parameter, overview.parameters)) {
							if (parameter.fe_result != undefined) {
								parameter.fe_result++;
							} else {
								parameter.fe_result = 1;
							}
						}
					});
				});
			});
		});
	}

	/**
	 * Creates the process flow based on the permission matrix (user role id)
	 * Maps status and its updates to each record
	 * Adds staging into status object inside the data directly
	 */
	alignProcessFlowWithPermissionMatrix(viewData, moduleId?, isParentPermissionMatrix?) {
		if (!viewData) {
			return;
		}

		viewData.forEach((group, groupIndex) => {
			if (group.hasOwnProperty("group")) {
				if(typeof group.group != 'object'){
					group.group = this.moduleData.columns.module_statuses[+group.group];
				}
			}
			group.data.forEach((row, rowIndex) => {
				// let moduleTypeIndex = this.moduleDataService.getModuleTypes().findIndex(moduleTypes => (+moduleTypes.id) == (+row.type_id));
				let moduleTypeIndex = this.moduleDataService.findTypeIndexById(+row.type_id);
				if (moduleTypeIndex >= 0 && row.status >= 0) {
					row.status = +row.status;

					// region stages
					// Assign stage array to row data
					row.statusStages = JSON.parse(JSON.stringify(this.moduleData.columns.module_types[moduleTypeIndex].status_stages));
					row.statusStages.forEach((stage, stageIndex) => {
						let isCurrent = stage.statuses.findIndex(status => status === (row.status));
						stage.completed = false;
						stage.current = isCurrent >= 0;
					});
					let alreadyComplete = false;
					for (let stageIndex = 0; stageIndex < row.statusStages.length; stageIndex++) {
						let stage = row.statusStages[stageIndex];
						if (stage.current) {
							alreadyComplete = true;
						}

						if (!alreadyComplete) {
							stage.completed = true;
						} else {
							stage.completed = false;
						}
					}
					// endregion

					let processFlow = this.moduleDataService.getModuleProcessFlow(moduleId || this.moduleId, moduleTypeIndex);
					let statusFound = processFlow.findIndex(element => element.status === row.status);
					row.status = moduleId ? JSON.parse(JSON.stringify(this.moduleDataService.modules[moduleId].columns.module_statuses[row.status])) : JSON.parse(JSON.stringify(this.moduleDataService.modules[this.moduleId].columns.module_statuses[row.status]));
					row.status.updates = [];
					if (statusFound >= 0) {
						let isAllowed = processFlow[statusFound].roles.find(role => role === this.roleId);

						if (isAllowed && this.moduleDataService.isAllowedToUpdateStatus(isParentPermissionMatrix)) {
							let updates = [];
							processFlow[statusFound].flow.forEach(flow => {
								moduleId ? row.status.updates.push(this.moduleDataService.modules[moduleId].columns.module_statuses[+flow]) : row.status.updates.push(this.moduleDataService.modules[this.moduleId].columns.module_statuses[+flow]);
							});
							/*row.status = JSON.parse(JSON.stringify(this.moduleData.columns.module_statuses[+row.status]));
							row.status.updates = updates;*/
						}
					}
				}
			});

		});

		console.log("_VIEWDATA", this.viewData);
		return viewData;
	}

	/**
	 * Remove fields that are not in the permisson matrix / the user is not allowed to see
	 *
	 * @param fieldGroups
	 * @param allowedFields
	 */
	alignFieldsWithMatrix(fieldGroups, allowedFields) {
		for (let groupIndex = fieldGroups.length - 1; groupIndex >= 0; groupIndex--) {
			let group = fieldGroups[groupIndex];
			if (group.subGroups !== undefined) {
				group = this.alignFieldsWithMatrix(group.subGroups, allowedFields);
			}

			if (group.fields) {
				for (let fieldIndex = group.fields.length - 1; fieldIndex >= 0; fieldIndex--) {
					let field = group.fields[fieldIndex];
					let allowedField = allowedFields.find(x => x && x.field_id == field.col);

					if (!allowedField || (allowedField && !allowedField.view)) {
						group.fields.splice(fieldIndex, 1);
					} else {
						if (allowedField.view && !allowedField.update) {
							field.update = false;
						} else if (allowedField.view && allowedField.update) {
							field.update = true;
						}
					}
				}

				if (group.fields && group.fields.length === 0) {
					fieldGroups.splice(groupIndex, 1);
				}
			}
		}

		return fieldGroups;
	}

	/**
	 * Remove fields that are not in the permisson matrix / the user is not allowed to see
	 *
	 * @param dialogs
	 * @param allowedFields
	 */
	alignDialogFieldsWithMatrix(dialogs, allowedFields) {
		if (!dialogs) {
			return null;
		}

		let dialogNames = Object.keys(dialogs);

		for (let dialogName of dialogNames) {
			dialogs[dialogName].groups = this.alignFieldsWithMatrix(dialogs[dialogName].groups, allowedFields);
		}

		return dialogs;
	}

	/**
	 * Gets reference module id values to display in select box (for formas)
	 * Gets reference module ids for all types
	 */
	handleReferenceIds() {
		this.serviceCounter = 0;
		this.fieldsTemplates.forEach((fieldsTemplate, fieldTemplateIndex) => {
			this.calculateCount(fieldsTemplate);
			this.fetchReferenceModuleIds(fieldsTemplate);
		});

		this.moduleDataService.multiGroupsTemplates.forEach((fieldsTemplate, fieldTemplateIndex) => {
			this.fetchReferenceModuleIds(fieldsTemplate);
		});
	}

	/**
	 * Fetches module definitions of reference module Ids (autofill elements of form)
	 *
	 * @param fieldsTemplate
	 */
	referenceModuleIdCounter: number = 0;
	serviceCounter: number = 0;

	private calculateCount(fieldsTemplate) {
		fieldsTemplate.forEach((field, index) => {
			if (field.subGroups) {
				this.calculateCount(field.subGroups);
			}
			field.fields.forEach((element, elementIndex) => {
				if (element.reference_module_id) {
					this.referenceModuleIdCounter++;
				}
			});
		});
	}

	private fetchReferenceModuleIds(fieldsTemplate) {
		fieldsTemplate.forEach((field, index) => {
			if (field.subGroups) {
				this.fetchReferenceModuleIds(field.subGroups);
			}


			field.fields.forEach((element, elementIndex) => {


				if (element.reference_module_id && !this.ifReferenceModuleValueAlreadyPresent(elementIndex, element, field.fields)) {

					// Get module definition with values
					// remove key_show

					element.reference_module_values = element.reference_module_values.filter((value) => element.key_show != value);

					let reference_module_values = [];
					if (element.form_default_values) {
						// reference_module_values = element.reference_module_values;
						element.reference_module_values.forEach((referenceModuleValue, referenceModuleValueIndex) => {
							let found = element.form_default_values.find(formDefaultValue => formDefaultValue == referenceModuleValue);
							if (!found) {
								reference_module_values.push(referenceModuleValue);
							}
							element.form_default_values.forEach(defaultValue => {
								let defaultField = field.fields.find(x => x.col == defaultValue);
								if (defaultField) {
									defaultField.default_value_editable = element.form_default_values_editable;
								}
							});
						});
					} else {
						reference_module_values = element.reference_module_values;
					}

					if (reference_module_values.length == 0) {
						// reference_module_values = element.reference_module_values;
					}

					// Check if some fields are already in the fields
					for (let i = reference_module_values.length - 1; i >= 0; i--) {
						let referenceModuleValue = reference_module_values[i];
						let findInnerElement = field.fields.find((innerElement) => innerElement.col == referenceModuleValue )
						if (findInnerElement) {
							reference_module_values.splice(i, 1);
						}
					}

					this.userService.fetchReferenceModuleData(
						element.reference_module_id,
						reference_module_values
						// element.reference_module_values
					)
					.subscribe((data) => {
						this.serviceCounter++;
						if (data.status !== 200) {
							return;
						}
						this.moduleDataService.modules[element.reference_module_id] = data.content;
						if (data.content.moduleDefinition) {
							element.reference_keys = {};
							element.reference_keys['reference_keys'] = [];
							// Try adding reference_module_values to form
							try {
								data.content.moduleDefinition.forEach(referenceElementField => {
									if (referenceElementField.type == 'select' && referenceElementField.reference_module_id) {
										element.reference_keys['reference_keys'].push(
											{ field_id: referenceElementField.col, key_show: referenceElementField.key_show }
										);
									}
								});
								field.fields.splice(elementIndex + 1, 0, ...data.content.moduleDefinition);
							} catch (exception) {
							}
						}
						if(this.referenceModuleIdCounter == this.serviceCounter){
							// Opening drawer from notifications
							// if((this.drawerItemRecord || this._notificationService.notificationData) && (this.isNotification || this._notificationService.allowDrawerOpening)){
							if(this._notificationService.notificationData && this._notificationService.allowDrawerOpening){
								this.rowClicked(this._notificationService.notificationData);
								this.resetNotificationServiceData();
							}
							// Opening drawer from dashboard records
							if(this._dashboardService.recordData && this._dashboardService.allowDrawerOpening){
								this.drawerItemRecord = {
									id: +this._dashboardService.recordData.value_id,
									type_id: +this._dashboardService.recordData.type_id
								};
								this.rowClicked(this.drawerItemRecord);
								this.resetDashboardServiceData();
							}
							this.referenceModuleIdCounter = 0;
							this.serviceCounter = 0;
						}

						this.tableObjectFields(fieldsTemplate);
					});
				}
			});
		});
	}

	tableObjectFields(fieldsTemplate) {
		fieldsTemplate.forEach((field, index) => {
			if (field.subGroups) {
				this.fetchReferenceModuleIds(field.subGroups);
			}


			field.fields.forEach((element, elementIndex) => {
				if (element.inputType == "table_object") {

					element.columns.forEach((columnField, columnIndex) => {
						if (columnField.reference_module_id) { // TODO: @JAHANZAIB: if issue of adding reference modulevalue after the part id that has refernce_Mdule_values extend this condition with: && !this.ifReferenceModuleValueAlreadyPresent(columnIndex, columnField, element.columns)
							let referenceModuleValues = JSON.parse(JSON.stringify(columnField.reference_module_values));
							const index = referenceModuleValues.indexOf(columnField.key_show)
							if (index !== -1) {
								referenceModuleValues.splice(index, 1);
							}

							this.userService.fetchReferenceModuleData(
								columnField.reference_module_id,
								referenceModuleValues
								// element.reference_module_values
							)
								.subscribe((data) => {
									// this.serviceCounter++;
									if (data.status !== 200) {
										return;
									}
									this.moduleDataService.modules[columnField.reference_module_id] = data.content;
									if (data.content.moduleDefinition) {
										columnField.reference_keys = {};
										columnField.reference_keys['reference_keys'] = [];
										// Try adding reference_module_values to form
										try {
											data.content.moduleDefinition.forEach(referenceElementField => {
												if (referenceElementField.type == 'select' && referenceElementField.reference_module_id) {
													columnField.reference_keys['reference_keys'].push(
														{ field_id: referenceElementField.col, key_show: referenceElementField.key_show }
													);
												}
											});
											let isAddCol = true;
											element.columns.forEach(col => {
												if (col.type == data.content.moduleDefinition[0].type) {
													isAddCol = false;
												}
											});
											if (isAddCol) {
												element.columns.splice(columnIndex + 1, 0, ...data.content.moduleDefinition);
											}
										} catch (exception) {
										}
									}

								});
						}
					});
				}
			});
		});
	}

	/**
	 * Checks if reference module values are already fetched
	 *
	 * @param elementIndex
	 * @param element
	 * @param fields
	 */
	ifReferenceModuleValueAlreadyPresent (elementIndex: number, element: FieldConfig, fields): boolean {
		let referenceModuleValuesCounter = 0;
		let isPresent = false;
		try {
			for (let start = elementIndex + 1; start <= (elementIndex + element.reference_module_values.length - 1); start++) {
				if (fields[start].col == element.reference_module_values[referenceModuleValuesCounter]) {
					isPresent = true;
				} else {
					return false;
				}

				referenceModuleValuesCounter++;
			}
		} catch (exception) {
			isPresent = false;
		}

		return isPresent;
	}

	initParentTableData (): void {
		if (!this.parentViewData) {
			return;
		}

		this.tableWidgetData = null;

		if (!this.parentViewData.length) {
			this.hasNoData = true;
			this.isEmptyState = true;
		} else {
			this.hasNoData = false;
			this.isEmptyState = false;

			this.parentViewData.sort((a, b) => (a.group.id) - (b.group.id));
			this.tableWidgetData = {
				columnStructure: this.columnStructure,
				data: this.parentViewData,
				typeStructure: this.moduleDataService.parentViewPermissions.type,
				configuration: this.moduleDataService.getParentTableConfiguration()
			};

			timer(0).subscribe(() => {
				this.groupedTableWidget.initTableData();
			})
		}
	}

	/**
	 * Prepares data for the table
	 */
	initChildTableData(): void {
		if (!this.viewData) {
			return;
		}

		if (!this.viewData.length) {
		} else {
			this.viewData.sort((a, b) => (a.group.id) - (b.group.id));

			this.groupedTableWidget.initChildTable(
				this.parentDrawerItemRecord,
				{
					columnStructure: this.moduleDataService.viewPermissions.type[Object.keys(this.moduleDataService.viewPermissions.type)[0]],
					data: this.viewData,
					typeStructure: this.moduleDataService.viewPermissions.type,
					configuration: this.moduleDataService.getTableConfiguration()
				}
			);
		}
	}

	/**
	 * Prepares status list as needed for the table widget
	 *
	 * @param statusList
	 */
	transformationStatusInfoNChanges(statusList) {
		if (!this.moduleDataService.getViewPermissions().allowed_statuses || !statusList) {
			return;
		}
		var filteredStatusList = statusList.filter((x) => this.moduleDataService.getViewPermissions().allowed_statuses.includes(x.id));
		this.statusInfoNChanges = {};
		for (let i = 0; i < filteredStatusList.length; i++) {
			let index = i + 1;
			if (index < filteredStatusList.length) {
				this.statusInfoNChanges[filteredStatusList[i].name.en] = {
					id: filteredStatusList[i].id,
					backgroundColor: filteredStatusList[i].color,
					color: filteredStatusList[i].color,
					updates: [filteredStatusList[index].name],
					name: filteredStatusList[i].name
				};
			} else {
				this.statusInfoNChanges[statusList[i].name.en] = {
					id: filteredStatusList[i].id,
					backgroundColor: filteredStatusList[i].color,
					color: filteredStatusList[i].color,
					updates: [],
					name: filteredStatusList[i].name
				};
			}
		}
	}

	/**
	 * Prepares data for the table
	 */
	initTableData(searchQuery?): void {
		this.transformationStatusInfoNChanges(this.moduleData.columns.module_statuses);
		if (!this.viewData) {
			return;
		}
		// Todo: below check commented because we dont want to reset tableWidget on search. if needed safe to uncomment keeping in mind !searchQuery should be there
		// if(!searchQuery){
		// 	this.tableWidgetData = null;
		// }

		/* if (!this.viewData.length || !this.viewData[0].data.length) { // COMMENTED THIS OR CHECK AS IT IS CONFLICTING WITH EMPTY STATE OF TABLE WIDGET */
		if (!this.viewData.length && !searchQuery) {
			this.hasNoData = true;
			this.isEmptyState = true;
		} else {
			this.hasNoData = false;
			this.isEmptyState = false;

			this.viewData.sort((a, b) => (a.group.id) - (b.group.id));
			this.tableWidgetData = {
				columnStructure: this.columnStructure,
				data: this.viewData,
				statusInfoNChanges: this.statusInfoNChanges,
				typeStructure: this.moduleDataService.viewPermissions.type,
				configuration: this.moduleDataService.getTableConfiguration()
			};

			this.highlightRowSteps();

            timer(0).subscribe(() => {
                if (this.groupedTableWidget) {
                    this.groupedTableWidget.initTableData();
                }
            });
		}
	}

	backdrop: boolean = false;

	drawerClosed(event) {
		this.drawer.toggle();
		this.backdrop = false;
	}
	parentDrawerItemRecord: null;
	/**
	 * Opens Edit Drawer after user selected an item (from table widget)
	 *
	 * @param row
	 */
	rowClicked(row) {
		if (this.viewId == 257 || this.viewId == 251) {
			return;
		}

		console.log(row);
		this.drawerItemRecord = row;
		if (row.hasOwnProperty("frontend_tableConfiguration")) {
			if (row.frontend_tableConfiguration.isParent) {
				this.parentDrawerItemRecord = this.drawerItemRecord;
				let searchString = this.getSearchData(this.moduleDataService.parentViewPermissions.childView.searchKeys, this.drawerItemRecord);
				this.fetchDataOfPermissionMatrix(this.moduleDataService.parentViewPermissions.childView.searchKeys, searchString);
			} else if (row.frontend_tableConfiguration.isChild) {
				this.setDrawerType("edit");
			}
			return;
		}

		if (this.viewTitle.en == "Asset Report") {
			this.setDrawerType("assets");
		} else {
			this.setDrawerType("edit");
		}

		this.resetNotificationServiceData();
	}

	public getSearchData(searchKeys, record) {
		let searchString = "";

		searchKeys.forEach(searchKey => {
			searchString += record[searchKey];
		});

		return searchString;
	}

	isFormDirty: boolean = false;
	drawerItemRecord = null;

	/**
	 * Dynamically renders related Content into Drawer
	 *
	 * @param type
	 * @param data
	 */
	openDrawerComponent(type: string, data?: any) {
		this.isFormDirty = false;
		this.drawerWidth='';
		// this.drawer.toggle();

		switch (type) {
			case "add":
				this.drawerWidth = this.userService.checkDrawerWidth(false, false); // 70;
				this.drawerWidth = this.userService.responsiveDrawerWidth(type, this.drawerWidth, false);
				let addDrawerFactory = this.componentFactoryResolver.resolveComponentFactory(AddDrawerComponent);
				let addDrawer = this.viewContainerRef.createComponent(addDrawerFactory).instance;
				addDrawer.fieldsTemplates = JSON.parse(JSON.stringify(this.fieldsTemplates));
				if (!this.moduleDataService.viewPermissions || (!this.moduleDataService.viewPermissions.typeIds) || (this.moduleDataService.viewPermissions.typeIds && this.moduleDataService.viewPermissions.typeIds.length === 0)) {
					addDrawer.types = this.moduleData.columns.module_types.map(type => type.id);
				} else {
					addDrawer.types = this.moduleDataService.viewPermissions.typeIds;
				}
				addDrawer.isIncident = this.viewTitle.en == "Incidents";

				addDrawer.moduleId = this.moduleId;
				addDrawer.submitted.subscribe(async (data) => {

					let drawerItemRecord = {
						id: +data.values.id,
						type_id: +data.values.type_id
					};
					this.openDrawerFromSnackBar(drawerItemRecord, 'add');

					this.drawer.toggle();
					this.viewContainerRef.clear();
					this.lastModifiedItemId = data.id;
					if(!!this.boardWidget.first != true){
						const pageInfo = await this.getTableGroupPaginationInfo(data);
						if(pageInfo){
							this.fetchPaginatedData(pageInfo);
							this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].pageIndex = 0;
							this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].length++;
							this.tableWidget.first.selectedPageIndex.nativeElement = 1;
						}
						// Group does not exist
						else{
							if(this.moduleDataService.isStatusHasPermission(data.values.status)){
								this.fetchPermissionMatrix();
							}else{
								this.snackBarService.open(this.globalVars.translation["created_successfully"][this.globalVars.LNG]);
							}
						}
					}
					// this.fetchPermissionMatrix(this.parentModuleId);
					// this.tableWidgetData = null;
				});
				addDrawer.cancelled.subscribe((data) => {
					this.drawer.toggle();
					this.viewContainerRef.clear();
				});
				addDrawer.ifDirtyValues.subscribe((data) => {
					this.isFormDirty = data;
				});
				break;

			case "edit":
				this.drawerWidth = this.userService.checkDrawerWidth(true, false);// 70;
				this.drawerWidth = this.userService.responsiveDrawerWidth(type, this.drawerWidth, false);
				let editDrawerFactory = this.componentFactoryResolver.resolveComponentFactory(EditDrawerComponent);
				let editDrawer = this.viewContainerRef.createComponent(editDrawerFactory).instance;
				data = this.drawerItemRecord;
				editDrawer.data = data;
				let typeIdIndex = this.moduleData.columns.module_types.findIndex(moduleType => moduleType.id == (+data.type_id));
				editDrawer.moduleStatuses = this.moduleData.columns.module_statuses;

				editDrawer.fields = JSON.parse(JSON.stringify(this.fieldsTemplates[+typeIdIndex]));
				if (data.status && this.moduleData.columns.module_types[data.type_id].process_flow[data.status.id]) {
					editDrawer.actionButtons = this.moduleData.columns.module_types[data.type_id].process_flow[data.status.id].actions;
				}
				if (this.viewStatus) {
					editDrawer.statusView = this.viewStatus;
				}
				// I have to find the index of value which is clicked
				try {
					editDrawer.actionButtons = this.moduleData.columns.module_types[data.type_id].process_flow[data.status.id].actions;
				} catch (exception) {

				}

				editDrawer.editOverview = this.overViewData;

				// editDrawer.cardData = this.moduleData.columns.module_statuses;

				editDrawer.submitted.subscribe((data) => {
					this.drawer.toggle();
					this.viewContainerRef.clear();
					this.openDrawerFromSnackBar(this.drawerItemRecord, 'edit');

					if (this.moduleDataService.hasParentViewRelation) {
						if (data.frontend_tableConfiguration.hasParentChildRelation && data.frontend_tableConfiguration.isChild) {
							const searchString = this.getSearchData(this.moduleDataService.parentViewPermissions.childView.searchKeys, this.drawerItemRecord);
							if ((typeof data === 'object' && 'pageInfo' in data)) {
                                (!!this.searchService.getSearchQuery() && this.editItemService.shouldRefreshViewOnClose) ? this.refetchPermissionMatrix() : this.fetchPaginatedData(data.pageInfo);
							} else {
								this.fetchDataOfPermissionMatrix(this.moduleDataService.parentViewPermissions.childView.searchKeys, searchString);
							}
						}
						// this.fetchPermissionMatrix(this.parentModuleId);
					} else {

						if (( typeof data === 'object' && 'pageInfo' in data)) {
                            (!!this.searchService.getSearchQuery() && this.editItemService.shouldRefreshViewOnClose) ? this.refetchPermissionMatrix() : this.fetchPaginatedData(data.pageInfo);
						} else {
                            this.refetchPermissionMatrix();
						}
					}

					this.lastModifiedItemId = data.id;
				});
				editDrawer.cancelled.subscribe((data) => {
					this.drawer.toggle();
					this.viewContainerRef.clear();
				});
				editDrawer.ifDirtyValues.subscribe((data) => {
					this.isFormDirty = data;
				});
				break;

			case "assets":
				this.drawerVw = 80;
				let assetsDrawerFactory = this.componentFactoryResolver.resolveComponentFactory(AssetsReportComponent);
				let assetsDrawer = this.viewContainerRef.createComponent(assetsDrawerFactory).instance;
				if(this.drawerItemRecord && this.drawerItemRecord.id){
					assetsDrawer.id = this.drawerItemRecord.id;
				}
				assetsDrawer.submitted.subscribe((data) => {
					this.drawer.toggle();
					this.viewContainerRef.clear();
					this.snackBarService.open(this.globalVars.translation["Updated successfully"][this.globalVars.LNG], "", 2000);
					this.fetchPermissionMatrix();
					this.lastModifiedItemId = data.id;
				});
				assetsDrawer.cancelled.subscribe((data) => {
					this.drawer.toggle();
					this.viewContainerRef.clear();
				});
				break;

			default:
				break;
		}
	}

	public drawerType: string = "add";

	/**
	 * Sets Drawer Type and toggles it
	 * @param type
	 */
	setDrawerType(type) {
		this.clearContainerRef();

		switch (type) {
			case 'add':
				this.drawerVw = 50;
				break;

			case 'edit':
				this.drawerVw = 70;
				break;

			case 'assets':
				this.drawerVw = 80;
				this.drawerItemRecord = null;
				break;

			default:
				this.drawerVw = 70;
				break;
		}

		this.drawerType = type;
		this.drawer.toggle();
	}

	clearContainerRef() {
		this.viewContainerRef.clear();
	}

	/**
	 * Handles what to do when user clicks on backdrop when drawer is opened
	 */
	backdropClick() {
		if (this.isFormDirty) {
			this.drawer.disableClose = true;
			const dialogRef = this.dialog.open(ValidationDialog, {});
			dialogRef.afterClosed().subscribe((param) => {
				if (param) {
					this.drawer.disableClose = false;
					this.drawer.close();
					this.clearContainerRef();
				}
			});
		}
	}

	copyObject(object) {
		let newObject = [];
	}

	/**
	 * Updates Status once event emitted form table widget
	 *
	 * @param status
	 */
	statusUpdated(status) {

		if(status.hasOwnProperty('row')){
			this.drawerItemRecord = status.row
		}
		const dialogRef = this.dialog.open(ConfirmationDialog, {
			data: {
				status: status.status,
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				this.updateStatusApiCall(status);
			}
		});
	}

	/**
	 * Updates status
	 *
	 * @param row
	 */

	updateStatusApiCall(row) {
		this.ngxSpinner.show("user");
		let value: any = {};

		value.status = row.status.id;

		if (this.globalVars.getCurrentApplicationName() == 'insurance') {
			if (row.status.id === 19) {
				value.on_hold = true;
				value.status = undefined;
			} else if (row.row.on_hold == 'true' || row.row.on_hold == true) {
				value.on_hold = false;
			}
		}

		let data: any = {
			id: row.row.id,
			value: JSON.stringify(value),
			typeId: this.moduleDataService.typeHasTrigger(row.row.type_id) ? row.row.type_id : undefined,
			trigger: this.moduleDataService.typeHasTrigger(row.row.type_id) || undefined
		};

		this.userService.updateItemStatus(data).subscribe(async (res) => {
			this.showSnackBar(row.status);
			if (row.row.hasOwnProperty("frontend_tableConfiguration")) {
				if (row.row.frontend_tableConfiguration.hasParentChildRelation && row.row.frontend_tableConfiguration.isChild) {
					let searchString = this.getSearchData(this.moduleDataService.parentViewPermissions.childView.searchKeys, this.drawerItemRecord);
					this.fetchDataOfPermissionMatrix(this.moduleDataService.parentViewPermissions.childView.searchKeys, searchString);
				}
			}else{

				if(!!this.boardWidget.first != true){
					let pageInfo, fromGroupId = +row.row.status.id, toGroupId = +row.status.id;

					pageInfo = await this.getTableGroupPaginationInfo(null, fromGroupId);
					// From-Group does exist
					if(pageInfo){
						if(pageInfo.totalRecords == 1){
							this.tableWidget.first.dataSources.splice(pageInfo.tableIndex, 1);
							this.viewData.splice(pageInfo.tableIndex, 1);
						}

						pageInfo.group = fromGroupId;
						this.fetchPaginatedData(pageInfo);
						this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].pageIndex = 0;
						this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].length--;
						let totalRecords = this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].length;
						this.tableWidget.first.selectedPageIndex.nativeElement = 1;
						if(this.viewData.length && pageInfo.tableIndex < this.viewData.length){
							this.viewData[pageInfo.tableIndex].pageInfo.totalRecords = totalRecords;
						}
					}

					pageInfo = await this.getTableGroupPaginationInfo(null, toGroupId);
					// To-Group does exist
					if(pageInfo){
						pageInfo.group = toGroupId;
						this.fetchPaginatedData(pageInfo);
						this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].pageIndex = 0;
						this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].length++;
						let totalRecords = this.tableWidget.first.paginator["_results"][pageInfo.tableIndex].length;
						this.tableWidget.first.selectedPageIndex.nativeElement = 1;
						if(this.viewData.length && pageInfo.tableIndex < this.viewData.length){
							this.viewData[pageInfo.tableIndex].pageInfo.totalRecords = totalRecords;
						}
					}
					// To-Group does not exist
					else{
						if(this.moduleDataService.isStatusHasPermission(toGroupId)){
							this.fetchPermissionMatrix();
						}else{
							this.showSnackBar(row.status);
							this.ngxSpinner.hide("user");
						}
					}

					this.lastModifiedItemId = row.row.id;
				}else{
					this.ngxSpinner.hide("user");
				}
			}
		});
	}

	updateStatusAfterChanged(data) {
		// this.showSnackBar(data.status);
		this.updateStatusApiCall(data);
	}

	showSnackBar(status) {
		this.snackBar.openFromComponent(StatusUpdateSnackbar, {
			data: {
				color: status.color,
				status: status.name
			},
			duration: 2000,
		});
	}

	/**
	 * Get Claims By Year
	 */
	searchWidgetData: boolean = true;
	emptyState: any;

	getClaimsByYear(event) {
		if (!this.ifSearchBox) {
			this.tableWidgetData = null;
			this.viewData = null;
			this.ngxSpinner.show("user");
			this.userService.getClaimsByYear(event.value)
				.subscribe((data) => {
					if (data.status == 200) {
						this.viewData = data.content;
						this.searchWidgetData = true;
						this.alignProcessFlowWithPermissionMatrix(this.viewData);
						this.initTableData();
					} else {
						this.notFoundMessage = data.error.error;
						this.searchWidgetData = false;
						this.hasNoData = true
						this.emptyState = "no_result"
					}
					this.ngxSpinner.hide("user");
				});
		} else {
			this.getClaimsBySearch();
		}
	}

	/**
	 * fo search bar toggle
	 *
	 */
	ifSearchBox: boolean = false;
	searchbutton: string = "search";
	searchForm: FormGroup;
	notFoundMessage: string;

	createSearchForm() {
		// if(this.viewTitle.en == 'Asset Inquiry'){
		if(this.viewId == 3823){	//'Asset Inquiry'
			this.searchForm = this.formBuilder.group({
				searchWord: ['']
			});
		}
		else{
			this.searchForm = this.formBuilder.group({
				currentYear: [new Date().getFullYear().toString()],
				claimNo: ['']
			});
		}
		// console.log('searchForm__', this.searchForm.value);
	}

	toggleSearchBox() {
		this.ifSearchBox = !this.ifSearchBox;
		if (this.ifSearchBox) {
			this.searchbutton = "close";
		} else {
			this.searchbutton = "search";
			this.fetchPermissionMatrix();
			// if(this.viewTitle.en == 'Asset Inquiry')
			if(this.viewId == 3823)	//'Asset Inquiry'
				this.searchForm.patchValue({
					searchWord : ''
				});
			else
				this.searchForm.patchValue({
					claimNo : ''
				});

		}
	}


	getClaims(){
		this.ngxSpinner.show("user");
		this.tableWidgetData = null;
		this.viewData = null;
		let data = {
			serachYear	: this.searchForm.get('currentYear').value,
			claimNo		: this.searchForm.get('claimNo').value,
			viewId 		: this.viewId,
			roleId		: this.roleId
		};
		this.userService.searchClaim(data, this.moduleDataService.moduleFields)
		.subscribe(data => {
			if (data.status == 200) {
				if (data.content) {
					this.searchWidgetData = true;
					this.viewTitle = data.content.viewName;
					this.moduleDataService.setViewPermissions(data.content.permissions);
					this.columnStructure = this.getColumnStructure(this.moduleDataService.viewPermissions.type);
					this.viewData = data.content.tableData;
					data.content.permissions.viewName = data.content.viewName;

					// Got the edit_overview value from permission matrix and store in property
					this.viewStatus = this.moduleDataService.getEditOverview();
					this.overViewData = this.moduleDataService.getEditOverview();//Got edit_Overview Object from permission data
					this.alignProcessFlowWithPermissionMatrix(this.viewData);
					this.initTableData();

					if (this.moduleDataService.viewHasOverview()) {
						this.overview = this.generateDashboardOverview(this.viewData);
					}
				}
			} else {
				this.notFoundMessage = data.error.error;
				this.searchWidgetData = false;
				this.hasNoData = true
				this.emptyState = "no_result"
			}
			this.ngxSpinner.hide("user");
		});
	}

	getClaimsBySearch() {
		this.ngxSpinner.show("user");
		this.tableWidgetData = null;
		this.viewData = null;
		if (this.searchForm.get('claimNo').value == '') {
			this.fetchPermissionMatrix();
		} else {
			let data = {
				serachYear	: this.searchForm.get('currentYear').value,
				claimNo		: this.searchForm.get('claimNo').value,
				roleId		: this.roleId
			};
			this.userService.searchClaim(data, this.moduleDataService.moduleFields)
			.subscribe(data => {
				if (data.status == 200) {
					if (data.content) {
						this.viewData = data.content;
						this.searchWidgetData = true;
						this.alignProcessFlowWithPermissionMatrix(this.viewData);
						this.initTableData();
					} else {
						this.notFoundMessage = data.error.error;
						this.searchWidgetData = false;
						this.hasNoData = true
						this.emptyState = "no_result"
					}
				}
				this.ngxSpinner.hide("user");
			});

			this.userService.getClaimBySearch(data)
				.subscribe(data => {
					if (data.status == 200) {
						this.viewData = data.content;
						this.searchWidgetData = true;
						this.alignProcessFlowWithPermissionMatrix(this.viewData);
						this.initTableData();
					} else {
						this.notFoundMessage = data.error.error;
						this.searchWidgetData = false;
						this.hasNoData = true
						this.emptyState = "no_result"
					}
					this.ngxSpinner.hide("user");
				});
		}
	}

	// getRecordBySearchWord is specifically designed for "Asset Inquiry" View - to search asset by code
	getRecordBySearchWord(){
		console.log('getRecordBySearchWord triggered');

		this.ngxSpinner.show("user");
		this.tableWidgetData = null;
		this.viewData = null;
		let data = {
			searchWord	: this.searchForm.get('searchWord').value,
			viewId 		: this.viewId,
			moduleId	: this.moduleId,
			roleId		: this.roleId
		};
		this.userService.searchByWordForAssets(data, this.moduleDataService.moduleFields)
		.subscribe(data => {
			if (data.status == 200) {
				if (data.content) {
					this.searchWidgetData = true;
					this.viewTitle = data.content.viewName;
					this.moduleDataService.setViewPermissions(data.content.permissions);
					this.columnStructure = this.getColumnStructure(this.moduleDataService.viewPermissions.type);
					this.viewData = data.content.tableData;
					data.content.permissions.viewName = data.content.viewName;

					// Got the edit_overview value from permission matrix and store in property
					this.viewStatus = this.moduleDataService.getEditOverview();
					this.overViewData = this.moduleDataService.getEditOverview();//Got edit_Overview Object from permission data
					this.alignProcessFlowWithPermissionMatrix(this.viewData);
					this.initTableData();
				}
			} else {
				this.notFoundMessage = data.error.error;
				this.searchWidgetData = false;
				this.hasNoData = true
				this.emptyState = "no_result"
			}
			this.ngxSpinner.hide("user");
		});
	}

	years: any[] = [
		{ id: '2018', value: '2018' },
		{ id: '2019', value: '2019' },
		{ id: '2020', value: '2020' }
	];


	public fetchPaginatedData(pageInfo) {
		this.ngxSpinner.show('user');
		let moduleId, viewId, searchString, searchKeys;

		if ('searchQuery' in pageInfo) {
			pageInfo.searchStructure = this.moduleDataService.modules[this.moduleId].columns.module_fields;
		}

		if (pageInfo.hasOwnProperty("frontend_tableConfiguration")) {
			if (pageInfo.frontend_tableConfiguration.isParent) {
				moduleId = this.parentModuleId;
				viewId = this.viewId;
			} else if (pageInfo.frontend_tableConfiguration.isChild) {
				moduleId = +this.moduleId;
				viewId = this.moduleDataService.parentViewPermissions.childView.viewId;
			}
			searchString = this.getSearchData(this.moduleDataService.parentViewPermissions.childView.searchKeys, (pageInfo.parentRecord ? pageInfo.parentRecord : this.drawerItemRecord ));
			searchKeys = this.moduleDataService.parentViewPermissions.childView.searchKeys;
		} else {
			if (this.moduleDataService.hasParentViewRelation) {
				moduleId = this.parentModuleId;
			} else {
				moduleId = +this.moduleId;
			}
		}

        this.userService.fetchPaginatedData(viewId || this.viewId, moduleId, this.roleId, pageInfo, searchKeys, searchString)
            .subscribe(data => {

                if (data.content) {
                    let tableData = data.content.tableData;
                    tableData = tableData[0]; // as we are expecting only a single group in array
                    if (tableData) {
                        if (tableData.hasOwnProperty("group")) {
                            if (typeof tableData.group != 'object' && this.moduleDataService.isGroupedByStatus()) {
                                tableData.group = this.moduleDataService.getModuleStatuses(moduleId)[+tableData.group];
                            }
                        }
                        if (pageInfo.hasOwnProperty("frontend_tableConfiguration")) { // Parent child relation
                            if (pageInfo.frontend_tableConfiguration.isParent) {
                                this.findAndReplaceGroupRecords(tableData);
                            } else if (pageInfo.frontend_tableConfiguration.isChild) {
                                this.groupedTableWidget.initChildTable(this.parentDrawerItemRecord, {
                                    columnStructure: data.content.permissions.type[Object.keys(data.content.permissions.type)[0]],
                                    data: this.alignProcessFlowWithPermissionMatrix(data.content.tableData, moduleId, true),
                                    typeStructure: data.content.permissions.type,
                                    configuration: this.moduleDataService.getTableConfigurationParam(data.content.permissions)
                                });
                            }
                        } else { // No Parent child relation
                            this.findAndReplaceGroupRecords(tableData);
                            if (data.content.permissions.childView) {
                                this.alignProcessFlowWithPermissionMatrix(this.parentViewData, moduleId, true);
                            } else {
                                if (!this.moduleDataService.hasParentViewRelation) {
                                    this.alignProcessFlowWithPermissionMatrix(this.viewData, moduleId, false);
                                }
                            }
                        }

                        this.highlightRowSteps();

                    }
                }

                this.ngxSpinner.hide('user');

            });
	}

	/**
     * Find and replace single or multi-group records
     *
     * @param tableData records to be replaced with
     */
	public findAndReplaceGroupRecords(tableData) {
        const viewData = this.moduleDataService.hasParentViewRelation ? this.parentViewData : this.viewData;

		// Multi group table data
        if (viewData.length) {
            const foundIndex = viewData.findIndex((group) => (group.group && group.group.id === tableData.group.id));
            const groupIndex = this.moduleDataService.hasGrouping() ?
                (foundIndex < 0 ?  0 : foundIndex ) : 0;

            if (groupIndex < 0 || (!this.groupedTableWidget && !this.groupedBoardWidget)) {
                return;
            }

            viewData[groupIndex].data = tableData.data;

            if (this.activeMode.type === 'list') {
                this.groupedTableWidget.replaceTableDataSource(groupIndex, tableData); // UPDATE OLD PAGE DATA WITH NEW ONE
            } else {
                this.groupedBoardWidget.replaceCardData(groupIndex, tableData); // UPDATE OLD PAGE DATA WITH NEW ONE
            }
        }
	}

	public recordSearchQuery(query){
		let searchStructure;
		let moduleId;
		// searchStructure = this.moduleDataService.modules[this.moduleId].columns.module_fields;
		if(this.moduleDataService.hasParentViewRelation){
			moduleId = this.parentModuleId;
			searchStructure = this.moduleDataService.modules[moduleId].columns.module_fields;
			this.moduleId = null;
			this.parentModuleId = null;
		}else{
			searchStructure = this.moduleDataService.modules[this.moduleId].columns.module_fields;
		}
		this.fetchPermissionMatrix(moduleId, null, searchStructure, query);
	}

	public clearSearchQuery(query){
		let moduleId;
		if(this.moduleDataService.hasParentViewRelation){
			moduleId = this.parentModuleId; // make sure here id should be of parent. currently its stored as child
			this.moduleId = null;
			// this.parentModuleId = null;
		}
		this.fetchPermissionMatrix(moduleId, null, null, null);
	}

	/**
	 * Clean DashboardService data to avoid keep opening drawer on changing view from sidebar
	 *
	 */
	public resetDashboardServiceData(){
		this._dashboardService.recordData = null;
		this._dashboardService.allowDrawerOpening = false;
	}

	/**
	 * Clean NotificationService data to avoid keep opening drawer on changing view from sidebar
	 *
	 */
	public resetNotificationServiceData(){
		this._notificationService.notificationData = null;
		this._notificationService.allowDrawerOpening = false;
	}

	public async getTableGroupPaginationInfo(data, id?){
		let groupId = null, pageInfo = null, groupIndex = null;

		if(data && 'status' in data.values){
			groupId = data.values.status;
		}
		else if(id || id == 0){
			groupId = id;
		}
		if(groupId || groupId == 0){
			if(this.moduleDataService.isGroupedByStatus()){
				let groupFound = this.viewData.find( (group) => group.group.id == groupId);
				if(groupFound){
					pageInfo = groupFound.pageInfo;
					groupIndex = this.viewData.findIndex( (group) => group.group.id == groupId);
					pageInfo.tableIndex = groupIndex;
					this.tableWidget.first.tableData.data[groupIndex].pageInfo.pageNo = 0; // jump to first page by default
				}
			}else{
				if(this.viewData.length == 1){
					pageInfo = this.viewData[0].pageInfo;
					pageInfo.tableIndex = 0;
					this.tableWidget.first.tableData.data[0].pageInfo.pageNo = 0; // jump to first page by default
				}
			}
		}
		return pageInfo;
	}

	public highlightRowSteps() {
        if (this.lastModifiedItemId) {
            timer(0).subscribe(_ => {
                this.groupedTableWidget.lastModifiedItemId = this.lastModifiedItemId;
                this.groupedTableWidget.highlightChangesStatusRow();
                this.lastModifiedItemId = null;
            });
        }
	}

	public openDrawerFromSnackBar(data, type: string) {

		this.snackbarDrawerOpenerSubscription = this._snackbarDrawerOpenerService.fireDrawerOpener.subscribe( row => {
			this.rowClicked(row);
		});

		this.snackBar.openFromComponent(SnackbarDrawerOpener, {
			data: {
				drawerRecord: data,
				drawerType: type
			},
			duration: 5000,
		});
	}

	tabAnimationDone(tabGroup) {
        const mode = this.moduleDataService.modes.find(modeItem => modeItem.tabIndex === tabGroup.selectedIndex);
        if (mode) {
            this.setActiveMode(mode.type);
        }
        
	    if (this.activeMode.type === 'list') {
	        if(this.groupedTableWidget){
                this.groupedTableWidget.initTableData();
            }
        }
    }
    
    setActiveMode(mode: string) {
        switch (mode) {
            case "board":
                this.activeMode = {
                    type: "board",
                    tabIndex: this.moduleDataService.modes.find( modeItem => modeItem.type === mode).tabIndex
                };
                break;

            case "list":
                this.activeMode = {
                    type: "list",
                    tabIndex: this.moduleDataService.modes.find( modeItem => modeItem.type === mode).tabIndex,
                };
                break;

            default:
                this.activeMode = {
                    type: "list",
                    tabIndex: this.moduleDataService.modes.find( modeItem => modeItem.type === mode).tabIndex,
                };
                break;
        }
    }

    /**
     * Reload view by resetting tableWidgetData
     */
    public refetchPermissionMatrix() {
        this.fetchPermissionMatrix();
        this.tableWidgetData = null;
    }
    
    public fireActionButton(event) {
        this.openBarcodeDialog(event.layout, event.row, event.value);
    }

    public openBarcodeDialog(layout, row, id): void {

        const dialogRef = this.dialog.open(BarcodeDialog,{
            data: { id },
            minWidth: 500,
            // minHeight: 500
        });
        dialogRef.afterClosed().subscribe(() => {
            const a = document.createElement('a');
        });
    }
}
