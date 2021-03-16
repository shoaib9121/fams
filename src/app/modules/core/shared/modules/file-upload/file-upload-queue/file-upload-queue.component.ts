import { Component, OnDestroy, QueryList, Input, Output, EventEmitter, ContentChildren, forwardRef } from "@angular/core";
import { FileUpload } from "../file-upload/file-upload.component";
import { Subscription, merge } from "rxjs";
import { startWith } from "rxjs/operators";
import { HttpHeaders, HttpParams } from "@angular/common/http";
import { AttachmentsService } from "../../../../../core/shared/components/dynamic-reactive-form/attachments/attachments.service";

@Component({
	selector: "app-file-upload-queue",
	templateUrl: `file-upload-queue.component.html`,
	exportAs: "file-upload-queue",
})
export class FileUploadQueue implements OnDestroy {
	
	@ContentChildren(forwardRef(() => FileUpload)) fileUploads: QueryList<FileUpload>;
	
	/** Subscription to remove changes in files. */
	private _fileRemoveSubscription: Subscription | null;
	
	/** Subscription to changes in the files. */
	private _changeSubscription: Subscription;
	
	/** Combined stream of all of the file upload remove change events. */
	get fileUploadRemoveEvents () {
		return merge(...this.fileUploads.map(fileUpload => fileUpload.removeEvent));
	}
	
	public files: Array<any> = [];
	
	@Input()
	httpUrl: string;
	
	@Input()
	httpRequestHeaders: HttpHeaders | {
		[header: string]: string | string[];
	} = new HttpHeaders().set("Content-Type", "multipart/form-data");
	
	@Input()
	httpRequestParams: HttpParams | {
		[param: string]: string | string[];
	} = new HttpParams();
	
	// @Input()
	// fileAlias: string = "file";
	
	constructor (private attachmentsService: AttachmentsService) { }
	
	ngAfterViewInit () {
		// When the list changes, re-subscribe
		this._changeSubscription = this.fileUploads.changes.pipe(startWith(null)).subscribe(() => {
			if (this._fileRemoveSubscription) {
				this._fileRemoveSubscription.unsubscribe();
			}
			this._listenTofileRemoved();
		});
	}
	
	private _listenTofileRemoved (): void {
		this._fileRemoveSubscription = this.fileUploadRemoveEvents.subscribe((event: FileUpload) => {
			this.files.splice(event.id, 1);
			this.attachmentsService.removeAttachment(event.id);
		});
	}
	
	add (file: any) {
		this.files.push(file);
		this.attachmentsService.filesToPush(file);
	}
	
	public removeAll () {
		this.files = [];
		this.attachmentsService.attachments = [];
	}
	
	ngOnDestroy () {
		if (this.files) {
			this.removeAll();
		}
	}
	
	/**
	 * Upload image on the fly with a button next to attachment. But for now this upload functionality is not being used
	 */
	// public uploadAll () {
	// 	this.fileUploads.forEach((fileUpload) => {
	// 		fileUpload.upload();
	// 	});
	// }
}
