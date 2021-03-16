
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariables } from 'src/app/global-variables.service';
import { MatSidenav, MatDialog } from '@angular/material';
import { settingsDialog } from '../settings.component';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss']
})
export class UserManagmentComponent implements OnInit {
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
        "en" : "Company/Branch",
        "ar" : "",
      },
      field_id: "company",
      type: "single",
      cols: ["company"]
    },
    {
      name: {
        "en" : "Username",
        "ar" : "",
      },
      field_id: "username",
      type: "single",
      cols: ["username"]
    },
    {
      name: {
        "en" : "Role",
        "ar" : "",
      },
      field_id: "role",
      type: "single",
      cols: ["role"]
    }, {
      name: {
        "en" : "Vehicles",
        "ar" : "",
      },
      field_id: "vehicles",
      type: "single",
      cols: ["vehicles"]
    }, {
      name: {
        "en" : "Users",
        "ar" : "",
      },
      field_id: "users",
      type: "single",
      cols: ["users"]
    }, {
      name: {
        "en" : "Contact Person",
        "ar" : " ",
      },
      field_id: "contact_person",
      type: "single",
      cols: ["contact_person"]
    }, {
      name: {
        "en" : "Phone",
        "ar" : "",
      },
      field_id: "phone",
      type: "single",
      cols: ["phone"]
    }, {
      name: {
        "en" : "Last Orgin",
        "ar" : " ",
      },
      field_id: "last_orgin",
      type: "single",
      cols: ["last_orgin"]
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
      company:'Company 1',
      username: "Habeeb",
      role: "User",
     vehicles:'5',
     users:'4',
     contact_person:'Lousai',
     phone:'985225555',
     last_orgin:'12/11/2019',
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
   console.log(event)
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
