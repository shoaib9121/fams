import { Component, Input, OnInit } from '@angular/core';
import { FieldConfig } from "../shared";
import { FormControl, FormGroup } from "@angular/forms";
import { GlobalVariables } from "../../../../../../global-variables.service";

@Component({
	selector: 'app-name-object',
	templateUrl: './name-object.component.html',
	styleUrls: ['./name-object.component.scss']
})
export class NameObjectComponent implements OnInit {
	@Input() field: FieldConfig;
	@Input() group: any;

	public nameGroup: FormGroup;

	constructor(public globals: GlobalVariables) {
	}

	ngOnInit() {
		this.generateNameFormGroup();

		if (typeof this.field.value === "object") {
			this.setValue(this.field.value, true);
		} else {
			this.setValue(this.field.value);
		}

		this.nameGroup.valueChanges
			.subscribe((data) => {
				this.group.controls[this.field.col].setValue(this.nameGroup.value);
				this.group.controls[this.field.col].markAsDirty();
			});
	}

	generateNameFormGroup() {
		this.nameGroup = new FormGroup({
			en: new FormControl(this.field.value ? this.field.value.en : ""),
			ar: new FormControl(this.field.value ? this.field.value.ar : "")
		});
	}

	setValue(value, isJSON?) {
		if (isJSON) {
			this.nameGroup.controls.en.setValue(this.field.value['en']);
			this.nameGroup.controls.ar.setValue(this.field.value['ar']);
		} else {
			this.nameGroup.controls.en.setValue(this.field.value);
			this.nameGroup.controls.ar.setValue(this.field.value);
		}
	}

}
