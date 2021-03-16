import { Directive, OnInit, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { NgControl, NgForm, NgModel, FormGroup } from "@angular/forms";
import { FieldConfig } from '../shared';

@Directive({
    selector: '[registerChildComponentToForm]',
    providers: [NgModel]
})
export class RegisterTemplateFormModelDirective implements OnInit {
    @Input() field: FieldConfig;
    @Input() group: FormGroup;
    componentRef: any;
    constructor(
        private form: NgForm, 
        private eltControl: NgControl) {
    }

    ngOnInit() {
        setTimeout(() => {
            if (this.form && this.eltControl) {
                this.form.form.addControl(this.eltControl.name, this.eltControl.control);
            }
        }, 1);

    }

}