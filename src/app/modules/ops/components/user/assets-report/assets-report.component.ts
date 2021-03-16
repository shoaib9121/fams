import { Component, OnInit, Input, Output, EventEmitter, Inject } from "@angular/core";
import { GlobalVariables } from "../../../../../global-variables.service";
import { AssetReportService } from "./asset-report.service";
import { ActivatedRoute } from "@angular/router";
import { CreateItemService } from "../add-drawer/create-item.service";
import { CurrencyPipe, DecimalPipe } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from "@angular/material";
import { CommentsDialogComponent } from "./comments-dialog/comments-dialog.component";

@Component({
	selector: "app-assets-report",
	templateUrl: "./assets-report.component.html",
	styleUrls: ["./assets-report.component.scss"]
})
export class AssetsReportComponent implements OnInit {
	
	
	@Input() id: any;
	@Output() submitted: EventEmitter<any> = new EventEmitter();
	@Output() cancelled: EventEmitter<any> = new EventEmitter();
	
	public selectedTab: number;
	
	drawerTitle = this.globals.translation["Create Asset Statement"][this.globals.LNG];
	
	
	tabBack () {
		this.selectedTab -= 1;
	}
	
	eventCancelledDrawer () {
		this.cancelled.emit("cancelled");
	}
	
	eventSubmitted () {
		// console.log(JSON.stringify(this.dataSource));
		this.submitted.emit("created");
	}
	
	//#region DogsInsurrance section
	dataSource: any[] = [
		
		{
			type_id: 0,
			asset_type: {en: "Marine Vehicles", ar: "المركبات البحرية"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 1,
			asset_type: {en: "Third Party Liability", ar: "مسؤولية الطرف الثالث"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 2,
			asset_type: {en: "Buildings And its Content", ar: "المباني ومحتواها"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 3,
			asset_type: {en: "Stores Items", ar: "مخازن البنود"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 4,
			asset_type: {en: "Vehicle Impound", ar: "يحجز السيارة"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 5,
			asset_type: {en: "Third Party Liability", ar: "مسؤولية الطرف الثالث"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 7,
			asset_type: {en: "Staff Personal Injuries", ar: "إصابات الموظفين الشخصية"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 8,
			asset_type: {en: "Vehicles", ar: "مركبات"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: 0,
			comments: ""
			
		},
		{
			type_id: 9,
			asset_type: {en: "Armor & Bulldozer Vehicles", ar: "مركبات الدروع والجرافة"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 10,
			asset_type: {en: "Marine Trailers", ar: "المقطورات البحرية"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: 0,
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 11,
			asset_type: {en: "Devices & Equipment", ar: "الأجهزة والمعدات"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 12,
			asset_type: {en: "Radar & Cameras", ar: "الرادار والكاميرات"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
			
		},
		{
			type_id: 13,
			asset_type: {en: "Medical Mistakes", ar: "الأخطاء الطبية"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: 0,
			premium_total: "0",
			comments: ""
		},
		
		{
			type_id: 14,
			asset_type: {en: "Police Dogs", ar: "كلاب الشرطة"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: 0,
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 15,
			asset_type: {en: "Third Party Liability(Dogs)", ar: "مسؤولية الطرف الثالث (الكلاب)"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 16,
			asset_type: {en: "Horses", ar: "خيل"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		},
		{
			type_id: 17,
			asset_type: {en: "Third Party Liability(Horses)", ar: "مسؤولية الطرف الثالث (الخيول)"},
			total_assets: "-",
			sum_insured: "-",
			insurance_percentage: "-",
			premium: "0",
			insurance_fee: "0",
			premium_subtotal: "0",
			vat_amount: "0",
			premium_total: "0",
			comments: ""
		}
	];
	
	displayedColumns =
		["type_id", "asset_type", "total_assets", "sum_insured", "insurance_percentage", "premium", "insurance_fee",
			"premium_subtotal", "vat_amount", "premium_total", "comments"];
	
	tableHeader = [
		{
			field_id: "type_id",
			name: "ID"
		},
		{
			field_id: "asset_type",
			name: "Name"
		},
		{
			field_id: "total_assets",
			name: "Total Count"
		},
		{
			field_id: "sum_insured",
			name: "Insurance Value"
		},
		{
			field_id: "insurance_percentage",
			name: "Percentage"
		},
		{
			field_id: "premium",
			name: "Premium"
		},
		{
			field_id: "issuance_fee",
			name: ""
		},
		{
			field_id: "insurance_fee",
			name: "Issurance Fee"
		},
		{
			field_id: "premium_subtotal",
			name: "Premium SubTotal"
		},
		{
			field_id: "vat_amount",
			name: "VAT Ammount"
		},
		{
			field_id: "premium_total",
			name: "Premium Total"
		},
		{
			field_id: "comments",
			name: "Comments"
		}
	];
	downloadFileUrl = "";
	downloadFilename = "Asset Report.csv";
	moduleId: any;
	
	downloadFile (downloadFileUrl, name?) {
		this.downloadFileUrl = downloadFileUrl;
		this.downloadFilename = name;
		setTimeout(() => {
			document.getElementById("downloadPdf").click();
		}, 100);
	}
	
	constructor (public globals: GlobalVariables, private route: ActivatedRoute,
	             public assetReportService: AssetReportService,
	             private dp: DecimalPipe,
	             private dialog: MatDialog) {
		this.route.paramMap.subscribe(paramMap => {
			this.moduleId = paramMap.get("moduleId");
		});
	}
	
	ngOnInit () {
		console.log(this.id);
		if (this.id) {
			this.getAssetsbyId(this.id);
			this.drawerTitle = this.globals.translation["Edit Asset Statement"][this.globals.LNG];
		} else {
			this.getAssets();
		}
		
	}
	
	copyDataSource: any;
	vatPercentage: any = 5;
	
	isEditable (type_id, field_id) {
		if (field_id == "insurance_percentage") {
			if (this.copyDataSource) {
				let elementEditable = this.copyDataSource.find(i => i.type_id === type_id);
				if (elementEditable) {
					if (elementEditable.hasOwnProperty(field_id)) {
						return true;
					}
				}
			}
		}
		return false;
	}
	
	getAssets () {
		this.assetReportService.getAssets().subscribe(data => {
			this.copyDataSource = Object.assign([], data.content.data);
			this.copyDataSource.forEach(element => {
				let typeId = this.dataSource.find(i => i.type_id === element.type_id);
				if (typeId) {
					this.tableHeader.forEach(header => {
						let field_id = element.hasOwnProperty(header.field_id);
						if (field_id && header.field_id != "type_id") {
							typeId[header.field_id] = element[header.field_id];
						}
					});
					this.calculateFormulas(typeId);
				}
			});
			// this.copyDataSource.forEach(data => {
			// 	this.tableHeader.forEach(element => {
			// 		let field_id = data.hasOwnProperty(element.field_id);
			// 		if(field_id && element.field_id != 'type_id'){
			// 			element.editable = true;
			// 		}
			// 	})
			// 	if(!data['premium']){
			// 		data['premium'] = 0;
			// 	}
			// 	if(!data['insurance_percentage']){
			// 		data['insurance_percentage'] = 0;
			// 	}
			// 	data['insurance_fee'] = 0;
			// 	data['premium_subtotal'] = 0;
			// 	data['premium'] = 0;
			// 	data['vat_amount'] = 0;
			// 	data['premium_total'] = 0;
			// 	data['comments'] = '';
			// 	
			// })
		});
	}
	
	getAssetsbyId (id) {
		this.assetReportService.fetchAssetsById(id).subscribe(data => {
			//console.log(data.content.values.report)
			this.copyDataSource = Object.assign([], data.content.values.report);
			this.copyDataSource.forEach(element => {
				let typeId = this.dataSource.find(i => i.type_id === element.type_id);
				if (typeId) {
					this.tableHeader.forEach(header => {
						let field_id = element.hasOwnProperty(header.field_id);
						if (field_id && header.field_id != "type_id") {
							typeId[header.field_id] = element[header.field_id];
						}
					});
					this.calculateFormulas(typeId);
				}
			});
		});
	}
	
	reCalculateFormulas () {
		this.copyDataSource.forEach(element => {
			let typeId = this.dataSource.find(i => i.type_id === element.type_id);
			if (typeId) {
				this.calculateFormulas(typeId);
			}
		});
	}
	
	calculateFormulas (obj) {
		obj.vat_percentage = this.vatPercentage;
		let insurance_percentage = obj.insurance_percentage / 100;
		let formula = this.copyDataSource.find(i => i.type_id === obj.type_id);
		if (formula) {
			if (obj.hasOwnProperty("total_assets") && !obj.hasOwnProperty("sum_insured")
				&& !obj.hasOwnProperty("insurance_percentage") && !obj.hasOwnProperty("premium")) {
				obj.premium = (obj.sum_insured + insurance_percentage);
			} else {
				obj.premium = (obj.sum_insured * insurance_percentage) / 100;
			}
		}
		obj.insurance_fee = (obj.premium * obj.issuance_fee) / 100;
		obj.premium_subtotal = (obj.premium + obj.insurance_fee);
		obj.vat_amount = (obj.premium_subtotal * obj.vat_percentage);
		obj.premium_total = (obj.premium_subtotal + obj.vat_amount);
	}
	
	downloadAssets () {
		let assets = [];
		this.copyDataSource.forEach(element => {
			let asset = this.dataSource.find(elem => elem.type_id == element.type_id);
			if (asset) {
				assets.push(asset);
			}
		});
		let assetObj = {value: JSON.stringify(assets)};
		this.assetReportService.downloadAssets(assetObj).subscribe(data => {
			
			if (data.status == 200) {
				let downloadLink = document.createElement("a");
				// @ts-ignore
				downloadLink.href = "data:application/csv;charset=ISO-8859-1," + encodeURI("" + data.error.text);
				//downloadLink.href = window.URL.createObjectURL(new Blob([data.error.text], {type: "application/csv;charset=ISO-8859-1"}));
				downloadLink.setAttribute("download", "report.csv");
				document.body.appendChild(downloadLink);
				downloadLink.click();
				// this.downloadFile(data, this.downloadFilename);
			}
		});
	}
	
	saveAssets () {
		let report = [];
		this.copyDataSource.forEach(element => {
			let asset = this.dataSource.find(elem => elem.type_id == element.type_id);
			if (asset) {
				report.push(asset);
			}
		});
		let moduleId = 33;
		let typeId = 0;
		let value = {report};
		if (this.id) {
			this.assetReportService.updateAssets(this.id, value).subscribe(data => {
				if (data.status == 200) {
					this.eventSubmitted();
				}
			});
		} else {
			this.assetReportService.postAssets(moduleId, typeId, value).subscribe(data => {
				if (data.status == 200) {
					this.eventSubmitted();
				}
			});
		}
	}
	
	addComments (asset) {
		const dialogRef = this.dialog.open(CommentsDialogComponent, {
			data: {
				comment: asset.comments,
			}
		});
		dialogRef.afterClosed().subscribe((param) => {
			if (param) {
				asset.comments = param;
			}
		});
	}
	
	// calculateFormulas(obj){
	// 	obj.issuance_fee = obj.issuance_fee ? obj.issuance_fee : 10;
	// 	obj.VatPercentage = obj.VatPercentage ? obj.VatPercentage : 10;
	// 	if(obj.type_id == 15 || obj.type_id == 17){
	// 		obj.sum_insured = obj.sum_insured ? obj.sum_insured : 10;
	// 		obj.premium = (obj.sum_insured * obj.total_assets);
	// 		obj.insurance_fee = (obj.premium * obj.issuance_fee) / 100;
	// 	}
	// 	else if(obj.type_id == 1 || obj.type_id == 6 || obj.type_id == 7 || obj.type_id == 13){
	// 		obj.insurance_fee = (obj.premium * obj.issuance_fee) / 100;
	// 	}
	// 	else{
	// 		obj.premium = (obj.sum_insured * obj.insurance_percentage) / 100;
	// 		if(obj.type_id == 8 || obj.type_id == 9 ||  obj.type_id == 10){
	// 			obj.insurance_fee = 0;
	// 		}
	// 		else{
	// 			obj.insurance_fee = (obj.premium * obj.issuance_fee) / 100;
	// 		}
	// 	}
	// 	obj.premium_subtotal = (obj.premium + obj.insurance_fee);
	// 	obj.vat_amount = (obj.premium_subtotal * obj.VatPercentage);
	// 	obj.premium_total = (obj.premium_subtotal + obj.vat_amount);
	// }
	
	isObject (element) {
		if (element == null) {
			element = 0;
		}
		if (typeof (element) === "object") {
			return true;
		} else {
			return false;
		}
	}
	
	getKeys (obj) {
		return Object.keys(obj);
	}
	
	getTotalValue (field_id) {
		let add = 0;
		if (field_id == "total_assets" || field_id == "sum_insured" ||
			field_id == "insurance_percentage" || field_id == "premium" ||
			field_id == "insurance_fee" || field_id == "premium_subtotal" ||
			field_id == "vat_amount" || field_id == "premium_total") {
			this.dataSource.forEach(column => {
				if (typeof (column[field_id]) == "number") {
					add = (+add) + (+column[field_id]);
				}
			});
			return add;
		} else if (field_id == "asset_type") {
			return "Total";
		} else {
			return "";
		}
	}
	
	setFormat (value) {
		if (typeof (value) == "number") {
			return this.dp.transform(value, "0.1-2");
		} else {
			return value;
		}
	}
	
}

@Component({
	selector: "comment-dialog",
	templateUrl: "./comment-dialog.html",
	styleUrls: ["./assets-report.component.scss"]
})
export class ComponentDialog implements OnInit {
	
	comment: any;
	
	constructor (@Inject(MAT_DIALOG_DATA) public data: any,
	             public dialogRef: MatDialogRef<ComponentDialog>,
	             public globalVars: GlobalVariables) {
	}
	
	ngOnInit () {
		this.comment = this.data.comment;
	}
	
	onNoClick (): void {
		this.dialogRef.close(false);
	}
	
	onYesClick () {
		this.dialogRef.close(this.comment);
	}
}
