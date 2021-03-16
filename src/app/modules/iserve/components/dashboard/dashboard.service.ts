import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private restApi: HttpClient) { }

  //get dashboard datas
  getDashboardDAta() : any{
		let headers = new HttpHeaders();
	  return this.restApi.get(`${environment.iserveApiUrl}/dashboard/getDashboardDetails`, {headers: headers})

  }
  
  //get  datas for active booking table
  getActiveBookings(): any
  {
    let headers = new HttpHeaders();
	  return this.restApi.get(`${environment.iserveApiUrl}/dashboard/getLatestBookings`, {headers: headers})
  }

  //get counts of bookings
  getBookingsSummery(): any
  {
    let headers = new HttpHeaders();
	  return this.restApi.get(`${environment.iserveApiUrl}/dashboard/getBookingSummary`, {headers: headers})
  }

  private handleError(operation = "operation", result?: any) {
		
	}
}
