import { Component, OnInit } from '@angular/core';
import { Label, MultiDataSet, Color } from "ng2-charts";
import { ChartType, ChartDataSets, ChartOptions, ChartScales, ChartColor, ScaleTitleOptions } from "chart.js";
import { GlobalVariables } from "src/app/global-variables.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
	selector: 'app-dashboard-service-manager',
	templateUrl: './dashboard-service-manager.component.html',
	styleUrls: ['./dashboard-service-manager.component.scss']
})
export class DashboardServiceManagerComponent implements OnInit {

	dashBoarDataCounts: any;
	dashBoardData: any;
	
	constructor( public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService, private _dashboardService: DashboardService ) { 
	}

	ngOnInit() {
		this.getDashBoardData();
	}

  	getDashBoardData () {
		this.ngxSpinner.show("dashboard");
		this._dashboardService.getWorkshopServiceManagerDashboardData()
			.subscribe(data => {
				if (data.status == 200) {
					this.dashBoardData = data.content;
					this.dashBoarDataCounts = {};
					this.dashBoarDataCounts['issue_summary'] = this.dashBoardData.issue_summary;
					this.dashBoarDataCounts['jobcard_summary'] = this.dashBoardData.jobcard_summary;
					this.setIssueSummary();
					this.setJobcardSummary();
					this.summaryOpenedUpcomingJobcads();
					// this.workingStaffServiceManagerOther();
					this.workingStaffServiceManager();
					this.notWorkingStaff();
				}
				this.ngxSpinner.hide("dashboard");
			});
	}
	  
	/**
	 * Issue Summary Doughunt
	 */
	issueSummary = [];
	issueSummaryData = [];
	issueSummaryChartLabels: Label[] = this.issueSummary;
	issueSummaryChartData: MultiDataSet = [
		this.issueSummaryData,
	];
	issueSummaryChartType: ChartType = "doughnut";
	issueSummaryColors = [
		{
			backgroundColor: []
		}
	];
	issueSummaryChartOptions: ChartOptions = {
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
	issueSummaryChartOptionsForMedium: ChartOptions = {
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
	 * Jobcard Summary Doughunt
	 */
	jobcardSummary = [];
	jobcardSummaryData = [];
	jobcardSummaryChartLabels: Label[] = this.jobcardSummary;
	jobcardSummaryChartData: MultiDataSet = [
		this.jobcardSummaryData,
	];
	jobcardSummaryChartType: ChartType = "doughnut";
	jobcardSummaryColors = [
		{
			backgroundColor: []
		}
	];
	jobcardSummaryChartOptions: ChartOptions = {
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
	jobcardSummaryChartOptionsForMedium: ChartOptions = {
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
	  
	public setIssueSummary () {
		let data = this._dashboardService.sortArrayBasedOnStatusesIds(this.dashBoarDataCounts.issue_summary);
		if(!data){
			return;
		}

		data.forEach(element => {
			this.issueSummary.push(element.status.name[this.globalVars.LNG]);
			this.issueSummaryData.push(element.count);
			this.issueSummaryColors[0].backgroundColor.push(element.status.color);
		});
	}

	public setJobcardSummary () {
		let data = this._dashboardService.sortArrayBasedOnStatusesIds(this.dashBoarDataCounts.jobcard_summary);
		if(!data){
			return;
		}

		data.forEach(element => {
			this.jobcardSummary.push(element.status.name[this.globalVars.LNG]);
			this.jobcardSummaryData.push(element.count);
			this.jobcardSummaryColors[0].backgroundColor.push(element.status.color);
		});
	}

	/**
	 *  Working Staff Service Manager Table
	*/
	workingStaffServiceManagerColumns: string[] = ["staff_name", "equipment_number", "manufacturer_id", "model_id", "issue_name", "issue_status"];
	workingStaffServiceManagerDataSource = [];

	workingStaffServiceManager () {

		if(this.dashBoardData.workshop_staff_summary && this.dashBoardData.workshop_staff_summary.working_staff_service_manager) {
			this.workingStaffServiceManagerDataSource = this.dashBoardData.workshop_staff_summary.working_staff_service_manager;
		}
	}
	
	
	/**
	 *  Working Staff Service Manager Other Table
	*/
	// workingStaffServiceManagerOtherColumns: string[] = ["staff_name", "equipment_number", "issue_name", "issue_status", "jobcard_status"];
	// workingStaffServiceManagerOtherDataSource = [];

	// workingStaffServiceManagerOther () {

	// 	if(this.dashBoardData.workshop_staff_summary && this.dashBoardData.workshop_staff_summary.working_staff_service_manager_other){
	// 		this.workingStaffServiceManagerOtherDataSource = this.dashBoardData.workshop_staff_summary.working_staff_service_manager_other;
	// 	}
	// }
	
	
	/**
	 *  Unoccupied Working Staff Other Table
	*/
	notWorkingStaffColumns: string[] = ["staff_id", "staff_name"];
	notWorkingStaffDataSource = [];

	notWorkingStaff () {

		if(this.dashBoardData.workshop_staff_summary && this.dashBoardData.workshop_staff_summary.not_working_staff) {
			this.notWorkingStaffDataSource = this.dashBoardData.workshop_staff_summary.not_working_staff;
		}
	}
	
	/**
	 *  Summary Opened Upcoming Jobcards Table
	*/
	summaryOpenedUpcomingJobcadsColumns: string[] = ["bay", "equipment_number", "manufacturer_id", "model_id", "issue_count", "jobcard_status"];
	summaryOpenedUpcomingJobcadsDataSource = [];

	summaryOpenedUpcomingJobcads () {
		// data = JSON.parse('{"workshop_staff_summary":{"working_staff_service_manager":[],"working_staff_service_manager_other":[{"staff_name":{"en":"Workshop Staff 1","ar":"Workshop Staff 1"},"equipment_number":"DPD-V005159","issue_name":"Batteries Issue","issue_status":{"id":8,"name":{"en":"In Progress","ar":"دائر"},"color":"#ffc107"},"jobcard_status":{"id":0,"name":{"en":"Reported","ar":"ذكرت"},"color":"#ff9800"}},{"staff_name":{"en":"Workshop Staff 2","ar":"Workshop Staff 2"},"equipment_number":"","issue_name":"Window Motor Change","issue_status":{"id":1,"name":{"en":"Ready","ar":"جاهز"},"color":"#bdbdbd"},"jobcard_status":{"id":0,"name":{"en":"Reported","ar":"ذكرت"},"color":"#ff9800"}},{"staff_name":{"en":"Workshop Staff 1","ar":"Workshop Staff 1"},"equipment_number":"","issue_name":"dxgd","issue_status":{"id":0,"name":{"en":"Reported","ar":"ذكرت"},"color":"#ff9800"},"jobcard_status":{"id":0,"name":{"en":"Reported","ar":"ذكرت"},"color":"#ff9800"}}],"not_working_staff":[]},"jobcard_summary":[{"count":"7","status":{"id":0,"name":{"en":"Draft","ar":"مشروع"},"color":"#9e9e9e"}},{"count":"3","status":{"id":6,"name":{"en":"Closed","ar":"مغلق"},"color":"#8bc34a"}},{"count":"3","status":{"id":1,"name":{"en":"Ready","ar":"جاهز"},"color":"#9e9e9e"}},{"count":"1","status":{"id":4,"name":{"en":"In Progress","ar":"المتقدمة"},"color":"#ffc107"}}],"opened_upcoming_jobcards":[{"id":4081,"equipment_number":"DPD-V004566","manufacturer_id":{"en":"TOYOTA","ar":"TOYOTA"},"model_id":{"en":"HIACE","ar":"HIACE"},"issue_status":[{"count":"1","status":{"id":1,"name":{"en":"Ready","ar":"جاهز"},"color":"#bdbdbd"}}],"staff_assigned":[{"name":{"en":"Workshop Staff 1","ar":"Workshop Staff 1"},"id":"3988"}]},{"id":4106,"equipment_number":"DPD-V005172","manufacturer_id":{"en":"CHEVROLET","ar":"CHEVROLET"},"model_id":{"en":"G CARGO VAN","ar":"G CARGO VAN"},"issue_status":[{"count":"1","status":{"id":1,"name":{"en":"Ready","ar":"جاهز"},"color":"#bdbdbd"}}],"staff_assigned":[{"name":{"en":"Workshop Staff 2","ar":"Workshop Staff 2"},"id":"3989"}]},{"id":4180,"equipment_number":"DPD-V004637","manufacturer_id":{"en":"NISSAN","ar":"NISSAN"},"model_id":{"en":"PICK-UP","ar":"PICK-UP"},"issue_status":[{"count":"2","status":{"id":0,"name":{"en":"Reported","ar":"ذكرت"},"color":"#ff9800"}}],"staff_assigned":[{"name":{"en":"Workshop Staff 2","ar":"Workshop Staff 2"},"id":"3989"},{"name":{"en":"Workshop Staff 3","ar":"Workshop Staff 3"},"id":"4047"}]}],"issue_summary":[{"count":"3","status":{"id":8,"name":{"en":"In Progress","ar":"دائر"},"color":"#ffc107"}},{"count":"119","status":{"id":0,"name":{"en":"Reported","ar":"ذكرت"},"color":"#ff9800"}},{"count":"2","status":{"id":2,"name":{"en":"Parts Reservation Requested","ar":"مطلوب حجز قطع غيار"},"color":"#bdbdbd"}},{"count":"12","status":{"id":1,"name":{"en":"Ready","ar":"جاهز"},"color":"#bdbdbd"}},{"count":"13","status":{"id":3,"name":{"en":"Parts Under Procurement","ar":"قطع غيار قيد الشراء"},"color":"#29b6f6"}},{"count":"1","status":{"id":9,"name":{"en":"Closed","ar":"مغلق"},"color":"#8bc34a"}},{"count":"2","status":{"id":4,"name":{"en":"Parts Reserved","ar":"الأجزاء المحجوزة"},"color":"#29b6f6"}}]}')
		if(this.dashBoardData.opened_upcoming_jobcards) {
			this.summaryOpenedUpcomingJobcadsDataSource = this.dashBoardData.opened_upcoming_jobcards;
		}
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
