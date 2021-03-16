import { Component, OnInit, Input } from "@angular/core";
import { FieldConfig, Validator } from '../shared';
import { GlobalVariables } from 'src/app/global-variables.service';
import { DataService } from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss']
})
export class TimeComponent implements OnInit {
  @Input() field: FieldConfig;
	@Input() group: any;
	@Input() allGroups: any;
  
  
  minDate:any;
  maxDate:any;
  range: any;
  validation:Validator
  lng: string;
  // dateCtrl = new FormControl(); //single select control
  dateModel:any;
  
  selectedDate: Date;
  disableDateTimeIcon: boolean;
  constructor(
    public globalVariables: GlobalVariables,
    private dataService: DataService
    ) {
    this.lng = globalVariables.LNG;
  }
  ngOnInit() {
		this.handleFormDefaultValues();
	}
	
	/**
	 * Subscribes event that should set a form value inside it
	 * Needed here explicitly to handle date types
	 */
  handleFormDefaultValues() {
    this.dataService.fillFormDefaultValues.subscribe((data) => {
      if (data.disable === true && this.field.update === true && (this.field.col === data.col)) {
        this.disableDateTimeIcon = true;
        this.group.controls[this.field.col].setValue("");
        this.field.value = "";
      } else if (data.disable === false && this.field.update === true) {
        this.disableDateTimeIcon = false;
      }
    });
  }


  
  
  sendeventtoform(newValue) {
    this.group.controls[this.field.col].setValue(newValue);
    if (this.field.update) {
      this.group.controls[this.field.col].markAsDirty();
    }
  }

  
}
