import { Injectable } from "@angular/core";

@Injectable({
	providedIn: "root"
})
export class ModuleDataService {
	public moduleDefinition: any;
	public viewPermissions: any;
	public parentViewPermissions: any;
	public hasParentViewRelation: boolean;
	public moduleId: any;
	public viewId: any;
	public roleId: any;
	public multiGroupsTemplates: any[];
	public fieldsTemplates: any[];
	public dialogTemplates: any[];
	public modules: any;
	public menu: any;
	public paginationInfo: any;
	
	/*
	    'modes' represent tab view i.e. list/table, board etc.
	 */
	public modes: any;
	
	constructor() {
		this.multiGroupsTemplates = [];
		this.fieldsTemplates      = [];
		this.dialogTemplates      = [];
		this.modules = {};
		this.paginationInfo = {};
		this.modes = [
		    {
		        type: 'board',
                tabIndex: 1
            },
            {
		        type: 'list',
                tabIndex: 0
            },
        ];
	}
	
	public setModuleId (moduleId) {
		this.moduleId = moduleId;
	}
	
	public setViewId (viewId) {
		this.viewId = viewId;
	}
	
	public setRoleId (roleId) {
		this.roleId = roleId;
	}
	
	// region module data
	
	public setModuleDefinition (moduleDefinition) {
		this.moduleDefinition = moduleDefinition;
	}
	
	public setMultiGroups (typeId, multiGroups) {
		if (!Array.isArray(this.multiGroupsTemplates[typeId])) {
			this.multiGroupsTemplates[typeId] = [];
		}
		this.multiGroupsTemplates[typeId].push(multiGroups);
	}
	
	public getMultiGroups (typeId) {
		return this.multiGroupsTemplates[typeId];
	}
	
	public resetMultiGroups () {
		this.multiGroupsTemplates = [];
	}
	
	public setFieldsTemplate (typeId, template) {
		this.fieldsTemplates[typeId] = template;
	}
	
	public setDialogTemplate(typeId, name, template) {
		if (template) {
			if (!this.dialogTemplates[typeId]) {
				this.dialogTemplates[typeId] = {};
			}
			
			this.dialogTemplates[typeId][name] = template;
		}
	}
	
	public getDialogTemplate(typeId, dialogName) {
		return this.dialogTemplates[typeId][dialogName];
	}
	
	public getFieldsTemplate (typeId) {
		return this.fieldsTemplates[typeId];
	}
	
	public getEditOverview () {
		return this.viewPermissions.edit_overview;
	}
	
	public getModuleDefinition (moduleId?) {
		return moduleId ? this.modules[moduleId] : this.moduleDefinition;
	}
	
	public getModuleTypes () {
		return this.moduleDefinition.columns.module_types;
	}
	
	public getModuleTypeStatusStages (type_id) {
		return JSON.parse(JSON.stringify(this.moduleDefinition.columns.module_types[type_id].status_stages));
	}
	
	public get moduleStatuses () {
		return this.moduleDefinition.columns.module_statuses;
	}
	
	public getProcessFlow (typeId) {
		return this.moduleDefinition.columns.module_types[typeId].process_flow;
	}
	
	public getProcessFlowImages (typeId) {
		return this.moduleDefinition.columns.module_types[typeId].hasOwnProperty("flow_image") ? this.moduleDefinition.columns.module_types[typeId].flow_image : {};
	}
	
	public getTypeName (typeId) {
		return this.moduleDefinition.columns.module_types[+typeId].name;
	}
	
	public getType (typeId) {
		return this.moduleDefinition.columns.module_types[+typeId];
	}
	
	public getMenu () {
		return this.menu;
	}
	
	/**
	 * Finds the type index of provided type id
	 */
	public findTypeIndexById (typeId) {
		try {
			return this.moduleDefinition.columns.module_types.findIndex(moduleTypes => (+moduleTypes.id) == typeId);
		} catch (exception) {
			return null;
		}
	}
	
	public get moduleFields () {
		return this.moduleDefinition.columns.module_fields;
	}
	
	public getActionButtons (typeId, status) {
		let foundProcessFlow = this.getType(typeId).process_flow.find(processFlow => processFlow.status == status);
		if (foundProcessFlow) {
			let actions = foundProcessFlow.actions;
			let filteredActions = [];
			if (actions && actions.length > 0) {
				filteredActions = actions.filter(action => {
					if (action.hasOwnProperty("roles")) {
						if (typeof action.roles === "object") {
							let menuKeyFound = action.roles.find(role => {
								let keyFound, roleFound;
								// If roles has object having menuKeys
								if (typeof role === "object") {
									if (role.hasOwnProperty("menuKeys")) {
										keyFound = role.menuKeys.find(key => key == (this.menu ? this.menu : null));
									}
									if (role.hasOwnProperty("roles")) {
										roleFound = role.roles.find(roleId => roleId == this.roleId);
									}
									
									if (keyFound && roleFound) {
										return role;
									}
								}
								// If roles has just numeric role_id
								else {
									let roleFound = action.roles.find(roleId => roleId == this.roleId);
									if (roleFound) {
										return action;
									}
								}
								
							});
							if (menuKeyFound) {
								return action;
							}
						}
					} else {
						return action;
					}
				});
			}
			return filteredActions;
		}
		return null;
	}
	
	public shouldPreventModification (statusId, moduleId?) {
		try {
			return this.modules[moduleId || this.moduleId].columns.module_statuses[statusId].prevent_modification;
		} catch (exception) {
			return false;
		}
		
	}
	
	public getKeyName (key: string) {
		let keyValues = this.moduleDefinition.columns.module_fields.find(field => field.field_id == key);
		return (keyValues ? keyValues.name : null);
	}
	
	public typeHasTrigger (type_id: any) {
		try {
			return !!(this.getModuleTypes()[+type_id] && (this.getModuleTypes()[+type_id].trigger || this.getModuleTypes()[+type_id].trigger_config));
		} catch (exception) {
			return false;
		}
	}
	
	public isAllowedToUpdateStatus(isParentPermissionMatrix?): boolean {
		let viewPermissions;
		isParentPermissionMatrix ? viewPermissions = this.parentViewPermissions : viewPermissions = this.viewPermissions;
		
		if (!viewPermissions.hasOwnProperty("form_fields_transformed")) {
			return true;
		}
		
		let foundStatus = viewPermissions.form_fields_transformed.find(field => field && field.field_id === "status");
		if (foundStatus) {
			return foundStatus.update;
		}
		
		return false;
	}
	
	// region moduleS
	
	public getModuleStatuses(moduleId) {
		return this.modules[moduleId].columns.module_statuses;
	}
	
	getModuleStatusUpdates(moduleId, statusObj, typeId) {
		let updates = [];
		let processFlow = this.modules[moduleId || this.moduleId].columns.module_types[typeId].process_flow;
		const status = processFlow.find(x => x.status == statusObj.id);
		if (status && status.flow && this.isAllowedToUpdateStatus()) {
			const role = status.roles.find(x => x == this.roleId);
			if (role) {
				status.flow.forEach(element => {
					let status_val = this.modules[moduleId || this.moduleId].columns.module_statuses.find(x => x.id == element);
					if (status_val) {
						updates.push(status_val);
					}
				});
			}
		}
		
		return updates;
	}
	
	public getModuleProcessFlow (moduleId, typeId) {
		return this.modules[moduleId].columns.module_types[typeId].process_flow;
	}
	
	// endregion
	
	// endregion
	
	// region view permission matrix data
	
	public setViewPermissions (viewPermissions) {
		this.viewPermissions = viewPermissions;
	}
	
	public viewHasOverview () {
		return !!(Array.isArray(this.viewPermissions.overview) && this.viewPermissions.overview.length);
	}
	
	public getOverview () {
		return this.viewPermissions.overview;
	}
	
	public setParentViewPermissions (parentViewPermissions) {
		this.parentViewPermissions = parentViewPermissions;
		this.hasParentViewRelation = true;
	}
	
	public getAllowedTypes () {
		return this.viewPermissions.typeIds;
	}
	
	public getTypeGroups () {
		return this.viewPermissions ? this.viewPermissions.type_groups : null;
	}
	
	public getViewPermissions () {
		return this.viewPermissions;
	}
	
	/**
	 * Searches for the table configuration in permissions.viewModes (if viewModes is available)
	 */
	public getTableConfiguration () {
		if (this.viewPermissions.viewModes) {
			let listMode = this.viewPermissions.viewModes.find((mode) => mode && mode.type == "list");
			
			// Get Group by attribute
			if (listMode && listMode.group_by && this.hasGrouping()) {
				listMode.group_by.map((groupBy) => this.groupBy[groupBy]);
			}
			
			return listMode.configuration;
		}
		
		return null;
	}
	
	/**
	 * Searches for the table configuration in permissions.viewModes (if viewModes is available)
	 */
	public getTableConfigurationParam (permissionMatrix) {
		if (permissionMatrix.viewModes) {
			let listMode = permissionMatrix.viewModes.find((mode) => mode && mode.type == "list");
			
			// Get Group by attribute
			if (listMode && listMode.group_by && (permissionMatrix.group_by && permissionMatrix.group_by.length > 0)) {
				listMode.group_by.map((groupBy) => permissionMatrix.group_by[groupBy]);
			}
			
			return listMode.configuration;
		}
		
		return null;
	}
	
	public getParentTableConfiguration () {
		if (this.parentViewPermissions.viewModes) {
			let listMode = this.parentViewPermissions.viewModes.find((mode) => mode && mode.type == "list");
			
			// Get Group by attribute
			if (listMode && listMode.group_by && this.parentViewHasGrouping()) {
				listMode.group_by.map((groupBy) => this.groupBy[groupBy]);
			}
			
			return listMode.configuration;
		}
		
		return null;
	}
	
	public hasGrouping () {
		return (this.viewPermissions.group_by && this.viewPermissions.group_by.length > 0);
	}
	
	
	public isGroupedByStatus () {
		let groupedByStatus;
		if (this.viewPermissions.group_by && this.viewPermissions.group_by.length > 0) {
			if (this.viewPermissions.group_by[0].field_id === "status") {
				groupedByStatus = true;
			}else{
				groupedByStatus = false;
			}
		}
		return groupedByStatus;
	}
	
	public parentViewHasGrouping () {
		return (this.parentViewPermissions.group_by && this.parentViewPermissions.group_by.length > 0);
	}
	
	public get groupBy () {
		return this.viewPermissions.group_by;
	}
	
	/**
	 * Returns whether the view has a child view
	 * In such a case the child view will be treated as the main view and
	 * parentView (that has the childView) will be saved separately as the parent view
	 */
	public hasChildView (): boolean {
		return this.hasParentViewRelation;
	}
	
	// endregion

	/**
	 * Returns whether the view permission to show group
	 * @param status id of status/group
	 */
	public isStatusHasPermission (status): boolean {
		return this.getViewPermissions().allowed_statuses.indexOf(+status) !== -1;
	}
	
}
