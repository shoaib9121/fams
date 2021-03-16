import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
//import {MarkerCluster} from 'leaflet.markercluster';
import { environment } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-mapview',
  templateUrl: './mapview.component.html',
  styleUrls: ['./mapview.component.scss', /*"../../../../../../dist/leaflet/MarkerCluster.css"*/],
})
export class MapviewComponent implements OnInit {
  private map;
  private vehicles = [];
  private mapRefreshInterval = null;
  private clustermarker = null;
  constructor(private restApi: HttpClient) { }

  ngOnInit() {
    //this.loadScript('dist/leaflet/leaflet.markercluster-src.js');
    this.loadScript('assets/leaflet/leaflet.markercluster-src.js');
  }
  ngAfterViewInit(): void {
   
    this.initMap();
  }
  initMap(): void {
    this.map = this.getTheMap()
    this.map.invalidateSize();
    this.getVehicles();
    //setInterval(this.getVehicles, 4000);
    let myself = this;
    if(this.mapRefreshInterval == null){
      this.mapRefreshInterval = setInterval(function(){
          myself.getVehicles();
      }, 4000);
  }
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement> document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  getTheMap(): any{

      var map = L.map('map', {
        center: [25.303217,55.395197],
        zoom: 12
      });
      const tiles = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
        maxZoom: 19,
      });
      tiles.addTo(map);
      return map;
      
  }

  getVehicles(): void {

    let mySelf = this;
    const promise = this.restApi.get(`${environment.iserveApiUrl}/vehicle/listIserveVehicles`).toPromise();
		promise.then((records)=>{

      if(records["status"] == "ok"){
        mySelf.updateVehicleData( records["data"]["iserveVehicles"]);
      }
		}).catch((error)=>{
			console.log("Promise rejected with " + error);
    });
		
  }

  getIcon (status){

    return new L.Icon({
      iconUrl: 'assets/mapIcons/'+status+".png",
      iconSize:     [32, 32], 
      iconAnchor:   [16, 32],
    });

  }
  
  updateVehicleData(currentVehicles): void {
    var mySelf = this;
    try{
      console.log(mySelf.clustermarker)
      if(mySelf.clustermarker == null ){
         // @ts-ignore
         mySelf.clustermarker  = L.markerClusterGroup({
          spiderfyOnMaxZoom: false,
          disableClusteringAtZoom: 14,
          showCoverageOnHover: true,
          zoomToBoundsOnClick: true,
          polygonOptions: {
              fillColor: 'rgb(101,101,101)',//'#1b2557',
              color: '#1b2557',
              weight: 0.8,
              opacity: 1,
              fillOpacity: 0.8
          },iconCreateFunction: function(cluster) {
              var childCount = cluster.getChildCount();
              console.log("child = "+ childCount)
                  var c = ' marker-cluster-';
                  if (childCount < 5) {
                    c += 'small';
          }
                  else if (childCount < 10) {
                    c += 'medium';
                  } 
                  else {
                    c += 'large';
              }
              var cc = 'marker-cluster' + c;
              return new L.DivIcon({ html: '<div ><span>' + childCount + '</span></div>', 
                  className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
                 
                 }
        });
      }
      
      var markerLayer = new L.FeatureGroup();
      var initialFlag = false;
      currentVehicles.forEach( (row,index) => {

          var markerColor = "active"; 
          if(row.currentStatus == "active"){
              markerColor = "active";
          }else if(row.currentStatus == "reserved"){
              markerColor = "reserved";
          }else if(row.currentStatus == "booked"){
              markerColor = "booked";
          }else if(row.currentStatus == "maintenance"){
              markerColor = "maintenance";
          }
          if( typeof mySelf.vehicles[row.id] === "undefined"){
            initialFlag = true;
            row.marker =  L.marker(L.latLng( parseFloat(row.latitude), parseFloat(row.longitude)), {icon : mySelf.getIcon(markerColor), draggable:false})
            .bindTooltip(row.plateNumber + " - " +row.iserveId+ " ( "+ row.currentStatus + " )",
                        {
                            permanent: true,
                            offset: [0, -32],
                            direction: 'top'
                        }
                   );
                   row.marker.cl    
                   mySelf.clustermarker .addLayer( row.marker);
           // .addTo(mySelf.map).addTo(markerLayer);
          } else{
            row.marker = mySelf.vehicles[row.id].marker;
            mySelf.vehicles[row.id].marker.setLatLng(L.latLng( parseFloat(row.latitude), parseFloat(row.longitude)),{draggable:false});
            mySelf.vehicles[row.id].marker.setIcon(mySelf.getIcon(markerColor));
            mySelf.vehicles[row.id].marker._tooltip.setContent(row.plateNumber + " - " +row.iserveId+ " ( "+ row.currentStatus + " )" )
          }
          mySelf.vehicles[row.id] = row;
      });
      if(initialFlag){
        mySelf.map.addLayer(mySelf.clustermarker );
        //mySelf.map.fitBounds(markerLayer.getBounds()); 
      }
      

    }catch(err){
      console.log(err)
    }

  }

}
