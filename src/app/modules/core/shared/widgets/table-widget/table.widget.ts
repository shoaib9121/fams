import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Directive,
    ViewChild,
    SimpleChanges,
    Pipe,
    PipeTransform,
    ElementRef,
    ViewChildren,
    QueryList,
    Inject
} from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { GlobalVariables } from "../../../../../global-variables.service";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { TableWidgetConfiguration, TableWidgetModel } from "./table-widget.model";
import { DataService } from 'src/app/shared/service/data.service';
import { timer } from "rxjs";
import { PageEvent } from '@angular/material/paginator';
import { PaginatorIntlService } from '../../services/custom-paginator/custom-paginator.service';
import { MatPaginatorIntl, MatPaginator } from '@angular/material';
import { SearchService } from '../../services/search/search.service';
import {filter} from "rxjs/operators";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { BarcodeDialog } from "../../dialogs/barcode-dialog/barcode.dialog";

@Directive({
	selector: 'img[default]',
	host: {
	'(error)':'updateUrl()',
	'[src]':'src'
	}
})
class DefaultImage {
	@Input() src:string;
	@Input() default:string;

	updateUrl() {
	  this.src = this.default;
	}
}

@Pipe({
	name: 'totalPagesPipe'
})
export class TotalPagesPipe implements PipeTransform {
	transform(paginator: any, length: any, pageSize: any): any {
		let array = [];
		let totalPages = +Math.ceil(length/pageSize);
		for(let i=1; i <= totalPages; i++){
			array.push(i);
		}
		return array;
	}
}

@Component({
	selector: "app-table-widget",
	templateUrl: "./table.widget.html",
	styleUrls: ["./table.widget.scss"],
	animations: [
		trigger("detailExpand", [
			state("collapsed, void", style({minHeight: "0", height: "0px", visibility: "hidden"})),
			state("expanded", style({minHeight: "75px", height: "*", visibility: "visible"})),
			transition("expanded <=> collapsed, void <=> *", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
		]),
	],
	providers: [
		{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }
	]
})


export class TableWidget implements OnInit {
	@Input() viewSettings: Array<object>;
	@Input() tableData: TableWidgetModel;
	@Output() rowClicked = new EventEmitter<any>();
	@Output() checkBoxClicked = new EventEmitter<any>();
	@Output() statusUpdated = new EventEmitter<any>();
	@Output() actionButtonPressed = new EventEmitter<any>();
	@Output() actionButtonPressedAll = new EventEmitter<any>();
	@Output() toggleButtonPressed = new EventEmitter<any>();
	@Output() pagedDataRequest = new EventEmitter<any>();
	@Output() eventRecordSearchQuery = new EventEmitter<any>();
	@Output() eventClearSearchQuery = new EventEmitter<any>();

	public displayedColumns: string[];
	public bulkActions: object;
	public tableSearch: boolean;
	public dataSources: Array<MatTableDataSource<any>>;
	public lastModifiedItemId: number;
	public selection = new SelectionModel<MatTableDataSource<any>>(true, []);
	public isOneSelected = true;
	public defaultConfiguration: TableWidgetConfiguration = {
		globalHeaders: true,
		hasParentChildRelation: false,
		defaultPadding: true,
		showGroupFilter: true,
		haveSearch: true,
		search: {
			searchLevel: "global",
			searchLabel: {
				"en": "Search..",
				"ar": "بحث.."
			},
			searchLogic: "backend",
			// searchKeys: ["issue_id"]
		}
	};
	public onlyForFirstIndex = 0;

	/**
	 * Pagination Inputs
	 *
	 */
	public length;
	public pageSize;
	public pageSizeOptions = [5, 10, 20, 30];
	public pageEvent: PageEvent;
	@Input() totalPages: number;
	@ViewChild('selectedPageIndex', {static:false}) selectedPageIndex: ElementRef;
	@ViewChildren('childTable') childTable: QueryList<TableWidget> = new QueryList<TableWidget>();
	@ViewChildren(MatPaginator) paginator: QueryList<MatPaginator> = new QueryList<MatPaginator>();
	public searchQuery: string;
	
    /**
     * Helps finding and replacing childTable dataSource
     */
	public activeChildTable;

	constructor(public globals: GlobalVariables, public changeDetectorRef: ChangeDetectorRef, private dataService: DataService, private searchService: SearchService,
                private dialog: MatDialog,
    ) {}

	ngOnInit() {
		this.initTableData();
		this.calculateDynamicCellWidth(this.tableData.columnStructure);
		this.getMultiGroupsData();
	}

	/**
	 * Initializes Table Columns and DataSource
	 * When the parent component updates table data this method will be called
	 */
	initTableData(): void {
		// Setting Default Configuration if not set
		if (!this.tableData.configuration) {
			this.tableData.configuration = this.defaultConfiguration;
		}
		else{
			if(typeof this.tableData.configuration.haveSearch == "undefined") this.tableData.configuration.haveSearch = true; //by default the search feature is enabled
		}
		this.displayedColumns = this.tableData.columnStructure.map(column => column["field_id"]);
		this.dataSources = [];
		this.tableData.data.forEach((table) => {
			table["show"] = true;
			this.dataSources.push(new MatTableDataSource<any>(table.data));
			if('pageInfo' in table && table.pageInfo.searchQuery){
				this.searchQuery = table.pageInfo.searchQuery;
			}
		});

		if(this.tableData.data.length == 1){
			this.tableData.configuration.showGroupFilter = false;
		}
		this.bulkActions = this.tableData.bulkActions;
		this.tableSearch = this.tableData.tableSearch;
		this.calculateDynamicCellWidth(this.tableData.columnStructure);
	}

	initChildTable (parentRecord, tableData: TableWidgetModel): void {
	    if(parentRecord) {
            tableData.data[0].parentRecord = parentRecord;
        }
		this.dataSources.forEach((dataSource: MatTableDataSource<any>, dataSourceIndex) => {
			let foundRecord;
			let doesNotHaveSubItems;
			for(var i = 0; i < dataSource.data.length; i++){
                let dataSourceRecord = dataSource.data[i];

                // If initChildTable called via event e.g Status Update
                if ('SubItems' in dataSourceRecord && dataSourceRecord.hasOwnProperty('parentRow')) {
                    // TODO: COnfirm whether it is being used. if not remove this blog
                    foundRecord = dataSourceRecord.SubItems.data[0].data.find(data => data.id === dataSourceRecord.id);
                    doesNotHaveSubItems = false;
                    if (foundRecord) {
                        break;
                    }
                } else { // If initChildTable called by default on parent row clicked, child pagination event etc
                    foundRecord = dataSource.data.find(data => data.id === parentRecord.id);
                    doesNotHaveSubItems = true;
                    if (foundRecord) {
                        break;
                    }
                }
            }
			if (foundRecord) {
				if(doesNotHaveSubItems){
					let tempTableData = {};
					tempTableData = foundRecord.SubItems;

					timer(0).subscribe( _ => {
                        if (foundRecord.hasOwnProperty('SubItems')) {
                            // tempTableData['data'][0].data = tableData.data[0].data;
                            this.replaceChildTableDataSource(tableData.data[0]);
                            foundRecord.SubItems = tempTableData;
                        } else {
                            tableData.configuration.parentRow = parentRecord;
                            foundRecord.SubItems = tableData;
                        }

						if (!foundRecord.expanded) {
							this.toggleSubItems(foundRecord);
						}
						this.initTableData();
						this.changeDetectorRef.detectChanges();
					});
				}
			}
		});
	}

	/**
	 *
	 * @param row
	 */
	tableRowClicked (row, pageInfo?): void {
		if (row.expanded && (this.tableData.configuration.hasParentChildRelation && this.tableData.configuration.isParent) || (row.hasOwnProperty("SubItems"))) {
			this.toggleSubItems(row);
			return;
		}

		let tmpRow = row;
		if (this.tableData.configuration.hasParentChildRelation && (this.tableData.configuration.isParent || this.tableData.configuration.isChild)) {
			tmpRow.frontend_tableConfiguration = this.tableData.configuration;
		}
		tmpRow.pageInfo = pageInfo;
		this.eventRowClicked(tmpRow);
	}

	childTableRowClicked (row, tableWidget: TableWidget): void {
		let tmpRow = row;
		tmpRow.frontend_tableConfiguration = tableWidget.tableData.configuration;
		tmpRow.pageInfo = row.pageInfo;
		this.eventRowClicked(tmpRow);
	}


	childTableStatusUpdated (row, parentRow, tableWidget: TableWidget): void {
		let tmpRow = row.row;
		tmpRow.frontend_tableConfiguration = tableWidget.tableData.configuration;
		tmpRow.parentRow = parentRow;
        this.activeChildTable = tableWidget;
		this.eventStatusUpdated(row.status, tmpRow);
	}

	toggleSubItems (row): void {
		row.expanded = (!row.expanded);
	}

	calculateDynamicCellWidth (column) {

		let widthForEachColum = 100 / column.length;
		let copyArray = [...column];
		let totalUserWidth = 0;
		let lastValue = 0;
		column.forEach(element => {
			if (element.front_end_type && element.front_end_type.length > 2) {
				let newLine = element.front_end_type.filter(m => m.newline == false);
				// element.width = `1 1 ${(newLine.length + 1) * 10}%`;
				// element.width = `0 0 ${(newLine.length + element.front_end_type.length) * 2 + (+widthForEachColum)}%`;
				let width = (newLine.length !== element.front_end_type.length - 1) ? (+widthForEachColum) : (newLine.length + element.front_end_type.length) * (1.7) + (+widthForEachColum);
				// element.totalWidth=`${(newLine.length + element.front_end_type.length) * 2 + (+widthForEachColum)}`;
				element.totalWidth = +width;
				element.width = `0 0 ${Math.ceil(element.totalWidth)}%`;
			} else {
				// element.width = `0 0 ${Math.ceil(widthForEachColum)}%`;
				element.totalWidth = `${+widthForEachColum}`;

			}
			totalUserWidth = totalUserWidth + (+element.totalWidth);
		});

		console.log("totalUserWidth", totalUserWidth);

		this.manageWidth(column, totalUserWidth);
		// console.log('column2', column, widthForEachColum);
	}

	manageWidth (data, width) {

		let averageWidth = 100 / (+data.length);
		let widthToAdujust = (+width) - 100;
		let aboveAverageWidth = data.filter(m => m.totalWidth > averageWidth);
		let totalWidthToSubtract = widthToAdujust / data.length;

		let subTotalNow = 0;

		data.forEach(element => {
			element.width = `0 0 ${Math.floor(element.totalWidth - (totalWidthToSubtract))}%`;
			element.totalWidth = (Math.floor(element.totalWidth - (totalWidthToSubtract)));
			subTotalNow += element.totalWidth;

		});

		data.forEach(element => {

			if (element.totalWidth > averageWidth && subTotalNow < 100) {
				element.width = `0 0 ${Math.floor(element.totalWidth + (100 - subTotalNow))}%`;
				element.totalWidth = (Math.floor(element.totalWidth + (100 - subTotalNow)));
				subTotalNow += (100 - subTotalNow);
			}

		});
		// Math.max.apply(Math, data.map(function(o) { return o.totalWidth; }))
// console.log("final array",data,subTotalNow)

	}

	/**
	 * Highlights row after updating a record
	 */
	highlightChangesStatusRow () {
		if (this.lastModifiedItemId) {
			let el = document.getElementById("table-row-" + this.lastModifiedItemId);
			if (el) {
				el.scrollIntoView(
					{
						behavior: "smooth",
						block: "center",
						inline: "center"
					});

				el.classList.add("mat-elevation-row-highlight");
				setTimeout(() => {
					el.classList.remove("mat-elevation-row-highlight");
				}, 2000);
			}
		}
	}

	// region events for parent components

	eventRowClicked (row) {
		this.rowClicked.emit(row);
	}

	eventCheckboxClicked ( ev, row) {
		if (ev) {
			this.selection.toggle(row);
		}

		this.rowClicked.emit({isChecked: ev.checked, data: row});
	}

	eventStatusUpdated (status, row, pageInfo?) {
		this.lastModifiedItemId = row.id;
		row.pageInfo = pageInfo;
		this.statusUpdated.emit({status: status, row: row});
	}

	eventActionButtonPressed (row, button) {
		this.actionButtonPressed.emit({button: button, row: row});
	}

	eventActionButtonPressedAll (action) {

		this.actionButtonPressedAll.emit({action: action, selectedRows: this.selection.selected});
	}

	eventActionToggleButtonPressed (row) {
		row.available = !row.available;
		this.toggleButtonPressed.emit({row: row});
	}

	eventActionToggleButtonPressedAll () {

	}

	// endregion

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected () {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSources[0].data.length;
		return numSelected === numRows;
	}

	isOneSelectedFn () {
		if (this.selection.selected.length > 0) {
			this.isOneSelected = false;
		} else {
			this.isOneSelected = true;
		}

	}

	/**
	 * Filters Data of each table
	 *
	 * @param filterValue
	 * @param tableIndex
	 */
	applyFilter (filterValue: string, tableIndex) {
		this.dataSources[tableIndex].filter = filterValue.trim().toLowerCase();
	}

	/**
	 * Filters data globally (globally means filters across all tables (in case of multiple/grouped tables))
	 *
	 * @param filterValue
	 */
    applyGlobalFilter (filterValue: string) {
		if (this.tableData.configuration.search.searchLogic === "frontend") {
			this.dataSources.forEach((dataSource: MatTableDataSource<any>, dataSourceIndex) => {
				// TODO: Search by searchKeys from configuration
                if (filterValue || filterValue == '0') {
                    dataSource.filter = filterValue.trim().toLowerCase();
                } else {
                    dataSource.filter = '';
                    this.searchQuery = '';
                    this.searchService.resetSearchQuery();
                }
			});
		}
		if (this.tableData.configuration.search.searchLogic === "backend") {
		    filterValue ? this.emitRecordSearchQuery(filterValue.trim().toLowerCase()) : this.clearSearchQuery();
		}
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle () {
		this.isOneSelectedFn();
		this.isAllSelected() ?
			this.selection.clear() :
			this.dataSources[0].data.forEach(row => this.selection.select(row));
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel (row?: any): string {
		this.isOneSelectedFn();
		if (!row) {
			return `${this.isAllSelected() ? "select" : "deselect"} all`;
		}
		return `${this.selection.isSelected(row) ? "deselect" : "select"} row ${row.position + 1}`;
	}

    /**
     * Replaces a datasource at given index with provided data
     *
     * @param index
     * @param tableData
     */
    replaceTableDataSource(index: any, tableData: any) {
        this.dataSources[index].data = tableData.data;
        this.tableData.data[index].data = tableData.data;
    }
    
    /**
     * Replaces a datasource at given index of child table with provided data
     *
     * @param tableData
     */
    replaceChildTableDataSource(tableData: any) {
        const childTableIndex = this.childTable['_results'].findIndex ( table => table === this.activeChildTable );
        const group = tableData.data.length ? (tableData.data[0].pageInfo.group) : false;
        // Group found
        if (group || group === 0) {
            let foundChildTableGroupIndex;
            const tableWidget = this.childTable['_results'][childTableIndex];

            if (tableWidget.dataSources.length) {
                for (let j = 0; j < tableWidget.dataSources.length; j++) {
                    const dataSource = tableWidget.dataSources[j];
                    foundChildTableGroupIndex = dataSource.data.findIndex(data => (data.pageInfo.group || data.status.id) === group);
                    if (foundChildTableGroupIndex !== -1 || foundChildTableGroupIndex === 0) {
                        foundChildTableGroupIndex = j;
                        break;
                    }
                }
            }

            if (foundChildTableGroupIndex || foundChildTableGroupIndex === 0) {
                this.childTable["_results"][childTableIndex]["dataSources"][foundChildTableGroupIndex].data = tableData.data;
                this.childTable["_results"][childTableIndex].tableData.data[foundChildTableGroupIndex].data = tableData.data;
            }
        } else { // Group not found, replace with first group
            this.childTable["_results"][childTableIndex].dataSources[0].data = tableData.data;
            this.childTable["_results"][childTableIndex].tableData.data[0].data = tableData.data;
        }
    }

	// region helper functions

	isArray (element): boolean {
		return element instanceof Array;
	}

	isGroup (index, item): boolean {
		return !!item.group;
	}

	isFirstIndex (index, item): boolean {
		return index === 0;
	}

	isParentRow (index, item): boolean {
		return !item.group;
	}

	isObject (item): boolean {
		return item !== null && typeof item == "object";
	}

	getClaimInfo (item) {
		try {
			item = JSON.parse(item);
		} catch (exception) {
			item = {
				number: "-",
				year: "-",
			};
		}

		return item;
	}

	isString (item): boolean {
		return typeof item == "string";
	}

	hasChildren (index, item): boolean {
		// return item.SubItems && item.SubItems.length;
		return item.hasOwnProperty("SubItems");
	}

	getChildrenKeys (parent: any) {
		return Object.keys(parent.SubItems[0]);
	}

	hasElements (item) {
		return Object.keys(item).length;
	}

	isNextEmpty (element, nextIndex) {
		console.error((element[nextIndex + 1]) && (this.hasElements(element[nextIndex + 1]) === 0));
		return (element[nextIndex + 1]) && (this.hasElements(element[nextIndex + 1]) === 0);
	}

	getFieldValue (field: any) {
		if (this.globals.isNameObject(field)) {
			try {
				return JSON.parse(field)[this.globals.LNG];
			} catch {
				return field[this.globals.LNG];
			}
		} else if (this.isObject(field)) {
			// if it is an object, we don't know what we have to show
			return field[Object.keys(field)[0]];
		} else if (field === null || field === "null") {
			return "";
		} else if (!this.isObject(field)) {
			return field;
		}

		return field;
	}

	getMultiGroupsData() {
		this.dataService.multiGroupsData.subscribe(data => {
			console.log(data);
		});
	}

	// endregion

	/**
	 *	Toggles table group using its 'show' property
	 *
	 * @param table It holds properties like group, data and show
	 */
	filterRecordsByStatus(table){
		table.show = !table.show;
	}

	/**
	 *	Thumb image error event handler
	 *
	 * @param row table record
	 */
	errorEvent(row) {
		row.showPlaceholder = true;
	}

	/**
	 *	Thumb image load event handler
	 *
	 * @param row table record
	 */
	loadEvent(row) {
		row.showPlaceholder = false;
	}

	/**
	 *	Pagination event either, next, previous
	 *
	 * @param row table record
	 * @param event paginator event
	 * @param paginator paginator instance
	 */
	public getPagedData(table, event, paginator) {
		// Add 1 as paginator index starts from 0 but our page dropdown starts from 1
		event.previousPageIndex = event.previousPageIndex + 1;
		event.pageIndex = event.pageIndex + 1;
		const pageInfo = table.pageInfo;
		pageInfo.pageNo = pageInfo.pageNo + 1;
		let pageIndex = event.pageIndex;
		this.pageEvent = event;

		// On every page event, subtract pageIndex by 1 because of api rule
		pageIndex--;

		pageInfo.recordPerPage = event.pageSize;
		pageInfo.pageNo = pageIndex;
		paginator.pageIndex = pageIndex;
		pageInfo.isBoardWidget = false;
		pageInfo.parentRecord = table.parentRecord;
		this.eventGetPagedData(pageInfo);
	}

	public getPagedDataForPageIndex(table, pageNo, paginator) {
		const pageInfo = table.pageInfo;
		pageInfo.pageNo = pageNo - 1;
		paginator.pageIndex = pageNo - 1;
		this.eventGetPagedData(pageInfo);
	}

	public eventGetPagedData(pageInfo) {
		if (pageInfo.searchQuery) {
			pageInfo.searchQuery = pageInfo.searchQuery;
			this.searchQuery = pageInfo.searchQuery;
			this.searchService.setSearchQuery(pageInfo.searchQuery);
		}
		this.pagedDataRequest.emit(pageInfo);
	}

	public fetchChildPaginatedData(pageInfo, tableWidget: TableWidget, parentRecord) {
		pageInfo.frontend_tableConfiguration = tableWidget.tableData.configuration;
		this.activeChildTable = tableWidget;
        pageInfo.parentRecord = parentRecord;
		this.eventGetPagedData(pageInfo);
	}

	public emitRecordSearchQuery(query) {
        this.searchService.setSearchQuery(query);
		this.eventRecordSearchQuery.emit(query);
	}

	public clearSearchQuery() {
		this.searchQuery = '';
		this.searchService.resetSearchQuery();
		this.eventClearSearchQuery.emit(this.searchQuery);
	}
	
	public fireActionButton(layout, row, id, tableConfiguration) {
        row.frontend_tableConfiguration = tableConfiguration;
        this.actionButtonPressed.emit({action: layout, row: row, value: id});
    }

}
