/**
 * Table Widget Model
 */
export interface TableWidgetModel {
    columnStructure: Array<object>;
    typeStructure?: object;
    data: any;
    statusInfoNChanges?: object;
    bulkActions?: object;
    tableSearch?: boolean;
    changedStatusId?: number;
    configuration?: TableWidgetConfiguration;
}

/**
 * Defines Configuration of Table Widget
 */
export interface TableWidgetConfiguration {
    globalHeaders?: boolean;
    defaultPadding?: boolean;
    search?: {
        searchLabel: {
            en: string,
            ar: string,
        },
        searchLevel: string,
        searchLogic: string,
        // searchKeys: string[]
    };
    hasParentChildRelation?: boolean;
    isParent?: boolean;
    isChild?: boolean;
    showGroupFilter?: boolean;
    haveSearch?: boolean;
    parentRow?: any;
}
