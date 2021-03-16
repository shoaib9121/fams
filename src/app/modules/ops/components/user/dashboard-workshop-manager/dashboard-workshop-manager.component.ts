import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet, Color } from "ng2-charts";
import { ChartType, ChartDataSets, ChartOptions, ChartScales, ChartColor, ScaleTitleOptions } from "chart.js";
import { GlobalVariables } from "src/app/global-variables.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DashboardService } from "../dashboard/dashboard.service";

@Component({
	selector: 'app-dashboard-workshop-manager',
	templateUrl: './dashboard-workshop-manager.component.html',
	styleUrls: ['./dashboard-workshop-manager.component.scss']
})
export class DashboardWorkshopManagerComponent implements OnInit {

	public dashBoarDataCounts: any;
	public dashBoardData: any;
	public showOccupancy;
	public activeChipIndex;
	constructor( public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService, 
		private _dashboardService: DashboardService) { 
	}

	ngOnInit() {
		this.getDashBoardData();
	}

	getDashBoardData () {
		this.ngxSpinner.show("dashboard");
		this._dashboardService.getWorkshopManagerDashboardData()
			.subscribe(data => {
				if (data.status == 200) {
					this.dashBoardData = data.content;
					this.dashBoarDataCounts = {
						jobcard_info: this.dashBoardData.jobcard_info,
						issue_detail: this.dashBoardData.issue_detail,
						total_issues: this.dashBoardData.total_issues,
						total_internal_jobcards: this.dashBoardData.total_internal_jobcards,
						total_external_jobcards: this.dashBoardData.total_external_jobcards,
					};
					this.setJobcardInfo();
					this.setIssueDetails();
					this.toggleOccupancy();
					this.summaryOpenedUpcomingJobcads();
					this.notWorkingStaff();
					this.bayDetailsTable();
				}
				this.ngxSpinner.hide("dashboard");
			});
	}

	jobcardInfo = [];
	jobcardInfoData = [];
	jobcardInfoChartLabels: Label[] = this.jobcardInfo;
	jobcardInfoChartData: MultiDataSet = [
		this.jobcardInfoData,
	];
	jobcardInfoChartType: ChartType = "doughnut";
	jobcardInfoColors = [
		{
			backgroundColor: []
		}
	];
	jobcardInfoChartOptions: ChartOptions = {
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
	jobcardInfoChartOptionsForMedium: ChartOptions = {
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
	

	issueDetails = [];
	issueDetailsData = [];
	issueDetailsChartLabels: Label[] = this.issueDetails;
	issueDetailsChartData: MultiDataSet = [
		this.issueDetailsData,
	];
	issueDetailsChartType: ChartType = "doughnut";
	issueDetailsChartColors = [
		{
			backgroundColor: []
		}
	];
	issueDetailsChartOptions: ChartOptions = {
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
	issueDetailsChartOptionsForMedium: ChartOptions = {
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
	
	

	baySummary = [];
	baySummaryData = [];
	baySummaryChartLabels: Label[] = this.baySummary;
	baySummaryChartData: MultiDataSet = [
		this.baySummaryData,
	];
	baySummaryChartType: ChartType = "doughnut";
	baySummaryChartOptions: ChartOptions = {
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
	baySummaryChartOptionsForMedium: ChartOptions = {
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
	 * Bay Summary Bar
	*/
	baySummaryBarChartType: ChartType = 'bar';
	baySummaryBarChartLabels: Label[];
	baySummaryBarChartData: ChartDataSets[];
	baySummaryBarChartColors: Color[];
	baySummaryBarChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'bottom',
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
					// callback : (value, index, values) => {
					// 	return value.slice(0, 12)+(value.length > 12 ? '...' : '');
					// }
				}
			}],
			yAxes: [{
				gridLines: {
					offsetGridLines: true
				},
			}],
		}
	};

	
	/**
	 *  Not Working Staff Other Table
	*/
	notWorkingStaffColumns: string[] = ["staff_id", "staff_name"];
	notWorkingStaffDataSource = [];

	notWorkingStaff () {

		if(this.dashBoardData.unassigned_service_managers) {
			this.notWorkingStaffDataSource = this.dashBoardData.unassigned_service_managers;
		}
	}

	/**
	 *  Summary Opened Upcoming Jobcards Table
	*/
	summaryOpenedUpcomingJobcadsColumns: string[] = ["bay", "equipment_number", "manufacturer_id", "model_id", "issue_count", "jobcard_status"];
	summaryOpenedUpcomingJobcadsDataSource = [];

	summaryOpenedUpcomingJobcads () {
		if(this.dashBoardData.opened_upcoming_jobcards) {
			this.summaryOpenedUpcomingJobcadsDataSource = this.dashBoardData.opened_upcoming_jobcards;
		}
	}

	/**
	 *  Bay Details Table
	*/
	bayDetailsTableColumns: string[] = ["bay", "equipment_number", "manufacturer_id", "model_id", "issue_count", "jobcard_status", "service_manager"];
	bayDetailsTableDataSource = [];

	bayDetailsTable () {
		if(this.dashBoardData.bay_details) {
			this.bayDetailsTableDataSource = this.dashBoardData.bay_details;
		}
	}

	public initBaySummaryBarChart (chip, i) {
		this.activeChipIndex = i;
		this.baySummaryBarChartLabels = []
		this.baySummaryBarChartLabels.push(chip.bay_details.name);
		let datasets = [];
		let summary = chip.jobcard_summary;
		summary = this._dashboardService.sortArrayBasedOnStatusesIds(summary);
		summary.forEach( (status, index) => {
			let dataset = {
				data: null,
				label: ''
			}
			let colorSet = {
				backgroundColor: null,
			}
			dataset.data = [status.count];
			dataset.label = status.status.name[this.globalVars.LNG];
			colorSet.backgroundColor = status.status.color;
			this.baySummaryBarChartColors[index] = colorSet;
			datasets.push(dataset);
		});
		this.baySummaryBarChartData = datasets;
	}

	public initBaySummaryDailyStatsBarChart () {

		this.dashBoardData.bay_summary_daily_statistics.forEach( (baySummary) => {
			this.maxJCPerDay.push(+baySummary.max_jc_per_day);
			this.jobcardCount.push(+baySummary.jobcard_count);
			this.baySummaryBarChartLabels.push(baySummary.bay)
		});

		if(this.showOccupancy) {
			this.baySummaryBarChartData = [
				{
					data: this.maxJCPerDay,
					label: this.globalVars.translation["max_jc_per_day"][this.globalVars.LNG]
				},
				{
					data: this.jobcardCount,
					label: this.globalVars.translation["assigned_jobcards"][this.globalVars.LNG]
				}
			];
		} 
	}

	public baySummaryChips = [];
	public maxJCPerDay = [];
	public jobcardCount = [];
	public setBaySummaryChips () {
		this.baySummaryChips = [];
		this.dashBoardData.bay_summary.forEach( (baySummary) => {
			this.baySummaryChips.push(baySummary);
		});
		this.initBaySummaryBarChart(this.baySummaryChips[0], 0);
	}
	
	public toggleOccupancy () {
		this.baySummaryBarChartLabels = []
		this.baySummaryBarChartColors = [];
		this.baySummaryBarChartData = [];
		this.showOccupancy ? this.initBaySummaryDailyStatsBarChart() : this.setBaySummaryChips();
	}
	
	public setJobcardInfo () {
		let data = this._dashboardService.sortArrayBasedOnStatusesIds(this.dashBoarDataCounts.jobcard_info);
		data.forEach( element => {
			this.jobcardInfo.push(element.status.name[this.globalVars.LNG]);
			this.jobcardInfoData.push(element.count);
			this.jobcardInfoColors[0].backgroundColor.push(element.status.color);
		});
	}
	
	public setIssueDetails () {
		let data = this._dashboardService.sortArrayBasedOnStatusesIds(this.dashBoarDataCounts.issue_detail);
		data.forEach(element => {
			this.issueDetails.push(element.status.name[this.globalVars.LNG]);
			this.issueDetailsData.push(element.count);
			this.issueDetailsChartColors[0].backgroundColor.push(element.status.color);
		});
	}

	public openRecordInDrawer(row) {
		this.ngxSpinner.show("dashboard");
		let valueId = row.id;
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
