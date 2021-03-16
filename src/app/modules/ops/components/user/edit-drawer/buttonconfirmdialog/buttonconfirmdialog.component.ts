import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { GlobalVariables } from "src/app/global-variables.service";

@Component({
	selector: "button-confirm",
	templateUrl: "buttonconfirmdialog.component.html",
	styleUrls: ["./buttonconfirmdialog.component.scss"]
	
})

export class ButtonConfirmComponent implements OnInit {
	messageObject: string;
	lng: string;
	buttonName: string;
	
	constructor (@Inject(MAT_DIALOG_DATA) public data: any,
	             public dialogRef: MatDialogRef<ButtonConfirmComponent>,
	             public globalVars: GlobalVariables,) {
		this.lng = globalVars.LNG;
	}
	
	ngOnInit () {
		console.log(this.data);
		this.messageObject = this.data.buttonMessage;
	}
	
	onNoClick (): void {
		this.dialogRef.close(false);
	}
	
	onYesClick () {
		this.dialogRef.close(true);
	}
}
