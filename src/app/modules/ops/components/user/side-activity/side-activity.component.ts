import { Component, OnInit, ViewChild, Input, ElementRef, ContentChild, Directive, TemplateRef } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { EditItemService } from '../edit-drawer/edit-item.service';
import { NgxSpinnerService } from "ngx-spinner";
import { SnackbarService } from "src/app/modules/core/shared/services/snackbar/snackbar.service";
import { FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { SpinnerSnackbarService } from "src/app/modules/core/shared/components/spinner-snackbar/spinner-snackbar.service";
import { ModuleDataService } from '../module-data/module-data.service';
import { timer } from 'rxjs';

@Component({
	selector: 'app-side-activity',
	templateUrl: './side-activity.component.html',
	styleUrls: ['./side-activity.component.scss']
})

export class SideActivityComponent implements OnInit {

	@Input() data;
	public activityData;
	public activityFiltered;
	public activityTypes: any[];
	public activeChipIndex;
	public activeChipType;
	public activeChipTemplate;
	public emptyState: string;
	public fileListForDownload: any = [];
	public attachments: any = [];
	public activityForm: FormGroup;
	public activityFormControlName: string;
	public ifFile: boolean;
	public fileData: File;
	public downloadFileUrl: any;
	public downloadFilename: any;
	@Input() moduleStatuses: any;
	@Input() editOverview: any;
	public name: any;
	public currentApplicationName: any;
	public statusArray: any = [];
	@ViewChild('scrollActivity', { static: false }) activityScrollContainer: ElementRef;

	constructor(
		public globalVars: GlobalVariables,
		private editItemService: EditItemService,
		private ngxSpinner: NgxSpinnerService,
		public snackBarService: SnackbarService,
		private formBuilder: FormBuilder,
		public spinnerSnackBarService: SpinnerSnackbarService,
		public moduleDataService: ModuleDataService,
	) { }

	ngOnInit() {
		this.fetchActivity();
		this.activityTypes = [
			{
				en: this.globalVars.translation["all"].en,
				ar: this.globalVars.translation["all"].ar,
			},
			{
				en: this.globalVars.translation["attachment"].en,
				ar: this.globalVars.translation["attachment"].ar
			},
			{
				en: this.globalVars.translation["Log"].en,
				ar: this.globalVars.translation["Log"].ar,
			},
			{
				en: this.globalVars.translation["comment"].en,
				ar: this.globalVars.translation["comment"].ar,
			}
		];
		this.activityData = [];
		this.activityFiltered = [];
		this.emptyState = 'no_result';
		this.name = JSON.parse(window.localStorage.getItem("user_info")).name;
		this.currentApplicationName = this.globalVars.getCurrentApplicationName();
		this.defaultactivityFormControlName();
	}

	ngAfterViewInit() {
		timer(0).subscribe( _ => {
			this.activeChipType = 'all';
			this.activeChipIndex = 0;
		})
	}

	public fetchActivity() {
		this.ngxSpinner.show("activity");
		this.editItemService.getActivityList(this.data.id)
			.subscribe((data) => {
				if (data.content) {
					this.activityData = data.content;
					this.activityFiltered = this.activityData;
					if (this.activeChipType === 'attachment') {
						this.initActivityData(this.activeChipIndex, this.activeChipType);
					}
					this.activityFiltered = this.sortByDateTime(this.activityFiltered);
					console.log('activityData', this.activityData);
				}
				this.ngxSpinner.hide("activity");
			});
	}

	public initActivityData(index, type) {
		this.activeChipIndex = index;
		type = type.toLowerCase();
		this.activityFiltered = [];
		this.activeChipType = type;
		this.resetActivityForm();
		this.enableFormControl();

		switch (type) {
			case "all":
				type = "all";
				this.emptyState = 'no_result';
				this.createCommentFormControl();
				break;
			case "attachment":
				this.emptyState = 'no_attachment';
				this.createAttachmentFormControl();
			break;
			case "log":
				this.emptyState = 'no_result';
				this.disableFormControl();
				break;
			case "comment":
				this.emptyState = 'no_comments';
				this.createCommentFormControl();
			break;
		}


		if (type === 'all') {
			this.activityFiltered = this.activityData;
		} else {
			this.activityFiltered = this.activityData.filter(activity => activity.type === type);

			if (type === 'log') {
				this.getStatusLog();
			}
		}
	}

	// ************************ Logs Starts************************
	/**
	 * getStatusLog
	 */
	public getStatusLog() {
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

				for (let j = 0; j < this.activityFiltered.length; j++) {
					if (this.activityFiltered[j].updatedValue.status == cloneParameter[index]) {
						let obj = {
							id: this.activityFiltered[j].id,
							createdAt: this.activityFiltered[j].createdAt,
							status: cloneParameter[index]
						};

						vlogStatus2.push(obj);
					}
				}
			}

			this.atttachToStatusToTime(cloneParameter, vlogStatus2);
		}

	}


	public atttachToStatusToTime(cloneParameter, vlogStatus2) {
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

	public formatDate(date) {
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


	public compileStatus(sttusObj) {
		let obj = {
			id: sttusObj.id,
			name: sttusObj.name,
			color: sttusObj.color
		};

		return obj;
	}

	public getTotalTimeSpent(vlogStatusArray) {
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


	public getTimeDifference(date1, date2) {
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


	public DacCalculater(hoursDifference, offDays = 0) {
		var Days = Math.floor(hoursDifference / 24);
		var Remainder = hoursDifference % 24;
		var Hours = Math.floor(Remainder);
		let result = hoursDifference < 24 ? hoursDifference + 'd' : Days - offDays + 'd';
		return result ? result : 0;
	}


	public getStartEndDate(dateArray: any, datetype: any) {
		let result: any;
		let onlyDates = dateArray.map(d => (new Date(d.createdAt).getTime() / 1000));
		if (datetype == 's')
			result = Math.min(...onlyDates);
		else
			result = Math.max(...onlyDates);

		// result=this.formatDate(new Date(result*1000))

		return (isNaN(new Date(result * 1000).getTime()) ? false : this.formatDate(new Date(result * 1000)));


	}
	public isWeekend(date1, date2) {
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
	// ************************ Logs Ends************************


	// ************************ Files Starts************************
	public downloadAttachment(attachment) {
		let downloadFileUrl = `${this.globalVars.getAPIBaseUrl()}/attachment/download/${attachment.id}`;
		let name = attachment.name;
		this.downloadFile(downloadFileUrl, name);
	}

	public downloadFile(downloadFileUrl, name?) {
		this.downloadFileUrl = downloadFileUrl;
		this.downloadFilename = name;
		this.spinnerSnackBarService.open(this.globalVars.translation["Downloading"][this.globalVars.LNG]);
		setTimeout(() => {
			this.editItemService.downloadFile(this.downloadFileUrl).subscribe( _ => {
				document.getElementById("downloadPdfA").click();
				this.ngxSpinner.hide("edit");
			});
		}, 100);
	}

	public uploadAttachment() {
		let formData: FormData = new FormData();
		formData.append("file", this.fileData, this.fileData.name);
		formData.append("value", JSON.stringify({ title: this.activityForm.value.comment }));
		formData.append("valueId", this.data.id);
		this.ngxSpinner.show("activity");
		
		this.editItemService.uploadAttachment(formData)
			.subscribe((data) => {
				if (data.content) {
					this.snackBarService.open(this.globalVars.translation["File uploaded successfully"][this.globalVars.LNG]);
					this.fetchActivity();
					this.removeFile();
					this.activeChipType === 'all' ? this.createCommentFormControl() : this.createAttachmentFormControl();
				}
			});
	}

	public onSelectedFilesChanged(files) {
		let title;
		
		title = this.ifFormControlHasValue();
		this.enableFormControl();
		this.createAttachmentFormControl();
		if (files) {
			this.fileData = <File>files[0];
			setTimeout( _ => {
				(<HTMLInputElement>document.getElementById("chooseFile")).innerHTML = files[0].name;
				this.ifFile = true;
				this.activityForm.patchValue({
					file: this.fileData,
					comment: title ? title : files[0].name
				});
			}, 10)

		} else {
			this.ifFile = false;
			this.activityForm.patchValue({
				file: null
			});
		}
	}

	public removeFile() {
		this.ifFile = false;
		this.fileData = null;
		if((<HTMLInputElement>document.getElementById("chooseFile"))) {
			(<HTMLInputElement>document.getElementById("chooseFile")).innerHTML = '';
		}
		this.activityForm.patchValue({
			comment: "",
			file: null
		});
	}

	public toggleInput() {
		if (!this.ifFile) {
			(<HTMLInputElement>document.querySelector('input.selected-file')).click();
		}
		this.ifFile = !this.ifFile;
	}

	/**
	 * Creates Form Control as attachment for activityForm
	 */
	public createAttachmentFormControl() {
		this.activityForm = this.formBuilder.group({
			comment: ["", Validators.required], // here comment is equivalent to fileTitle
			file: ["", Validators.required]
		});
	}
	
	/**
	 * Creates Form Control as comment for activityForm
	 */
	public createCommentFormControl() {
		this.activityForm = this.formBuilder.group({
			comment: ["", Validators.required]
		});
	}
	
	/**
	 * Default Form Control for activityForm
	 */
	public defaultactivityFormControlName() {
		this.activityFormControlName = "comment"; // by default

		if (!this.ifFile && this.activityForm && !this.activityForm.controls.hasOwnProperty("comment") || !this.activityForm) {
			this.activityForm = this.formBuilder.group({
				comment: ["", Validators.required]
			});
		}
	}
	// ************************ Files Ends************************

	/**
	 * Reset Form Group activityForm and file attached (if any)
	 */
	public resetActivityForm() {
		this.activityForm.reset();
		this.ifFile = false;
		this.fileData = null;
	}

	public submitActivityForm() {
		if(this.activityForm.invalid) {
			return;
		}

		this.ifFile ? this.uploadAttachment() : this.postComment();

		this.resetActivityForm();
	}

	public postComment() {
		let data = {
			moduleValueId: this.data.id,
			comment: this.activityForm.get('comment').value,
			status: 'sending'
		};
		this.activityForm.patchValue({
			comment: null
		});
		this.editItemService.chatUpdate(data)
			.subscribe((data) => {
				if (data.content) {
					data.content.type = 'comment';
					this.activityFiltered.push(data.content);
					this.activityFiltered = this.sortByDateTime(this.activityFiltered);
					setTimeout(() => {
						data.status = 'sent';
					}, 200);
					this.scrollToTop();
				}
			});
	}

	public ifFormControlHasValue(): string {
		let value; 
		if(this.activityForm.controls.hasOwnProperty("comment") && this.activityForm.controls.comment.value !== '') {
			value = this.activityForm.controls.comment.value;
		}
		
		return value;
	}

	public disableFormControl() {

		if(this.activityForm.controls.hasOwnProperty("comment")) {
			this.activityForm.controls.comment.disable();
		}
	}

	public enableFormControl() {
		
		if(this.activityForm.controls.hasOwnProperty("comment")) {
			this.activityForm.controls.comment.enable();
		}
	}

	public sortByDateTime(array) {
		return array.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
	}

	public scrollToTop() {
		setTimeout(() => {
			this.activityScrollContainer.nativeElement.scrollTop = 0;
		}, 10);
	}
}