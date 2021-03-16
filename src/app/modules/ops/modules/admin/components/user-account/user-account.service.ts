import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import { GlobalVariables } from 'src/app/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

	constructor(
		private restApi: HttpClient,
		private globalVariables: GlobalVariables
	) { }
	  
	  
  	loadAllUserAccounts() {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/user/list`)
		.pipe(
			tap((response: any) => {
				response.content_modified = this.transformUserAccountDataToTableData(
					response.content
				);
			}),
			catchError(this.handleError("UserAccountService@loadAllUserAccounts"))
		);
	}

	transformUserAccountDataToTableData(response: any): any {
		
		// When no data - no table Structure
		if (response.length === 0 || Object.keys(response).length === 0) {
			return [];
		}
		
		let globalObject = [];
		response.forEach((record, index) => {
			globalObject.push({
				"id" 			: record.id,
				"type_id" 		: 0,
				"name" 			: record.name,
				"username" 		: record.username,
				"email" 		: record.email,
				"phone" 		: record.phone,
				"dataset" 		: record
			});
		});  

		return [
			{
				data: globalObject
			}
		];
	}

	fetchModuleDefinitionData(moduleId: number): Observable<any> {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/module/getmoduledefinition/${moduleId}`)
		.pipe(
			tap((response: any) => {
				//console.log("Module data before", response.content);
				// response.content.moduleDefinition = this.transformToFormData(
				// 	response
				// );
				// console.log("module data after", response.content.moduleDefinition);
			}),
			catchError(this.handleError("PermissionMatrixService@fetchModuleData"))
		);
	}

	getAllApplications() {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/application/list`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UserAccountService@getAllApplications"))
		);
	}
	getAllUserRoles() {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/role/list`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UserAccountService@getAllUserRoles"))
		);
	}

	getUserAccountByID(userId: number) {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/user/${userId}`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UserAccountService@getUserAccountByID"))
		);
	}
	
	createUserAccount(jsonObject: any) {
		let moduleId = this.globalVariables.systemModuleConstants.USER;
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"moduleId"	: moduleId,
			"deleted"	: false,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/user/registeruser`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("UserAccountService@createUserAccount"))
			);
	}
	
	editUserAccount(jsonObject: any, id: number) {
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"id"		: id,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues?appId=`+this.globalVariables.getCurrentApplicationID(), postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("UserAccountService@editUserAccount"))
			);
	}

	fetchModuleValuesByModuleId(moduleId: string, keyShow: string): Observable<any> {
		
		let postObject = {
			"refModId"	: moduleId,
			"keyShow"	: keyShow,
			"searchString"	: "",
			"offset"	: 0,
			"limit"		: 1000
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchreferencevalue`, postObject)
			.pipe(
				tap((response: any) => {
					console.log("Module records :", moduleId, keyShow, response.content);
				}),
				catchError(this.handleError("PermissionMatrixService@fetchModuleMatrixDataByIds"))
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
