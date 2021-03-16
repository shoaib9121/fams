import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
 
@Injectable({
	providedIn: 'root'
})
export class JWTInterceptorService {
 
    private pendingHTTPRequests$ = new Subject<void>();
 
  constructor() { }
 
  // Cancel Pending HTTP calls
  public cancelPendingRequests() {
    this.pendingHTTPRequests$.next();
  }
 
  public onCancelPendingRequests() {
    // let obj :any  
    // return obj;
    return this.pendingHTTPRequests$.asObservable();
  }
 
}