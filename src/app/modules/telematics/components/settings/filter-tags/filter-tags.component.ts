

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariables } from 'src/app/global-variables.service';
import { MatSidenav, MatDialog, MatTableDataSource } from '@angular/material';
import { settingsDialog } from '../settings.component';
import { SelectionModel } from '@angular/cdk/collections';
const ELEMENT_DATA = [
  { name: 'L1145' },
  { name: 'Dubai h1522' },
  { name: '25488' },
  { name: '236874' },
  { name: '22584' }
];

@Component({
  selector: 'app-filter-tags',
  templateUrl: './filter-tags.component.html',
  styleUrls: ['./filter-tags.component.scss']
})
export class FilterTagsComponent implements OnInit {
  @ViewChild('drawer', {static: false}) drawer: MatSidenav;
  selection = new SelectionModel(true, []);
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
      displayedColumns: string[] = ['Vehicles', 'select'];
      dataSource = new MatTableDataSource(ELEMENT_DATA)
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

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

removeSelectedRows(row) {
  this.dataSource.data = this.dataSource.data.filter(i => i !== row)
  console.log(row)
}

addSelectedRows(row) {


  this.dataSource.data.push(row)
  console.log(row)
}

checkboxLabel(row?): string {
  if (!row) {
    return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
}

isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSource.data.length;
  return numSelected === numRows;
}

masterToggle() {
  this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
}
}
