import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {GlobalVariables} from "../../../../global-variables.service";

@Injectable({
	providedIn: "root"
})
export class LocationsService {
	
	constructor(private restApi: HttpClient, private globalVariables: GlobalVariables) {
	}
	
	saveLocation(postVariables: any ): Observable<any> {
			
		return this.restApi.post(`${environment.iserveApiUrl}/location/saveLocationData`, {
			locationInfo : {
				address  : postVariables.address,
				locationType  : postVariables.locationType,
				location  : postVariables.location,
				latitude : postVariables.latitude,
				longitude : postVariables.longitude,
				systemAdded  : true
			},
			id: postVariables.id,
			available:"yes"
		})
		.pipe(
			tap((response: any) => {
				
			}),
			catchError((error: HttpErrorResponse) => {
				if (error.error instanceof ErrorEvent) {
					console.error('An error occurred:', error.error.message);
				} else {
				console.error(
					`Backend returned code ${error.status}, ` +
					`body was: ${error.error}`);
				}
				return throwError(
				'Something bad happened; please try again later.');
			})
		);
	}

	deleteLocation(postVariables: any ): Observable<any> {
			
		return this.restApi.post(`${environment.iserveApiUrl}/location/deleteLocationData`, {
			ids: postVariables.id.toString()
		})
		.pipe(
			tap((response: any) => {
				
			}),
			catchError((error: HttpErrorResponse) => {
				if (error.error instanceof ErrorEvent) {
					console.error('An error occurred:', error.error.message);
				} else {
				console.error(
					`Backend returned code ${error.status}, ` +
					`body was: ${error.error}`);
				}
				return throwError(
				'Something bad happened; please try again later.');
			})
		);
	}

	 listTelVehicles() : any{
		let headers = new HttpHeaders();
		//headers = headers.set('Content-Type', 'application/json; charset=utf-8');
		//headers = headers.set('Authorization', 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhemFhZCIsImV4cCI6MTU3NjIxNDY2NywiaWF0IjoxNTc2MTcxNDY3fQ.6y0_EPfV78kvjbgAmyZl4AakaD_nqrGzqzXCYuT6TRuomi-79JOw6_l6buXehnkB3fiBYVRrUwSJS5TEoyGh9g');
		return this.restApi.get(`${environment.iserveApiUrl}/vehicle/listTelVehicles`, {headers: headers})

	}
	
	private handleError(operation = "operation", result?: any) {
		
	}

}
