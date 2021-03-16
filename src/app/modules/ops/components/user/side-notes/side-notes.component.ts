import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from 'src/app/global-variables.service';
import { EditItemService } from '../edit-drawer/edit-item.service';
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpinnerSnackbarService } from 'src/app/modules/core/shared/components/spinner-snackbar/spinner-snackbar.service';
import { ModuleDataService } from '../module-data/module-data.service';


@Component({
	selector: 'app-side-notes',
	templateUrl: './side-notes.component.html',
	styleUrls: ['./side-notes.component.scss']
})
export class SideNotesComponent implements OnInit {


	/**
	 * Log of item
	 */
	public itemLog: any;
	public userName: any;
	/**
	 * Comments of item
	 */
	public comments: any = [];
	statusArray: any = [];
	name: any;
	currentApplicationName: any;

	/**
	 * Provided if whe need to show an overview ("=small dashboard") in this component
	 */

	/**
	* Form Group for chat form
	*/
	public chatForm: FormGroup;

	@ViewChild('scrollChat', {static: false}) chatScrollContainer: ElementRef;

	@Input() editOverview: any;
	@Input() data;
	@Input() moduleStatuses: any;
	drawerTitle: any;


	constructor(
		public globalVars: GlobalVariables,
		private editItemService: EditItemService,
		public snackBarService: SnackbarService,
		private formBuilder: FormBuilder,
		public spinnerSnackBarService: SpinnerSnackbarService,
		public moduleDataService: ModuleDataService,
	) {
		this.drawerTitle = this.globalVars.translation["Update_" + this.globalVars.getCurrentApplicationName()][this.globalVars.LNG];

	}

	ngOnInit() {
		this.createChatForm();
		this.fetchComments();
		this.fetchLog();
		this.name = JSON.parse(window.localStorage.getItem("user_info")).name;
		this.currentApplicationName = this.globalVars.getCurrentApplicationName();

	}

	fetchComments() {
		this.editItemService.getChatList(this.data.id)
			.subscribe((data) => {
				if (data.status == 200) {
					this.comments = data.content;
				}
				this.scrollToBottom();
			});
	}

	fetchLog() {
		this.editItemService.getLogList(this.data.id)
			.subscribe((data) => {
				if (data.status == 200) {
					this.itemLog = data.content;
					console.log('log', this.itemLog);

					this.getStatusLog();
				}
			});
	}

	/**
	   * getStatusLog
	   */
	getStatusLog() {
		if (!this.editOverview || (this.editOverview && this.editOverview.length == 0)) {
			return;
		}

		let cloneEditOverView = this.editOverview.slice();

		let vlogStatus2: any = [];

		if (cloneEditOverView[0].overview.type == "diff_date") {
			let cloneParameter = cloneEditOverView[0].overview.parameters.slice();

			//extracting status object form statuses array

			/**
			 * getting value loges form array
			 */
			for (let index = 0; index < cloneParameter.length; index++) {

				for (let j = 0; j < this.itemLog.length; j++) {
					if (this.itemLog[j].updatedValue.status == cloneParameter[index]) {
						let obj = {
							id: this.itemLog[j].id,
							createdAt: this.itemLog[j].createdAt,
							status: cloneParameter[index]
						};

						vlogStatus2.push(obj);
					}
				}
			}

			this.atttachToStatusToTime(cloneParameter, vlogStatus2);
		}


	}


	atttachToStatusToTime(cloneParameter, vlogStatus2) {
		let vlogStatus: any = [];
		for (let index = 0; index < cloneParameter.length; index++) {
			for (let k = 0; k < this.moduleStatuses.length; k++) {
				if (this.moduleStatuses[k].id == cloneParameter[index]) {

					let obj = {
						status: this.compileStatus(this.moduleStatuses[k]),
						timeSpent: vlogStatus2.filter(f => f.status == this.moduleStatuses[k].id),

					};

					vlogStatus.push(obj);
				}

			}

		}

		this.getTotalTimeSpent(vlogStatus);

		this.statusArray = vlogStatus;
		for (let index = 0; index < this.statusArray.length; index++) {
			const element = this.statusArray[index];
			element.startDate = this.getStartEndDate(element.timeSpent, 's');
			element.endDate = this.getStartEndDate(element.timeSpent, 'e');
			element.offDays = this.isWeekend(element.startDate, element.endDate);

		}
		// console.log("status list",this.moduleStatuses[2]);
		console.log("status list", this.statusArray);

	}

	formatDate(date) {
		var monthNames = [
			"January", "February", "March",
			"April", "May", "June", "July",
			"August", "September", "October",
			"November", "December"
		];

		var day = date.getDate();
		var monthIndex = date.getMonth();
		var year = date.getFullYear();

		return day + ' ' + monthNames[monthIndex] + ' ' + year;
	}


	compileStatus(sttusObj) {
		let obj = {
			id: sttusObj.id,
			name: sttusObj.name,
			color: sttusObj.color
		};

		return obj;
	}

	getTotalTimeSpent(vlogStatusArray) {
		let vlogStatus = vlogStatusArray;


		for (let index = 0; index < vlogStatus.length; index++) {
			const element = vlogStatus[index].timeSpent;
			// element.totalTimeSpent = 0;
			let totalTimeSpent = 0;

			// =element.map((a,b)=>this.getTimeDifference(a.createdAt,b.createdAt))
			for (let k = 0; k < element.length - 1; k++) {
				// console.log('time',element[k])
				if (element[k]) {
					let a = element[k].createdAt ? element[k].createdAt : new Date().getTime();
					let b = element[k + 1].createdAt ? element[k + 1].createdAt : new Date().getTime();
					// console.log('time',element[k])
					// element.totalTimeSpent = element.totalTimeSpent + this.getTimeDifference(a, b);
					totalTimeSpent = totalTimeSpent + this.getTimeDifference(a, b);

					vlogStatus[index].totalTimeSpent = totalTimeSpent
				}
			}

		}
		// console.log("vlog status list after calculation",vlogStatus)
	}


	getTimeDifference(date1, date2) {
		date1 = new Date(date1);
		date2 = new Date(date2);
		var difference = 0;
		if (date1 < date2)
			difference = date2.getTime() - date1.getTime();
		else
			difference = date1.getTime() - date2.getTime();

		//     var daysDifference = Math.floor(difference/1000/60/60/24);
		//     difference -= daysDifference*1000*60*60*24;

		var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
		difference -= hoursDifference * 1000 * 60 * 60;

		var minutesDifference = Math.floor(difference / 1000 / 60);
		// difference -= minutesDifference*1000*60

		// var secondsDifference = Math.floor(difference/1000);


		return hoursDifference;
	}


	DacCalculater(hoursDifference, offDays = 0) {
		var Days = Math.floor(hoursDifference / 24);
		var Remainder = hoursDifference % 24;
		var Hours = Math.floor(Remainder);
		let result = hoursDifference < 24 ? hoursDifference + 'd' : Days - offDays + 'd';
		return result ? result : 0;
	}


	getStartEndDate(dateArray: any, datetype: any) {
		let result: any;
		let onlyDates = dateArray.map(d => (new Date(d.createdAt).getTime() / 1000));
		if (datetype == 's')
			result = Math.min(...onlyDates);
		else
			result = Math.max(...onlyDates);

		// result=this.formatDate(new Date(result*1000))

		return (isNaN(new Date(result * 1000).getTime()) ? false : this.formatDate(new Date(result * 1000)));


	}
	isWeekend(date1, date2) {
		var d1 = new Date(date1),
			d2 = new Date(date2),
			isWeekend = false;
		var totalOffDays = 0;

		while (d1 < d2) {
			var day = d1.getDay();
			isWeekend = (day === 6) || (day === 5);
			if (isWeekend) { totalOffDays++ } // return immediately if weekend found
			d1.setDate(d1.getDate() + 1);
		}
		return totalOffDays;
	}

	/**
	 * Creates Form Control for chat form
	 */
	createChatForm() {
		this.chatForm = this.formBuilder.group({
			comment: ['']
		});
	}


	postComment() {
		let data = {
			moduleValueId: this.data.id,
			comment: this.chatForm.get('comment').value,
			status: 'sending'
		};
		this.chatForm.patchValue({
			comment: null
		});
		this.editItemService.chatUpdate(data)
			.subscribe((response) => {
				if (response.status == 200) {
					data['createdAt'] = response.content.createdAt;
					this.comments.push(data);
					setTimeout(() => {
						data.status = 'sent';
					}, 200);
					this.scrollToBottom();
				}
			});
	}

	scrollToBottom() {
		setTimeout(() => {
			this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
		}, 10);
	}

	getKeys(element) {
		return Object.keys(element);
	}


	getValidFields(element1, element2) {
		let keys = Object.keys(element1);
		let count = 0;
		keys.forEach(function (value) {
			if (value != 'status') {
				if (element1[value] != '' && element2[value] != '') {
					count++;
				}
			}
		});
		return count;
	}


	getUpdatedBy(updatedBy) {
		if (updatedBy == this.name[this.globalVars.LNG].toLowerCase()) {
			return this.globalVars.translation["You"][this.globalVars.LNG];
		}

		return updatedBy;
		//return  (updatedBy === this.userName[this.globalVars.LNG].toLowerCase()) ? this.globalVars.translation["You"][this.globalVars.LNG] : updatedBy;
	}

	checkKeyStatus(element) {
		return element.hasOwnProperty("status");
	}


}
