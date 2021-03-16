import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
	selector: "app-alert-dialog",
	templateUrl: "./alert.dialog.html",
	styleUrls: ["./alert.dialog.scss"]
})
export class AlertDialog implements OnInit {
	
	constructor (@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AlertDialog>) {
	}
	
	ngOnInit () {
	}
	
	handleActionButton (result) {
		this.dialogRef.close(result);
	}
	
}
