import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet, Color } from "ng2-charts";
import { ChartType, ChartDataSets, ChartOptions, ChartScales, ChartColor, ScaleTitleOptions } from "chart.js";
import { GlobalVariables } from "src/app/global-variables.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DashboardService } from "../dashboard/dashboard.service";

@Component({
  selector: 'app-dashboard-store',
  templateUrl: './dashboard-store.component.html',
  styleUrls: ['./dashboard-store.component.scss']
})
export class DashboardStoreComponent implements OnInit {

	dashBoarDataCounts: any;
	dashBoardData: any;
	
	constructor( public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService, private _dashboardService: DashboardService ) { 
	}

	ngOnInit() {
		this.getDashBoardData();
	}

  	public getDashBoardData () {
		this.ngxSpinner.show("dashboard");
		this._dashboardService.getStoreDashboardData()
			.subscribe(data => {
				if (data.status == 200) {
					this.dashBoardData = data.content;
					this.dashBoarDataCounts = {};
					this.dashBoarDataCounts['stock_summary'] = this.dashBoardData.stock_summary;
					this.dashBoarDataCounts['order_summary'] = this.dashBoardData.order_summary;
					this.dashBoarDataCounts['delivered_parts'] = this.dashBoardData.delivered_parts;
					this.dashBoarDataCounts['under_procurement'] = this.dashBoardData.under_procurement;
					this.setStockSummary();
					this.setOrderSummary();
					this.setReservedPartsData();
					this.setOrderedParts();
					this.setStoreSummary();
				}
				this.ngxSpinner.hide("dashboard");
			});
	}
	  
	/**
	 * Stock Summary Doughunt
	 */
	stockSummary = [];
	stockSummaryData = [];
	stockSummaryChartLabels: Label[] = this.stockSummary;
	stockSummaryChartData: MultiDataSet = [
		this.stockSummaryData,
	];
	stockSummaryChartType: ChartType = "doughnut";
	stockSummaryColors = [
		{
			backgroundColor: []
		}
	];
	stockSummaryChartOptions: ChartOptions = {
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
	stockSummaryChartOptionsForMedium: ChartOptions = {
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

	/**
	 * Order Summary Doughunt
	 */
	orderSummary = [];
	orderSummaryData = [];
	orderSummaryChartLabels: Label[] = this.orderSummary;
	orderSummaryChartData: MultiDataSet = [
		this.orderSummaryData,
	];
	orderSummaryChartType: ChartType = "doughnut";
	orderSummaryColors = [
		{
			backgroundColor: []
		}
	];
	orderSummaryChartOptions: ChartOptions = {
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
	orderSummaryChartOptionsForMedium: ChartOptions = {
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


	/**
	 * Reserved Parts Bar
	*/

	public reservedPartsLabels = [];
	public stockQuantityData = [];
	public reservedQuantityData = [];

	reservedPartsChartLabels: Label[] = this.reservedPartsLabels;
	reservedPartsChartData: ChartDataSets[] = [
		{
			data: this.stockQuantityData,
			label: this.globalVars.translation["stock_quantity"][this.globalVars.LNG]
		},
		{
			data: this.reservedQuantityData,
			label: this.globalVars.translation["reserved_quantity"][this.globalVars.LNG]
		}
	];
	reservedPartsChartType: ChartType = 'bar';
	reservedPartsChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'top',
			align: 'end',
			labels: {
				boxWidth: 12,
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
						return value.slice(0, 12)+(value.length > 12 ? '...' : '');
					}
				}
			}],
			yAxes: [{
				gridLines: {
					offsetGridLines: true
				},
			}],
		}
	};
	reservedPartsChartColors: Color[] = [
		{backgroundColor: 'rgb(0, 168, 247)'},
		{backgroundColor: '#06B1B1'}
	];


	public setReservedPartsData() {
		if (this.dashBoardData && this.dashBoardData.hasOwnProperty("reserved_parts")) {
			this.dashBoardData.reserved_parts.forEach(type => {
				this.reservedPartsLabels.push(type.name);
				this.stockQuantityData.push(type.stock_quantity);
				this.reservedQuantityData.push(type.reserved_quantity);
			});
		}
	}

	public setStoreSummary() {
		if (this.dashBoardData && this.dashBoardData.hasOwnProperty("store_summary")) {
			this.dashBoarDataCounts['store_summary'] = {};
			this.dashBoarDataCounts['store_summary']['parts'] = this.dashBoardData.store_summary.parts;
			this.dashBoarDataCounts['store_summary']['vendors'] = this.dashBoardData.store_summary.vendors;
			this.dashBoarDataCounts['store_summary']['purchase_orders'] = this.dashBoardData.store_summary.purchase_orders;
		}
	}

	public setOrderedParts() {
		if (this.dashBoardData && this.dashBoardData.hasOwnProperty("ordered_parts")) {
			this.dashBoarDataCounts.ordered_parts = this.dashBoardData.ordered_parts;
		}
	}

	public setStockSummary () {
		let data = this.dashBoarDataCounts.stock_summary;
		data.forEach(element => {
			this.stockSummary.push(element.status.name[this.globalVars.LNG]);
			this.stockSummaryData.push(element.count);
			this.stockSummaryColors[0].backgroundColor.push(element.status.color);
		});
	}

	public setOrderSummary () {
		let data = this._dashboardService.sortArrayBasedOnStatusesIds(this.dashBoarDataCounts.order_summary);
		data.forEach(element => {
			this.orderSummary.push(element.status.name[this.globalVars.LNG]);
			this.orderSummaryData.push(element.count);
			this.orderSummaryColors[0].backgroundColor.push(element.status.color);
		});
	}
}
