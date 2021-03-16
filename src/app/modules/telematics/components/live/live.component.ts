import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariables } from 'src/app/global-variables.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { MatDialogRef, MatDialog, MatSidenav, MatTableDataSource } from '@angular/material';
import { TelematicsService } from '../../telematics.service';
import { SelectionModel } from '@angular/cdk/collections';
@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  private map;
  @ViewChild("tableWidget", { static: false }) groupedTableWidget: TableWidget;
  @ViewChild('drawer', { static: false }) drawer: MatSidenav;
  @ViewChild('mapdrawer', { static: false }) mapdrawer: MatSidenav;
  displayedColumns = ['title', 'plateNumber', 'driver', 'odometer', "speed", "update_timestamp"]

  public dataSource: any

  /**
  * List Table data
  */
  public tableWidgetData: {
    columnStructure: Array<object>,
    data: Array<object>,
    statusInfoNChanges: object,
    tableSearch: boolean,
    typeStructure: object,
  };


/**column structure for list table */
  public columnStructure: any = [
    {
      name: {
        "en": "Title",
        "ar": "",
      },
      field_id: "title",
      type: "single",
      cols: ["title"]
    },
    {
      name: {
        "en": "Plate Number",
        "ar": " ",
      },
      field_id: "plateNumber",
      type: "single",
      cols: ["plateNumber"]
    },
    {
      name: {
        "en": "Brand",
        "ar": " ",
      },
      field_id: "brand",
      type: "single",
      cols: ["brand"]
    },
    {
      name: {
        "en": "Model",
        "ar": " ",
      },
      field_id: "model",
      type: "single",
      cols: ["model"]
    },
    {
      name: {
        "en": "Year",
        "ar": " ",
      },
      field_id: "year",
      type: "single",
      cols: ["year"]
    },
    {
      name: {
        "en": "Color",
        "ar": " ",
      },
      field_id: "color",
      type: "single",
      cols: ["color"]
    },
    {
      name: {
        "en": "Driver",
        "ar": "",
      },
      field_id: "driver",
      type: "single",
      cols: ["driver"]
    },
    {
      name: {
        "en": "Odometer",
        "ar": "",
      },
      field_id: "odometer",
      type: "single",
      cols: ["odometer"]
    },
    {
      name: {
        "en": "Speed",
        "ar": " ",
      },
      field_id: "speed",
      type: "single",
      cols: ["speed"]
    },
    {
      name: "Action",
      field_id: "actions",
      type: "grouped_button",
      cols: ["requestType", "status"]
    },
    {
      name: {
        "en": "last Updated",
        "ar": " ",
      },
      field_id: "update_timestamp",
      type: "single",
      cols: ["update_timestamp"]
    }
  ];

  /**icons list for drawer */
  icons = {
    altitude: 'arrow-up',
    odometer:'speedometer-medium',
    temperature:'temperature-celsius',
    canSpeed:'speedometer',
    driver_name:'car',
    driverName:'car',
    driver:'car',
    driving_licence:'car',
    mobile_number:'cellphone',
    satellites:'satellite',
    latitude:'earth',
    longitude:'earth',
    lastRecord:'file-document',
    deviceActivated:'calendar',
    deviceId:'devices',
    device_id:'devices',
    brand:'file-image',
    plate_number:'file-image',
    vehicleType:'car',
    driver_mobile:'cellphone',
    record_v_datetime:'calendar',
    angle:'angle-right',
    driver_gender:'gender-male-female',
    color:'color-helper',
    speed:'speedometer',
    initialOdometer:'speedometer-medium',
    update_timestamp:'calendar',
    record_v_timestamp:'calendar',
    record_g_timestamp:'calendar',
    activation_timestamp:'calendar',
    modal:'file-image',
    model:'file-image',
    record_g_datetime:'calender',
    digitalInput2:'pencil'
  }

  public HybridcolumnStructure: any = ["title", "plateNumber", "driver", "odometer", "speed", "update_timestamp", "update_timestamp"]
  public telmaticVehicle: any;
  selectedVehicle: any;
  selection = new SelectionModel(true, []);
  tripdisplayedColumns: string[] = ['select', 'From', 'To', 'Start Time', 'End Time', 'Distance', 'Duration'];
  tripdataSource = new MatTableDataSource()

  constructor(public globalVars: GlobalVariables, private http: HttpClient, public ngxSpinner: NgxSpinnerService, private dialog: MatDialog, private telematicsService: TelematicsService) {
    this.initTableData()
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {


  }

  /**initiate leaflet map */
  initMap(): void {
    this.map = this.getTheMap()
    this.map.invalidateSize();
  }

  getTheMap(): any {


    var map = L.map('map', {
      center: [25.303217, 55.395197],
      zoom: 12
    });
    const tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      maxZoom: 19,
    });
    console.log(tiles)
    tiles.addTo(map);
    return map;

  }


  /**initiate the table data */
  initTableData() {
    this.ngxSpinner.show();
    this.tableWidgetData = {
      columnStructure: this.columnStructure,
      data: [],
      statusInfoNChanges: [],
      tableSearch: true,
      typeStructure: {
        0: this.columnStructure,
      }
    };



    this.getListOfVehicles()
  }


  /**api calling for fetch list of telematics vehicles */
  getListOfVehicles(): void {
    console.log("here")
    this.telematicsService.fetchListOfTelematicsVehicles().subscribe((data) => {
      console.log(data)
      if (data["status"] == "ok") {

        const listOfVehicles = data.data
        for (var i = 0; i < listOfVehicles.length; i++) {

          listOfVehicles[i].update_timestamp = this.timeFormatting(listOfVehicles[i].update_timestamp)

          listOfVehicles[i]["actions"] = [
            {
              name: { en: "Vehicle Icon", ar: "" },
              tooltip: { en: "Vehicle Icon", ar: "" },
              icon: listOfVehicles[i].vehicleIcon,
              action: "openImageDrawer"
            },
            {
              name: { en: "Vehicle Status", ar: "" },
              tooltip: { en: "Vehicle Status", ar: "" },
              // listOfVehicles[i].vehicleStatus
              icon: "image",
              action: "openImageDrawer"
            }
          ]
        }
        this.globalVars.addDefaultTypeId(listOfVehicles);

        this.dataSource = new MatTableDataSource(listOfVehicles);

        console.log(this.dataSource)
        this.tableWidgetData.data = [
          {
            data: listOfVehicles
          }];
      }
      this.ngxSpinner.hide();
      setTimeout(() => {
        this.initMap();
      }, 1);
    })

  }

  /**converting time */
  timeFormatting(time) {
    // console.log(time)

    if (time > 60) {
      if (Math.floor(time / 60) > 60) {
        return Math.floor(time / 3600) + ' hour ' + time % 60 + 'minutes ago'
      }
      else {
        return Math.floor(time / 60) + ' minutes ' + time % 60 + ' secs ago'
      }

    }
    else {
      return time + ' seconds ago'
    }

  }


  openDialogue(event) {
    console.log(event)
    const dialogRef = this.dialog.open(liveDialog, {
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

  /**table row clicked */
  tableRowClicked(row) {

    this.selectedVehicle = row
    this.mapdrawer.toggle();
    this.ngxSpinner.show("drawer")
    this.telematicsService.getTelmaticsVehicle(row).subscribe((data) => {
      this.telmaticVehicle = data.data
      this.ngxSpinner.hide("drawer");
      console.log(data)
      this.tripdataSource = new MatTableDataSource(this.telmaticVehicle.trips)

    })
    console.log(row)
  }

  /**table search filter */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  masterToggle() {


  }

  isAllSelected() {

  }

  rowClicked(event) {
    console.log(event)
    // this.drawer.toggle()
  }

  /** initiate the map when tab change */
  tabChange(event) {
    if (event.index == 2) {
      this.drawer.close();
      this.map.remove()
      setTimeout(() => {
        this.initMap();
      }, 2000);
    }
    else if (event.index == 1) {
      this.drawer.close();
    }
    else {

      this.drawer.open();
    }
  }

  transform(value: any) {
    return Object.keys(value)
  }

}


@Component({
  selector: 'live-dialog',
  templateUrl: 'live-dialogue.html',
})
export class liveDialog {
  constructor(public globals: GlobalVariables, public dialogRef: MatDialogRef<liveDialog>, ) {



  }

  onYesClick(str): void {
    this.dialogRef.close(true);
  }

}
