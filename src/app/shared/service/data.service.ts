import {Injectable, EventEmitter, Output} from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	
	constructor() {
	}
	
	@Output() editFields: EventEmitter<boolean> = new EventEmitter();
	@Output() multiEditFields: EventEmitter<boolean> = new EventEmitter();
	@Output() fillFormDefaultValues: EventEmitter<any> = new EventEmitter();
	@Output() checkResetTable: EventEmitter<any> = new EventEmitter();
	@Output() serviceOnChange: EventEmitter<any> = new EventEmitter();
	@Output() multiIssues: EventEmitter<boolean> = new EventEmitter();
	@Output() multiGroupsData: EventEmitter<any> = new EventEmitter();
	@Output() tableStatus: EventEmitter<any> = new EventEmitter();
	data: any;
	
	editFieldsChange(data) {
		this.editFields.emit(data);
	}
	
	multiEditFieldsChange(data) {
		this.multiEditFields.emit(data);
	}


	tableStatusChange(data) {
		this.tableStatus.emit(data);
	}
	
	/**
	 * Fires event to show data in side issue
	 *
	 * @param data 
	 */
	serviceChange(data) {
		this.serviceOnChange.emit(data);
        this.setListData(data);
	}

	/**
	 * Fires event to fill a value in select component
	 *
	 * @param field_id
	 * @param value
	 */
	eventFillFormDefaultValues(field_id, value, group_name?, disable?) {
		this.fillFormDefaultValues.emit({col: field_id, value: value, group_name: group_name, disable: disable});
	}

	resetField(object) {
		this.checkResetTable.emit(object);
	}

	public setListData(data) {
        this.data = data;
    }
    
	public getListData() {
        return this.data;
    }
    
// TODO: Remove if not needed
//   @Output() manageFormulas: EventEmitter<boolean> = new EventEmitter();
//   manageFormula(data) {
//     this.manageFormulas.emit(data);
// }
//   @Output() inputValue: EventEmitter<boolean> = new EventEmitter();
//   setValue(formControl: any, subField: any, val: any) {
//     let data:any = [];
//     data.push(formControl);
//     data.push(subField);
//     data.push(val);
//     this.inputValue.emit(data)

// }
}
