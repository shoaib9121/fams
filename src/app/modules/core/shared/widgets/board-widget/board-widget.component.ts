import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatTableDataSource} from '@angular/material';
import {GlobalVariables} from "../../../../../global-variables.service";
import { ModuleDataService } from "../../../../ops/components/user/module-data/module-data.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
	selector: 'app-board-widget',
	templateUrl: './board-widget.component.html',
	styleUrls: ['./board-widget.component.scss']
})
export class BoardWidgetComponent implements OnInit {

	todo = [
		'Get to work',
		'Pick up groceries',
		'Go home',
		'Fall asleep'
	];
	todo1 = [];

	done = [];


	@Input() boardData: any;
	@Output() cardClicked: EventEmitter<any> = new EventEmitter();
	@Output() statusUpdated: EventEmitter<any> = new EventEmitter();
	cards: any;
	statusInfoNChanges: any = [];
	public displayedColumns: string[];
	@Output() pagedDataRequest = new EventEmitter<any>();
	/**
	 * Pagination Inputs
	 *
	 */
	public length;
	public pageSize;
    public pageSizeOptions = [5, 10, 20, 30];
    public pageEvent: PageEvent;
    @Input() totalPages: number;
    @ViewChild('selectedPageIndex', {static: false}) selectedPageIndex: ElementRef;

	constructor(private dialog: MatDialog, public globals: GlobalVariables, private moduleDataService: ModuleDataService) {
	}

	initialSkeleton = new Array(5);

	connectedTo = [];
	ngOnInit() {


		this.cards = this.boardData.data;
		this.setTableShowProperty();
		this.statusInfoNChanges = this.boardData.statusInfoNChanges;
		console.log("board_widget_", this.cards);
		console.log("board_widget_", this.boardData);
		for (const card of this.cards) {
		    if (card.group) {
                this.connectedTo.push(card.group.name.en);
            }
		}
		this.dataListing();
	}


	/**
	 * Prepares data for the listing
	 */
	dataListing() {

		const tempArray = Object.keys(this.statusInfoNChanges).map((k) => this.statusInfoNChanges[k]);
		for (let i = 0; i < tempArray.length; i++) {
			const dataFound = this.cards.find(j => j.group.id === tempArray[i].id);
			if (dataFound) {
				tempArray[i] = dataFound;
			} else {
				tempArray[i] = {group: tempArray[i], data: []};
			}

		}

		this.cards = tempArray;
		this.cards.sort((a, b) => (a.group.id) - (b.group.id));
		console.log(this.cards);
	}


	cardItemClick(data) {
		this.cardClicked.emit(data);
	}

	onDrop(event, group) {
		console.log(event, group);
		// let updatable = this.futureStatusCheck(event.previousContainer.data[0].status.updates, event.container.id);
		let updatable = this.futureStatusCheck(event, group);
		if (updatable) {
			this.showAlert(event, group);
		} else {
			this.showNotClaimAlert(event);
		}
	}

	//futureStatuschecking
	futureStatusCheck(event, group) {
	    const futureStatuses = event.item.data.status.updates || [];
	    let statusUpdatable = false;
	    const draggedStatus = event.container.id;

	    if (futureStatuses.length) {
            statusUpdatable = futureStatuses.some(i => i.name[this.globals.LNG] === draggedStatus);
        } else {
            const foundProcessFlow = this.moduleDataService.getProcessFlow(event.item.data.type_id).find( item => item.status === event.item.data.status.id);

            if (foundProcessFlow) {
                if (foundProcessFlow.roles.indexOf(this.moduleDataService.roleId) !== -1) {
                    if (foundProcessFlow.flow.indexOf(group.id) !== -1 ) {
                        statusUpdatable = true;
                    }
                }
            }
        }
		console.log(futureStatuses);
		return statusUpdatable;
	}

	//alert
	showAlert(event: CdkDragDrop<string[]>, group) {
		const dialogRef = this.dialog.open(BoardWidgetDialog, {
			data: {
				status: group
			}
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {

				let status = this.cards.find(i => i.group.name.en == event.container.id).group;
				let data = event.item.data;
				console.log("SSSSSS", status, "SSSSSSS", data);
				data.status = status;
				transferArrayItem(event.previousContainer.data,
					event.container.data,
					event.previousIndex,
					event.currentIndex);
				this.statusUpdated.emit({status: status, row: data});
                event.item.data.pageInfo.totalRecords--;
                const lastItemInDestinationGroup = event.container.data[event.container.data.length - 1];
                if (lastItemInDestinationGroup.hasOwnProperty('pageInfo')) {
                    event.container.data[event.container.data.length - 1]['pageInfo'].totalRecords++;
                }
            } else {
				moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
			}
		});
	}

	showNotClaimAlert(event) {
		console.log(event);
        const lastItemInSourceGroup = event.previousContainer.data[event.previousContainer.data.length - 1];
		this.dialog.open(BoardWidgetNotclaimDialog, {
			data: {
				status: lastItemInSourceGroup.status.updates
			}
		});

	}

	getChildrenKeys(parent: any) {
		if (parent && typeof parent === "object") {
			let keys = Object.keys(parent);
			return keys;
		}
		return parent;
	}

	toggleSubItems(row): void {
		row.expanded = (!row.expanded);
		// this.cd.detectChanges();
		console.log("toggle subitems", row.expanded);
	}

	isArray(val) {
		return Array.isArray(val);

	}

	isObject(val) {
		//return typeof val === 'object';
		return val !== null && typeof val == 'object';
	}

	isNull(val) {
		//return typeof val === 'object';
		return val == '' || val === null || val == 'null';
	}

	dragMoved(event) {

		let positionX = event.pointerPosition.x;

		if (positionX > document.getElementById('container').getBoundingClientRect().right) {
			document.getElementById('container').scrollLeft += 20;
		}

		if (positionX < document.getElementById('container').getBoundingClientRect().left) {
			document.getElementById('container').scrollLeft -= 20;
		}


	}

	/*getFieldValue(field: any) {
		try {
			field = JSON.parse(field);
			if (field && field.number) {
				return field.number + "";
			}
		} catch (exception) {

		}

		if (this.globals.isNameObject(field)) {
			return field[this.globals.LNG];
		} else if (field === null || field === 'null') {
			return "";
		} else if (this.isObject(field)) {
			// if it is an object, we don't know what we have to show
			//return field[Object.keys(field)[0]];
			return JSON.stringify(field);
		} else if (!this.isObject(field)) {
			return field;
		}

		return field;
	}*/

	getFieldValue(field: any) {
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

	getClaimInfo(item) {
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


	/**
	 *	Toggles card group using its 'show' property
	 *
	 * @param card It holds properties like group, data and show
	 */
	filterRecordsByStatus(card){
		card.show = !card.show;
	}


	setTableShowProperty(){
		this.cards.forEach((card) => {
			card["show"] = true;
		});
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
        this.eventGetPagedData(pageInfo);
    }
    
    public getPagedDataForPageIndex(card, pageNo, paginator) {
        const pageInfo = card.pageInfo;
        pageInfo.pageNo = pageNo - 1;
        paginator.pageIndex = pageNo - 1;
        this.eventGetPagedData(pageInfo);
    }
    
    public eventGetPagedData(pageInfo) {
        this.pagedDataRequest.emit(pageInfo);
    }
    
    public replaceCardData(index: any, tableData: any) {
        this.cards[index].data = tableData.data;
    }
}

@Component({
	selector: 'board-widget-dialog',
	templateUrl: 'board-widget-dialog.html',
})
export class BoardWidgetDialog {

	constructor(
		public dialogRef: MatDialogRef<BoardWidgetDialog>, public globals: GlobalVariables, @Inject(MAT_DIALOG_DATA) public data: any) {
		console.log("AAAAAAAAAAA", data);
	}


	onYesClick(str): void {
		this.dialogRef.close(true);
	}

	onNoClick(str) {
		this.dialogRef.close(false);
	}


}

@Component({
	selector: 'board-widget-dialog',
	templateUrl: 'board-widget-notclaim-dialog.html',
})
export class BoardWidgetNotclaimDialog {

	constructor(
		public notClaimdialogRef: MatDialogRef<BoardWidgetNotclaimDialog>, public globals: GlobalVariables, @Inject(MAT_DIALOG_DATA) public data: any) {
		console.log("AAAAAAAAAAA", data);
	}


	onOkClick(str) {
		this.notClaimdialogRef.close(false);
	}


}
