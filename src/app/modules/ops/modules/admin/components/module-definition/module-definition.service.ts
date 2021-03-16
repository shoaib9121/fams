import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {GlobalVariables} from "../../../../../../global-variables.service";
import {catchError, tap} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class ModuleDefinitionService {
	
	constructor(private restApi: HttpClient, private globals: GlobalVariables) {
	}
	
	// region reading data
	
	/**
	 * Fetches Module List (without whole definition)
	 */
	fetchModuleList(): Observable<any> {
		return this.restApi.get(`${this.globals.getAPIBaseUrl()}/module/compactlist`)
		.pipe(
			catchError(this.handleError("ModuleDefinitionService@fetchModuleList"))
		);
	}
	
	/**
	 * Fetches specified Module Definition
	 *
	 * @param moduleId
	 */
	fetchModuleDefinition(moduleId): Observable<any> {
		// TODO: Cacheable this call
		return this.restApi.get(`${this.globals.getAPIBaseUrl()}/module/getmoduledefinition/${moduleId}`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("ModuleDefinitionService@fetchModuleList"))
		);
	}
	
	/**
	 * Fetches user userRoles
	 */
	fetchRoles(): Observable<any> {
		return this.restApi.get(`${this.globals.getAPIBaseUrl()}/role/list`)
			.pipe(
				catchError(this.handleError("ModuleDefinitionService@fetchRoles"))
			);
	}
	
	// endregion
	
	// posting data
	
	/**
	 * Creates/Saves a new module definition
	 *
	 * @param moduleDefinition
	 */
	postModuleDefinition(moduleDefinition) {
		return this.restApi.post(`${this.globals.getAPIBaseUrl()}/module`, moduleDefinition)
			.pipe(
				catchError(this.handleError("ModuleDefinitionService@postModuleDefinition"))
			);
	}
	
	putModuleDefinition(moduleId, moduleDefinition) {
		const headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
		
		moduleDefinition.id = moduleId;
		return this.restApi.post(`${this.globals.getAPIBaseUrl()}/module/updatemodulev1`, JSON.stringify(moduleDefinition), {headers: headers})
			.pipe(
				catchError(this.handleError("ModuleDefinitionService@postModuleDefinition"))
			);
	}
	
	getDirtyValues(form: any) {
		let dirtyValues = {};
		
		Object.keys(form.controls)
		.forEach(formControlName => {
			const currentControl = form.controls[formControlName];
			
			if (currentControl.dirty) {
				if (currentControl.controls) { //dirtyValues[formControlName] = this.getDirtyValues(currentControl);
					let tmpDirtyValue = {};
					if (currentControl.controls["moduleStatus"] && currentControl.controls["moduleStatus"].dirty) {
						tmpDirtyValue["moduleStatus"] = currentControl.controls["moduleStatus"].value;
					} else if (currentControl.controls["moduleField"] && currentControl.controls["moduleField"].dirty) {
						tmpDirtyValue["moduleField"] = currentControl.controls["moduleField"].value;
					} else if (currentControl.controls["moduleType"] && currentControl.controls["moduleType"].dirty) {
						tmpDirtyValue["moduleType"] = currentControl.controls["moduleType"].value;
					}
					
					dirtyValues[formControlName] = tmpDirtyValue;
				} else {
					dirtyValues[formControlName] = currentControl.value;
				}
			}
		});
		
		return dirtyValues;
	}
	
	// endregion
	
	private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return of(error);
		};
	}
}
