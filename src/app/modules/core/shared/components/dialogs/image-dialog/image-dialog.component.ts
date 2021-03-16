import { Component, OnInit, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { GlobalVariables } from 'src/app/global-variables.service';

@Component({
	selector: 'app-image-dialog',
	templateUrl: './image-dialog.component.html',
	styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit {

	// public title: string;
	// public image_path: string;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ImageDialogComponent>,
		public globalVars: GlobalVariables) {
	}

	ngOnInit() {
	}

	onClose(): void {
		this.dialogRef.close(true);
		console.log('onClose');
	}

}
