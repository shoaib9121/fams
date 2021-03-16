import { Component, EventEmitter, Input, OnInit, Output, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA } from "@angular/material";
import { GlobalVariables } from "../../../../../global-variables.service";
import { SnackbarDrawerOpenerService } from "./snackbar-drawer-opener.service";

@Component({
	selector: "snackbar-drawer-opener",
	template: `
          <div fxLayout fxLayoutAlign="space-between center">
              <span *ngIf="data.drawerType == 'add'">{{globals.translation['created_successfully'][globals.LNG]}}&nbsp;&nbsp; </span>
              <span *ngIf="data.drawerType == 'edit'">{{globals.translation['Updated successfully'][globals.LNG]}}&nbsp;&nbsp; </span>
              <button mat-button color="primary" (click)="openDrawer()">{{globals.translation['open'][globals.LNG]}} </button>
          </div>
  `
})
export class SnackbarDrawerOpener {

	constructor (@Inject(MAT_SNACK_BAR_DATA) public data: any, public globals: GlobalVariables, private _snackbarDrawerOpenerService: SnackbarDrawerOpenerService) {
    }

    public openDrawer(){
        console.log('openeing drawer from SnackbarDrawerOpener');
        this._snackbarDrawerOpenerService.fireDrawerOpenerEvent(this.data.drawerRecord);
    }
}
