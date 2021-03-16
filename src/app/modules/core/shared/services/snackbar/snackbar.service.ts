import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material";

@Injectable({
	providedIn: "root"
})
export class SnackbarService {
	
	constructor(private snackBar: MatSnackBar) {
	}
	
	open(message: string, action?: string, duration?: number): void {
		this.snackBar.open(message, action, {
			duration: duration || 2000,
			direction: ( window.localStorage.getItem("lang") === "en" ? "ltr" : "rtl" ),
			horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: "info-snackbar"
		});
	}
}
