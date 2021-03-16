import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from 'src/app/global-variables.service';
import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { LocationsService } from './locations.service';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {
  @ViewChild('drawer', {static: false}) drawer: MatSidenav;
  public addFormVisible: boolean;
  private map;
  private locationMarker;
  private locationCircle;
  private circleOptions = {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0
  }
  public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
	    statusInfoNChanges: object,
	    tableSearch: boolean,
	    typeStructure: object,
  };

  // public  provider = new GoogleProvider({ 
  //   params: {
  //     field_id: 'AIzaSyCTpMa0Z7HVRguSM3jshYKPcAL13y0xZio',
  //   },
  // });

  public drawerType : string;
  public locationModel = { 
		id : 0, 
		address : "",
    location : "", 
    latitude : "",
    longitude : "",
		locationType : "" , 
    systemAdded : false,
    systemAddedText : ""
  };

  public columnStructure: any = [
		{
			name: {
				"en" : "No#",
				"ar" : "رقم",
			},
			field_id: "serialNo",
			type: "single",
			cols: ["serialNo"]
		},{
			name: {
				"en" : "Address",
				"ar" : "عنوان",
			},
			field_id: "address",
			type: "single",
			cols: ["address"]
		},{
			name: {
				"en" : "Location",
				"ar" : "موقعك",
			},
			field_id: "location",
			type: "single",
      cols: ["location"]
		},{
			name: {
				"en" : "Location Type",
				"ar" : "نوع الموقع",
			},
			field_id: "locationType",
			type: "single",
			cols: ["locationType"]
		},{
			name: {
				"en" : "Updated",
				"ar" : "محدث",
			},
			field_id: "systemAddedText",
			type: "ajeesh",
			cols: ["systemAdded"]
		},{
			name: "Action",
			field_id: "actions",
			type: "grouped_button",
			cols: ["requestType", "status"]
		}
  ];
  
  @ViewChild("tableWidget", {static: false}) groupedTableWidget: TableWidget;
  constructor(private locationsService: LocationsService,private snackBarService: SnackbarService, private router: Router, private restApi: HttpClient, public globalVars: GlobalVariables,
              public ngxSpinner: NgxSpinnerService) {
    this.addFormVisible = true;
    this.drawerType = "add";
  }

  ngOnInit() {

    this.initTableData();

  }

  async initTableData() {
	
	  this.tableWidgetData = {
		  columnStructure: this.columnStructure,
		  data: [],
		  statusInfoNChanges: [],
		  tableSearch: true,
		  typeStructure: {
			  0: this.columnStructure
        }
    };
    this.getLocations()
  }

  openDrawer(type: string) {
		this.drawerType = type;
    this.drawer.toggle();
    this.initMapAdd();
	}

	drawerClosed(event) {

    this.clearLocationModel();
    this.drawer.toggle();
    
  }
  
  tableActionEvent(event): void {
		eval("this."+event.button.action+"(event)")
  }
  
  clearLocationModel(){

    this.locationModel = { 
      id : 0, 
      address : "",
      location : "", 
      latitude : "",
      longitude : "",
      locationType : "" , 
      systemAdded : false,
      systemAddedText: ""
    };

  }

  saveLocation(event){
    
    if(this.locationModel.address == ""){return;}
    if(this.locationModel.location == ""){return;}
    this.locationModel.latitude = this.locationModel.location.split(",")[0];
    this.locationModel.longitude = this.locationModel.location.split(",")[1];
		this.locationsService.saveLocation(this.locationModel).subscribe((data) => {
			this.snackBarService.open(this.globalVars.translation["Saved successfully"][this.globalVars.LNG],null,3000);
			this.drawerClosed(event);
      this.initTableData();
      this.clearLocationModel();
		});
    
	}
  
  editLocation(event): void  {
    
		this.locationModel = event.row;
		this.drawerType = "edit";
    this.drawer.toggle();
    this.initMapEdit();
    
  }
  
  deleteLocation(event) : void{

    this.locationModel = event.row;
    this.locationsService.deleteLocation(this.locationModel).subscribe((data) => {
			this.snackBarService.open(this.globalVars.translation["Saved successfully"][this.globalVars.LNG],null,3000);
      this.initTableData();
    });
    
  }

  initMapEdit(): void {

    let self = this;
    if(typeof this.map === "undefined"){
      this.map = this.getTheMap()
    }else{
      if(typeof self.locationMarker !== "undefined"){
        self.map.removeLayer( self.locationMarker)
        self.map.removeLayer( self.locationCircle)
      }
    }
    
    let latlng = L.latLng( parseFloat(this.locationModel.location.split(",")[0]), parseFloat(this.locationModel.location.split(",")[1]));
    self.locationMarker =  L.marker(latlng, {draggable:true});
    self.locationMarker.addTo(self.map);
    self.locationCircle = L.circle(latlng, 1000, self.circleOptions);
    self.locationCircle.addTo(self.map);
    self.map.panTo(latlng);
    self.locationMarker.on('dragend', function(event){
      var markerEv = event.target;
      var position = markerEv.getLatLng();
      self.locationModel.location = position.lat.toString().substring(0, 8)+","+position.lng.toString().substring(0, 8);
      self.locationMarker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
      self.locationCircle.setLatLng(new L.LatLng(position.lat, position.lng));
    });

  }

  rowClicked(event): void{
    
  }
  statusUpdated(event): void{

  }

  getLocations(): void {
		this.ngxSpinner.show();
		const promise = this.restApi.get(`${environment.iserveApiUrl}/location/listLocationData`).toPromise();
		promise.then((records)=>{
      if(records["status"] == "ok"){
        var inc = 1;
        for(var i = 0;i<records["data"]["locations"].length;i++){

            if(records["data"]["locations"][i].systemAdded == true){

              records["data"]["locations"][i].systemAddedText = {
                type : "chip",  
                value: {
                  en : "Updated",
                  ar : "محدث"
                },
                tooltip: {
                  en : "Updated",
                  ar : "محدث"
                },
                color : "#c5e1a5"
              };

            }else{

              records["data"]["locations"][i].systemAddedText = {
                  type : "chip",  
                  value: {
                    en : "Not Updated",
                    ar : "غير محدث"
                  },
                  tooltip: {
                    en : "Not Updated",
                    ar : "غير محدث"
                  },
                  color: "#ef9a9a"
              }

            }

            records["data"]["locations"][i]["actions"] =  [
              {
                "name": {
                  "ar": "تعديل",
                  "en": "Edit"
                },
                "tooltip": {
                  "ar": "تعديل",
                  "en": "Edit"
                },
                "icon": "pencil",
                "action": "editLocation"
              },
              {
                "name": {
                  "ar": "حذف",
                  "en": "Delete"
                },
                "tooltip": {
                  "ar": "حذف",
                  "en": "Delete"
                },
                "icon": "delete",
                "action": "deleteLocation"
              }
            ];

            records["data"]["locations"][i]["serialNo"] = inc++;
          
        }
        
        this.globalVars.addDefaultTypeId(records["data"]["locations"]);
        this.tableWidgetData.data = [
          {
            data: records["data"]["locations"]
          }];
      }
			this.groupedTableWidget.initTableData();
            this.ngxSpinner.hide();
		}).catch((error)=>{
			console.log("Promise rejected with " + JSON.stringify(error));
			this.ngxSpinner.hide();
    });
    
		//return await this.restApi.get(`${environment.iserveApiUrl}/vehicle/listTelVehicles`).toPromise();
	}
  
  initMapAdd(): void {
    
    let self = this;
    if(typeof this.map === "undefined"){
      this.map = this.getTheMap()
    }else{
      if(typeof self.locationMarker !== "undefined"){
        self.map.removeLayer( self.locationMarker)
        self.map.removeLayer( self.locationCircle)
      }
    }

    this.map.on('click', function(e){

      if(typeof self.locationMarker !== "undefined"){
        self.map.removeLayer( self.locationMarker)
        self.map.removeLayer( self.locationCircle)
      }
      self.locationMarker =  L.marker(e.latlng, {draggable:true});
      self.locationMarker.addTo(self.map);
      self.locationModel.location = e.latlng.lat.toString().substring(0, 8)+","+e.latlng.lng.toString().substring(0, 8);
      self.locationCircle = L.circle(e.latlng, 1000, self.circleOptions);
      self.locationCircle.addTo(self.map);
      self.locationMarker.on('dragend', function(event){
          var markerEv = event.target;
          var position = markerEv.getLatLng();
          self.locationModel.location = position.lat.toString().substring(0, 8)+","+position.lng.toString().substring(0, 8);
          self.locationMarker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
          self.locationCircle.setLatLng(new L.LatLng(position.lat, position.lng));
      });

    })
    this.map.invalidateSize();
    //this.getVehicles();
  }

  getTheMap(): any{
      
      var map = L.map('locationmap', {
        center: [ 24.429373,54.428000 ],
        zoom: 3
      });
      L.control.scale().addTo(map);
      const tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });
      tiles.addTo(map);
      return map;

  }

}
