import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, takeUntil, filter } from "rxjs/operators";
import { Router, ActivationEnd, ChildActivationEnd, NavigationStart } from "@angular/router";
import { JWTInterceptorService } from "./jwt.interceptor.service";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
	
	constructor (router: Router, private httpCancelService: JWTInterceptorService) {
		router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe((event: NavigationStart) => {
			this.httpCancelService.cancelPendingRequests();
		});
	}
	
	
	/**
	 * Intercepts
	 *      - Auth Token in Header
	 *      - Application ID in Params (in URL PARAMS)
	 *
	 * @param request
	 * @param next
	 */
	intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (request.url.indexOf("user/login") < 0) {
			let httpParams = new HttpParams();
			if (request.method != "POST" && request.url.indexOf("mdi.svg") < 0) {
				httpParams = httpParams.set("appId", this.getCurrentApplicationID());
			}
			request = request.clone({
				setHeaders: {
					Authorization: "Bearer " + this.getJWT()
				},
				params: httpParams
			});
		}
		return next.handle(request)
			.pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()),
				tap((response: any) => {
					if(response.hasOwnProperty('body') && typeof response.body === 'object' && response.body.hasOwnProperty('status') ) {
						response.body.status = response.body.status === 'OK' ? 200 : response.body.status;
					}
				}),
				catchError(this.handleError("Interceptor"))
			);
	}
	
	getJWT (): string {
		return window.localStorage.getItem("jwt");
	}
	
	/**
	 * Loads application navigation structure for whole platform from local storage
	 */
	loadAppStructure (): any {
		const appNav = JSON.parse(window.localStorage.getItem("app_structure"));
		if (!appNav) {
			window.location.replace("/#/login");
		}
		return appNav;
	}
	
	/**
	 * Returns current Application ID
	 */
	getCurrentApplicationID () {
		let appStructure = this.loadAppStructure();
		return appStructure.find(app => app.route == window.location.hash.split("/")[2]).id;
	}
	
	/**
	 * Logs out the user locally (removes all local storage vars, except the language preference)
	 */
	logoutLocally (): void {
		const language = window.localStorage.getItem("lang");
		window.localStorage.clear();
		window.localStorage.setItem("lang", language);
	}
	
	/**
	 * Handles error on a "global level"
	 * If any error - clears storage of API Calls
	 *
	 * @param operation
	 * @param result
	 */
	private handleError (operation = "operation", result?: any) {
		return (error: HttpErrorResponse): Observable<any> => {
			if (error instanceof HttpErrorResponse) {
				if (error.status === 401) {
					this.logoutLocally();
					window.location.pathname = "/#/login";
				}
			}
			
			window.localStorage.removeItem("CACHE_STORAGE");
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return throwError(error);
		};
	}
}
