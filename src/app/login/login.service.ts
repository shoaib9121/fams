import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {GlobalVariables} from "../global-variables.service";

@Injectable({
	providedIn: "root"
})
export class LoginService {
	

	telematicsDummypath=[{
		notes: "Telematics notes",
		name:
		{
		en: "Telematics",
		ar: " "
		},
		route: "telematics",
		status: "1",
		menus:[{
		Name: {en: "Dashboard", ar: ""},
		icon: "view-dashboard",
		route: "dashboard",
		workspaces: []
		},
		{
			Name: {en: "Live", ar: " "},
			icon: "view-dashboard",
			route: "live",
			workspaces: []
		},
		{
		Name: {en: "History", ar: " "},
		icon: "view-dashboard",
		route: "history",
		workspaces: []
		},
		{
		Name: {en: "Settings", ar: " "},
		icon: "settings",
		route: "settings/alarm",
		workspaces: []
		}
		

	],
	icon: "car-back",
	navigation:[]
	}]
	constructor(private restApi: HttpClient, private globalVariables: GlobalVariables) {
	}
	
	login(credentials: { username:string, password:string }): Observable<any> {
		return this.restApi.post(window["loginApiUrl"], {
			username: credentials.username,
			password: credentials.password,
		})
		.pipe(
			tap((response: any) => {
				if (response.status === 200) {
					response = this.setApplicationStructure(response);
					window.localStorage.setItem("user_info", JSON.stringify(response.content.values));
					window.localStorage.setItem("jwt", response.content.values.tokens[0]);
					// response.content.applicationData.push(this.telematicsDummypath);
					this.globalVariables.storeAppStructure(response.content.applicationData);
				}
				console.log(response.content.applicationData);
			}),
			catchError(this.handleError("LoginService@login"))
		);
	}	
	/**
	 * Sets application structure for whole platform
	 *
	 * @param response - App Structure will be extracted from here
	 */
	setApplicationStructure(response: any) {
		let __tempAppDataStructure = [];
		response.content.applicationData.forEach((application, appIndex, appObject) => {
			// console.log('appObject___', appIndex, application.id, appObject);
			if(response.content.values.hasOwnProperty("permission_matrixV2") && response.content.values.permission_matrixV2.hasOwnProperty(application.id)){
				

				if (application.id === response.content.defaultApplication) {
					response.content.defaultRoute = application.route;
					application.navigation = response.content.workspaces;
				}
				
				//iServe attached automatically - hardcoded one for iserveadmin user
				if (application.route != "iServe" && application.route != "iserve") {
					let __tempMenuStructure = [];
					if (application.hasOwnProperty("menus")) {
						application.menus.forEach(menu => {
							if(response.content.values.permission_matrixV2[application.id].hasOwnProperty("menus") && response.content.values.permission_matrixV2[application.id]["menus"].length > 0){
								let __userAppMenuStructure = response.content.values.permission_matrixV2[application.id]["menus"].find(uMenu => uMenu.route == menu.route)
								if(typeof __userAppMenuStructure != "undefined"){
									let __tempWorkspaceStructure = [];
									menu.workspaces.forEach((workspaceId, arrayIndex) => {
										if(__userAppMenuStructure.hasOwnProperty("workspaces") && __userAppMenuStructure["workspaces"].length > 0){
											let __userAppMenuWorkspaceStructure = __userAppMenuStructure["workspaces"].find(uWp => uWp.workspace == workspaceId)
											if(typeof __userAppMenuWorkspaceStructure != "undefined"){
												let __workspaceDefinition = response.content.workspaces.find(workspace => workspace.workspaceId == workspaceId);
												if(typeof __workspaceDefinition != "undefined")
													__tempWorkspaceStructure.push(__workspaceDefinition);
											}
										}
									})
									menu.workspaces = __tempWorkspaceStructure;
									__tempMenuStructure.push(menu);
								}
							}
						})
					}
					application.menus = __tempMenuStructure;
					__tempAppDataStructure.push(application);
				}
				//right now - we are skipping the iserve app added through UI
				else if (application.route == "iServe")
					__tempAppDataStructure.push(application);
			}
		});
		console.log('__tempAppDataStructure', __tempAppDataStructure);
		response.content.applicationData = __tempAppDataStructure;
		return response;
	}
	
	private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			/*if (error.status === 200) {
				error = this.setApplicationStructure(error);
				window.localStorage.setItem("user_info", JSON.stringify(error.content.values));
				this.globalVariables.storeAppStructure(error.content.applicationData);
			}*/
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);

			return of(error);
		};
	}
}
