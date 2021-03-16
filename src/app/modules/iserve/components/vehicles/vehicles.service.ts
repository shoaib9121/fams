import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {environment} from "../../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {GlobalVariables} from "../../../../global-variables.service";

@Injectable({
	providedIn: "root"
})
export class VehicleService {
	
	constructor(private restApi: HttpClient, private globalVariables: GlobalVariables) {
	}
	
	saveVehicle(postVariables: { tel_asset_id: number, iserveId: string, available: string, vehicleGroup: string, id : number }): Observable<any> {
		return this.restApi.post(`${environment.iserveApiUrl}/vehicle/saveVehicleData`, {
			vehicleInfo : {
				tel_asset_id : postVariables.tel_asset_id,
				iserveId  : postVariables.iserveId,
				currentStatus : "active",
				vehicleGroup : postVariables.vehicleGroup,
			},
			available  : postVariables.available,
			id : postVariables.id
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
