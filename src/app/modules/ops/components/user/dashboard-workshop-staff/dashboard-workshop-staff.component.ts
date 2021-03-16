import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-dashboard-workshop-staff',
  templateUrl: './dashboard-workshop-staff.component.html',
  styleUrls: ['./dashboard-workshop-staff.component.scss']
})
export class DashboardWorkshopStaffComponent implements OnInit {

    // dashBoarDataCounts: any;
	dashBoardData: any;
    recentIssuesColumns: string[] = ["equipment_number", "manufacturer_id", "model_id", "issue_name", "priority", "repair_type",
        "symptom", "estimated_time", "actual_time", "start_time", "status"];
    upcomingIssuesColumns: string[] = ["equipment_number", "manufacturer_id", "model_id", "issue_name", "priority", "repair_type",
        "symptom", "estimated_time", "actual_time", "start_time", "status"];
        
	constructor (private _dashboardService: DashboardService, public globalVars: GlobalVariables, private ngxSpinner: NgxSpinnerService) {
	}
	
	ngOnInit () {
		this.getDashBoardData();
	}
	
	public getDashBoardData () {
		this.ngxSpinner.show("dashboard");
		this._dashboardService.getWorkshopStaffDashboardData()
			.subscribe(data => {
				if (data.status == 200) {
					// data.content = JSON.parse('{"upcoming_issues":[],"recent_issues":[{"id":4099,"equipment_number":"DPD-V005172","manufacturer_id":{"en":"CHEVROLET","ar":"CHEVROLET"},"model_id":{"en":"G CARGO VAN","ar":"G CARGO VAN"},"issue_name":"Tyre Change","priority":{"en":"Urgent","ar":"ملح"},"repair_type":{"en":"PM","ar":""},"symptom":"","estimated_time":"02:00:00","actual_time":"00:01:17","status":{"en":"Closed","ar":"مغلق"},"start_time":"2020-04-02T22:02:52.320","vehicle_component":"Breaks"}]}')
					this.dashBoardData = data.content;
				}
				this.ngxSpinner.hide("dashboard");
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
