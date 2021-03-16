import { Component, OnInit, Input } from "@angular/core";
import { GlobalVariables } from "src/app/global-variables.service";

@Component({
	selector: "app-empty-state",
	templateUrl: "./empty-state.component.html",
	styleUrls: ["./empty-state.component.scss"]
})
export class EmptyStateComponent implements OnInit {
	
	@Input() state: any;
	@Input() width: any;
	src: any;
	title: any;
	
	
	constructor (public globalVars: GlobalVariables) {
 
	}
	
	ngOnInit () {
		this.initView();
	}
	
	initView () {
		switch (this.state) {
            case "no_issues":
                this.src = "assets/svg-icons/no-results.svg";
                this.title = this.globalVars.translation["No Issues Found"][this.globalVars.LNG];
                break;
			case "no_result":
				this.src = "assets/svg-icons/no-results.svg";
				this.title = this.globalVars.translation["No Result Found"][this.globalVars.LNG];
				this.width = this.width || 20;
				break;
			case "no_attachment":
				this.src = "assets/empty_states/empty_attachments_circle.png";
				this.title = this.globalVars.translation["No Attachments"][this.globalVars.LNG];
                this.width = this.width || 40;
				break;
			case "no_comments":
				this.src = "assets/empty_states/empty_chat_circle.png";
				this.title = this.globalVars.translation["No Comments"][this.globalVars.LNG];
                this.width = this.width || 40;
				break;
		}
	}
	
	
}
