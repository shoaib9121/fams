import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { GlobalVariables } from "../../../../../global-variables.service";

@Injectable({
	providedIn: "root"
})
export class AssetReportService {
	
	constructor (private restApi: HttpClient, private globalVariables: GlobalVariables) {
	}
	
	getAssets () {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getassetsummary`)
			.pipe(
				tap((response: any) => {
				
				}),
				catchError(this.handleError("Upload Item"))
			);
	}
	
	
	fetchAssetsById (id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/${id}`)
			.pipe(
				tap((response: any) => {
				
				}),
				catchError(this.handleError("Upload Item"))
			);
	}
	
	postAssets (moduleId, typeId, data: any) {
		data.type_id = typeId;
		let formData = new FormData();
		formData.append("modulevalue", JSON.stringify({
			moduleId: moduleId,
			value: JSON.stringify(data),
			deleted: false,
		}));
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue`, formData)
			.pipe(
				tap((response: any) => {
				
				}),
				catchError(this.handleError("CreateAssetReport@createNewAssetreport"))
			);
	}
	
	updateAssets (id, data: any) {
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues`, {
			id: id,
			value: JSON.stringify(data)
		})
			.pipe(
				tap((response: any) => {
				
				}),
				catchError(this.handleError("CreateAssetReport@createNewAssetreport"))
			);
	}
	
	downloadAssets (assets): Observable<HttpResponse<ArrayBuffer>> {
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/exportassetreport`, assets)
			.pipe(
				tap((response) => {
					console.log(response);
				}),
				catchError(this.handleError("Upload Item"))
			);
	}
	
	private handleError (operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return of(error);
		};
	}
}
