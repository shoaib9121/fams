import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
const ELEMENT_DATA = [
  { name: 'L1145' },
  { name: 'Dubai h1522' },
  { name: '25488' },
  { name: '236874' },
  { name: '22584' }
];


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})


export class HistoryComponent implements OnInit {
  @ViewChild("tableWidget", { static: false }) groupedTableWidget: TableWidget;
  selection = new SelectionModel(true, []);
  constructor(public globalVars: GlobalVariables) {

  }

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

  filterDAys = [
    {
      en: '1Day',
      ar: ''
    },
    {
      en: '7Days',
      ar: ''
    },
    {
      en: '14Days',
      ar: ''
    },
    {
      en: '30Days',
      ar: ''
    },
  ]


  bookdata = [
    {
      id: 75,
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

  public columnStructure: any = [
    {
      name: {
        "en": "Vehicle",
        "ar": " ",
      },
      field_id: "vehicle",
      type: "single",
      cols: ["vehicle"]
    },
    {
      name: {
        "en": "Driver",
        "ar": "المستعمل",
      },
      field_id: "Driver",
      type: "single",
      cols: ["Driver"]
    },
    {
      name: {
        "en": "From",
        "ar": "مركبة",
      },
      field_id: "From",
      type: "date",
      cols: ["From"]
    },
    {
      name: {
        "en": "To",
        "ar": " ",
      },
      field_id: "To",
      type: "date",
      cols: ["To"]
    },
    {
      name: {
        "en": "Start-Time",
        "ar": " ",
      },
      field_id: "start_time",
      type: "single",
      cols: ["start_time"]
    },
    {
      name: {
        "en": "End-Time",
        "ar": " ",
      },
      field_id: "end_time",
      type: "single",
      cols: ["end_time"]
    },
    {
      name: {
        "en": "Duration",
        "ar": " ",
      },
      field_id: "duration",
      type: "single",
      cols: ["duration"]
    },
    {
      name: {
        "en": "Distance",
        "ar": " ",
      },
      field_id: "distance",
      type: "single",
      cols: ["distance"]
    },
    {
      name: {
        "en": "Fuel Used",
        "ar": " ",
      },
      field_id: "fuel_used",
      type: "single",
      cols: ["fuel_used"]
    },
    {
      name: {
        "en": "Fuel Cost",
        "ar": " ",
      },
      field_id: "fuel_cost",
      type: "single",
      cols: ["fuel_cost"]
    },
    {
      name: {
        "en": "Estd. Fuel Used",
        "ar": " ",
      },
      field_id: "estd_fuel",
      type: "single",
      cols: ["estd_fuel"]
    },
    {
      name: {
        "en": "Estd. Fuel Cost",
        "ar": " ",
      },
      field_id: "estd_cost",
      type: "single",
      cols: ["estd_cost"]
    },
    {
      name: {
        "en": "View",
        "ar": " ",
      },
      field_id: "view",
      type: "single",
      cols: ["view"]
    }
  ];

  searchFilter = [
    {
      name: {
        en: "vehicles",
        ar: ''
      }

    },
    {
      name: {
        en: "Groups",
        ar: ''
      }

    }
  ]
  historyFilters = [
    {
      name: {
        en: 'Selected Report',
        ar: ''
      },
      icon: "insert_drive_file",
      type: 'report'
    },
    {
      name: {
        en: 'Search By Date & Time',
        ar: ''
      },
      icon: "av_timer",
      type: 'time'
    },
    {
      name: {
        en: 'Filters',
        ar: ''
      },
      icon: "filter_list",
      type: 'filter'
    },
    {
      name: {
        en: 'Search By Group(s) or Vehicle(s)',
        ar: ''
      },
      icon: "search",
      type: 'search'
    },

  ]


  ReportTypes = [
    {
      name: {
        en: 'Trip History',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Daily Trip History',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Complete History',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Total Distance',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Over Speed',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Maximum Speed',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Speed Analysis',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Engine Idle',
        ar: ''
      },
      icons: []
    },
    {
      name: {
        en: 'Stops',
        ar: ''
      },
      icons: []
    },
  ]
  displayedColumns: string[] = ['Vehicles', 'select'];
  dataSource = new MatTableDataSource(ELEMENT_DATA)
  public filterTags = [{
    en: 'Emergency Vehicles',
    ar: 'سيارات الطوارئ'
  },
  {
    en: 'Inactive Vehicles ',
    ar: 'المركبات غير النشطة'
  }

  ];
  ngOnInit() {

    this.initTableData()

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
    this.getTableData();
  }

  getTableData(): void {
    // this.ngxSpinner.show();







    var inc = 1;
    for (var i = 0; i < this.bookdata.length; i++) {
      this.bookdata[i]["serialNo"] = inc++;
      this.bookdata[i]["actions"] = [
        {
          name: { en: "image", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          tooltip: { en: "image", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          icon: "image",
          action: "openImageDrawer"
        },
        {
          name: { en: "image", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          tooltip: { en: "image", ar: "ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
          icon: "image",
          action: "openImageDrawer"
        }


      ]
    }

    this.globalVars.addDefaultTypeId(this.bookdata);
    this.tableWidgetData.data = [
      {
        data: this.bookdata
      }];




    // this.groupedTableWidget.initTableData();

    // this.ngxSpinner.hide();


    //return await this.restApi.get(`${environment.iserveApiUrl}/vehicle/listTelVehicles`).toPromise();
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

  rowClicked(event)
  {

  }
}
