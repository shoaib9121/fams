import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TelematicsService {

  constructor(	private restApi: HttpClient) { }


  /**fetch the list of vehicles */
  
  fetchListOfTelematicsVehicles(){
		return this.restApi
		.get(`${environment.iserveApiUrl}/telematics/listTelVehicles?apiKey=NJHFASFKJ1515AF256JA983592385HDGSKGDKDJF279511520`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("telematicsService@fetchListOfTelematicsVehicles"))
		);
	}

/**getTelematicsVehicles */

	getTelmaticsVehicle(row)
	{
		console.log(row.iserveVehicleId)
		return this.restApi
		.get(`${environment.iserveApiUrl}/telematics/getTelVehicle?vehicleId=`+row.iserveVehicleId+`&apiKey=NJHFASFKJ1515AF256JA983592385HDGSKGDKDJF279511520`)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("telematicsService@fetchListOfTelematicsVehicles"))
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
