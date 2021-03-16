
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Observable, of, throwError, observable } from 'rxjs';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, catchError, map, startWith } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { FormControl } from '@angular/forms';
import { GlobalVariables } from 'src/app/global-variables.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import { BookingsallService } from './bookingsall.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-bookingsall',
  templateUrl: './bookingsall.component.html',
  styleUrls: ['./bookingsall.component.css']
})
export class BookingsallComponent implements OnInit {

	public columnStructure: any = [
		{	
			name: {
				"en" : "No#",
				"ar" : "رقم",
			},
			field_id: "serialNo",
			type: "single",
			cols: ["id"]
		},
		{
			name: {
				"en" : "User",
				"ar" : "المستعمل",
			},
			field_id: "user",
			type: "single",
			cols: ["user"]
		},
		{
			name: {
				"en" : "Vehicle",
				"ar" : "مركبة",
			},
			field_id: "vehicle",
			type: "single",
			cols: ["vehicle"]
		},
		{
			name: {
				"en" : "Iserve Id",
				"ar" : "أنا أخدم",
			},
			field_id: "iserveId",
			type: "single",
			cols: ["iserveId"]
		},
		{
			name: {
				"en" : "Status",
				"ar" : "الحالة",
			},
			field_id: "systemAddedText",
			type: "ajeesh",
			cols: ["status"]
		},
		{
			name: {
				"en" : "Booking Date",
				"ar" : "تاريخ الحجز",
			},
			field_id: "bookingDate",
			type: "single",
			cols: ["brand"]
		},
		{
			name: {
				"en" : "From",
				"ar" : "من عند",
			},
			field_id: "startAddress",
			type: "single",
			cols: ["startAddress"]
		},
		{
			name: {
				"en" : "Dropoff Date",
				"ar" : "تاريخ الانزال",
			},
			field_id: "endDate",
			type: "single",
			cols: ["endDate"]
		},
    	{
			name: {
				"en" : "To",
				"ar" : "إلى",
			},
			field_id: "endAddress",
			type: "single",
			cols: ["endAddress"]
		},{
			name: "Action",
			field_id: "actions",
			type: "grouped_button",
			cols: ["images"]
		}
  	];

	public statusModel = { 
		active : 0,
		pending : 0,
		closed : 0,
		cancelled : 0
	};  

	public statusValues = {
		end : {
			text : "Closed",
			color : "#c8e6c9"
		},
		booked : {
			text : "Active",
			color : "#b3e5fc"
		},
		cancel : {
			text : "Cancelled",
			color : "#ef9a9a"
		},
		reserved : {
			text : "Reserved",
			color : "#fff59d"
		},
		expired : {
			text : "Expired",
			color : "#ef9a9a"
		}
	};

	drawerImages:any
  	public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
    	statusInfoNChanges: object,
		tableSearch: boolean,
	    typeStructure: object,
   
	};
	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	@ViewChild("tableWidget", {static: false}) groupedTableWidget: TableWidget;
  	constructor(public dialog: MatDialog,private sanitizer:DomSanitizer,
		private snackBarService: SnackbarService, private router: Router, private restApi: HttpClient, public globalVars: GlobalVariables,
		        public ngxSpinner: NgxSpinnerService,private bookingsallService :BookingsallService) {
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
				0: this.columnStructure,
			}
		};
		this.getLocations();
	  }
	
	rowClicked(event): void{
		
    
	}

	statusUpdated(event): void{
  
	}

  	getLocations(): void {
		this.ngxSpinner.show();
		const promise = this.restApi.get(`${environment.iserveApiUrl}/booking/listAllBooking`).toPromise();

		console.log(promise)
		promise.then((records)=>{
			console.log(records)
			if(records["status"] == "ok"){
				
				var inc = 1;
				for(var i = 0;i<records["data"]["booking"].length;i++){
					records["data"]["booking"][i]["serialNo"] = inc++;
					records["data"]["booking"][i]["actions"] = [
						{
							name   : { en:"image", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
							tooltip   : { en:"image", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
							icon   : "image",
							action : "openImageDrawer"						
						}],
					records["data"]["booking"][i].systemAddedText = {
						type : "chip",  
						value: {
							en : this.statusValues[records["data"]["booking"][i]["status"]].text,
							ar : this.statusValues[records["data"]["booking"][i]["status"]].text
						},
						tooltip: {
							en : this.statusValues[records["data"]["booking"][i]["status"]].text,
							ar : this.statusValues[records["data"]["booking"][i]["status"]].text
						},
						color :this.statusValues[records["data"]["booking"][i]["status"]].color
					};
				}
				
				this.globalVars.addDefaultTypeId(records["data"]["booking"]);
				this.tableWidgetData.data = [
				{
					data: records["data"]["booking"]
				}];

				this.statusModel = { 
					active : (parseInt(records["data"]["summary"].active) > 0 ? records["data"]["summary"].active : 0),
					pending : (parseInt(records["data"]["summary"].pending) > 0 ? records["data"]["summary"].pending : 0),
					closed : (parseInt(records["data"]["summary"].close) > 0 ? records["data"]["summary"].close : 0),
					cancelled : (parseInt(records["data"]["summary"].cancel) > 0 ? records["data"]["summary"].cancel : 0),
				};  

			}
			this.groupedTableWidget.initTableData();
			
			this.ngxSpinner.hide();
		}).catch((error)=>{
			// console.log("Promise rejected with " + JSON.stringify(error));
			this.ngxSpinner.hide();
		});

	//return await this.restApi.get(`${environment.iserveApiUrl}/vehicle/listTelVehicles`).toPromise();
	}

	openImageDrawer(event)
	{
		 this.drawer.toggle();
		 this.drawerImages=null
		 this.ngxSpinner.show("imageDrawer");
	     console.log(event)

	 this.bookingsallService.getDrawerImages(event.row.id).subscribe((data) => {
	  this.drawerImages=data.data.imageList
	  this.ngxSpinner.hide("imageDrawer");
		console.log(this.drawerImages)
	 })
	 
	 
	}

	transform(image){
		return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+image);
	}


  	tableActionEvent(event): void {
		eval("this."+event.button.action+"(event)")
	}
  
  	cancelBooking() {
  	}
}
