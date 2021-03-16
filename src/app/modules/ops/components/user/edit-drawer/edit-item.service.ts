import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse, HttpHeaders } from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {GlobalVariables} from "../../../../../global-variables.service";
import { SnackbarService } from 'src/app/modules/core/shared/services/snackbar/snackbar.service';

@Injectable({
	providedIn: 'root'
})
export class EditItemService {
	
	public shouldRefreshViewOnClose: boolean;

	constructor(private restApi: HttpClient, private globalVariables: GlobalVariables, private snackBarService: SnackbarService) {
	}
	
	downloadFilesAsZip(url, id: any, fileIds: any): Observable<HttpResponse<Blob>> {
		return this.restApi.get(url)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}
	
	uploadAttachment(params) {
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/attachment/uploadfile`, params)
		.pipe(
			tap((response: any) => {
			
			}),
			catchError(this.handleError("Upload Item"))
		);
	}
	
	getAttachementList(id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/attachment/modulevalue/` + id)
		.pipe(
			tap((response: any) => {
			
			}),
			catchError(this.handleError("Upload Item"))
		);
	}
	
	chatUpdate(data) {
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/comment`, data)
		.pipe(
			tap((response: any) => {
			
			}),
			catchError(this.handleError("Update Chat"))
		);
	}
	
	getChatList(id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/comment/modulevalue/` + id)
		.pipe(
			tap((response: any) => {
			
			}),
			catchError(this.handleError("Get Chat List"))
		);
	}
	
	getLogList(id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/valuelog/modulevalue/` + id)
		.pipe(
			tap((response: any) => {
			
			}),
			catchError(this.handleError("EditItemService@getLogList"))
		);
	}
	
	public getActivityList(id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/metadata/` + id)
		.pipe(
			tap((response: any) => {
				this.processActivityListData(response);
			}),
			catchError(this.handleError("EditItemService@getActivityList"))
		);
	}

	/**
	 * Filtering some fields, adding some additional attributes to render data as needed
	 */
	public processActivityListData(response) {
		let activities = response.content;
		if (activities.length) {
			activities.forEach((activity: any) => {

				activity.createdAtShow = this.globalVariables.timeStampToDateTimeFormat(activity.createdAt);

				// For Log type
				if(activity.type === 'log') {
					if(activity.hasOwnProperty("log")) {
						activity.log = this.getValidLogTypeFields(activity.log);
						activity.fieldCount = this.getValidFieldsCount(activity.log);
						activity.isStatusValueEmpty = this.isStatusFieldEmpty(activity.log);
						activity.fieldKeys = Object.keys(activity.log).length ? Object.keys(activity.log) : [];
						activity.hasKeyStatus = activity.log.hasOwnProperty("status");
					}
					activity.updatedBy = this.getUpdatedBy(activity.updatedBy);
				}
				
				// For Comment type
				if(activity.type === 'comment') {
					activity.createdBy = this.getUpdatedBy(activity.createdBy);
				}

				// For Attachment type
				if(activity.type === 'attachment') {
					activity.fileValue = JSON.parse(activity.fileValue);
				}
			})
		}
		return response;
	}
	
	public getUpdatedBy(updatedBy) {
		if (updatedBy == JSON.parse(window.localStorage.getItem("user_info")).name[this.globalVariables.LNG].toLowerCase()) {
			return this.globalVariables.translation["You"][this.globalVariables.LNG];
		}

		return updatedBy;
	}

	public getValidLogTypeFields(log): any {
		let keys = Object.keys(log);
		keys.forEach((value) => {
			
			if(this.globalVariables.isNameObject(log[value].name)) {
				log[value].name = log[value].name[this.globalVariables.LNG];
			}

			if (value != 'status') {
				if (log[value].updatedValue != '' || log[value].originalValue != '') {

					// If en/ar object is inside name attribute
					if(log[value].updatedValue.hasOwnProperty("name") && this.globalVariables.isNameObject(log[value].updatedValue.name)) {
						log[value].updatedValue = log[value].updatedValue.name[this.globalVariables.LNG];
					}
					if(log[value].originalValue.hasOwnProperty("name") && this.globalVariables.isNameObject(log[value].originalValue.name)) {
						log[value].originalValue = log[value].originalValue.name[this.globalVariables.LNG];
					}

					// If en/ar object exists
					if(this.globalVariables.isNameObject(log[value].updatedValue)) {
						log[value].updatedValue = log[value].updatedValue[this.globalVariables.LNG];
					}

					if(this.globalVariables.isNameObject(log[value].originalValue)) {
						log[value].originalValue = log[value].originalValue[this.globalVariables.LNG];
					}
				}
			}
		});
		return log;
	}

	public getValidFieldsCount(element) {
		let keys = Object.keys(element);
		let count = 0;
		keys.forEach(function (value) {
			if (value != 'status') {
				if (element[value].updatedValue != '' || element[value].originalValue != '') {
					count++;
				}
			}
		});
		return count;
	}

	/**
	 * This method sets value for isStatusValueEmpty(boolean) to not display status field_id whose updatedValue = '' regardless any type of value for originalValue. If later we consider originalValue then modify checks accordingly in this method.
	 */
	public isStatusFieldEmpty(log): boolean {
		let keys = Object.keys(log);
		keys.forEach((value) => {
			
			if (value == 'status') {
				if (log[value].updatedValue === '' && log[value].originalValue === '') {
					log.isStatusValueEmpty = true;
				}
				else {
					if(log[value].updatedValue === '') {
						log.isStatusValueEmpty = true;
						return; 
					}

					log.isStatusValueEmpty = false;
				}
			}
		});
		return !!log.isStatusValueEmpty;
	}

	public updateItem(id, data, multiValues?, triggerConfig?) {
		let body: any = {
			id: +id,
		};
		if (Object.keys(data)) {
			body.value = JSON.stringify(data);
		}
		if (multiValues && multiValues.length > 0) {
			body.multiValues = JSON.stringify(multiValues);
		}
		if (triggerConfig) {
			body.trigger = triggerConfig.trigger;
			body.typeId = +triggerConfig.typeId;
		}
		
		body.appId = this.globalVariables.getCurrentApplicationID();
		
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues?appId=`+this.globalVariables.getCurrentApplicationID(), body);
	}
	
	public fetchItemDetails(id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/${id}`)
		.pipe(
			tap((response) => {
			}),
			catchError(this.handleError("EditDrawerService@loadClaimDetails"))
		);
	}
	
	public fetchLinkedItems(moduleId, linkedId, linkedKey) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/linkedvaluesV2?linkedKey=${linkedKey}&id=${linkedId}`)
			.pipe(
				tap((response) => {
				}),
				catchError(this.handleError("EditDrawerService@loadClaimDetails"))
			);
	}
	
	public getACtionButton(api, id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl() + api}${id}`, {})
		.pipe(
			tap((response) => {
				console.log(response, "resp");
			}),
			catchError(this.handleError("EditDrawerService@loadClaimDetails"))
		);
	}
	
	public postActionButton(api, id) {
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl() + api}`, {"id": id})
			.pipe(
				tap((response) => {
					console.log(response, "resp");
				}),
				catchError(this.handleError("EditDrawerService@postActionButton"))
			);
	}
	
	public actionPdfButtons(api, id) {
		return this.restApi.post(`${environment.apiUrl + api}${id}`, null)
		.pipe(
			tap((response) => {
			}),
			catchError(this.handleError("EditDrawerService@actionPdfButtons"))
		);
	}
	
	getChildRecordsBasedOnParentID(parent_id, module_id) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/workspace/getsubassets?parentId=` + parent_id + `&moduleId=` + module_id)
		.pipe(
			tap((response: any) => {
				response.content_modified = this.transformToChildRecordsTableData(
					response.content
				);
			}),
			catchError(this.handleError("EditDrawerService@getChildRecordsBasedOnParentID"))
		);
	}
	
	transformToChildRecordsTableData(response: any): any {
		// When no data - no table Structure
		if (response.length === 0 || Object.keys(response).length === 0) {
			return [];
		}
		
		let globalObject = [];
		for (
			let index = 0;
			index < Object.keys(response).length;
			index++
		) {
			let recordId = Object.keys(response)[index];
			let record = response[Object.keys(response)[index]];
			globalObject.push({
				"id": recordId,
				"type_id": record.type_id,
				"equipment_type": record.equipment_number,
				"manufacturer_id": record.manufacturer_name[this.globalVariables.LNG],
				"model_id": record.model_id,
				"model_year": record.model_year
			});
		}
		
		/*response.forEach((record, recordId) => {
          globalObject.push({"id":recordId,
            "type_id": record.type_id,
            "equipment_type":record.equipment_number,
            "manufacturer_id":record.manufacturer_id,
            "model_id":record.model_id,
            "model_year":record.model_year
          });
    });*/
		
		return [
			{
				data: globalObject
			}
		];
	}

	public getActionButtonEnableDisableState(api, id): Observable<any>{	
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl() + api}${id}`)
		.pipe(
			tap(( response: any ) => {
				console.log('action button state', response);
			}),
			catchError(this.handleError('EditDrawerService@getActionButtonEnableDisableState'))
		);
	}
	
	public downloadFile(url): Observable<HttpResponse<Blob>>{	
		return this.restApi.get(url, { headers: new HttpHeaders ({ 'Content-Type': 'application/pdf' }), responseType: 'blob'})
		.pipe(
			tap(( response: any ) => {
				console.log('file data available to download', response);
			}),
			catchError(this.handleError('EditDrawerService@downloadFile'))
		);
	}
	   
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
