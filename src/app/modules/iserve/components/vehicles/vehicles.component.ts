import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Observable, of, throwError, observable } from 'rxjs';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, catchError, map, startWith } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { FormControl, NgForm } from '@angular/forms';
import { GlobalVariables } from 'src/app/global-variables.service';
import {VehicleService} from "./vehicles.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
	selector: 'app-vehicles',
	templateUrl: './vehicles.component.html',
	styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent implements OnInit {
	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	public drawerType: string;
	public viewTitle = "Planning";
	public options = [];
	public filteredOptions: Observable<string[]>;
	public myControl = new FormControl();
	public addFormVisible: boolean;  
	public statusModel = { 
		active : 0,
		inActive : 0
	};
	public addVehicleModel = { 
		id : 0, 
		tel_asset_id : 0,
		plateNumber : "", 
		model : "" , 
		brand : "" , 
		color : "", 
		vehicleType : "",  
		odometer: "",
		year: "",
		iserveId: "",
		vehicleLocation: "",
		vehicleGroup: "",
		deviceId: "",
		available:  true,
		select: true
	};
	public addVehiclOption = { 
		text : ""
	};
	public searchModel = "";
	public columnStructure: any = [
		{
			name: {
				"en" : "No#",
				"ar" : "الرقم التسلسلي",
			},
			field_id: "select",
			type: "select",
			cols: ["selectOne"]
		},
		{
			name: {
				"en" : "No#",
				"ar" : "الرقم التسلسلي",
			},
			field_id: "serialNo",
			type: "single",
			cols: ["serialNo"]
		},
		{
			name: {
				"en" : "Type",
				"ar" : "اكتب",
			},
			field_id: "vehicleType",
			type: "single",
			cols: ["vehicleType"]
		},
		{
			name: {
				"en" : "Device ID",
				"ar" : "معرف الجهاز",
			},
			field_id: "deviceId",
			type: "single",
			cols: ["DeviceId"]
		},
		{
			name: {
				"en" : "Make",
				"ar" : "يصنع",
			},
			field_id: "brand",
			type: "single",
			cols: ["brand"]
		},
		{
			name: {
				"en" : "Model",
				"ar" : "نموذج",
			},
			field_id: "model",
			type: "single",
			cols: ["model"]
		},
		{
			name: {
				"en" : "Plate No",
				"ar" : "لوحة لا",
			},
			field_id: "plateNumber",
			type: "single",
			cols: ["plateNumber"]
		},
		{
			name: {
				"en" : "iServe #",
				"ar" : "أنا أخدم #",
			},
			field_id: "iserveId",
			type: "single",
			cols: ["iserveId"]
		},
		
		{
			name: {
				"en" : "Available",
				"ar" : "متاح",
			},
			field_id: "available",
			type: "toggle_slider",
			cols: ["available"]
		},
		{
			name: "Action",
			field_id: "actions",
			type: "grouped_button",
			cols: ["requestType", "status"]
		}
	];
	
	public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
		statusInfoNChanges: object,
		bulkActions: object,
		tableSearch: boolean,
		typeStructure: object,
	};
	
	@ViewChild("tableWidget", {static: false}) groupedTableWidget: TableWidget;
	
	statusUpdated(event): any {
	
	}
	
	constructor(private vehicleService: VehicleService,public dialog: MatDialog,
		private snackBarService: SnackbarService, private router: Router, private restApi: HttpClient, public globalVars: GlobalVariables,
	            public ngxSpinner: NgxSpinnerService) {
		this.addFormVisible = true;
		this.drawerType = "add";
	}

	async ngOnInit() {
		this.initTableData();
		var tel_vehicles = await this.listTelVehicles();
		this.options = tel_vehicles.data;
		this.filteredOptions = this.filteredOptions = this.myControl.valueChanges
			.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
		
	}

	async populateTelVehicles(){
		var tel_vehicles = await this.listTelVehicles();
		this.options = tel_vehicles.data;
		this.filteredOptions = this.filteredOptions = this.myControl.valueChanges
			.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
	}
	
	ngAfterViewInit() {
	}
	
    initTableData() {
		this.tableWidgetData = {
			columnStructure: this.columnStructure,
			data: [],
			statusInfoNChanges:[],
			bulkActions : [
				{
					"name": {
					"ar": "حذف الكل",
					"en": "Delete All"
					},
					"tooltip": {
					"ar": "حذف الكل",
					"en": "Delete All"
					},
					"icon": "delete",
					"action": "deleteVehicleAll"
				},{
					"name": {
					"ar": "رمز الاستجابة السريعة",
					"en": "QrCode All"
					},
					"tooltip": {
					"ar": "رمز الاستجابة السريعة",
					"en": "QrCode All"
					},
					"icon": "qrcode",
					"action": "downloadQrCodeAll"
				}
			],
			tableSearch: true,
			typeStructure: {
				0: this.columnStructure
			}
		};
		this.getVehicles();	
	}
	
	drawerClosed(event) {
		this.clearVehicleModel();
		this.drawer.toggle();
	}
	
	saveVehicle(event){

		
		var myself = this;
		if  ( this.addVehicleModel.tel_asset_id < 1 ||
			(typeof this.addVehicleModel.iserveId == "undefined" || this.addVehicleModel.iserveId == "" )|| 
			(typeof this.addVehicleModel.plateNumber == "undefined" || this.addVehicleModel.plateNumber == "" )){
			return;
		}
		this.vehicleService.saveVehicle({
			tel_asset_id: this.addVehicleModel.tel_asset_id,
			iserveId: this.addVehicleModel.iserveId,
			available : (this.addVehicleModel.available ? "Yes": "No"),
			vehicleGroup : this.addVehicleModel.vehicleGroup,
			id : this.addVehicleModel.id
		}).subscribe((data) => {
			myself.snackBarService.open(this.globalVars.translation["Saved successfully"][this.globalVars.LNG],null,2000);
			myself.initTableData();
			myself.drawerClosed(event);
			myself.populateTelVehicles()
			console.log(data)
		});
		
	}

	clearVehicleModel(){

		this.addVehicleModel = { 
			id : 0, 
			tel_asset_id : 0,
			plateNumber : "", 
			model : "" , 
			brand : "" , 
			color : "", 
			vehicleType : "",  
			odometer: "",
			year: "",
			iserveId: "",
			vehicleLocation: "",
			vehicleGroup: "",
			deviceId: "",
			available: true,
			select:true,
			
		};
		this.addVehiclOption.text = "";

	}

	rowClicked(row) {
		console.log("row clicked", row);
	}

	openDrawer(type: string) {

		this.drawerType = type;
		this.drawer.toggle();

	}

    async listTelVehicles(): Promise<any>{
		
		return await this.restApi.get(`${environment.iserveApiUrl}/vehicle/listTelVehicles`).toPromise().catch((error)=>{
			console.log("Promise rejected with " + JSON.stringify(error));
		});

	}

	onSelection(event){
		
		this.addFormVisible = true;
		this.addVehicleModel.tel_asset_id = event.option.id;
		this.getVehicleFromId(event.option.id);

	}

	getVehicleFromId( id ): any{
		this.ngxSpinner.show();
		var self = this;
		const promise = this.restApi.get(`${environment.iserveApiUrl}/vehicle/getTelVehicle?vehicleId=`+id).toPromise();
		promise.then((records)=>{
			if(records["status"] == "ok"){
				let data = records["data"];
				self.addVehicleModel.plateNumber = data.plateNumber;
				self.addVehicleModel.brand = data.brand;
				self.addVehicleModel.model = data.model;
				self.addVehicleModel.color = data.color;
				self.addVehicleModel.year = data.year;
				self.addVehicleModel.vehicleType = data.vehicleType;
				self.addVehicleModel.odometer = data.odometer;
				self.addVehicleModel.vehicleGroup = data.vehicleGroup;
				self.addVehicleModel.deviceId = data.deviceId;
				self.addVehicleModel.available = data.available;
				self.addVehicleModel.iserveId = data.title;
			}
			
			this.ngxSpinner.hide();
		}).catch((error)=>{
			console.log("Promise rejected with " + JSON.stringify(error));
			this.ngxSpinner.hide();
		});
 		
	}

	getVehicles(): void {
		this.ngxSpinner.show();
		const promise = this.restApi.get(`${environment.iserveApiUrl}/vehicle/listIserveVehicles`).toPromise();
		promise.then((records)=>{

			for(var i = 0;i<records["data"]["iserveVehicles"].length;i++){
				records["data"]["iserveVehicles"][i]["serialNo"] = i+1;
			//	records["data"]["iserveVehicles"][i]["vehicleType"] = "Car";
				records["data"]["iserveVehicles"][i]["select"] = false;
				if(records["data"]["iserveVehicles"][i]["available"] == "Yes"){
					records["data"]["iserveVehicles"][i]["available"] = "true";
				}else{
					records["data"]["iserveVehicles"][i]["available"] = "false";
				}
				
			}
			
			this.globalVars.addDefaultTypeId(records["data"]["iserveVehicles"]);
			this.tableWidgetData.data = [
				{
					data: records["data"]["iserveVehicles"]
				}];
			this.statusModel.inActive = records["data"]["summary"]["inActive"];
			this.statusModel.active = records["data"]["summary"]["active"];
			this.groupedTableWidget.initTableData();
			this.ngxSpinner.hide();
		}).catch((error)=>{
			console.log("Promise rejected with " + JSON.stringify(error));
			this.ngxSpinner.hide();
		});
		
	}

	tableActionEvent(event): void {
		eval("this."+event.button.action+"(event)")
	}

	actionButtonPressedAll(event): void {
		eval("this."+event.action+"(event)")
	}

	downloadQrCodeAll(event): void {
		
		let self = this;
		event.selectedRows.forEach( (row,index) => {
			this.ngxSpinner.show();
			const promise = this.restApi.get(`${environment.iserveApiUrl}/vehicle/getQrCodeForVehicle?id=`+row.id).toPromise();
			promise.then((records)=>{
				var a = document.createElement('a')
				a.setAttribute('download', row.iserveId);
				a.setAttribute('href', "data:image/jpeg;base64,"+records["data"].qrCodeImage);
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				this.ngxSpinner.hide();
			}).catch((error)=>{
				console.log("Promise rejected with " + JSON.stringify(error));
				this.ngxSpinner.hide();
			});

		});

	}

	deleteVehicleAll(event): void {
		let myself = this;
		let myEvent = event;
		const dialogRef = this.dialog.open(DialogVehicleConfirm,{
			data: {caption : this.globalVars.translation["Are You Sure want to delete all the vehicles?"][this.globalVars.LNG]}
		});
		dialogRef.afterClosed().subscribe((event) => {
			myEvent.selectedRows.forEach( (row,index) => {
				if(event){
					this.ngxSpinner.show();
					const promise =  this.restApi.post(`${environment.iserveApiUrl}/vehicle/deleteVehicle`, {
						ids : row.id.toString()
					}).toPromise();
					promise.then((records)=>{
						myself.initTableData();
						this.ngxSpinner.hide();
					}).catch((error)=>{
						console.log("Promise rejected with " + JSON.stringify(error));
						this.ngxSpinner.hide();
					});
				}
			});
		});
	
	}

	availableToggleEvent(event): void {

		this.addVehicleModel = event.row;
		this.vehicleService.saveVehicle({
			tel_asset_id: this.addVehicleModel.tel_asset_id,
			iserveId: this.addVehicleModel.iserveId,
			available : (this.addVehicleModel.available ? "yes": "no"),
			vehicleGroup : this.addVehicleModel.vehicleGroup,
			id : this.addVehicleModel.id
		}).subscribe((data) => {
			this.snackBarService.open(this.globalVars.translation["Available status Updated"][this.globalVars.LNG],null,2000);
		});

	}

	openEditDrawer(event): void  {
		this.addVehicleModel = event.row;
		this.drawerType = "edit";
		this.drawer.toggle();
	}

	deleteIserveVehicle(event): void  {
		
		let myEvent = event, myself = this;
		const dialogRef = this.dialog.open(DialogVehicleConfirm,{
			data: {caption : this.globalVars.translation["Are You Sure want to delete this vehicle?"][this.globalVars.LNG]}
		});
		dialogRef.afterClosed().subscribe((event) => {
			if(event){
				this.ngxSpinner.show();
				const promise =  this.restApi.post(`${environment.iserveApiUrl}/vehicle/deleteVehicle`, {
					ids : myEvent.row.id.toString()
				}).toPromise();
				promise.then((records)=>{
					if(records["status"] == "ok"){
						this.snackBarService.open(this.globalVars.translation["Deleted successfully"][this.globalVars.LNG],null,2000);
					}
					myself.initTableData();
					this.ngxSpinner.hide();
				}).catch((error)=>{
					console.log("Promise rejected with " + JSON.stringify(error));
					this.ngxSpinner.hide();
				});
			}
		});

	}
	
	lockIserveVehicle(event): void  {

		let myEvent = event;
		const dialogRef = this.dialog.open(DialogVehicleConfirm,{
			data: {caption : this.globalVars.translation["Are You Sure want to lock this vehicle ?"][this.globalVars.LNG]}
		});
		dialogRef.afterClosed().subscribe((event) => {
			if(event){
				this.ngxSpinner.show();
				const promise = this.restApi.get(`${environment.iserveApiUrl}/vehicle/lockVehicle?id=`+myEvent.row.id).toPromise();
				promise.then((records)=>{
					if(records["status"] == "ok"){
						this.snackBarService.open(this.globalVars.translation["Locked successfully"][this.globalVars.LNG],null,2000);
					}
					this.ngxSpinner.hide();
				}).catch((error)=>{
					console.log("Promise rejected with " + JSON.stringify(error));
					this.ngxSpinner.hide();
				});
			}
		});

	}

	openQrCodeDrawer(event): void  {
		this.ngxSpinner.show();
		const promise = this.restApi.get(`${environment.iserveApiUrl}/vehicle/getQrCodeForVehicle?id=`+event.row.id).toPromise();
		promise.then((records)=>{
			this.openDialogQrCode(records,event)
			this.ngxSpinner.hide();
		}).catch((error)=>{
			console.log("Promise rejected with " + JSON.stringify(error));
			this.ngxSpinner.hide();
		});
		
	}

	openDialogQrCodeAll(records,event): void {
		
		const dialogRef = this.dialog.open(DialogQrCode,{
			data: {qrCodeImage: records["data"].qrCodeImage,iserveId: event.iserveId}
		});
		dialogRef.afterClosed().subscribe(() => {
			const a = document.createElement('a');
		});
	}

	openDialogQrCode(records,event): void {
		
		const dialogRef = this.dialog.open(DialogQrCode,{
			data: {qrCodeImage: records["data"].qrCodeImage,iserveId: event["row"].iserveId}
		});
		dialogRef.afterClosed().subscribe(() => {
			const a = document.createElement('a');
		});
	}

	private handleError(operation = "operation", result?: any) {

		return (error: any): Observable<any> => {
            return of(error);
        };
	}
	
	private _filter(value: any): string[] {
		
		const filterValue = value.toLowerCase();
		return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
	}
}

@Component({
	selector: 'vehicle-dialog',
	templateUrl: './vehicle-dialog.html',
  })
  export class DialogQrCode {
  
	constructor(
	  public dialogRef: MatDialogRef<DialogQrCode>,
	  @Inject(MAT_DIALOG_DATA) public data: any,public globalVars: GlobalVariables) {}
  
	onNoClick(): void {
	  this.dialogRef.close();
	}
	
  
  }

  @Component({
	selector: 'vehicle-confirm',
	templateUrl: './vehicle-confirm.html',
  })
  export class DialogVehicleConfirm {
  
	constructor(
	  public dialogRef: MatDialogRef<DialogVehicleConfirm>,
	  @Inject(MAT_DIALOG_DATA) public data: any,public globalVars: GlobalVariables) {

		
	  }
  
	onYesClick(str): void {
		this.dialogRef.close(true);
	}
	
	onNoClick(str) {
		this.dialogRef.close(false);
	}
  
  }



