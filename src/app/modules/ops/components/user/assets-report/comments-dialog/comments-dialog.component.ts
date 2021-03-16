import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { GlobalVariables } from "../../../../../../global-variables.service";

@Component({
	selector: "app-comments-dialog",
	templateUrl: "./comments-dialog.component.html",
	styleUrls: ["./comments-dialog.component.scss"]
})
export class CommentsDialogComponent implements OnInit {
	
	comment: any;
	
	constructor (@Inject(MAT_DIALOG_DATA) public data: any,
	             public dialogRef: MatDialogRef<CommentsDialogComponent>,
	             public globalVars: GlobalVariables) {
	}
	
	ngOnInit () {
		this.comment = this.data.comment;
	}
	
	onNoClick (): void {
		this.dialogRef.close(false);
	}
	
	onYesClick () {
		this.dialogRef.close(this.comment);
	}
}
