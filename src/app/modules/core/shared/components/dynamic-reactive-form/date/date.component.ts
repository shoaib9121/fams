import {Component, OnInit, Input} from "@angular/core";
import {FieldConfig} from '../shared';
import {GlobalVariables} from 'src/app/global-variables.service';
import {FormulaService} from '../shared/formula.service';
import {DataService} from "../../../../../../shared/service/data.service";
import {FormControl, Validators} from "@angular/forms";
import { DynamicService } from '../shared/dynamic.service';

@Component({
	selector: "app-date",
	templateUrl: "./date.component.html",
	styleUrls: ["./date.component.scss"]
})
export class DateComponent implements OnInit {
	@Input() field: FieldConfig;
	@Input() group: any;
	@Input() allGroups: any;
	
	
	/**
	 * Sets the date value in the form
	 */
	dateControl: FormControl;
	
	range: any;
	disableDateTimeIcon: boolean;
	
	constructor(
		public globalVariables: GlobalVariables,
		private formulaService: FormulaService,
		private dataService: DataService,
		private dynamicService: DynamicService
	) {
	}
	
	ngOnInit() {
		this.dateControl = new FormControl({value: (this.field.value && this.field.value !="")? new Date(this.field.value) : '', disabled: !this.field.update});
		this.handleFormDefaultValues();
		if (this.field.default_value_editable === false) {
			this.dateControl.disable();
		}
		
	}
	
	/**
	 * Subscribes event that should set a form value inside it
	 * Needed here explicitly to handle date types
	 */
	handleFormDefaultValues() {
		this.dataService.fillFormDefaultValues.subscribe((data) => {
			if (data.disable === true && this.field.update === true && (this.field.col === data.col)) {
				this.dateControl.disable();
				this.disableDateTimeIcon = true;
				this.dateControl.setValue("");
			}  else if (data.disable === false && this.field.update === true) {
				this.dateControl.enable();
				this.disableDateTimeIcon = false;
			}
			if ((this.group.group_name == data.group_name) || (data.group_name === undefined)) {
				if (this.field.col == data.col) {
					if (data.value && data.value != "") {
						this.dateControl.setValue(new Date(data.value));
					} else {
						this.dateControl.setValue(data.value);
					}
					this.setValue();
				}
			}
		});
	}


	setValue() {
		if (this.dateControl.value == null || this.dateControl.value == "") {
			this.field.value = "";
			this.group.controls[this.field.col].setValue("");
		} else {
			this.field.value = this.convertToDateString(this.dateControl.value);
			this.group.controls[this.field.col].setValue(this.convertToDateString(this.dateControl.value));
			if (this.field.update) {
				this.group.controls[this.field.col].markAsDirty();
			}
		}
		
		this.formulaService.manageFormula(this.allGroups, this.dynamicService.allFormGroups);

	}
	
	/**
	 * Converts a date string into a "DD/MM/YYYY" format
	 *
	 * @param val
	 */
	convertToDateString(val) {
		let dd;
		let mm;
		const abc = new Date(isNaN(+val) ? val : +val).toDateString();
		const date = new Date(abc);
		dd = date.getDate();
		mm = date.getMonth() + 1;
		const yyyy = date.getFullYear();
		if (dd < 10) {
			dd = dd;
		}
		if (mm < 10) {
			mm = mm;
		}
		
		const d = mm + '/' + dd + '/' + yyyy;
		return d;
	}
}
