import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { SpinnerComponent } from "./spinner-snackbar.component";

@Injectable({
	providedIn: "root"
})
export class SpinnerSnackbarService {
	
	constructor(private snackBar: MatSnackBar) { }
	
    open(message: string, action?: string, duration?: number): void {
        this.snackBar.openFromComponent(SpinnerComponent, {
            duration: duration || 2000,
			direction: ( window.localStorage.getItem("lang") === "en" ? "ltr" : "rtl" ),
			horizontalPosition: "left",
            verticalPosition: "bottom",
            panelClass: "info-snackbar",
            data: message
        });
    }
}
