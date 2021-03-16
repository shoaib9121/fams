import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { GlobalVariables } from "../../../../global-variables.service";
import { Cacheable } from "ngx-cacheable";
import { ModuleDataService } from "./module-data/module-data.service";
import { DOMStorageStrategy } from "ngx-cacheable/common/DOMStorageStrategy";
import { MediaMatcher } from "@angular/cdk/layout";

@Injectable({
	providedIn: "root"
})
export class UserService {

	constructor(
		private restApi: HttpClient,
		private globalVariables: GlobalVariables,
		private moduleDataService: ModuleDataService,
		private mediaMatcher: MediaMatcher
	) {

	}

	/**
	 * Fetches Module Data which is used for creating the form and formgroups
	 * @param moduleId
	 */
	@Cacheable(
		{
			maxCacheCount: 50,
			maxAge: 300000,
			storageStrategy: DOMStorageStrategy,
		}
	)
	fetchModuleData(moduleId: number): Observable<any> {
		return this.restApi
			.get(`${ this.globalVariables.getAPIBaseUrl() }/module/getmoduledefinition/${ moduleId }`)
			.pipe(
				tap((response: any) => {
					response.content.moduleDefinition = this.transformModuleTypes2Structure(response);
				}),
				catchError(this.handleError("UserService@fetchModuleData")),
			);
	}
	
	/**
	 * Fetches module definition
	 *
	 * @param moduleId
	 * @param moduleValues
	 */
	@Cacheable(
		{
			maxCacheCount: 50,
			maxAge: 300000,
			storageStrategy: DOMStorageStrategy,
		}
	)
	fetchReferenceModuleData(moduleId: number, moduleValues): Observable<any> {
		return this.restApi
			.get(`${ this.globalVariables.getAPIBaseUrl() }/module/getmoduledefinition/${ moduleId }`)
			.pipe(
				tap((response: any) => {
					response.content.moduleDefinition = this.transformReferenceToFormData(
						response,
						moduleValues,
					);
				}),
				catchError(this.handleError("UserService@fetchReferenceModuleData")),
			);
	}

	/**
	 * Fetches Module Data which is used for creating the form and formgroups
	 * @param moduleId
	 */
	fetchModuleMatrixData(moduleId: number): Observable<any> {
		return this.restApi
		.get(`${this.globalVariables.getAPIBaseUrl()}/module/getmoduledefinition/${moduleId}`)
		.pipe(
			tap((response: any) => {
				//console.log("Module data before", response.content);
				// response.content.moduleDefinition = this.transformModuleTypes2Structure(
				// 	response
				// );
				console.log("module data after", response.content.moduleDefinition);
			}),
			catchError(this.handleError("UserService@fetchModuleData"))
		);
	}


	/**
	 * Fetches Values of a module
	 * @param valueId
	 * @param keys      - for this keys we will get the values
	 */
	@Cacheable(
		{
			maxCacheCount: 50,
			maxAge: 300000,
			storageStrategy: DOMStorageStrategy,
		}
	)
	fetchModuleValue(valueId: number, keys: string[]) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/referencevalue?valueId=` + valueId + `&keys=` + keys.join(",") + ``)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("CreateItem@createNewItem"))
		);
	}

	/**
	 * Fetches Values of a module
	 * @param valueId
	 * @param field_id      - for this keys we will get the values
	 */
	@Cacheable(
		{
			maxCacheCount: 50,
			maxAge: 300000,
			storageStrategy: DOMStorageStrategy,
		}
	)

	fetchSelectNameValue(valueId: number, field_id: string) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/referencevalue?valueId=` + valueId + `&keys=` + field_id)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("CreateItem@createNewItem"))
		);
	}

	/**
	 * Fetches Values of a module
	 * @param valueId
	 * @param keys      - for this keys we will get the values
	 */

	fetchModuleReferenceKeysValue(valueId: number, keys: string[], referenceKeys: any,reference_value_api?:any, formData?:any) {

		let body;
		if (reference_value_api && reference_value_api.length > 0) {
			body = this.checkReferenceValueAPI(reference_value_api, formData, referenceKeys);
		} else {
			body = JSON.stringify(referenceKeys);
		}
		return this.restApi.post(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/referencevalue?valueId=` + valueId + `&keys=` + keys, body)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("CreateItem@createNewItem"))
		);
	}

	checkReferenceValueAPI(reference_value_api, formData, referenceKeys) {
		let body;
		const referenceValueApi = JSON.parse(JSON.stringify(reference_value_api[0]));
		referenceValueApi.return_field_ids = [Object.keys(referenceValueApi.mapping).join(",")];
		delete referenceValueApi["mapping"];
		delete referenceValueApi["type"];
		if (formData && formData.length > 0) {
			body = { current_data: this.getFlattenObject(formData) };
		}
		if (body == null) { body = {} };
		for (var key in referenceValueApi) {
			body[key] = referenceValueApi[key];
		}
		body.reference_keys = referenceKeys ? referenceKeys.reference_keys : referenceKeys;
		body = JSON.stringify(body);
		return body;
	}

	/**
	 * Converting mutiple objects into one
	 *
	 */
	getFlattenObject(formData) {
		let formArray;
		if (formData && formData.length > 0) {
			const value = formData;
			formArray = value.reduce(function (result, current) {
				return Object.assign(result, current);
			}, {});
		}
		return formArray;
	}

	/**
	 * Fetches Values against search query of a module
	 * @param referenceModuleId
	 * @param keyShow
	 * @param query       //searching query
	 */
	fetchModuleReferenceValues(referenceModuleId: number, keyShow: string, query: string) {
		return this.restApi.get(`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchreferencevalue?referenceModuleId=` + referenceModuleId + `&keyShow=` + keyShow + `&query=` + query + ``)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("CreateItem@createNewItem"))
		);
	}
	
	/**
	 * Fetches Permission Matrix / View Settings
	 * Based on this application knows what and how to display the information to the user
	 *
	 * @param viewId
	 * @param moduleId
	 * @param roleId
	 * @param moduleFields      - used for conversion of permission matrix fields (fields that is user allowed to see)
	 * @param searchKeys        - used for parent/child relations - we search for those keys in the child view
	 * @param searchString      - used for parent/child relations - we search for this string in the child view
	 * @param searchStructure   - used for searching across records of a view - we pass to the backend in which fields the user wants to search in
	 * @param searchQuery       - used for searching across records of a view - we want to search against the query in the searchStructure
	 */
	fetchPermissionMatrix (viewId: number, moduleId: number, roleId: number, moduleFields, searchKeys?, searchString?, searchStructure?, searchQuery?) {
		let observable$: Observable<any>;
		
		let search = "";
		if (searchKeys && searchString) {
			// For handling parent/child relations
			search = `&searchKeys=${searchKeys.join(",")}&searchString=${searchString}`;
		}
		
		if (searchQuery) {
			// With Search Query
			observable$ = this.restApi
				.post(`${this.globalVariables.getAPIBaseUrl()}/workspace/viewpermissionsV2SearchStructure`, {
					viewId: +viewId,
					moduleId: +moduleId,
					roleId: +roleId,
					showMatrix: true,
					searchQuery: searchQuery,
					searchStructure: JSON.stringify(searchStructure)
				});
		} else {
			// Without Search Query
			observable$ = this.restApi
				.get(`${this.globalVariables.getAPIBaseUrl()}/workspace/viewpermissionsV2?viewId=${viewId}&moduleId=${moduleId}&roleId=${roleId}${search}&showMatrix=true`);
		}
		
		return observable$.pipe(
			tap((response: any) => {
				this.handleResponseOfPermissionMatrix(response, moduleFields);
			}),
			catchError(this.handleError("UserService@fetchPermissionMatrix"))
		);
	}
	
	/**
	 * Handles needed transformations based on the response of the permission matrix api
	 *
	 * @param response
	 * @param moduleFields
	 */
	handleResponseOfPermissionMatrix(response, moduleFields) {
		response.content.form_fields                         = this.joinFieldsWithDefinition(response.content.permissions.form_fields, moduleFields);
		// assigning the previous statement again in a new variable, because .form_fields is being processed and manipulated and we need the original form for further operation
		response.content.permissions.form_fields_transformed = this.joinFieldsWithDefinition(response.content.permissions.form_fields, moduleFields);
		response.content.permissions.type_groups             = this.generateTypeGroups(response.content.permissions.type_groups);
		response.content.tableData                           = this.transformToTableDataV2(response.content);
		response.content.permissions.type                    = this.removeUnwantedTableFields(response.content);
		
		// If the permission matrix is grouped by and grouped by status - we are grouping the table data by the status
		if (response.content.permissions.group_by && response.content.permissions.group_by.length > 0 && response.content.tableData.length > 0) {
			if (response.content.permissions.group_by[0].field_id === "status") {
				response.content.tableData = this.groupTableData(response.content.tableData, "status");
			}
		} else {
			response.content.tableData = this.setNonGroupPaginationInfo(response.content.tableData);
		}
	}

	fetchPermissionMatrixOld(viewId: number, moduleId: number, roleId: number, moduleFields, searchKeys?, searchString?) {
		let search = "";
		if (searchKeys && searchString) {
			search = `&searchKeys=${searchKeys.join(",")}&searchString=${searchString}`;
		}

		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/workspace/viewpermissions?viewId=${viewId}&moduleId=${moduleId}&roleId=${roleId}${search}`
		)
		.pipe(
			tap((response: any) => {
				response.content.form_fields = this.joinFieldsWithDefinition(response.content.permissions.form_fields, moduleFields);
				response.content.permissions.type_groups = this.generateTypeGroups(response.content.permissions.type_groups);
				response.content.tableData = this.transformToTableData(response.content);
				response.content.permissions.type = this.removeUnwantedTableFields(response.content);
				if (response.content.permissions.group_by && response.content.permissions.group_by.length > 0 && response.content.tableData.length > 0) {
					if (response.content.permissions.group_by[0].field_id === "status") {
						response.content.tableData = this.groupTableData(response.content.tableData, "status");
					}
				}
			}),
			catchError(this.handleError("UserService@fetchPermissionMatrix"))
		);
	}

	 /**
	  * Fetches ISSUE Permission Matrix / View Settings
	  *
	  * @param api
	  */
	fetchIssuePermissionMatrix(api, searchString) {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/${api}&${searchString}`
		)
		.pipe(
			tap((response: any) => {
				if (response.content.hasOwnProperty("parentView")) {
					response.content.parentView.parentViewTableData = this.transformToTableData(response.content.parentView);
					response.content.parentView.permissions.type = this.removeUnwantedTableFields(response.content.parentView);
					response.content.childView.childViewTableData = this.transformToTableData(response.content.childView);
					response.content.childView.permissions.type = this.removeUnwantedTableFields(response.content.childView);

					if (response.content.childView.permissions.group_by && response.content.childView.permissions.group_by.length > 0 && response.content.childView.childViewTableData.length > 0) {
						if (response.content.childView.permissions.group_by[0].field_id === "status") {
							response.content.childView.childViewTableData = this.groupTableData(response.content.childView.childViewTableData, "status");
						}
					}
				}
			}),
			catchError(this.handleError("UserService@fetchPermissionMatrix"))
		);
	}

	/**
	 * Transforms each field from backend structure into form for frontend structure
	 *
	 * @param response
	 * @param moduleValues  - these keys are added in the returned value
	 */
	transformReferenceToFormData(response, moduleValues) {
		if (!response.content.columns.module_fields) {
			return;
		}
		let moduleDefinition = [];
		response.content.columns.module_fields.forEach((field, fieldIndex) => {
			let isInModuleValues = moduleValues.find(
				moduleValue => moduleValue === field.field_id
			);
			if (isInModuleValues) {
				moduleDefinition.push(this.transformToFormField(field, false, false));
			}
		});

		return moduleDefinition;
	}

	/**
	 * Generates Type Groups if there in the permission matrix
	 *
	 * @param typeGroups
	 */
	generateTypeGroups(typeGroups) {
		if (!typeGroups || typeGroups.length === 0) {
			return;
		}

		typeGroups.forEach((typeGroup, typeGroupIndex) => {
			typeGroup.values.forEach((typeId, typeIdIndex) => {
				let type = this.moduleDataService.getType(typeId);
				if (type) {
					typeGroup.values[typeIdIndex] = {
						id: type.id,
						name: type.name,
						icon: type.icon,
						flow_image: type.flow_image,
					};
				}
			});
		});

		return typeGroups;
	}

	/**
	 * Groups Data for table by provided field_id
	 *
	 * @param tableData
	 * @param groupByFieldId
	 */
	groupTableData(tableData, groupByFieldId) {
		if (!tableData || tableData.length == 0) {
			return;
		}
		let newTableData = [];
		for (let i = 0; i < tableData[0].data.length; i++) {
			let row = tableData[0].data[i];
			let pageInfo: any = {};
			if(row.hasOwnProperty("pageInfo")) {
				pageInfo = row.pageInfo;
				pageInfo.groupParam = groupByFieldId;
			}

			if (i === 0) {
				let temp: any = {
					group: row[groupByFieldId],
					data: [],
				}
				if(row.hasOwnProperty("pageInfo")) {
					temp.pageInfo = pageInfo;
				}

				newTableData.push(temp);
			}
			let index = newTableData.findIndex(group => group.group == row[groupByFieldId]);
			if (index > -1) {
				newTableData[index].data.push(row);
			} else {

				let temp: any = {
					group: row[groupByFieldId],
					data: [row],
				}
				if(row.hasOwnProperty("pageInfo")) {
					temp.pageInfo = pageInfo;
				}

				newTableData.push(temp);
			}
		}

		return newTableData;
	}

	setNonGroupPaginationInfo(tableData) {

		let newTableData = [];
		if(tableData[0].data.length > 0){
			tableData[0].pageInfo = tableData[0].data[0].pageInfo; // because pageInfo in each record is same
			newTableData = tableData;
		}
		if(newTableData.length < 1){
			newTableData = tableData;
		}
		return newTableData;
	}

	createType(moduleId: number, data) {
		return this.restApi.post(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue`,
			{
				moduleId: moduleId,
				deleted: false,
				value: JSON.stringify(data)
			}
		);
	}

	/**
	 * Returns an array with the module definition - user is allowed to see all these fields
	 *
	 * @param allowedFormFields
	 * @param moduleFormFields
	 */
	joinFieldsWithDefinition(allowedFormFields, moduleFormFields) {
		let formFieldsConverted = [];

		allowedFormFields.forEach(fieldPermissions => {
			if (moduleFormFields[fieldPermissions.id]) {
				moduleFormFields[fieldPermissions.id].view = fieldPermissions.view;
				moduleFormFields[fieldPermissions.id].update = fieldPermissions.edit;
			}
			formFieldsConverted.push(moduleFormFields[fieldPermissions.id]);
		});

		return formFieldsConverted;
	}

	isObject(item): boolean {
		return item !== null && typeof item == 'object';
	}

	getFieldValue(field: any) {
		if (this.globalVariables.isNameObject(field)) {
			try {
				return JSON.parse(field)[this.globalVariables.LNG];
			} catch {
				return field[this.globalVariables.LNG];
			}
		} else if (this.isObject(field)) {
			// if it is an object, we don't know what we have to show, so we show the first property of it
			return field[Object.keys(field)[0]];
		} else if (field === null || field === "null") {
			return "";
		} else if (!this.isObject(field)) {
			return field;
		}

		return field;
	}

	transformToTableData(response: any): any {
		// get all type ids
		response.permissions.typeIds = Object.keys(response.permissions.type);
		// When no data = no table Structure
		if (Object.keys(response.data).length === 0 || (response.data && response.data[Object.keys(response.data)[1]].length == 0)) {
			return [];
		}

		let globalObject = [];
		let index = 0;

		response.data.type_id.forEach((typeId) => {

			let tmpObj = {};

			response.permissions.type[typeId].forEach((field, fieldIndex) => {

				let tmpArray = [];

				if (field.type == "table" || field.type == "table_object") {
					try {
						let tmpTable = JSON.parse(response.data[field.keys[0]][index]);

						if (tmpTable && tmpTable != "null" && tmpTable != null) {
							for (let table of tmpTable) {
								let tableArray = [];
								if (field.type == "table"){
									for (let index of field.indexes) {
										tableArray.push(table[index]);
										// console.log("TABLE", table[index]);
									}
								}
								else if (field.type == "table_object"){
									for (let index of field.index_fields) {
										tableArray.push(table[index]);
										// console.log("TABLE", table[index]);
									}
								}
								tmpArray.push(tableArray);
							}
						} else {
							if(field.type != "table_object")
								tmpArray.push(new Array(field.indexes.length));
						}
					} catch (exception) {
						tmpArray.push(new Array(field.indexes.length));
						console.debug(exception);
					}

					tmpObj[field.field_id] = tmpArray;
				} else {
					field.keys.forEach((field_id, keyIndex) => {
						let indexOfDot = field_id.lastIndexOf(".");
						let value: any;

						// field type handling
						if (field.type === "frontend_module_type_name") {
							value = [this.getFieldValue(this.moduleDataService.getTypeName(response.data[field_id][index]))];
							field.front_end_type = [
								{
									type: "text",
									tooltip: this.globalVariables.translation["type_name_" + this.globalVariables.getCurrentApplicationName()],
									newline: false,
								}
							];
						} else {
							if (indexOfDot > -1) {
								value = response.data[field_id.substring(0, indexOfDot)][index] ?
									response.data[field_id.substring(0, indexOfDot)][index][field_id.substring(indexOfDot + 1)] : null;
							} else {
								value = response.data[field_id][index];
							}
							value = this.getFieldValue(value);
						}

						tmpArray.push(value);
					});

					// If it is not a group just put the simple one
					tmpObj[field.field_id] = field.type == "group" ? tmpArray : tmpArray[0];
				}
			});

			globalObject.push(tmpObj);
			index++;
		});

		return [
			{
				data: globalObject
			}
		];
	}
	
	transformToTableDataV2 (response: any): any {
		response.permissions.typeIds = Object.keys(response.permissions.type);
		// When no data = no table Structure
		if (response.data.length === 0) {
			return [];
		}
		let outputObject = [];
		response.data.forEach((groupDataConfiguration) => {
			let groupData     = groupDataConfiguration.data[0]; // at index 0 the actual data is being stored
			let recordIndex   = 0;
			let pageInfo: any = {
				group:         groupDataConfiguration.group ? +groupDataConfiguration.group : null,
				recordPerPage: groupDataConfiguration.recordPerPage,
				totalRecords:  groupDataConfiguration.totalRecords,
				pageNo:        groupDataConfiguration.pageNo,
			};
			
			if (groupData.type_id.length > 0) {
				groupData.type_id.forEach((typeId) => {
					// This is the new object we are saving for one row = one record
					let transformedRecord: any = {};
					
					response.permissions.type[typeId].forEach((field, fieldIndex) => {
						let tmpArray = [];
						
						if (field.type == "table" || field.type == "table_object") {
							try {
								let tmpTable = JSON.parse(groupData[field.keys[0]][recordIndex]); //TODO: Need to test this with V2 response
								
								if (tmpTable && tmpTable != "null" && tmpTable != null) {
									for (let tableRow of tmpTable) {
										let tableArray = [];
										if (field.type == "table") {
											for (let localIndex of field.indexes) {
												// Add indexes to display to the array
												tableArray.push(this.getFieldValue(tableRow[localIndex]));
												// console.log("TABLE", table[index]);
											}
										} else if (field.type == "table_object") {
											for (let localIndex of field.index_fields) {
												// Add indexes to display to the array
												tableArray.push(this.getFieldValue(tableRow[localIndex]));
												// console.log("TABLE", table[index]);
											}
										}
										tmpArray.push(tableArray);
									}
								} else {
									if (field.type != "table_object") {
										tmpArray.push(new Array(field.indexes.length));
									}
								}
							} catch (exception) {
								tmpArray.push(new Array(field.indexes.length));
								console.debug(exception);
							}
							
							transformedRecord[field.field_id] = tmpArray;
						} else {
							field.keys.forEach((field_id, keyIndex) => {
								let indexOfDot = field_id.lastIndexOf(".");
								let value: any;
								
								// field type handling
								if (field.type === "frontend_module_type_name") {
									value                = [this.getFieldValue(this.moduleDataService.getTypeName(groupData[field_id][recordIndex]))];
									field.front_end_type = [
										{
											type:    "text",
											tooltip: this.globalVariables.translation["type_name_" + this.globalVariables.getCurrentApplicationName()],
											newline: false,
										},
									];
									
								} else {
									if (indexOfDot > -1) {
										value = groupData[field_id.substring(0, indexOfDot)][recordIndex] ?
											groupData[field_id.substring(0, indexOfDot)][recordIndex][field_id.substring(indexOfDot + 1)] : null;
									} else {
										value = groupData[field_id][recordIndex];
									}
									value = this.getFieldValue(value);
								}
								
								tmpArray.push(value);
							});
							
							// If it is not a group just put the simple one
							transformedRecord[field.field_id] = field.type == "group" ? tmpArray : tmpArray[0];
						}
					});
					
					pageInfo.searchQuery       = response.searchQuery;
					transformedRecord.pageInfo = pageInfo;
					outputObject.push(transformedRecord);
					recordIndex++;
				});
			}
		});
		
		return [
			{
				data: outputObject
			}
		];
	}

	/**
	 * Removes unwanted elements from table - elements that are needed for the data structure, but are not shown in the table view
	 * @param response
	 */
	removeUnwantedTableFields(response) {
		let unwantedTypes = ["id", "flag"];

		response.permissions.typeIds.forEach((typeId, typeIndex) => {
			let typeStructure = response.permissions.type[typeId];

			unwantedTypes.forEach((unwantedType) => {
				for (let i = typeStructure.length - 1; i >= 0; i--) {
					let findIndex = typeStructure.findIndex((structure) => structure.type == unwantedType);
					if (findIndex > -1) {
						typeStructure.splice(findIndex, 1);
					}
				}
			});
		});

		return response.permissions.type;
	}

	transformToTableDataGroupedByStatus(response: any): any {
		if (Object.keys(response.data).length === 0) {
			return [];
		}
		let dataIndex = 0;
		let globalIndex = 0;
		let globalObject = [];

		// getting all type ids
		let types = Object.keys(response.permissions.type);


		types.forEach((typeId) => {
			let type = response.permissions.type[typeId];
			for (let index = 0; index < response.data[Object.keys(response.data)[0]].length; index++) {
				type.forEach((field, typeIndex) => {
					// TODO: to be continued after status will be in data object
					if (field.type === "status") {
						if (globalObject.length === 0) {
							dataIndex = 0;
							globalObject.push({
								group: response.data[field.field_id][index],
								data: []
							});
						}
						if (
							globalObject[globalIndex]["group"] !=
							response.data[field.field_id][index]
						) {
							globalIndex++;
							dataIndex = 0;
							globalObject.push({
								group: response.data[field.field_id][index],
								data: []
							});
						}

						globalObject[globalIndex]["data"][dataIndex] = {
							[field.field_id]: response.data[field.field_id][index]
						};
					} else if (field.type === "id") {
						globalObject[globalIndex]["data"][dataIndex][field.field_id] =
							response.data[field.field_id][index];
					} else if (field.type === "group" || field.type === "group-reference") {
						let tmpArray = [];
						field.keys.forEach((field_id, keyIndex) => {
							tmpArray.push(response.data[field_id][index]);
						});
						globalObject[globalIndex]["data"][dataIndex][field.field_id] = tmpArray;
					} else {
						globalObject[globalIndex]["data"][dataIndex][field.field_id] =
							response.data[field.field_id][index];
					}

				});
			}


			dataIndex++;
		});

		return globalObject;
	}

	/**
	 * Transform data into form groups format which is needed for dynamic reactive forms
	 *
	 * @param data
	 */
	transformModuleTypes2Structure(data: any): any {
		data = data.content;
		let moduleFields = data.columns.module_fields;
		let global_view_data = [];
		// let temp = data.columns.module_types[0];
		data.columns.module_types.forEach((moduleType, moduleTypeId) => {

			let multiFieldsStructure = [];

			// Multi Groups
			/*
			let j = 0;
			if (moduleType.forms.hasOwnProperty("multi_groups")) {
				for (let form of moduleType.forms.multi_groups) {
					multiFieldsStructure.push({
						groupName: form.name,
						fields: [],
						optional: form.optional || false
					});
					for (let field of form.fields) {
						let async = false;
						let tmp = moduleFields[field];
						if (!tmp) {
							continue;
						}
						multiFieldsStructure[j].fields.push(this.transformToFormField(tmp, async));

						if (form.default_field_values !== undefined) {
							let defaultFieldValue = form.default_field_values.find(defaultFieldValue => defaultFieldValue.field == field);
							if (defaultFieldValue) {
								multiFieldsStructure[j].fields[multiFieldsStructure[j].fields.length - 1].value = defaultFieldValue.value;
							}
						}
					}
					j++;
				}
				moduleType.forms.multi_groups = multiFieldsStructure;
			}*/

			moduleType.forms.groups = this.transformGroup2Structure(moduleType, moduleFields);
			moduleType.forms.dialogs = this.transformDialogs2Structure(moduleType, moduleFields, data.id);
			global_view_data.push(moduleType);
		});

		return global_view_data;
	}

	private transformDialogs2Structure (moduleType, moduleFields, moduleId) {
		if (!moduleType.forms.hasOwnProperty("dialogs")) {
			return undefined;
		}

		let dialogNames = Object.keys(moduleType.forms.dialogs);
		for (let dialogName of dialogNames) {
			if (moduleType.forms.dialogs[dialogName].module_id == moduleId) {
				let tmpModuleType = {
					forms: {
						groups: moduleType.forms.dialogs[dialogName].groups
					}
				};
				moduleType.forms.dialogs[dialogName].groups = this.transformGroup2Structure(tmpModuleType, moduleFields);
			}
		}

		return moduleType.forms.dialogs;
	}

	private transformGroup2Structure (moduleType, module_fields) {
		if (!moduleType.forms.hasOwnProperty("groups")) {
			return [];
		}

		let fieldsTemplate = [];

		let fieldId = 0;
		for (let form of moduleType.forms.groups) {
			fieldsTemplate.push({
				groupName: form.name,
				fields: [],
				optional: form.optional || false
			});
			for (let field of form.fields) {
				let async = false;
				let tmp = module_fields[field];
				if (!tmp) {
					continue;
				}

				let transformedField = this.transformToFormField(tmp, async);

				// if (transformedField.type == "table_object") {
				// 	transformedField.columns = transformedField.columns.map((columnField) => this.transformToFormField(columnField, async));
				// }

				fieldsTemplate[fieldId].fields.push(transformedField);


				// Handling default values
				if (form.default_field_values !== undefined) {
					let defaultFieldValue = form.default_field_values.find(defaultFieldValue => defaultFieldValue.field == field);
					if (defaultFieldValue) {
						fieldsTemplate[fieldId].fields[fieldsTemplate[fieldId].fields.length - 1].value = defaultFieldValue.value; //['defaultValue']
						fieldsTemplate[fieldId].fields[fieldsTemplate[fieldId].fields.length - 1].isDefault = true;
					}
				}
			}
			if (form.sub_group) {
				let subGroupIndex = 0;
				fieldsTemplate[fieldId].subGroups = [];
				for (let subForm of form.sub_group) {
					fieldsTemplate[fieldId].subGroups.push({
						groupName: subForm.name,
						fields: [],
						optional: subForm.optional || true
					});
					for (let field of subForm.fields) {
						let async = false;
						let tmp = module_fields[field];
						let transformedField = this.transformToFormField(tmp, async);
						// if (transformedField.type == "table_object") {
						// 	transformedField.columns = transformedField.columns.map((columnField) => this.transformToFormField(columnField, async));
						// }
						fieldsTemplate[fieldId].subGroups[subGroupIndex].fields.push(transformedField);
					}
					subGroupIndex++;
				}
			}
			fieldId++;
		}

		return fieldsTemplate;
	}

	/**
	 * Transforms backend field definition to frontend field definition (represents one input element / form control)
	 *
	 * @param backendField
	 * @param isAsync
	 * @param isAllowedToUpdate
	 */
	public transformToFormField(
		backendField: any,
		isAsync: boolean,
		isAllowedToUpdate?: boolean
	) {
		let input_type = "select";
		let tableObjectColumn = "";
		if (backendField.data_type == "module-reference") {
			isAsync = true;
			input_type = "select";
		} else if (backendField.data_type == "table" ) {
			input_type = "table";
		} else if ( backendField.data_type == "table_object") {
			input_type = "table_object";
			tableObjectColumn = JSON.parse(JSON.stringify(backendField.columns.map(columnField => this.transformToFormField(columnField, isAsync, isAllowedToUpdate))));
		}  else if (backendField.data_type == "status") {
			input_type = "status";
		} else if (backendField.data_type == "date") {
			input_type = "date";
		} else if (backendField.data_type == "time") {
			input_type = "time";
		} else if (backendField.data_type == "list") {
			input_type = "staticselect";
			backendField.key_show = "name";
		} else if (backendField.data_type == "module-reference-multiple" || (backendField.data_type == "select" && backendField.multiple)) {
			input_type = "multi_select";
		} else if (backendField.data_type == "textarea") {
			input_type = "textarea";
		} else if (backendField.data_type == "name-object") {
			input_type = "name_object";
		} else if (backendField.data_type == "image") {
			input_type = "image";
		} else if (backendField.data_type == "attachments") {
			input_type = "attachments";
		}  else if (backendField.data_type == "dialog") {
			input_type = "dialog";
		} else {
			input_type = "input";
		}
		return {
			type: input_type,
			label: backendField.name,
			inputType: input_type == "status" ? input_type : backendField.data_type, // input_type,
			col: backendField.field_id,
			columns: input_type == "table_object"? tableObjectColumn : backendField.columns,
			footer: backendField.footer,
			multiple: backendField.multiple,
			key_show: backendField.key_show,
			update: isAllowedToUpdate !== undefined ? isAllowedToUpdate : true,
			value: input_type == "select" ? "" : "", // TODO: change condition to if multiselect, then [] otherwise ""
			reference_module_id: backendField.reference_module_id,
			reference_module_values: backendField.reference_module_values,
			post_reference_values: backendField.post_reference_values,
			form_default_values: backendField.form_default_values,
			form_default_values_editable: backendField.form_default_values_editable,
			async: isAsync,
			formula: backendField.formula,
			math: this.generateFormula(backendField.formula, true),
			options: backendField.list_values ? backendField.list_values : undefined,
			resetFields: backendField.reset_fields_on_change,
			filter: backendField.filter,
			allFormulaFieldsRequired: true,
			validations: backendField.validation,
			services_on_change: backendField.services_on_change,
			shouldAutofillGlobally: backendField.should_autofill_globally,
			dialog: backendField.dialog,
			dialog_inputs: backendField.dialog_inputs,
			dialog_return_value: backendField.dialog_return_value,
			dialog_return_value_data_type: backendField.dialog_return_value_data_type,
			is_system_column: backendField.is_system_column,
			reference_value_api: backendField.reference_value_api
		};
	}

	formula: string = "";

	generateFormula(formu, isMain) {
		this.formula = undefined;
		this.multiArraytoStringFormula(formu, isMain);
		if (this.formula) {
			this.formula = this.formula;
		}
		return this.formula;
	}

	/**
	 * Converting array formula to formula string.
	 *
	 * @param formu
	 * @param isMain
	 */
	multiArraytoStringFormula(formu, isMain) {
		let cal: any = [];
		if (formu != undefined) {
			if (isMain) {
				this.formula = "";
				cal.push(formu);
			} else {
				cal = formu;
			}
			cal.forEach((element, idx, array) => {
				let currEle = Object.keys(element)[0];
				if (currEle && typeof element != "string") {
					this.formula += 'this.' + currEle + "(";
					this.multiArraytoStringFormula(element[currEle], false);
					if (!isMain) {
						this.formula += ",";
					}
				} else {
					let value_field_id = this.checkFormulaElement(element);
					if (idx === array.length - 1) {

						// let value_field_id = this.checkFormulaElement(element);
						if (isNaN(value_field_id)) {
							this.formula += "'" + value_field_id + "'"; //+ '),';
						} else {
							this.formula += +value_field_id; //+ '),';
						}
					} else {
						if (isNaN(value_field_id)) {
							this.formula += "'" + value_field_id + "'" + ",";
						} else {
							this.formula += +value_field_id + ",";
						}
					}
				}
			});
			let lastChar = this.formula[this.formula.length - 1];
			if (!isMain) {
				if (lastChar == ",") {
					this.formula = this.formula.substring(0, this.formula.length - 1);
				}
				this.formula += ")";
			}
		}
	}

	checkFormulaElement(element) {
		try {
			switch (element.toLowerCase()) {
				case "global_year_end_date":
					element = this.getYearEndDate();
					break;

				case "global_total_year_days":
					element = this.getTotalYearDays();
					break;

				default:
					break;
			}
		} catch (exception) {
		}

		return element;
	}

	getYearEndDate() {
		let date: any = new Date();
		date.setYear(date.getFullYear() + 1);
		date.setMonth(0);
		date.setDate(1);
		date.setHours(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		return date - 0;
	}

	getTotalYearDays() {
		let date: Date = new Date();
		return this.isLeapYear(date.getFullYear()) ? 366 : 365;
	}

	isLeapYear(year) {
		return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
	}

	/**
	 * Updates Status of item
	 *
	 * @param data
	 */
	updateItemStatus(data) {
		// data.appId = this.globalVariables.getCurrentApplicationID();
		return this.restApi
		.post(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/updatejsonvalues?appId=${this.globalVariables.getCurrentApplicationID()}`,
			data
		)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	/**
	 * Get Claims by Year
	 *
	 * @param year
	 */
	getClaimsByYear(year) {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchclaimyear?year=` +
			year
		)
		.pipe(
			tap((response: any) => {
				const resp = response.content;
				window.localStorage.setItem("insurance_year", year);
				response.content = this.transformToTableYearWiseData(response);
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	searchClaim(data, moduleFields){
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchclaim?year=` +
			data.serachYear +
			`&claimNo=` +
			data.claimNo +
			`&viewId=` +
			data.viewId +
			`&roleId=` +
			data.roleId
		)
		.pipe(
			tap((response: any) => {
				//response.content.permissions = response.content.permissions[0]
				response.content.form_fields = this.joinFieldsWithDefinition(response.content.permissions.form_fields, moduleFields);
				response.content.permissions.type_groups = this.generateTypeGroups(response.content.permissions.type_groups);
				response.content.tableData = this.transformToTableData(response.content);
				response.content.permissions.type = this.removeUnwantedTableFields(response.content);
				if (response.content.permissions.group_by && response.content.permissions.group_by.length > 0 && response.content.tableData.length > 0) {
					if (response.content.permissions.group_by[0].field_id === "status") {
						response.content.tableData = this.groupTableData(response.content.tableData, "status");
					}
				}
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	getClaimBySearch(data) {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchclaim?year=` +
			data.serachYear +
			`&claimNo=` +
			data.claimNo
		)
		.pipe(
			tap((response: any) => {
				const resp = response.content;
				window.localStorage.setItem("insurance_year", data.year);
				let content = [resp];
				response.content = content;
				response.content = this.transformToTableYearWiseData(response);
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	searchByWordForAssets(data, moduleFields){
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/search/searchAsset?searchInKeys=equipment_number,animal_number,building_number` +
			`&searchString=` +
			data.searchWord +
			`&viewId=` +
			data.viewId +
			`&moduleId=` +
			data.moduleId +
			`&roleId=` +
			data.roleId
		)
		.pipe(
			tap((response: any) => {
				//response.content.permissions = response.content.permissions[0]
				response.content.form_fields = this.joinFieldsWithDefinition(response.content.permissions.form_fields, moduleFields);
				response.content.permissions.type_groups = this.generateTypeGroups(response.content.permissions.type_groups);
				response.content.tableData = this.transformToTableData(response.content);
				response.content.permissions.type = this.removeUnwantedTableFields(response.content);
				if (response.content.permissions.group_by && response.content.permissions.group_by.length > 0 && response.content.tableData.length > 0) {
					if (response.content.permissions.group_by[0].field_id === "status") {
						response.content.tableData = this.groupTableData(response.content.tableData, "status");
					}
				}
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	/**
	 * Transforms claims by year data in to format of table data
	 *
	 */
	transformToTableYearWiseData(response: any) {
		let dataIndex = 0;
		let globalIndex = 0;
		let globalObject = [];
		let globalGroupedArray = [];

		for (let i = 0; i < response.content.length; i++) {
			let vehicle_info = [];
			vehicle_info.push(
				response.content[i].values.vehicle_code,
				response.content[i].values.vehicle_class
			);
			let accident_info = [];
			accident_info.push(
				response.content[i].values.accident_date,
				response.content[i].values.accident_time,
				response.content[i].values.accident_type,
				response.content[i].values.accident_location
			);
			globalObject.push({
				status: response.content[i].values.status,
				id: response.content[i].id,
				type_id: response.content[i].values.type_id,
				claim_no: response.content[i].values.claim_no,
				vehicle_information: vehicle_info,
				accident_information: accident_info,
				created_at: response.content[i].values.created_date,
				on_hold: null
			});
		}

		for (let i = 0; i < globalObject.length; i++) {
			if (globalObject[i].status.en) {
				// var tempid=globalObject[i].status.en
				// var selectedpost =globalObject.filter(j => j.status.en == globalObject[i].status.en)
				// const found = globalGroupedArray.some(el =>  el.data[0].status.en === tempid);
				// if(!found)
				// {
				// 	globalGroupedArray.push({group:0,data:selectedpost})
				// }
			} else {
				var tempid = globalObject[i].status;
				var selectedpost = globalObject.filter(
					j => j.status == globalObject[i].status
				);
				const found = globalGroupedArray.some(
					el => el.data[0].status === tempid
				);
				if (!found) {
					globalGroupedArray.push({group: tempid, data: selectedpost});
				}
			}
		}

		return globalGroupedArray;
	}

	/**
	 * Get Dashboard Data by Year
	 *
	 * @param year
	 */
	getDashBoardData() {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/getfamsdashboarddata`
		)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	getDashBoardByYear(year) {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/workspace/getdashboarddata?year=` +
			year
		)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	fetchClaimNotification() {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchclaimyear?year=` +
			2020 +
			`&claimNo=` +
			1
		)
		.pipe(
			tap(response => {
			}),
			catchError(this.handleError("UserSerivce@fetchNotification"))
		);
	}

	/**
	 * Get Claim No by Year
	 *
	 * @param year
	 * @param claimNo
	 */
	getClaimNoByYear(year, claimNo) {
		return this.restApi
		.get(
			`${this.globalVariables.getAPIBaseUrl()}/modulevalue/searchclaimyear?year=` +
			year +
			`&claimNo=` +
			claimNo
		)
		.pipe(
			tap((response: any) => {
			}),
			catchError(this.handleError("UpdateStatusApi@Update data"))
		);
	}

	private handleError(operation = "operation", result?: any) {
		return (error: any): Observable<any> => {
			console.error(error);
			console.log(`${operation} failed: ${error.message}`);
			return of(error);
		};
	}

	/**
	 * drawer width
	 */
	checkDrawerWidth(isEdit, isSide) {
		let viewpermission = this.moduleDataService.getViewPermissions();
		if (isSide) {
			if (isEdit) {
				try {
					if (viewpermission.drawer_templates) {
						return viewpermission.drawer_templates.edit_template.side_drawer.width;
					} else {
						return this.globalVariables.edit_side_drawer_width;
					}
				} catch{
					return this.globalVariables.edit_side_drawer_width;
				}
			} else {
				try {
					if (viewpermission.drawer_templates) {
						return viewpermission.drawer_templates.add_template.side_drawer.width;
					} else {
						return this.globalVariables.add_side_drawer_width;
					}
				} catch{
					return this.globalVariables.add_side_drawer_width;
				}
			}
		} else {
			if (isEdit) {
				try {
					if (viewpermission.drawer_templates) {
						return viewpermission.drawer_templates.edit_template.width;
					} else {
						return this.globalVariables.edit_drawer_width;
					}
				} catch{
					return this.globalVariables.edit_drawer_width;
				}
			} else {
				try {
					if (viewpermission.drawer_templates) {
						return viewpermission.drawer_templates.add_template.width;
					} else {
						return this.globalVariables.add_drawer_width;
					}
				} catch{
					return this.globalVariables.add_drawer_width;
				}
			}
		}
	}

	/**
	 * responsive drawer width
	 *
	 * @param drawerType drawer type as add, edit or assets
	 * @param drawerWidth
	 * @param isSide boolean value for side drawer
	 */
	responsiveDrawerWidth(drawerType, drawerWidth, isSide) {
		const mediaQueryList = this.mediaMatcher.matchMedia('screen and (min-width: 960px) and (max-width: 1367px)');

		if (mediaQueryList && mediaQueryList.matches) {

			if(isSide){

				switch (drawerType) {
					case "add":
						drawerWidth = '35vw';
						break;
					case "edit":
						drawerWidth = '35vw';
						break;
					case "assets":
						drawerWidth = '30vw';
						break;
					default:
						break;
				}

			} else {
				
				switch (drawerType) {
					case "add":
						drawerWidth = '100vw';
						break;
					case "edit":
						drawerWidth = '100vw';
						break;
					case "assets":
						drawerWidth = '80vw';
						break;
					default:
						break;
				}
			}
		}

		return drawerWidth;
	}

	fetchPaginatedData(viewId: number, moduleId: number, roleId: number, pageInfo, searchKeys?, searchString?) {
		let groupByParam = pageInfo.groupParam ? pageInfo.groupParam : '';
		let groupByValue = (pageInfo.group != undefined && pageInfo.group != null) ? pageInfo.group : '';
		let recordsPerPage = pageInfo.recordPerPage ? pageInfo.recordPerPage : '';
		let pageNo = (pageInfo.pageNo != undefined && pageInfo.pageNo != null) ? pageInfo.pageNo : '';
		let search = "";
		if (searchKeys && searchString) {
			search = `&searchKeys=${searchKeys.join(",")}&searchString=${searchString}`;
		}
		// With Search Query
		if(pageInfo.searchQuery){
			let body = {
				viewId: viewId,
				moduleId: moduleId,
				roleId: roleId,
				showMatrix: true,
				searchQuery: pageInfo.searchQuery,
				searchStructure: JSON.stringify(pageInfo.searchStructure),
				pageNo: pageNo,
				recordsPerPage: recordsPerPage,
				groupByParam: groupByParam,
				groupByValue: groupByValue,
			}
			return this.restApi
				.post(
					// Todo: input showMatrix dynamically
					`${this.globalVariables.getAPIBaseUrl()}/workspace/viewpermissionspagedatasearchstructure`, body
				)
				.pipe(
					tap((response: any) => {
						this.handleResponseOfPaginatedData(response);
					}),
					catchError(this.handleError("UserService@fetchPaginatedData"))
			);
		}
		// Without Search Query
		else{
			return this.restApi
				.get(
					// Todo: showMatrix param is hard coded here. make it dynamic if needed
					`${this.globalVariables.getAPIBaseUrl()}/workspace/viewpermissionspagedata?viewId=${viewId}&moduleId=${moduleId}&roleId=${roleId}&groupByParam=${groupByParam}&groupByValue=${groupByValue}&pageNo=${pageNo}&recordsPerPage=${recordsPerPage}${search}&showMatrix=true`
				)
				.pipe(
					tap((response: any) => {
						this.handleResponseOfPaginatedData(response);
					}),
					catchError(this.handleError("UserService@fetchPaginatedData"))
				);
		}
	}

	handleResponseOfPaginatedData(response) {
		response.content.form_fields = this.joinFieldsWithDefinition(response.content.permissions.form_fields, this.moduleDataService.moduleFields);
		response.content.permissions.form_fields_transformed = this.joinFieldsWithDefinition(response.content.permissions.form_fields, this.moduleDataService.moduleFields);
		response.content.permissions.type_groups = this.generateTypeGroups(response.content.permissions.type_groups);
		response.content.tableData = this.transformToTableDataV2(response.content);
		response.content.permissions.type = this.removeUnwantedTableFields(response.content);
		if (response.content.permissions.group_by && response.content.permissions.group_by.length > 0 && response.content.tableData.length > 0) {
			if (response.content.permissions.group_by[0].field_id === "status") {
				response.content.tableData = this.groupTableData(response.content.tableData, "status");
			}
        } else{
            response.content.tableData = this.setNonGroupPaginationInfo(response.content.tableData)
        }
	}

}
