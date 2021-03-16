import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {GlobalVariables} from 'src/app/global-variables.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class RolesService {
	
	constructor(private globals: GlobalVariables, private restApi: HttpClient) {
	}
	
	/**
	 * Fetches user userRoles
	 */
	fetchRoles(): Observable<any> {
		return this.restApi.get(`${this.globals.getAPIBaseUrl()}/role/list`)
		.pipe(
			catchError(this.handleError("RolesService@fetchRoles"))
		);
	}
	
	addRole(data) {
		return this.restApi.post(`${this.globals.getAPIBaseUrl()}/role`, {
			moduleId: 5,
			deleted: false,
			value: JSON.stringify(data)
		})
		.pipe(
			catchError(this.handleError("RolesService@fetchRoles"))
		);
	}
	
	updateRole(rowId, data) {
		return this.restApi.post(`${this.globals.getAPIBaseUrl()}/updatejsonvalues`, {
			id: rowId,
			moduleId: 5,
			deleted: false,
			value: JSON.stringify(data)
		})
		.pipe(
			catchError(this.handleError("RolesService@fetchRoles"))
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
