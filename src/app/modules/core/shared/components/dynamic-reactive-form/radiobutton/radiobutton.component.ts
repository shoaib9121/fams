import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from '../shared';
@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrls: ['./radiobutton.component.css']
})
export class RadiobuttonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  required:string=''
  constructor() {}
  ngOnInit() {

    this.field.validations.forEach(validation => {
      if(validation.name=="required")
      {
        this.required=" *";
      }
    });
  }
}
