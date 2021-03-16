
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariables } from 'src/app/global-variables.service';
import { MatSidenav, MatDialog } from '@angular/material';
import { settingsDialog } from '../settings.component';


@Component({
  selector: 'app-group-vehicles',
  templateUrl: './group-vehicles.component.html',
  styleUrls: ['./group-vehicles.component.scss']
})
export class GroupVehiclesComponent implements OnInit {
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
        "en" : "Name",
        "ar" : "المستعمل",
      },
      field_id: "name",
      type: "single",
      cols: ["name"]
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
      name: "Action",
      field_id: "actions",
      type: "grouped_button",
      cols: ["edit", "delete"]
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
      name:'corola',
      vehicle: "L 52075",
      driver: "10021255",
      view:1,
      type_id: 0
      }]

  constructor(public globalVars: GlobalVariables,public ngxSpinner: NgxSpinnerService,private dialog: MatDialog) { 
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
           {
             name   : { en:"delete", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
             tooltip   : { en:"delete", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
             icon   : "delete",
             action : "deleteRow"						
           }
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
 }


 tableActionEvent(event): void {
  console.log(event)
  eval("this."+event.button.action+"(event)")
}


rowClicked(event): void{
  console.log(event)
}


deleteRow(event)
{
  console.log(event)
  const dialogRef = this.dialog.open(settingsDialog, {
   data: {
     status: 'd'
   }
 });
 dialogRef.afterClosed().subscribe(result => {
   if (result) {
     console.log(result)
    
   } else {
     console.log('else')
   }
 });
}

}
