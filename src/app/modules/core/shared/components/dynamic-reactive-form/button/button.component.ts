import { Component, OnInit,Output,EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FieldConfig } from '../shared';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {
  field: FieldConfig;
  group: FormGroup;
  @Output() public selectEvent =new EventEmitter;
  constructor() {}
  ngOnInit() {}
}
