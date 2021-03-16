import { Component, OnInit } from "@angular/core";
import { Label, MultiDataSet, Color } from "ng2-charts";
import { ChartType, ChartDataSets, ChartOptions, ChartScales, ChartColor, ScaleTitleOptions } from "chart.js";
import { UserService } from "../../user.service";
import { DashboardService } from "../../dashboard/dashboard.service";
import { GlobalVariables } from "src/app/global-variables.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
	selector: "app-dashboard",
	templateUrl: "./dashboard.component.html",
	styleUrls: ["./dashboard.component.scss"]
})
export class DashboardComponent implements OnInit {
	
	dashBoarDataCounts: any;
	dashBoardData: any;
	constructor (private userService: UserService, public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService, private _dashboardService: DashboardService) {
	}
	
	ngOnInit () {
		this.getDashBoardData();
	}
	
	getDashBoardData () {
		this.ngxSpinner.show("dashboard");
		this.userService.getDashBoardData()
			.subscribe(data => {
				if (data.status == 200) {
					this.dashBoardData = data.content.data;
					this.dashBoarDataCounts = {
						total_vehicles: this.dashBoardData.total_vehicles,
						total_components: this.dashBoardData.total_components,
						active_assets: this.dashBoardData.active_assets,
						desposed_assets: this.dashBoardData.disposed_assets,
						reuse_assets: this.dashBoardData.reused_assets,
						waiting_in_storage_for_transfer: this.dashBoardData.waiting_in_storage_assets
					};
					this.assetsGroupByType(this.dashBoardData.assets_group_by_type);
					this.requestGroupByStatus();
					this.requestByTypeBarChart(this.dashBoardData.request_by_type_bar_chart);
					this.recentlyAddedVehicles(this.dashBoardData.recently_added_vehicles);
				}
				this.ngxSpinner.hide("dashboard");
			});
	}
	
	
	assetTypes = [];
	assetTypesDatas = [];
	assetByCategoryChartLabels: Label[] = this.assetTypes;
	assetByCategoryChartData: MultiDataSet = [
		this.assetTypesDatas,
	];
	assetByCategoryChartType: ChartType = "doughnut";
	assetByCategoryChartOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: true,
			position: "right",
			labels: {
				boxWidth: 14,
				fontSize: 13,
				padding: 4,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	assetByCategoryChartOptionsForMedium: ChartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: true,
			position: "right",
			labels: {
				boxWidth: 10,
				fontSize: 12,
				padding: 4,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	
	assetsGroupByType(data) {
		data.forEach(element => {
			this.assetTypes.push(element.asset_type[this.globalVars.LNG]);
			this.assetTypesDatas.push(element.total_count);
		});
	}
	
	requestByStatusTypes = [];
	requestByStatusDatas = [];
	requestByStatusChartLabels: Label[] = this.requestByStatusTypes;
	requestByStatusChartData: MultiDataSet = [
		this.requestByStatusDatas,
	];
	requestByStatusChartType: ChartType = "doughnut";
	requestByStatusChartOptions: ChartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: true,
			position: "right",
			labels: {
				boxWidth: 14,
				fontSize: 13,
				padding: 4,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	requestByStatusChartOptionsForMedium: ChartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: true,
			position: "right",
			labels: {
				boxWidth: 10,
				fontSize: 12,
				padding: 4,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	requestByStatusChartOptionsForLarge: ChartOptions = {
		responsive: true,
		maintainAspectRatio: true,
		legend: {
			display: true,
			position: "right",
			labels: {
				boxWidth: 10,
				fontSize: 12,
				padding: 4,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	
	donutColors = [
		{
			backgroundColor: []
		}
	];
	
	requestGroupByStatus () {
		let data = this._dashboardService.sortArrayBasedOnStatusesIds(this.dashBoardData.request_group_by_status);
		if(!data){
			return;
		}
		data.forEach(element => {
			this.requestByStatusTypes.push(element.status.name[this.globalVars.LNG]);
			this.requestByStatusDatas.push(element.count);
			this.donutColors[0].backgroundColor.push(element.status.color);
		});
	}
	
	requestsLabels = [];
	requestsDataOpen = [];
	requestsDataClose = [];
	
	requestsChartLabels: Label[] = this.requestsLabels;
	requestsChartData: ChartDataSets[] = [
		{
			data: this.requestsDataOpen,
			label: this.globalVars.translation["open"][this.globalVars.LNG],
			maxBarThickness: 10,
			barThickness: 10
		},
		{
			data: this.requestsDataClose,
			label: this.globalVars.translation["Close"][this.globalVars.LNG],
			maxBarThickness: 10,
			barThickness: 10
		}
	];
	requestsChartType: ChartType = "bar";
	requestsChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: "top",
			align: "end",
			labels: {
				boxWidth: 12
			},
		},
		scales : {
			xAxes: [{
				gridLines: {
					offsetGridLines: true
				},
				ticks : {
					autoSkip : false,
					fontFamily: this.globalVars.dubaiFont,
					callback : (value, index, values) => {
						return value.slice(0, 10)+(value.length > 12 ? '...' : '');
					}
				}
			}],
			yAxes: [{
				gridLines: {
					offsetGridLines: true
				},
				ticks : {
					stepSize: 10,
				},
			}],
		}
	};

	public requestsChartColors: Color[] = [
		{backgroundColor: "#ffa1b5"},
		{backgroundColor: "#fed29d"},
		{backgroundColor: "#90d9d7"},
		{backgroundColor: "#fa9092"},
		{backgroundColor: "#eaeaea"},
		{backgroundColor: "#c1d6e1"},
		{backgroundColor: "#93d9d9"},
		{backgroundColor: "#f1f2f4"},
		{backgroundColor: "#ffe29a"},
		{backgroundColor: "#86c7f3"}
	];
	
	public requestByTypeBarChart (data) {
		data.forEach(element => {
			this.requestsLabels.push(element.name[this.globalVars.LNG]);
			this.requestsDataOpen.push(element.open);
			this.requestsDataClose.push(element.close);
		});
		
	}
	
	recentlyAddedVehiclesDetailsColumns: string[] = ["equipment_number", "proc_status", "fleet_number", "green_disk_number", "equipment_type", "model_year",
		"manufacturer_id", "model_id", "color", "description"];
	recentlyAddedVehiclesDetailsDataSource = [];
	
	public recentlyAddedVehicles (data) {
		this.recentlyAddedVehiclesDetailsDataSource = data;
	}
	
	public openRecordInDrawer(row) {
		this.ngxSpinner.show("dashboard");
		let valueId = row.asset_id;
		this._dashboardService.getViewRoleModuleIds(valueId)
		.subscribe(data => {
			if (data.status == 200) {
				data.content.value_id = valueId; // Set record id
					this._dashboardService.openDrawerFromTableRecord(data.content);
				}
				this.ngxSpinner.hide("dashboard");
			});
	}
}
