import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material";
import { GlobalVariables } from "../../../../../global-variables.service";

@Component({
	selector: "status-update-snackbar",
	template: "{{globals.translation['Status successfully updated to'][globals.LNG]}}&nbsp;&nbsp;" +
		"<span class='status-label' [style.backgroundColor]='data.color'>{{ data.status[globals.LNG] }}</span>"
})
export class StatusUpdateSnackbar {
	constructor (@Inject(MAT_SNACK_BAR_DATA) public data: any,
	             public globals: GlobalVariables) {
	}
}
