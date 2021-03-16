import {Component, OnInit, ViewChild, Input, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from 'src/app/global-variables.service';
import { EditItemService } from '../edit-drawer/edit-item.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SpinnerSnackbarService } from 'src/app/modules/core/shared/components/spinner-snackbar/spinner-snackbar.service';
import { TableWidgetModel } from 'src/app/modules/core/shared/widgets/table-widget/table-widget.model';
import { UserService } from '../user.service';
import { ModuleDataService } from '../module-data/module-data.service';
import { timer, Subscription } from 'rxjs';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { DataService } from 'src/app/shared/service/data.service';


@Component({
    selector: 'app-side-list',
    templateUrl: './side-list.component.html',
    styleUrls: ['./side-list.component.scss']
})
export class SideListComponent implements OnInit, OnDestroy {

    /**
     * Stores structure, data & moduleStatuses for list view
     */
    public tableWidgetData: TableWidgetModel;

    drawerItemRecord = null;
    @ViewChild('tableWidget', { static: false }) groupedTableWidget: TableWidget;

    @Input() data;
    @Input() structure;
    @Input() isEdit;
    @Input() loadDataLocally: boolean;
    viewTitle: any;
    permissionData: any;
    columnStructure: any;
    viewData: any;
    parentViewData: any;
    childViewData: any;
    hasNoData: boolean;
    isEmptyState: boolean;
    public displayedColumns: string[];
    subsVar: Subscription;
    subsMultiIssue: Subscription;
    moduleId: any;

    constructor(
        public globalVars: GlobalVariables,
        private editItemService: EditItemService,
        private ngxSpinner: NgxSpinnerService,
        public snackBarService: SnackbarService,
        private formBuilder: FormBuilder,
        public spinnerSnackBarService: SpinnerSnackbarService,
        private userService: UserService,
        private moduleDataService: ModuleDataService,
        private dataService: DataService

    ) {

    }

    ngOnInit() {
        // this.structure.api = viewpermissioncombined/parentModuleId=41&childModuleId=85
        // &moduleId=85
        if (this.loadDataLocally) {
            this.ngxSpinner.show("side-list");
            this.data = this.dataService.getListData();
            this.fetchIssuePermissionMatrix();
        }
        
        this.subsVar =  this.dataService.serviceOnChange.subscribe((data) => {
            this.ngxSpinner.show("side-list");
            this.dataService.setListData(data);
            this.data = data;
            this.fetchIssuePermissionMatrix();
        });
    }


    /**
     * Fetch table data and permissions
     */
    fetchIssuePermissionMatrix() {
        this.tableWidgetData = null;
        let searchString = "";
        if (this.structure.parameters && this.structure.parameters.length > 0) {
            searchString = this.getSearchData(this.structure.parameters, this.data);
        }
        this.userService.fetchIssuePermissionMatrix(this.structure.api, searchString)
            .subscribe((data) => {
                if (data.content) {
                    /** In case of parent child relation */
                    if (data.content.hasOwnProperty("parentView")) {
                        this.parentViewData = data.content.parentView;
                        this.moduleId = this.getUrlVars()["parentModuleId"];
                        this.alignProcessFlowWithPermissionMatrix(this.parentViewData.parentViewTableData);
                        this.childViewData = data.content.childView;
                        this.moduleId = this.getUrlVars()["childModuleId"];
                        this.alignProcessFlowWithPermissionMatrix(this.childViewData.childViewTableData);
                        this.initParentTableData();
                        if (this.parentViewData.parentViewTableData[0]) {
                            this.drawerItemRecord = this.parentViewData.parentViewTableData[0].data[0];
                        }
                        this.initChildTableData();
                    } else {
                        /** in case of single table (no parent child relation) */
                        this.viewData = data.content;
                        this.moduleId = this.getUrlVars()["moduleId"];
                        this.alignProcessFlowWithPermissionMatrix(this.viewData);
                        this.initTableData();
                    }
                }
                this.ngxSpinner.hide("side-list");
            });
    }

    public getSearchData(parameters, record) {
        let searchString = "";
        parameters.forEach(parameter => {
            if (parameter.type == "frontend_record" && parameter.searchKeys != null) {
                searchString += `searchKeys=${parameter.searchKeys.join(",")}&searchString=${record[parameter.searchValue]}`;
            }
        });

        return searchString;
    }

    alignProcessFlowWithPermissionMatrix(viewData) {
        if (!viewData) {
            return;
        }
        viewData.forEach((group, groupIndex) => {
            if (group.hasOwnProperty("group")) {
                if(typeof group.group != 'object'){
                    group.group = this.moduleDataService.getModuleStatuses(this.moduleId)[+group.group];
                }
            }
            group.data.forEach((row, rowIndex) => {
                let moduleTypeIndex = this.moduleDataService.findTypeIndexById(+row.type_id);
                if (moduleTypeIndex >= 0 && row.status >= 0) {
                    row.status = +row.status;
                    row.status = JSON.parse(JSON.stringify(this.moduleDataService.getModuleStatuses(this.moduleId)[row.status]));
                }
            });

        });

    }


    /**
     * Prepares data for the child table
     */
    initChildTableData(): void {
        if (!this.childViewData.childViewTableData) {
            return;
        }
        if (!this.childViewData.childViewTableData.length) {
        } else {
            this.childViewData.childViewTableData.sort((a, b) => (a.group.id) - (b.group.id));
            timer(0).subscribe(() => {
                if (this.groupedTableWidget) {
                    this.groupedTableWidget.initChildTable(
                        this.drawerItemRecord,
                        {
                            columnStructure: this.getColumnStructure(this.childViewData.permissions),
                            data: this.childViewData.childViewTableData,
                            typeStructure: this.childViewData.permissions.type,
                            configuration: this.getTableConfiguration(this.childViewData.permissions)

                        }
                    );
                }
            });
        }
    }

    /**
     * Prepares data for the table and  init Parent table
     */
    initParentTableData(): void {
        if (!this.parentViewData.parentViewTableData) {
            return;
        }
        this.tableWidgetData = null;
        if (!this.parentViewData.parentViewTableData.length) {
            this.hasNoData = true;
            this.isEmptyState = true;
        } else {
            this.hasNoData = false;
            this.isEmptyState = false;

            this.parentViewData.parentViewTableData.sort((a, b) => (a.group.id) - (b.group.id));
            this.tableWidgetData = {
                columnStructure: this.getColumnStructure(this.parentViewData.permissions),
                data: this.parentViewData.parentViewTableData,
                typeStructure: this.parentViewData.permissions.type,
                configuration: this.getTableConfiguration(this.parentViewData.permissions)
            };
        }
    }

    /**
     * Prepares data for the table and init table
     */
    initTableData(): void {
        if (!this.viewData.tableData) {
            return;
        }
        this.tableWidgetData = null;
        this.viewData.tableData.sort((a, b) => (a.group.id) - (b.group.id));
        this.tableWidgetData = {
            columnStructure: this.getColumnStructure(this.viewData.permissions),
            data: this.viewData.tableData,
            typeStructure: this.viewData.permissions.type,
        };
    }

    /**
     * Get table column structures
     */
    getColumnStructure(permissionMatrix?) {
        let firstFieldId = Object.keys(permissionMatrix.type)[0];
        return permissionMatrix.type[firstFieldId];
    }

    /**
     * Get table column Configuration
     */
    public getTableConfiguration(permissionMatrix) {
        if (permissionMatrix.viewModes) {
            let listMode = permissionMatrix.viewModes.find((mode) => mode && mode.type == "list");
            listMode.configuration.defaultPadding = false;
            return listMode.configuration;
        }
    }


    checkBoxClicked(ev) {
        if (ev.isChecked == true) {
            this.fetchItemDetails(ev.data.id, ev.isChecked);
        } else {
            if(ev.data){
                let data:any = {};
                data['isChecked'] = false;
                data['id'] = ev.data.id;
                this.dataService.multiEditFields.emit(data);
            }
            // this.selection.selected // find object with id = frontend_id:: unselect
        }
    }

    fetchItemDetails(id, isChecked) {
        this.ngxSpinner.show("side-list");
        this.subsMultiIssue = this.editItemService.fetchItemDetails(id)
            .subscribe((data) => {
                data.isChecked = isChecked;
                this.dataService.multiEditFields.emit(data);
                this.ngxSpinner.hide("side-list");
            });

    }

    ngOnDestroy() {
        if (this.subsVar) {
            this.subsVar.unsubscribe();
        }

        if (this.subsMultiIssue) {
            this.subsMultiIssue.unsubscribe();
        }
    }

    getUrlVars() {
        let vars = {};
        const parts = this.structure.api.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

}
