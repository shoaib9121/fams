import {Component, Input, OnInit} from '@angular/core';
import {FieldConfig, Validator} from '../shared';
import {GlobalVariables} from 'src/app/global-variables.service';
import {FormulaService} from '../shared/formula.service';
import { DynamicService } from '../shared/dynamic.service';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
	@Input() field: FieldConfig;
	@Input() group: any;
	@Input() allGroups: any;
	
	@Input() validation: Validator;
	required: string = '';
	
	constructor(
		public globalVariables: GlobalVariables,
		private formulaService: FormulaService,
		private dynamicService: DynamicService
	) {
	}
	
	ngOnInit() {
		this.group.valueChanges.subscribe((data) => {
		});
	}
	
	//Set value in formgroup
	getValue(event) {
		this.field.value = this.checkValue(event);
		this.group.value[this.field.col] = this.checkValue(event);
		this.formulaService.manageFormula(this.allGroups, this.dynamicService.allFormGroups);
	}
	
	//Check value string or number
	checkValue(val) {
		if (!isNaN(val) && val != "") {
			val = +val;
		} else if (val) {
			val = val.toString();
		}
		return val;
	}
}
