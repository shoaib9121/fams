import { FormControl, FormGroup } from "@angular/forms";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FieldConfig } from "../shared";
import { GlobalVariables } from "src/app/global-variables.service";
import { Subscription } from "rxjs";
import { DataService } from "src/app/shared/service/data.service";
import { ModuleDataService } from "src/app/modules/ops/components/user/module-data/module-data.service";

@Component({
	selector:    "app-status",
	templateUrl: "./status.component.html",
	styleUrls:   ["./status.component.scss"],
})
export class StatusComponent implements OnInit, OnDestroy {
	@Input() group: FormGroup;
	@Input() field: FieldConfig;
	/**
	 * Needed for populating status when this component is used in the TableObjectComponent
	 */
	public tableStatusUpdate$: Subscription;
	/**
	 * FormControl that stores the value of this component before we assign it to the global form value
	 */
	public localFormControl: FormControl;
	public isId: boolean;
	public isValue: boolean;
	/**
	 * Stores all options which will be displayed in the select
	 */
	public fieldOptions: any;
	
	constructor (public globalVariables: GlobalVariables, private dataService: DataService, private moduleDataService: ModuleDataService) {
		this.localFormControl = new FormControl([]);
		this.isValue          = true;
	}
	
	ngOnInit () {
		this.fieldOptions = this.field.options;
		if (!this.field.update) {
			this.localFormControl.disable();
		}
		if (this.group["group_name"]) {
			this.group.controls[this.field.col].setValue(this.field.value);
			this.localFormControl.setValue([]);
		}
	}
	
	ngAfterViewInit () {
		// Used for when this component is being used in a table to prevent updating all status.components in other rows
		this.tableStatusUpdate$ = this.dataService.tableStatus.subscribe(data => {
			if (this.group["index"] === data.index && !this.group["group_name"]) {
				this.fieldOptions = [this.moduleDataService.modules[data.moduleId].columns.module_statuses[data.status]];
				this.field.value  = data.status;
				this.isId         = true;
				this.group.controls[this.field.col].setValue(data.status);
				if (!this.localFormControl.value) {
					this.localFormControl.setValue([]);
				}
			}
		});
	}
	
	ngOnDestroy () {
		if (this.tableStatusUpdate$) {
			this.tableStatusUpdate$.unsubscribe();
		}
	}
	
	selected (event: any) {
		if (this.field.update) {
			this.group.controls[this.field.col].markAsDirty();
		}
		if (this.field.value[0] == event) {
		} else {
			let eventValue   = this.checkEvent(event);
			this.field.value = this.checkValue(eventValue);
			this.group.controls[this.field.col].setValue(this.checkValue(eventValue));
		}
	}
	
	checkValue (val) {
		if (!isNaN(val) && val != "") {
			val = +val;
		} else {
			val = val.toString();
		}
		return val;
	}
	
	checkEvent (event) {
		if (this.isId) {
			return +event.id;
		} else if (this.isValue) {
			return event[Object.keys(event)[0]];
		}
	}
	
	compareObjects (o1: any, o2: any): boolean {
		return o1.id == o2[0];
	}
	
}
