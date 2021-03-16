import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { LoginService } from "./login.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { SnackbarService } from "../modules/core/shared/services/snackbar/snackbar.service";
import { GlobalVariables } from '../global-variables.service';

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
	public credentialsFG: FormGroup;
	public loginTranslations: any = {
		username: {
			en: "Username",
			ar: "Username"
		},
		password: {
			en: "Password",
			ar: "Password"
		},
		server_not_reachable: {
			en: "Server is not reachable currently - please try again later",
			ar: "لا يمكن الوصول إلى الخادم حاليًا - يرجى المحاولة مرة أخرى لاحقًا"
		}
	};
	
	constructor (private loginService: LoginService, private router: Router, private spinner: NgxSpinnerService, private snackbarService: SnackbarService, 
		public globalVariables: GlobalVariables) {
		this.credentialsFG = new FormGroup({
			username: new FormControl("", [Validators.required]),
			password: new FormControl("", [Validators.required])
		});
		this.globalVariables.loadLanguage();

	}
	
	ngOnInit () {
		
		/**
		 * Redirect to default route if user is logged in already
		 */
		let jwt = window.localStorage.getItem("jwt");
		if (jwt) {
			this.router.navigate([""]);
		}
	}
	
	login (): void {
		this.spinner.show();
		this.loginService.login({
			username: this.credentialsFG.value.username,
			password: this.credentialsFG.value.password
		}).subscribe((data) => {
			console.log("component", data);
			
			if (data && data.status === 400) {
				this.spinner.hide();
				if (data.error.error.toLowerCase().indexOf("password") > -1) {
					this.credentialsFG.controls.password.setErrors({incorrect: true});
					this.credentialsFG.controls.password.markAllAsTouched();
				} else if (data.error.error.toLowerCase().indexOf("user") > -1) {
					this.credentialsFG.controls.username.setErrors({incorrect: true});
					this.credentialsFG.controls.username.markAllAsTouched();
				}
			} else if (data.status === 200) {
				localStorage.setItem("webSocket_id", data.content.id);
				this.router.navigate(["apps/" + data.content.defaultRoute], {
					state: {
						data: {
							appStructure: data.content.applicationData,
						}
					}
				});
			} else if (data.status === 0) {
				this.spinner.hide();
				this.snackbarService.open(this.loginTranslations["server_not_reachable"][this.globalVariables.LNG]);
			}
		});
	}
}


