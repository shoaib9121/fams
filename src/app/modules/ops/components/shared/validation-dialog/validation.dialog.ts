import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GlobalVariables } from "../../../../../global-variables.service";

@Component({
	selector: "valdiation-dialog",
	templateUrl: "validation.dialog.html",
})
export class ValidationDialog {
	
	constructor (
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ValidationDialog>,
		public globalVars: GlobalVariables) {
	}
	
	onYesClick (str): void {
		this.dialogRef.close(true);
	}
	
	onNoClick (str) {
		this.dialogRef.close(false);
	}
}
