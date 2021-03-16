import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import { GlobalVariables } from 'src/app/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

	constructor(
		private restApi: HttpClient,
		private globalVariables: GlobalVariables
	) { }
	  
	  
  	loadAllDepartments() {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/department/list`)
		.pipe(
			tap((response: any) => {
				response.content_modified = this.transformDepartmentDataToTableData(
					response.content
				);
			}),
			catchError(this.handleError("DepartmentService@loadAllDepartments"))
		);
	}

	transformDepartmentDataToTableData(response: any): any {
		
		// When no data - no table Structure
		if (response.length === 0 || Object.keys(response).length === 0) {
			return [];
		}
		
		let globalObject = {};
		response.forEach((record, index) => {
			if(!globalObject.hasOwnProperty(record.applicationId))
				globalObject[record.applicationId] = {
					id 			: record.applicationId,
					name 		: record.applicationName,
					dataGroup	: []
				};


			globalObject[record.applicationId].dataGroup.push({
				"id" 			: record.id,
				"type_id" 		: 0,
				"name_en" 		: record.name['en'],
				"name_ar" 		: record.name['ar'],
				"dataset" 		: record
			});
		});
		// console.log('loadAllViews--formatted', globalObject);  

		let formated_object_for_datatable = [];
		let formattedDeptIds = Object.keys(globalObject);
		for ( let index = 0; index < formattedDeptIds.length; index++ ) {
			formated_object_for_datatable.push(
				{
					group: {
						name: globalObject[formattedDeptIds[index]].name,
						color: "#03a066"
					},
					data: globalObject[formattedDeptIds[index]].dataGroup
				}
			)
		}
		// console.log('loadAllViews--formated_object_for_datatable', formated_object_for_datatable);
		return formated_object_for_datatable;
	}

	getDepartmentsByID(deptId: number) {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/department/${deptId}`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("DepartmentService@getDepartmentsByID"))
		);
	}
	
	createDepartment(jsonObject: any) {
		let moduleId = this.globalVariables.systemModuleConstants.DEPARTMENT;
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"moduleId"	: moduleId,
			"deleted"	: false,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/department`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("DepartmentService@createDepartment"))
			);
	}
	
	editDepartment(jsonObject: any, id: number) {
		let jsonString = JSON.stringify(jsonObject);
		let postObject = {
			"id"		: id,
			"value"		: jsonString
		}

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues`, postObject)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("DepartmentService@editDepartment"))
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
