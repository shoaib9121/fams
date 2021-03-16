import {Component, Input, OnInit} from "@angular/core";
import {GlobalVariables} from "../../../global-variables.service";

@Component({
	selector: "app-top-bar",
	templateUrl: "./top-bar.component.html",
	styleUrls: ["./top-bar.component.scss"]
})
export class TopBarComponent implements OnInit {
	@Input() apps: any;
	menus: any;
	
	constructor(public globalVars: GlobalVariables) {
		// console.log("App Language Top Bar",this.globalVars.LNG);
	}
	
	ngOnInit() {
		
		let lang = localStorage.getItem("lang");
		if (lang == "ar") {
			document.getElementsByTagName("mat-nav-list")[0].setAttribute("dir", "rtl");
		} else {
			document.getElementsByTagName("mat-nav-list")[0].setAttribute("dir", "ltr");
		}
	}
	
	/**
	 * Returns routing link
	 *
	 * @param route
	 */
	createRouterLink(menu) {
		
		if (this.globalVars.getCurrentApplicationName() != "iServe" && this.globalVars.getCurrentApplicationName() != "telematics") {
			return this.globalVars.getCurrentApplicationName() + '/user/' + menu.route;
		}
		else if(this.globalVars.getCurrentApplicationName() === "telematics")
		{
			return this.globalVars.getCurrentApplicationName() + '/' + menu.route;
		}
		
		let menuRoute = menu.route;
		if (menuRoute != "dashboard") {
			menuRoute = menu.route + "/" + "users";
		}
		return this.globalVars.getCurrentApplicationName() + "/" + menuRoute;
	}
	
	getCurrentMenu() {
		this.menus = this.apps[0].menus;
		this.apps.forEach(app => {
			if (app.route == this.globalVars.getCurrentApplicationName()) {
				this.menus = app.menus;
			}
		});
		
		return this.menus;
	}
	
	getCurrentMenuOld() {
		let appIndex = this.globalVars.loadAppStructure().findIndex(app => app.route == this.globalVars.getCurrentApplicationName());
		if (appIndex >= 0) {
			this.menus = this.globalVars.loadAppStructure()[appIndex].menus;
		}
		
		return this.menus;
	}
	
}
