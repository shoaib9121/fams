import { Component, EventEmitter, Input, OnDestroy, Output, Inject, forwardRef } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from '@angular/common/http';
// import { FileUploadQueue } from '../file-upload-queue/file-upload-queue.component';
import { timer } from 'rxjs';

@Component({
	selector: 'app-file-upload',
	templateUrl: `./file-upload.component.html`,
	exportAs: 'file-upload',
	host: {
		'class': 'file-upload',
	},
	styleUrls: ['./file-upload-queue.scss'],
})
export class FileUpload implements OnDestroy {

	// private isUploading: boolean = false;
	// @Input()
	// httpUrl: string = 'http://localhost:8080';

	// @Input()
	// fileAlias: string = "file";

	// @Input()
	// httpRequestHeaders: HttpHeaders | {
	// 	[header: string]: string | string[];
	// } = new HttpHeaders().set("Content-Type", "multipart/form-data");

	// @Input()
	// httpRequestParams: HttpParams | {
	// 	[param: string]: string | string[];
	// } = new HttpParams();


	@Input()
	get file(): any {
		return this._file;
	}
	set file(file: any) {
		this._file = file;
		// this.total = this._file.size;
	}

	@Input()
	set id(id: number) {
		this._id = id;
	}
	get id(): number {
		return this._id;
	}

	@Output() removeEvent = new EventEmitter<FileUpload>();
	@Output() onUpload = new EventEmitter();

	public loaded: number = 0;
	private _file: any;
	public _id: number;
	public isImage: boolean = true;
	public timer = timer(0);
	// private fileUploadSubscription: any;
	// private total: number = 0;
	// private progressPercentage: number = 0;

	constructor(
		private HttpClient: HttpClient,
		// @Inject(forwardRef(() => FileUploadQueue)) public fileUploadQueue: FileUploadQueue
	) {
		// if (fileUploadQueue) {
		// 	this.httpUrl = fileUploadQueue.httpUrl || this.httpUrl;
		// 	this.fileAlias = fileUploadQueue.fileAlias || this.fileAlias;
		// 	this.httpRequestHeaders = fileUploadQueue.httpRequestHeaders || this.httpRequestHeaders;
		// 	this.httpRequestParams = fileUploadQueue.httpRequestParams || this.httpRequestParams;
		// }
	}

	ngOnInit() { }

	ngAfterViewInit() {
		if (this._file && (this._file.type == 'image/png' || this._file.type == 'image/jpeg')) {
			this.isImage = true;
			const preview = document.querySelector('#img-thumb-' + this._id);
			const reader = new FileReader();

			reader.addEventListener("load", function () {
				// convert image file to base64 string
				if (preview){
					preview['src'] = reader.result;
				}
			}, false);

			if (this._file) {
				reader.readAsDataURL(this._file);
			}
		} else {
			this.timer.subscribe( _ => {
				this.isImage = false;
			})
		}
	}

	public remove(): void {
		this.removeEvent.emit(this);
		// if (this.fileUploadSubscription) {
		// 	this.fileUploadSubscription.unsubscribe();
		// }
	}

	ngOnDestroy() {
		console.log('file ' + this._file.name + ' destroyed...');
	}

	/**
	 * Upload image on the fly with a button next to attachment. But for now this upload functionality is not being used
	 */
	// public upload(): void {
	// 	this.isUploading = true;
	// 	// How to set the alias?
	// 	let formData = new FormData();
	// 	formData.set(this.fileAlias, this._file, this._file.name);
	// 	this.fileUploadSubscription = this.HttpClient.post(this.httpUrl, formData, {
	// 		// headers: this.httpRequestHeaders,
	// 		observe: "events",
	// 		params: this.httpRequestParams,
	// 		reportProgress: true,
	// 		responseType: "json"
	// 	}).subscribe((event: any) => {
	// 		if (event.type === HttpEventType.UploadProgress) {
	// 			this.progressPercentage = Math.floor(event.loaded * 100 / event.total);
	// 			this.loaded = event.loaded;
	// 			this.total = event.total;
	// 		}
	// 		this.onUpload.emit({ file: this._file, event: event });
	// 	}, (error: any) => {
	// 		if (this.fileUploadSubscription) {
	// 			this.fileUploadSubscription.unsubscribe();
	// 		}
	// 		this.isUploading = false;
	// 		this.onUpload.emit({ file: this._file, event: event });
	// 	});
	// }

}
