import {Component, OnInit, ViewChild} from '@angular/core';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { TableWidget } from 'src/app/modules/core/shared/widgets/table-widget/table.widget';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { Observable, of, throwError, observable } from 'rxjs';
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, catchError, map, startWith } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { GlobalVariables } from 'src/app/global-variables.service';
import {UserService} from "./users.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
	selector: 'app-vehicles',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	public drawerType: string;
	public viewTitle = "Planning";
	public options = [];
	public filteredOptions: Observable<string[]>;
	public myControl = new FormControl();
	public addFormVisible: boolean;
	// public userModel = { 
	// 	id : 0, 
	// 	fullName : "",
	// 	userName : "", 
	// 	password : "" , 
	// 	rePassword : "" , 
	// 	email : "", 
	// 	mobileNumber : "",  
	// 	userType: "",
    // 	status: "",
	// 	statusVal : 0,
	// 	employeeId : 0,
	// 	available : true
	// };
	get password()
	{
	return this.userModel.get('password')
	}

	userModel = this.fb.group({
		id:[0],
		fullName:['',[Validators.required]],
		userName:['',[Validators.required]],
		password:['',[Validators.required]],
		rePassword:['',[Validators.required]],
		email:['',[Validators.required,Validators.email]],
		mobileNumber:['',[Validators.required]],
		userType:['',[Validators.required]],
		status:[""],
		statusVal:[0],
		employeeId:['',[Validators.required]],
		available:[true],
	  },{validator : passwordValidator})
	
	public statusModel = { 
		active : 0,
		inactive : 0
	};  
	public addVehiclOption = { 
		text : ""
	};
	public searchModel = "";
	public columnStructure: any = [
		{
			name: {
				"en" : "No#",
				"ar" :  "رقم",
			},
			field_id: "serialNo",
			type: "single",
			cols: ["serialNo"]
		},
		{
			name: {
				"en" : "Employee Id",
				"ar" : "معرف الموظف",
			},
			field_id: "employeeId",
			type: "single",
			cols: ["employeeId"]
		},{
			name: {
				"en" : "Username",
				"ar" : "اسم المستخدم",
			},
			field_id: "userName",
			type: "single",
			cols: ["userName"]
		},{
			name: {
				"en" : "Full Name",
				"ar" : "الاسم الكامل",
			},
			field_id: "fullName",
			type: "single",
			cols: ["fullName"]
		},{
			name: {
				"en" : "Email",
				"ar" : "البريد الإلكتروني",
			},
			field_id: "email",
			type: "single",
			cols: ["email"]
		},{
			name: {
				"en" : "Mobile Number",
				"ar" : "رقم الهاتف المحمول",
			},
			field_id: "mobileNumber",
			type: "single",
			cols: ["mobileNumber"]
		},{
			name: {
				"en" : "User Type",
				"ar" : "نوع المستخدم",
			},
			field_id: "userType",
			type: "single",
			cols: ["userType"]
		},{
			name: {
				"en" : "Active",
				"ar" : "نشيط",
			},
			field_id: "available",
			type: "toggle_slider",
			cols: ["status"]
		},{
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
		tableSearch: boolean,
		typeStructure: object
	};
	
	@ViewChild("tableWidget", {static: false}) groupedTableWidget: TableWidget;
	
	constructor(private userService: UserService,
		private snackBarService: SnackbarService, private router: Router, private restApi: HttpClient, public globalVars: GlobalVariables,
	            public ngxSpinner: NgxSpinnerService,private fb: FormBuilder) {
		this.addFormVisible = true;
		this.drawerType = "add";
	}

	async ngOnInit() {
		this.initTableData();
		//this.getVehicles();	
	}
	
	statusUpdated(event) : any {
	
	}
	
	ngAfterViewInit() {
	}
	
	async initTableData() {
		
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

		this.getUsers();
    
	}
	
	drawerClosed(event) {
		this.clearUserModel();
		this.drawer.toggle();
	}
	
	saveUser(event){
		console.log(this.userModel.value)
		if(this.userModel.valid)
		{

		if(this.userModel.get('available').value == true){
			this.userModel.controls['statusVal'].setValue(1)
		}else{
			this.userModel.controls['statusVal'].setValue(0)
		}
       
		this.userService.saveUser(this.userModel.value).subscribe((data) => {
			console.log(data)
			this.snackBarService.open(this.globalVars.translation["Saved successfully"][this.globalVars.LNG],null,3000);
			this.clearUserModel();
			this.drawerClosed(event);
			this.initTableData()
			
			
		});
		
	}
    
	}

	clearUserModel(){

		 this.userModel.reset();
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
		/*return await this.restApi.get(`${environment.iserveApiUrl}/user/listVehicles`).toPromise().catch((error)=>{
			console.log("Promise rejected with " + JSON.stringify(error));
		});*/
	}


	getUsers(): void {
		this.ngxSpinner.show();
		const promise = this.restApi.get(`${environment.iserveApiUrl}/user/listUser`).toPromise();
		promise.then((records)=>{
			console.log(records)
			if(records["status"] == "ok"){

			var inc = 1;
			for(var i = 0;i<records["data"]["users"].length;i++){
				
				
				records["data"]["users"][i]["type_id"] = 0
				if(records["data"]["users"][i]["status"] == 1){
				records["data"]["users"][i]["available"] = true;
				records["data"]["users"][i]["statusVal"] = 1;
				}else{
				records["data"]["users"][i]["available"] = false;
				records["data"]["users"][i]["statusVal"] = 0;
				}
				records["data"]["users"][i]["actions"] = [
				/*{
					name   : { en:"Edit", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
					tooltip   : { en:"Edit", ar:"ÃƒËœÃ‚ÂªÃƒËœÃ‚Â¹ÃƒËœÃ‚Â¯Ãƒâ„¢Ã…Â Ãƒâ„¢Ã¢â‚¬Å¾" },
					icon   : "pencil",
					action : "openEditDrawer"						
				},*/
				{
					name   : { en:"Delete", ar:"ÃƒËœÃ‚Â­ÃƒËœÃ‚Â°Ãƒâ„¢Ã‚Â" },
					tooltip   : { en:"Delete", ar:"ÃƒËœÃ‚Â­ÃƒËœÃ‚Â°Ãƒâ„¢Ã‚Â" },
					icon   : "delete",
					action : "deleteIserveUser"						
				}
				];
				records["data"]["users"][i]["serialNo"] = inc++;
				
			}
			
			this.statusModel = { 
				active : (parseInt(records["data"]["summary"].active) > 0 ? records["data"]["summary"].active : 0),
				inactive : (parseInt(records["data"]["summary"].inactive) > 0 ? records["data"]["summary"].inactive : 0),
			};  

			this.tableWidgetData.data = [
			{
				data: records["data"]["users"]
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

	tableActionEvent(event): void {
		eval("this."+event.button.action+"(event)")
	}

	getErrorMessage() {
		return this.userModel.get('email').hasError('required') ? 'email is required' :
		this.userModel.get('email').hasError('email') ? 'Not a valid email' :	'';
	  }


	openEditDrawer(event): void  {
	
		console.log(event)
		this.userModel.controls['statusVal'].setValue(1)
		this.userModel.controls['password'].setValue("")
		this.userModel.controls['mobileNumber'].setValue(event.row.mobileNumber)
		this.userModel.controls['fullName'].setValue(event.row.fullName)
		this.userModel.controls['employeeId'].setValue(event.row.employeeId)
		this.userModel.controls['userType'].setValue(event.row.userType)
		this.userModel.controls['id'].setValue(event.row.id)
		this.userModel.controls['userName'].setValue(event.row.userName)
		this.userModel.controls['email'].setValue(event.row.email)
		this.userModel.controls['status'].setValue(event.row.status)
		this.userModel.controls['statusVal'].setValue(event.row.statusVal)

		this.drawerType = "edit";
		this.drawer.toggle();

	}

	deleteIserveVehicle(event): void  {
		// console.log(event);
	}

	lockIserveVehicle(event): void  {
		// console.log(event);
	}

	openQrCodeDrawer(event): void  {

		// console.log(event);
	}

	availableToggleEvent(event): void {
		
		//set values for form
		this.setFormVAlues(event)
		if(this.userModel.get('available').value == true){
			this.userModel.controls['statusVal'].setValue(1)
		}else{
			this.userModel.controls['statusVal'].setValue(0)
		}
		console.log(this.userModel.value)
		this.userService.saveUser(this.userModel.value).subscribe((data) => {
			console.log(data)
			this.snackBarService.open(this.globalVars.translation["Saved successfully"][this.globalVars.LNG],null,3000);
			this.getUsers();
		});
		this.clearUserModel();
		
	}

	setFormVAlues(event)
	{
		
		this.userModel.controls['password'].setValue(event.row.password)
		this.userModel.controls['mobileNumber'].setValue(event.row.mobileNumber)
		this.userModel.controls['fullName'].setValue(event.row.fullName)
		this.userModel.controls['employeeId'].setValue(event.row.employeeId)
		this.userModel.controls['userType'].setValue(event.row.userType)
		this.userModel.controls['id'].setValue(event.row.id)
		this.userModel.controls['userName'].setValue(event.row.userName)
		this.userModel.controls['email'].setValue(event.row.email)
		this.userModel.controls['status'].setValue(event.row.status)
		this.userModel.controls['statusVal'].setValue(event.row.statusVal)	
		this.userModel.controls['available'].setValue(event.row.available)	
	}

    	
	private handleError(operation = "operation", result?: any) {
		
        return (error: any): Observable<any> => {
            console.error(error);
            console.log(`${operation} failed: ${error.message}`);
            return of(error);
        };
	}
	
	private _filter(value: any): string[] {
		
		const filterValue = value.toLowerCase();
		return this.options.filter(option => option.title.toLowerCase().includes(filterValue));
	}
}


import { AbstractControl, ValidatorFn } from "@angular/forms";

export function passwordValidator
    (control : AbstractControl):{[field_id:string]:boolean} | null {


            const password=control.get('password');
            const rePassword=control.get('rePassword');
              
            if(password.pristine || rePassword.pristine)
            {
                return null;
            }
            return password && rePassword && password.value != rePassword.value ? {'misMatch':true} :null 
    } 
