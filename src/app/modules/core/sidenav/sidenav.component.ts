import {Component, Input, OnInit, ViewEncapsulation} from "@angular/core";
import {GlobalVariables} from "../../../global-variables.service";


@Component({
	selector: "app-sidenav",
	templateUrl: "./sidenav.component.html",
	styleUrls: ["./sidenav.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class SidenavComponent implements OnInit {
	/** Subscription to the Directionality change EventEmitter. */
	statusClass = 'not-active';
	
	
	@Input() appNavigation: any;
	panelOpenState: false;
	workSpace: any;
	
	public userName: any;
	
	constructor(public globalVars: GlobalVariables) {
	}
	
	ngOnInit() {
		this.userName = JSON.parse(window.localStorage.getItem("user_info")).name;
	}
	
	changeLanguage(lang: string) {
		if (lang == "en") {
			localStorage.setItem("lang", "en");
		} else if (lang == "ar") {
			localStorage.setItem("lang", "ar");
		} else {
			localStorage.setItem("lang", "en");
		}
		window.top.location.reload();
	}
	
	/**
	 * Loggs out user from current session
	 */
	logout() {
		const lang = window.localStorage.getItem("lang");
		window.localStorage.clear();
		window.localStorage.setItem("lang", lang);
		location.pathname = "";
		location.href = "/";
		window.top.location.reload();
	}
}
