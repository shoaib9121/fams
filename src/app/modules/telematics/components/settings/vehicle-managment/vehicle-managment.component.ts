

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariables } from 'src/app/global-variables.service';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-vehicle-managment',
  templateUrl: './vehicle-managment.component.html',
  styleUrls: ['./vehicle-managment.component.scss']
})
export class VehicleManagmentComponent implements OnInit {

  @ViewChild('drawer', {static: false}) drawer: MatSidenav;
  public columnStructure: any =  [
    {	
      name: {
        "en" : "no#",
        "ar" : " ",
      },
      field_id: "serialNo",
      type: "single",
      cols: ["no"]
    },
    {
      name: {
        "en" : "Vehicle",
        "ar" : "المستعمل",
      },
      field_id: "vehicle",
      type: "single",
      cols: ["vehicle"]
    },
    {
      name: {
        "en" : "Registration-Date",
        "ar" : "المستعمل",
      },
      field_id: "registration",
      type: "date",
      cols: ["registration"]
    },
    {
      name: "Action",
      field_id: "actions",
      type: "grouped_button",
      cols: ["edit"]
    },
  
    ];
  /**
 * Table data
 */

  public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
		statusInfoNChanges: object,
    tableSearch: boolean,
    typeStructure: object,
  };

  dummyApidata= [
    {
      id: 75,
      vehicle: "L 52075",
      registration:'12/11/2020',
      driver: "10021255",
      view:1,
      type_id: 0
      }]

  constructor(public globalVars: GlobalVariables,public ngxSpinner: NgxSpinnerService) { 
    this.initTableData()
  }

  ngOnInit() {
  }

  initTableData() {
		
		/*
		This is the fix done for the table widjet 
		*/
		this.tableWidgetData = {
			columnStructure: this.columnStructure,
			data: [],
			statusInfoNChanges: [],
      tableSearch: true,
      typeStructure: {
				0: this.columnStructure,
			}
		};
    this.loadFilters()
  }

  loadFilters(): void {
    this.ngxSpinner.show();
       var inc = 1;
       for(var i = 0;i<this.dummyApidata.length;i++){
         this.dummyApidata[i]["serialNo"] = inc++;
         this.dummyApidata[i]["actions"] = [
           {
             name   : { en:"edit", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
             tooltip   : { en:"edit", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
             icon   : "pencil",
             action : "openDrawer"						
           },
         ]      
       }
       this.ngxSpinner.hide();
       this.globalVars.addDefaultTypeId(this.dummyApidata);
       this.tableWidgetData.data = [
       {
         data: this.dummyApidata
       }];
 
 }
 openDrawer(event)
 {
  this.drawer.toggle();
   console.log(event)
 }


 tableActionEvent(event): void {
  console.log(event)
  eval("this."+event.button.action+"(event)")
}


rowClicked(event): void{
  console.log(event)
}
}
