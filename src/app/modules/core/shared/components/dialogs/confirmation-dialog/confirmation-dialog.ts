import { Component, Inject} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { GlobalVariables } from "../../../../../../global-variables.service";

@Component({
	selector: 'confirmation-dialog',
	templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
	
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<ConfirmationDialog>,
		public globalVars: GlobalVariables) {
	}
	
	onYesClick(str): void {
		this.dialogRef.close(true);
	}
	
	onNoClick(str) {
		this.dialogRef.close(false);
	}
}