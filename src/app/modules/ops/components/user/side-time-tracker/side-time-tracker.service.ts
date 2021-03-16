import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {GlobalVariables} from "../../../../../global-variables.service";
import { TimeTrackingModel } from "./side-time-tracker.model";

@Injectable({
	providedIn: 'root'
})
export class TimeTrackingService {
	
	constructor(private restApi: HttpClient, private globalVariables: GlobalVariables) {
    }

    /**
     * Time Tracking Request for Start, Stop, Pause, and Resume
     */
    postTimeTrackingAPI(data: TimeTrackingModel) {
        let body: any = {
            id: +data.id,
        };
        let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
        body.value = JSON.stringify(data.value);

		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/timer`, body, {headers: header})
		.pipe(
			tap((response: any) => {
				
			}),
			catchError(this.handleError("Timer Tracking"))
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