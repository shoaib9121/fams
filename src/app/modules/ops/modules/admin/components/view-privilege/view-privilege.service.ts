import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import { GlobalVariables } from 'src/app/global-variables.service';
// import { Cacheable } from 'ngx-cacheable';
// import { DOMStorageStrategy } from 'ngx-cacheable/common/DOMStorageStrategy';


@Injectable({
  providedIn: 'root'
})
export class ViewPrivilegeService {

  constructor(
		private restApi: HttpClient,
		private globalVariables: GlobalVariables
	) { }

	/*@Cacheable(
		{
			maxCacheCount: 50,
			maxAge: 300000,
			storageStrategy: DOMStorageStrategy,
		}
	)*/
  	loadAllViews(appId?: number) {
		return this.restApi
		// .get(`${this.globalVariables.getAPIBaseUrl()}/view/allappviewsbyroles/${appId}`)
		.get(`${this.globalVariables.getAPIBaseUrl()}/view/allappviewsbyroles`)
		.pipe(
			tap((response: any) => {
				// response.content.values[0].workspace = ""; // for testing un assigned workspaces
				// console.log('loadAllViews', response.content.values);
				response.content_modified = this.transformViewDataToTableData(
					response.content.values
				);
			}),
			catchError(this.handleError("ViewPrivilegeService@loadAllViews"))
		);

		/*let response = this.getDummyViewList();
		response['content_modified'] = this.transformViewDataToTableData(
			response.content.values
		);
		return response;*/

  	}
	
	transformViewDataToTableData(response: any): any {
		
		// When no data - no table Structure
		if (response.length === 0 || Object.keys(response).length === 0) {
			return [];
		}
		
		// let globalObject = [];
		let globalObject = {};
		for ( let index = 0; index < Object.keys(response).length; index++ ) {
			// let recordId = Object.keys(response)[index];
			let record = response[Object.keys(response)[index]];

			let user_roles = [];
			if(record.hasOwnProperty("user_roles_permission_matrix") && Array.isArray(record.user_roles_permission_matrix) && record.user_roles_permission_matrix.length > 0){
				record.user_roles_permission_matrix.forEach((role, index) => {
					if(!this.globalVariables.IsEmptyObject(role))
						user_roles.push([role.name[this.globalVariables.LNG]]);
					else{
						// delete record.user_roles_permission_matrix[index];
						record.user_roles_permission_matrix.splice(index, 1);
					}
				});
			}

			//if no workspace, then create a dummy one
			if(!record.workspace || this.globalVariables.IsEmptyObject(record.workspace)){
				record.workspace = {
					id: "__0__",
					name: {en: "No Workspace Assigned", ar: "لا مساحة عمل معينة"}
				}
			}

			if(!globalObject.hasOwnProperty(record.workspace['id']))
				globalObject[record.workspace['id']] = {
					id 			: record.workspace['id'],
					name 		: record.workspace['name'],
					dataGroup	: []
				};

			// globalObject.push({
			globalObject[record.workspace['id']].dataGroup.push({
				// "id" 			: record.id ? record.id : recordId,
				"id" 			: record.id,
				"type_id" 		: 0,
				"view_name" 	: record.name[this.globalVariables.LNG],
				"module" 		: record.module.name[this.globalVariables.LNG],
				"workspace"		: record.workspace.name[this.globalVariables.LNG],
				"user_roles"	: user_roles,
				"dataset" 		: record
			});
		}
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
		
		/*return [
			{
				group: {
					name: {en: "Planning", ar: "Planning"},
					color: "#FF0000"
				},
				data: globalObject
			}
		];*/
		return formated_object_for_datatable;
	}
  
	private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return of(error);
		};
	}
}