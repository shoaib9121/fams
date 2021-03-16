import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { GlobalVariables } from "../../global-variables.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatGridTileHeaderCssMatStyler } from "@angular/material";
import { Title } from "@angular/platform-browser";

@Component({
	selector: "app-core",
	templateUrl: "./core.component.html",
	styleUrls: ["./core.component.scss"],
	encapsulation: ViewEncapsulation.None,
})
export class CoreComponent implements OnInit {
	public appStructure: any;
	public navigation: any;
	
	constructor (public globalVariables: GlobalVariables, private titleService: Title, private router: Router, private route: ActivatedRoute/* private spinner: NgxSpinnerService*/) {
		route.queryParams.subscribe(val => {
			this.setApplicationTitle(this.globalVariables.getCurrentApplicationName());
		});
	}
	
	ngOnInit () {
		try {
			this.initAppStructure();
			
			// If url is "/apps" or "/apps/FIRSTAPP/", make redirect to get the first link
			let pathSplitted = window.location.hash.split("/");
			
			if (pathSplitted.length <= 2) {
				this.router.navigate(
					["/apps/" + this.appStructure[0].route + "/"]
				);
			} else if (pathSplitted.length <= 3) {
				let appName = "";
				this.globalVariables.updateCurrentApplicationData();
				
				// Special Handling for iServe
				if (this.globalVariables.CURRENT_APP_NAME == "iServe") {
					this.router.navigate(
						["/apps/iServe/admin/vehicles"]
					);
				} else {
					let app = this.appStructure[0].menus[0].route;
					if (app == "dashboard") {
						this.router.navigate(
							["/apps/" + this.globalVariables.CURRENT_APP_NAME + "/user/dashboard"]
						);
					} else if (pathSplitted[2]) {
						appName = pathSplitted[2];
						app = this.appStructure.find(app => app.route == appName);
						
						if (app) {
							let type = app.menus[0].workspaces[0];
							if (type && type.length > 0) {
								type = type.type;
							} else {
								type = "user";
							}
							if (app.menus[0].workspaces && app.menus[0].workspaces[0] && app.menus[0].workspaces[0].views[0] && app.menus[0].workspaces[0].views[0].module) {
								this.router.navigate(
									["/apps/" + pathSplitted[2] + "/" + type + "/" + app.menus[0].route + "/" + app.menus[0].workspaces[0].views[0].module + "/" + app.menus[0].workspaces[0].views[0].viewId + "/" + app.menus[0].workspaces[0].views[0].role]
								);
							} else {
								this.router.navigate(
									["/apps/" + pathSplitted[2] + "/" + type + "/" + app.menus[0].route + "/"]
								);
							}
						}
					} else {
						app = this.appStructure[0];
						this.router.navigate(
							["/apps/" + app.route + "/" + app.menus[0].workspaces[0].type + "/" + app.menus[0].route]
						);
					}
				}
			}
		} catch (exception) {
			this.router.navigate(["/login"]);
		}
	}
	
	/**
	 * Sets HTML Title
	 *
	 * @param currentApplicationName
	 */
	setApplicationTitle (currentApplicationName) {
		switch (currentApplicationName) {
			case "iServe":
				this.titleService.setTitle("Dubai Police - iServe Car Sharing");
				break;
			case "insurance":
				this.titleService.setTitle("Dubai Police - Insurance Management System");
				break;
			case "fams":
				this.titleService.setTitle("Dubai Police - Fleet & Asset Management System");
				break;
		}
	}
	
	
	/**
	 * Loads App Navigation (top bar) either from history state or local storage
	 */
	initAppStructure (): void {
		this.appStructure = (history.state.data && history.state.data.appStructure) ?
			history.state.data.appStructure : this.globalVariables.loadAppStructure();
	}
	
	/**
	 * Loads Menu Navigation (sidenav)
	 * Used for passing navigation to child module (SidenavComponent)
	 */
	getAppNavigation (): any {
		let app = window.location.hash.split("/")[2];
		if (!app) {
			app = this.appStructure[0].route;
		}
		this.appStructure.forEach((application, index) => {
			if (app === application.route) {
				this.navigation = application;
				application.menus.forEach(work => {
					if (work.route == this.globalVariables.getCurrentMenu()) {
						this.navigation = work;
					}
				});
			}
		});
		if (!this.navigation) {
			this.router.navigate(["/login"]);
			return;
		}
		return this.navigation;
	}
	
}
