import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FieldConfig, Validator, MathService } from '../shared';
import { GlobalVariables } from 'src/app/global-variables.service';
import { FormulaService } from '../shared/formula.service';
import { DynamicService } from '../shared/dynamic.service';

@Component({
	selector: 'app-text-area',
	templateUrl: './text-area.component.html',
	styleUrls: ['./text-area.component.scss'],
})
export class TextAreaComponent implements OnInit, AfterViewInit {
	@Input() field: FieldConfig;
	@Input() group: any;
	@Input() allGroups: any;
	
	@Input() validation: Validator;
	required: string = '';
	lng: string;

	constructor(
		public globalVariables: GlobalVariables,
		private formulaService: FormulaService,
		private dynamicService: DynamicService
	) {
		this.lng = globalVariables.LNG;
	}

	ngOnInit() {
		if (this.field.validations && this.field.validations.length > 0) {
			this.field.validations.forEach(validation => {
				if (validation.name == 'required') {
					this.required = '*';
				}
			});
		}
	}
	ngAfterViewInit() {
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
