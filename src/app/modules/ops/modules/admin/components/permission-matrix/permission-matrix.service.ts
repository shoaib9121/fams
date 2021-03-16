import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import { GlobalVariables } from 'src/app/global-variables.service';
import { Cacheable } from 'ngx-cacheable';
import { DOMStorageStrategy } from 'ngx-cacheable/common/DOMStorageStrategy';

@Injectable({
  providedIn: 'root'
})
export class PermissionMatrixService {

	constructor(
		private restApi: HttpClient,
		private globalVariables: GlobalVariables
	) { }

	
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

	@Cacheable(
		{
			maxCacheCount: 50,
			maxAge: 300000,
			storageStrategy: DOMStorageStrategy,
		}
	)
	fetchModuleMatrixDataByIds(moduleIds: string): Observable<any> {
		// moduleIds should be comma separated module ids like http://localhost:8200/module/getmoduledefinition/list?ids=1,2,3
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/module/getmoduledefinition/list?ids=${moduleIds}`)
		.pipe(
			tap((response: any) => {
				//console.log("Module data before", response.content);
				// response.content.moduleDefinition = this.transformToFormData(
				// 	response
				// );
				// console.log("fetchModuleMatrixDataByIds", response.content);
			}),
			catchError(this.handleError("PermissionMatrixService@fetchModuleMatrixDataByIds"))
		);
	}
	async fetchModuleMatrixDataById(moduleId: string): Promise<any>{
		return await this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/module/getmoduledefinition/list?ids=${moduleId}`).toPromise().catch((error)=>{
			console.log("PermissionMatrixService@fetchModuleMatrixDataById" + JSON.stringify(error));
		});

	}
	
  	loadAllWorkSpaces() {
		return this.restApi
		// .get(`${this.globalVariables.getAPIBaseUrl()}/workspace/listbyapplication/${appId}`)
		.get(`${this.globalVariables.getAPIBaseUrl()}/workspace/list`)
		.pipe(
			tap((response: any) => {
				
			}),
			catchError(this.handleError("PermissionMatrixService@loadAllWorkSpaces"))
		);
	}
	  
	loadAllModules() {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/module/compactlist`)
		.pipe(
			tap((response: any) => {
				let content_modified = []

				if(Array.isArray(response.content) ){
					response.content.forEach((element, index) => {
						content_modified.push({ id: element.id, name: {en: element.name, ar: element.nameArabic} });
					});
					response.content_modified = content_modified;
				}
			}),
			catchError(this.handleError("PermissionMatrixService@loadAllModules"))
		);
	}

	loadAllUserRoles() {
	  return this.restApi
	  .get(`${this.globalVariables.getAPIBaseUrl()}/role/list`)
	  .pipe(
			tap((response: any) => {
				
			}),
			catchError(this.handleError("PermissionMatrixService@loadAllUserRoles"))
	  	);
	}

	fetchViewPermissionData(viewId: number, roleId: number): Observable<any> {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/view/viewpermissions/${viewId}/${roleId}/`)
		.pipe(
			tap((response: any) => {
				//console.log("Module data before", response.content);
				// response.content.moduleDefinition = this.transformToFormData(
				// 	response
				// );
				// console.log("module data after", response.content);
			}),
			catchError(this.handleError("PermissionMatrixService@fetchViewPermissionData"))
		);
	}

	createNewView(jsonObject: any) {
		let moduleId = this.globalVariables.systemModuleConstants.VIEW;
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"moduleId"	: moduleId,
			"deleted"	: false,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/view`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("PermissionMatrixService@createNewView"))
			);
	}

	addUserIntoView(jsonObject: any, viewId: number) {
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"id"		: viewId,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/view/adduserroletopermissionmatrix`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("PermissionMatrixService@addUserIntoView"))
			);
	}

	editUserPermissionView(jsonObject: any, viewId: number) {
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"id"		: viewId,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/view/updatepermissionmatrix`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("PermissionMatrixService@editUserPermissionView"))
			);
	}

	deleteUserViewPermissionMatrix(viewId: number, userId: number) {
		let postObject = {
			"id"		: viewId,
			"value"		: userId
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/view/removeuserrolefrompm`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("PermissionMatrixService@deleteUserViewPermissionMatrix"))
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
