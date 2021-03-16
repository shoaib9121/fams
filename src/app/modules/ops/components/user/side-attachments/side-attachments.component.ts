import { Component, OnInit, ViewChild, Input } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { GlobalVariables } from "src/app/global-variables.service";
import { EditItemService } from "../edit-drawer/edit-item.service";
import { NgxSpinnerService } from "ngx-spinner";
import { SnackbarService } from "src/app/modules/core/shared/services/snackbar/snackbar.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { SpinnerSnackbarService } from "src/app/modules/core/shared/components/spinner-snackbar/spinner-snackbar.service";


@Component({
	selector: "app-side-attachments",
	templateUrl: "./side-attachments.component.html",
	styleUrls: ["./side-attachments.component.scss"]
})
export class SideAttachmentsComponent implements OnInit {
	
	/**
	 * Attachments of item
	 */
	public attachments: any;
	
	/**
	 * FormGroup for attachment form
	 */
	public attachmentForm: FormGroup;
	
	@Input() data;
	downloadFileUrl: any;
	downloadFilename: any;
	ifFile: boolean;
	fileData: File;
	
	fileListForDownload: any = [];
	
	constructor (
		public globalVars: GlobalVariables,
		private editItemService: EditItemService,
		private ngxSpinner: NgxSpinnerService,
		public snackBarService: SnackbarService,
		private formBuilder: FormBuilder,
		public spinnerSnackBarService: SpinnerSnackbarService
	) {
	
	}
	
	ngOnInit () {
		this.fetchAttachments(this.data.id);
		this.createAttachmentForm();
	}
	
	/**
	 * Creates Form Control for attachment form
	 */
	createAttachmentForm () {
		this.attachmentForm = this.formBuilder.group({
			fileTitle: ["", Validators.required],
			file: ["", Validators.required]
		});
	}
	
	onSelectedFilesChanged (files) {
		if (files) {
			(<HTMLInputElement> document.getElementById("chooseFile")).innerHTML = files[0].name;
			this.ifFile = true;
			this.fileData = <File> files[0];
			this.attachmentForm.patchValue({
				file: this.fileData
			});
			
		} else {
			this.ifFile = false;
			this.attachmentForm.patchValue({
				file: null
			});
		}
	}
	
	removeFile () {
		this.ifFile = false;
		(<HTMLInputElement> document.getElementById("chooseFile")).innerHTML = this.globalVars.translation["Choose File"][this.globalVars.LNG];
		this.attachmentForm.patchValue({
			file: null
		});
	}
	
	uploadAttachment () {
		let formData: FormData = new FormData();
		formData.append("file", this.fileData, this.fileData.name);
		formData.append("value", JSON.stringify({title: this.attachmentForm.value.fileTitle}));
		formData.append("valueId", this.data.id);
		
		this.editItemService.uploadAttachment(formData)
			.subscribe((data) => {
				if (data.status == 200) {
					this.snackBarService.open(this.globalVars.translation["File uploaded successfully"][this.globalVars.LNG]);
					this.fetchAttachments(this.data.id);
					(<HTMLInputElement> document.getElementById("chooseFile")).innerHTML = "Choose file";
					this.ifFile = false;
					this.attachmentForm = this.formBuilder.group({
						fileTitle: [""],
						file: ["", Validators.required]
					});
				}
			});
	}
	
	fetchAttachments (id) {
		this.editItemService.getAttachementList(id)
			.subscribe((data) => {
				this.attachments = data.content;
			});
	}
	
	isChecked () {
		return this.fileListForDownload.length === this.attachments.length;
	};
	
	isIndeterminate () {
		return (this.fileListForDownload.length > 0 && !this.isChecked());
	};
	
	exists (attachment) {
		return this.fileListForDownload.find(c => {
			return c.id === attachment.id;
		}) != undefined;
	};
	
	selectAllToDownloadList (checked) {
		if (checked) {
			var l1 = this.fileListForDownload.length,
				l2 = this.attachments.length;
			if (l1 === l2) {
				this.fileListForDownload.splice(0, l1);
			} else if (l1 === 0 || l1 > 0) {
				this.fileListForDownload.splice(0, l2); // EMPTY ARRAY FIRST
				this.attachments.forEach(attachment => this.fileListForDownload.push(attachment));
			}
			
		} else {
			this.fileListForDownload.length = 0; // empty list on un-select all
		}
	}
	
	
	downloadAttachmentAsZip () {
		this.downloadFile(this.DownloadNowURI(), "files.zip");
	}
	
	DownloadNowURI () {
		let filedsArray = this.fileListForDownload.map(m => m.id);
		if (filedsArray.length > 0 && filedsArray.length < this.attachments.length) {
			return (`${this.globalVars.getAPIBaseUrl()}/attachment/modulevalue/downloadAsZip?id=${this.data.id}&fileIds=${filedsArray.join(",")}`);
		} else {
			return (`${this.globalVars.getAPIBaseUrl()}/attachment/modulevalue/downloadAsZip/${this.data.id}`);
		}
		
	}
	
	downloadFile (downloadFileUrl, name?) {
		this.downloadFileUrl = downloadFileUrl;
		this.downloadFilename = name;
		this.spinnerSnackBarService.open(this.globalVars.translation["Downloading"][this.globalVars.LNG]);
		setTimeout(() => {
			this.editItemService.downloadFile(this.downloadFileUrl).subscribe(_ => {
				document.getElementById("downloadPdfA").click();
				this.ngxSpinner.hide("edit");
			});
		}, 100);
	}
	
	/**
	 *
	 * download files in zip format methods added
	 * 1-addToDownloadList (event, attachment);
	 * WHY:we are using addToDowloadList method to add/remove checked files for attachment list
	 *
	 * @param event
	 * @param attachment
	 */
	addToDownloadList (checked, attachment) {
		if (checked) {
			let index;
			if (this.fileListForDownload.length < 1) {
				this.fileListForDownload.push(attachment);
				this.exists(attachment);
			} else {
				let foundAttachment = this.fileListForDownload.filter((val, i) => {
					if (val.id === attachment.id) {
						index = i;
						return val;
					}
				});
				if (foundAttachment.length > 0) {
					this.fileListForDownload.splice(index, 1);
				} else {
					this.fileListForDownload.push(attachment);
				}
			}
			
		} else {
			let index;
			let foundAttachment = this.fileListForDownload.filter((val, i) => {
				if (val.id === attachment.id) {
					index = i;
					return val;
				}
			});
			if (foundAttachment.length > 0) {
				this.fileListForDownload.splice(index, 1);
			}
		}
	}
	
	
	downloadAttachment (attachment) {
		let downloadFileUrl = `${this.globalVars.getAPIBaseUrl()}/attachment/download/${attachment.id}`;
		let name = attachment.name;
		this.downloadFile(downloadFileUrl, name);
	}
	
	
}
