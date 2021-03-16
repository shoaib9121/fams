import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { GlobalVariables } from 'src/app/global-variables.service';
import { MatSidenav, MatDialog } from '@angular/material';
import { settingsDialog } from '../settings.component';

@Component({
  selector: 'app-alarm-settings',
  templateUrl: './alarm-settings.component.html',
  styleUrls: ['./alarm-settings.component.scss']
})
export class AlarmSettingsComponent implements OnInit {
  @ViewChild('drawer', { static: false }) drawer: MatSidenav;


  public days: any = [
    {
      en: 'Monday',
      ar: ''
    },
    {
      en: 'Tuesday',
      ar: ''
    },
    {
      en: 'Wednesday',
      ar: ''
    }, {
      en: 'Thursday',
      ar: ''
    }, {
      en: 'Friday',
      ar: ''
    }, {
      en: 'Saturday',
      ar: ''
    }, {
      en: 'Sunday',
      ar: ''
    },]


  public columnStructure: any = [
    {
      name: {
        "en": "no#",
        "ar": " ",
      },
      field_id: "serialNo",
      type: "single",
      cols: ["no"]
    },
    {
      name: {
        "en": "Title",
        "ar": "المستعمل",
      },
      field_id: "title",
      type: "single",
      cols: ["title"]
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

  dummyApidata = [
    {
      id: 75,
      title: 'Overspeed Detected',
      vehicle: "L 52075",
      driver: "10021255",
      From: 14 - 12 - 2019,
      To: 14 - 12 - 2019,
      start_time: "4.30",
      end_time: "3.30",
      duration: 1,
      distance: 1,
      fuel_used: 100,
      fuel_cost: 20,
      estd_cost: 200,
      estd_fuel: 200,
      view: 1,
      type_id: 0
    }]
  constructor(public globalVars: GlobalVariables, public ngxSpinner: NgxSpinnerService, private dialog: MatDialog) {
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
    this.loadAlarm()
  }

  loadAlarm(): void {
    this.ngxSpinner.show();
    var inc = 1;
    for (var i = 0; i < this.dummyApidata.length; i++) {
      this.dummyApidata[i]["serialNo"] = inc++;
      this.dummyApidata[i]["actions"] = [
        {
          name: { en: "edit", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          tooltip: { en: "edit", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          icon: "pencil",
          action: "openDrawer"
        },
        {
          name: { en: "delete", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          tooltip: { en: "delete", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          icon: "delete",
          action: "deleteRow"
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

  openDrawer(event) {
    this.drawer.toggle();
    console.log(event)
  }


  tableActionEvent(event): void {
    console.log(event)
    eval("this." + event.button.action + "(event)")
  }


  rowClicked(event): void {
    console.log(event)
  }

  deleteRow(event) {
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
