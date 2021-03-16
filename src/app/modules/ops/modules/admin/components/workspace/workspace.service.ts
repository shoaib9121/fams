import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import { GlobalVariables } from 'src/app/global-variables.service';

@Injectable({
  	providedIn: 'root'
})
export class WorkspaceService {

	constructor(
		private restApi: HttpClient,
		private globalVariables: GlobalVariables
	) { }
	  
	  
  	loadAllWorkSpaces() {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/workspace/list`)
		.pipe(
			tap((response: any) => {
				response.content_modified = this.transformWorkspaceDataToTableData(
					response.content
				);
			}),
			catchError(this.handleError("WorkspaceService@loadAllWorkSpaces"))
		);
	}

	transformWorkspaceDataToTableData(response: any): any {
		
		// When no data - no table Structure
		if (response.length === 0 || Object.keys(response).length === 0) {
			return [];
		}
		
		let globalObject = {};
		response.forEach((record, index) => {
			if(!record.hasOwnProperty("applications") || !Array.isArray(record.applications) || record.applications.length == 0){
				record.applications = [{
					id: "__0__",
					name: {en: "No Application Assigned", ar: "لم يتم تعيين تطبيق"}
				}];
			}
			if(record.hasOwnProperty("applications") && Array.isArray(record.applications) && record.applications.length > 0){
				// if(record.applications.length>1) console.log('multiappworkspaces', record)
				record.applications.forEach((app, appIndex) => {
					if(!globalObject.hasOwnProperty(app['id'])){
						globalObject[app['id']] = {
							id 			: app['id'],
							name 		: app['name'],
							dataGroup	: []
						};
					}

					globalObject[app['id']].dataGroup.push({
						"id" 			: record.id,
						"type_id" 		: 0,
						"name_en" 		: record.name['en'],
						"name_ar" 		: record.name['ar'],
						"dataset" 		: record
					});
				});
			}
		});
		// console.log('loadAllViews--formatted', globalObject);  

		let formated_object_for_datatable = [];
		let formattedWorspaceIds = Object.keys(globalObject);
		for ( let index = 0; index < formattedWorspaceIds.length; index++ ) {
			formated_object_for_datatable.push(
				{
					group: {
						name: globalObject[formattedWorspaceIds[index]].name,
						color: "#03a066"
					},
					data: globalObject[formattedWorspaceIds[index]].dataGroup
				}
			)
		}
		// console.log('loadAllViews--formated_object_for_datatable', formated_object_for_datatable);
		return formated_object_for_datatable;
	}

	getAllApplications() {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/application/list`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("WorkspaceService@getAllApplications"))
		);
	}

	getWorkspaceByID(workspaceId: number) {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/workspace/${workspaceId}`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("WorkspaceService@getWorkspaceByID"))
		);
	}
	
	createWorkspace(jsonObject: any) {
		let moduleId = this.globalVariables.systemModuleConstants.WORKSPACE;
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"moduleId"	: moduleId,
			"deleted"	: false,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/workspace`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("WorkspaceService@createWorkspace"))
			);
	}
	
	editWorkspace(jsonObject: any, id: number) {
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"id"		: id,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues?appId=`+this.globalVariables.getCurrentApplicationID(), postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("WorkspaceService@editWorkspace"))
			);
	}



	private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return of(error);
		};
	}
}
