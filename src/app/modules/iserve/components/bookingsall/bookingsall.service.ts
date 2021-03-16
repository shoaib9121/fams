import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingsallService {

  constructor(private restApi: HttpClient) { }

  //get dashboard datas
  getDrawerImages(id) : any{
		let headers = new HttpHeaders();
	  return this.restApi.get(`${environment.iserveApiUrl}/booking/getDamageImages?id=`+id, {headers: headers})

  }
}
