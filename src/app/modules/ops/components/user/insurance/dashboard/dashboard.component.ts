import {Component, OnInit} from '@angular/core';
import {Label, MultiDataSet, Color} from 'ng2-charts';
import {ChartType, ChartDataSets, ChartOptions} from 'chart.js';
import {NgxSpinnerService} from "ngx-spinner";
import {DashboardService} from '../../../user/dashboard/dashboard.service';
import {GlobalVariables} from "../../../../../../global-variables.service";

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	
	dashBoarDataCounts: any;
	assetTypes: string[] = [];
	assetTypesData = [];
	avgCostDaysData = [];
	avgCostData = [];
	avgDaysData = [];
	claimDetailsDataSource = [];
	claimDetailsColumns: string[] = ['claim_no', 'claim_type', 'created_at', 'claim_status'];
	reimbursementLabels = [];
	reimbursementDataOpen = [];
	reimbursementDataClose = [];

	constructor(
		private ngxSpinner: NgxSpinnerService,
		public globalVars: GlobalVariables,
		private _dashboardService: DashboardService
	) {
	}
	
	/**
	 * Graph data for Reimbursement Requests
	 */
	reimbursementChartLabels: Label[] = this.reimbursementLabels;
	reimbursementChartData: ChartDataSets[] = [
		{
			data: this.reimbursementDataOpen,
			label: this.globalVars.translation["open"][this.globalVars.LNG]
		},
		{
			data: this.reimbursementDataClose,
			label: this.globalVars.translation["Close"][this.globalVars.LNG]
		}
	];
	reimbursementChartType: ChartType = 'bar';
	reimbursementChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'top',
			align: 'end',
			labels: {
				boxWidth: 10,
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
						return value.slice(0, 12) + (value.length > 12 ? '...' : '');
					}
				}
			}],
			yAxes: [{
				gridLines: {
					offsetGridLines: true
				}
			}],
		}
	};
	public reimbursementChartColors: Color[] = [
		{backgroundColor: '#9999FF'},
		{backgroundColor: 'rgb(103, 206, 23)'}
	];
	
	
	/**
	 * Graph data for Avarage Cost & Days to Settle a Claim
	 */
	settleClaimChartLabels: Label[] = this.assetTypes;
	settleClaimChartData: ChartDataSets[] = [
		{
			data: this.avgCostData,
			label: this.globalVars.translation["Cost"][this.globalVars.LNG]
		},
		{
			data: this.avgDaysData,
			label: this.globalVars.translation["Days"][this.globalVars.LNG]
		}
	];
	settleClaimChartType: ChartType = 'bar';
	settleClaimChartOptions: ChartOptions = {
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
						return value.slice(0, 12) + (value.length > 12 ? '...' : '');
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
	settleClaimChartColors: Color[] = [
		{backgroundColor: 'rgb(0, 168, 247)'},
		{backgroundColor: '#06B1B1'}
	];

	ngOnInit() {
		this.initDashboard();
	}
	
	/**
	 * Init Insurance Dashboard Data
	 *
	 */
	initDashboard() {
		this.ngxSpinner.show("dashboard");
		this._dashboardService.getInsuranceDashboardData()
		.subscribe(data => {
			this.dashBoarDataCounts = data.content;
			this.setAssetTypesData();
			this.setClaimDetailsData();
			this.setReimbursementData();
			this.setAvgCostDaysData();
			this.ngxSpinner.hide("dashboard");
		});
	}
	
	/**
	 * Graph data for Assured Amount by Claim Type
	 */
	assuredAmountChartLabels: Label[] = this.assetTypes;
	assuredAmountChartData: MultiDataSet = [
		this.assetTypesData,
	];
	assuredAmountChartType: ChartType = 'doughnut';
	assuredAmountChartColors = [
		{
			backgroundColor: []
		}
	];
	assuredAmountChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'right',
			labels: {
				boxWidth: 14,
				fontSize: 13,
				padding: 4,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	assuredAmountChartOptionsForXLarge: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'right',
			labels: {
				boxWidth: 14,
				fontSize: 14,
				padding: 8,
				fontFamily: this.globalVars.dubaiFont
			},
		}
	};
	
	private setAssetTypesData() {
		if (this.dashBoarDataCounts && this.dashBoarDataCounts.hasOwnProperty("assured_amount_by_asset_type")) {
			this.dashBoarDataCounts.assured_amount_by_asset_type.forEach(type => {
				this.assetTypes.push(type.asset_type[this.globalVars.LNG]);
				this.assetTypesData.push(type.total_sum_insured);
			});
		}
	}
	
	private setClaimDetailsData() {
		if (this.dashBoarDataCounts && this.dashBoarDataCounts.hasOwnProperty("claim_details")) {
			this.dashBoarDataCounts.claim_details.forEach(detail => {
				this.claimDetailsDataSource.push(detail);
			});
		}
	}
	
	private setAvgCostDaysData() {
		if (this.dashBoarDataCounts && this.dashBoarDataCounts.hasOwnProperty("Avg_cost_Avg_days")) {
			this.dashBoarDataCounts.Avg_cost_Avg_days.forEach(item => {
				this.avgCostDaysData.push(item);
				this.avgCostData.push(item.average_cost);
				this.avgDaysData.push(item.average_days);
			});
		}
	}
	
	private setReimbursementData() {
		if (this.dashBoarDataCounts && this.dashBoarDataCounts.hasOwnProperty("request_by_type_bar_chart")) {
			this.dashBoarDataCounts.request_by_type_bar_chart.forEach(type => {
				this.reimbursementLabels.push(type.request_type[this.globalVars.LNG]);
				this.reimbursementDataOpen.push(type.open);
				this.reimbursementDataClose.push(type.close);
			});
		}
	}

	public openRecordInDrawer(row) {
		this.ngxSpinner.show("dashboard");
		const valueId = row.id;
		this._dashboardService.getViewRoleModuleIds(valueId)
		.subscribe(data => {
			if (data.status === 200) {
				data.content.value_id = valueId; // Set record id
					this._dashboardService.openDrawerFromTableRecord(data.content);
				}
				this.ngxSpinner.hide("dashboard");
			});
	}
}
