import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVariables } from 'src/app/global-variables.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

	recordData;
	allowDrawerOpening: boolean;
    constructor(
		private restApi: HttpClient, private globalVariables: GlobalVariables, private router: Router
	) {
	}
	
	public sortArrayBasedOnStatusesIds(array) {
        array.sort(function(a, b) { 
			return a.status.id - b.status.id;
		});
		return array;
    }

	/**
	 * Open drawer for table record in various Dashboard types
	 *
	 */
	public openDrawerFromTableRecord(data) {
		let noNavigationChange = false;
		let url = `/apps/${this.globalVariables.getCurrentApplicationName()}/user/${this.globalVariables.getCurrentApplicationName() == "insurance" ? 'claims' : 'requests'}/${data.module_id}/${data.view_id}/${data.role_id}`;
		if (url == this.router.url) {
			noNavigationChange = true;
		}
		data.noNavigationChange = noNavigationChange;
		this.allowDrawerOpening = true;
		this.recordData = data;
		this.router.navigate([url]);
	}

	/**
	 * Get viewId, roleId, moduleId etc for table record in Dashboards
	 *
	 */
	public getViewRoleModuleIds(valueId) {
		return this.restApi
		.get( 
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getviewrolemoduleids?valueId=${valueId}`
		)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("DashboardService@getViewRoleModuleIds"))
		);
	}
    
    	
	/**
	 * Get Insurance Dashboard Data
	 *
	 */
	getInsuranceDashboardData () {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getinsuracedashboarddata`)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("DashboardService@getInsuranceDashboardData"))
			);
    }
	
	/**
	 * Get Workshop Manager Dashboard Data
	 *
	 */
	public getWorkshopManagerDashboardData() {
		return this.restApi
			.get(
				`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getworkshopmanagerdashboarddata`
			)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("DashboardService@getWorkshopManagerDashboardData"))
			);
	}

	/**
	 * Get Workshop Service Manager Dashboard Data
	 *
	 */
	public getWorkshopServiceManagerDashboardData() {
		return this.restApi
			.get(
				`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getworkshopservicemanagerdashboarddata`
			)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("DashboardService@getWorkshopServiceManagerDashboardData"))
			);
	}

	/**
	 * Get Workshop Staff Dashboard Data
	 *
	 */
	public getWorkshopStaffDashboardData() {
        return this.restApi
        .get( 
            `${this.globalVariables.getAPIBaseUrl()}/modulevalue/getworkshopstaffdashboarddata`
        )
        .pipe(
            tap((response: any) => {
            }),
            catchError(this.handleError("DashboardService@getWorkshopStaffDashboardData"))
        );
    }

	/**
	 * Get Store Dashboard Data
	 *
	 */
	public getStoreDashboardData() {
        return this.restApi
			.get(
				`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getstoredashboarddata`
			)
			.pipe(
				tap((response: any) => {
				}),
				catchError(this.handleError("DashboardStore@getStoreDashboardData"))
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
