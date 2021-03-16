import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {GlobalVariables} from "../../../../../global-variables.service";
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';

@Injectable({
	providedIn: 'root'
})
export class CreateItemService {
	
	constructor(private restApi: HttpClient, private globalVariables: GlobalVariables, private snackBarService: SnackbarService) {
	}
	
	/**
	 * Creates a new Item in the database
	 *
	 * @param moduleId
	 * @param typeId
	 * @param value
	 * @param multiValues
	 * @param attachments
	 */
	createNewItem (moduleId, typeId, value: any, multiValues?, attachments?) {
		let formData = new FormData();
		
		let body: any = {
			moduleId: moduleId,
			deleted: false,
		};
		if (multiValues && multiValues.length > 0) {
			body.multiValues = JSON.stringify(multiValues);
		}
		if (value && Object.keys(value).length > 0) {
			value.type_id = typeId;
			body.value = JSON.stringify(value);
		}
		
		if(attachments && attachments.length>0){
			const files: Array<File> = attachments;
			for(let i = 0; i < files.length; i++){
				formData.append("attachments", files[i], files[i]['name']);
			}
		}

		formData.append("modulevalue", JSON.stringify(body));
		
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue`, formData)
			.pipe(
				tap((response: any) => {
				
				}),
				catchError(this.handleError("CreateItem@createNewItem"))
			);
	}
	
	incidentCreated(id:any, data: any) {
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues`, {
			id: id,
			value: JSON.stringify(data)
		});
	}
	
	
	getModule(moduleId, referenceValues) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/reference?moduleId=${moduleId}&keys=${referenceValues.join(",")}`)
		.pipe(
			tap((response: any) => {
			
			}),
			catchError(this.handleError("CreateItem@createNewItem"))
		);
	}
	
	// http://localhost:8100/modulevalue/referencevalue?valueId=98&keys=name,age
	// http://80.227.151.58:8100/modulevalue/reference?moduleId=23
	
	private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);

			if(error.status == 400 && error.error && error.error.error && error.error.error != ""){
				// console.log(error.error.error);
				this.snackBarService.open(error.error.error, "", 5000);
			}
			
			return of(error);
		};
	}
}
