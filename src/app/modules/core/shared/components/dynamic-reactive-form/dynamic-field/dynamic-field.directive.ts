import {StatusComponent} from './../status/status.component';
import {
	ComponentFactoryResolver,
	Directive,
	Input,
	OnInit,
	ViewContainerRef
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FieldConfig} from '../shared';
import {InputComponent} from '../input/input.component';
import {ButtonComponent} from '../button/button.component';
import {SelectComponent} from '../select/select.component';
import {DateComponent} from '../date/date.component';
import {RadiobuttonComponent} from '../radiobutton/radiobutton.component';
import {CheckboxComponent} from '../checkbox/checkbox.component';
import {TableComponent} from "../table/table.component";
import {StaticSelectComponent} from '../static-select/static-select.component';
import {TextAreaComponent} from '../text-area/text-area.component';
import {TimeComponent} from '../time/time.component';
import {NameObjectComponent} from "../name-object/name-object.component";
import { SharedService } from '../shared/shared.service';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { AttachmentsComponent } from '../attachments/attachments.component';
import { TableObjectComponent } from '../table-object-component/table-object.component';
import { TableDialogComponent } from '../table-dialog/table-dialog.component';


const componentMapper = {
	input: InputComponent,
	button: ButtonComponent,
	select: SelectComponent,
	date: DateComponent,
	radiobutton: RadiobuttonComponent,
	checkbox: CheckboxComponent,
	attachments: AttachmentsComponent,
	table: TableComponent,
	table_object: TableObjectComponent,
	status: StatusComponent,
	staticselect: StaticSelectComponent,
	textarea: TextAreaComponent,
	time: TimeComponent,
	name_object: NameObjectComponent,
	multi_select: MultiSelectComponent,
	dialog: TableDialogComponent
};

@Directive({
	selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
	@Input() field: FieldConfig;
	@Input() group: FormGroup;
	@Input() allGroups: any;
	@Input() isEdit: any;
	// 
	
	
	componentRef: any;
	
	constructor(
		private resolver: ComponentFactoryResolver,
		private container: ViewContainerRef,
		public sharedService: SharedService,
	) {
	}
	
	ngOnInit() {
		if(this.isEdit && this.field.type == "attachments"){
			return;
		}
		if (this.field.type == "image") {
			this.sharedService.fireImageEvent(this.field);
		} else {
			const factory = this.resolver.resolveComponentFactory(
				componentMapper[this.field.type]
			);
			this.componentRef = this.container.createComponent(factory);
			this.componentRef.instance.field = this.field;
			this.componentRef.instance.group = this.group;
			this.componentRef.instance.allGroups = this.allGroups;
			this.componentRef.instance.isEdit = this.isEdit;
			// this.componentRef.instance.allFormGroups = this.dynamicService.allFormGroups;
		}
	}
}
