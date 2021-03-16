import { Injectable } from "@angular/core";
import {TableWidgetConfiguration} from "../../widgets/table-widget/table-widget.model";

@Injectable({
	providedIn: null
})
/**
 * Used for static data and pages throughout all apps
 */
export class StaticDataService {
	
	constructor () {
	}
	
	// region FAMS
	
	// region static pages
	
	// region Traffic Fines
	
	trafficFinesTableWidgetData () {
		return {
			columnStructure: this.trafficFinesTableStructure()[0],
			data: this.trafficFinesData(),
			typeStructure: this.trafficFinesTableStructure(),
            configuration: this.trafficFinesTableConfiguration()
		};
	}
	
	trafficFinesData () {
		return [
			{
				group: {
					id: 2,
					name: {
						en: "New",
						ar: "جديد"
					},
					color: "#03a9f4",
				},
				data: [
					{
						type_id: 0,
						vehicle: ["A 3218", "AV3237"],
						employee: ["EMP001"],
						violation: "رادار السرعة الزائدة",
						chargeable: "أثناء المهمة",
						fine_amount: ["900 AED", "0 AED"],
						issuing_authority: ["RTA"],
						date_of_violation: "13 Dec, 23:15",
						due_date: "15 Feb 2020",
						location: "شارع المنارة، دبي"
					},
					{
						type_id: 0,
						vehicle: ["A 3218", "AV3237"],
						employee: ["EMP001"],
						violation: "رادار السرعة الزائدة",
						chargeable: "أثناء المهمة",
						fine_amount: ["900 AED", "0 AED"],
						issuing_authority: ["RTA"],
						date_of_violation: "13 Dec, 23:15",
						due_date: "15 Feb 2020",
						location: "شارع المنارة، دبي"
					},
				]
			},
			{
				group: {
					id: 2,
					name: {
						en: "Waived",
						ar: "التنازل"
					},
					color: "#9e9e9e",
				},
				data: [
					{
						type_id: 0,
						vehicle: ["A 3218", "AV3237"],
						employee: ["EMP001"],
						violation: "رادار السرعة الزائدة",
						chargeable: "أثناء المهمة",
						fine_amount: ["900 AED", "0 AED"],
						issuing_authority: ["RTA"],
						date_of_violation: "13 Dec, 23:15",
						due_date: "15 Feb 2020",
						location: "شارع المنارة، دبي"
					},
					{
						type_id: 0,
						vehicle: ["A 3218", "AV3237"],
						employee: ["EMP001"],
						violation: "رادار السرعة الزائدة",
						chargeable: "أثناء المهمة",
						fine_amount: ["900 AED", "0 AED"],
						issuing_authority: ["RTA"],
						date_of_violation: "13 Dec, 23:15",
						due_date: "15 Feb 2020",
						location: "شارع المنارة، دبي"
					},
				]
			},
			{
				group: {
					id: 2,
					name: {
						en: "Overdue",
						ar: "متأخر"
					},
					color: "#ff9800",
				},
				data: [
					{
						type_id: 0,
						vehicle: ["A 3218", "AV3237"],
						employee: ["EMP001"],
						violation: "رادار السرعة الزائدة",
						chargeable: "أثناء المهمة",
						fine_amount: ["900 AED", "0 AED"],
						issuing_authority: ["RTA"],
						date_of_violation: "13 Dec, 23:15",
						due_date: "15 Feb 2020",
						location: "شارع المنارة، دبي"
					},
					{
						type_id: 0,
						vehicle: ["A 3218", "AV3237"],
						employee: ["EMP001"],
						violation: "رادار السرعة الزائدة",
						chargeable: "أثناء المهمة",
						fine_amount: ["900 AED", "0 AED"],
						issuing_authority: ["RTA"],
						date_of_violation: "13 Dec, 23:15",
						due_date: "15 Feb 2020",
						location: "شارع المنارة، دبي"
					},
				]
			},
		];
	}
	
	trafficFinesTableStructure () {
		return {
			0: [
				{
					type: "group",
					field_id: "vehicle",
					name: {
						en: "Vehicle",
						ar: "مركبة"
					},
					keys: [
						"vehicle_plate",
						"other_number"
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "pound-box"
							},
						},
						{
							type: "chip",
							icon: {
								position: "before",
								name: "pound"
							},
						}
					]
				},
				{
					type: "single",
					field_id: "employee",
					name: {
						en: "Employee",
						ar: "موظف"
					},
					keys: [
						"employee",
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "account"
							},
						},
					]
				},
				{
					type: "single",
					field_id: "violation",
					name: {
						en: "Violation",
						ar: "عنيف"
					},
					keys: [
						"violation",
					],
				},
				{
					type: "single",
					field_id: "chargeable",
					keys: [
						"chargeable"
					],
					name: {
						en: "Chargeable",
						ar: "عرضة للإتهام"
					},
				},
				{
					type: "group",
					field_id: "fine_amount",
					name: {
						en: "Fine Amount",
						ar: "مبلغ جيد"
					},
					keys: [
						"fine_amount",
						"price"
					],
					front_end_type: [
						{
							type: "chip",
						},
						{
							type: "chip",
						},
					]
				},
				{
					type: "group",
					field_id: "issuing_authority",
					name: {
						en: "Issuing Authority",
						ar: "سلطة الإصدار"
					},
					keys: [
						"issuing_authority"
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "office-building"
							},
						},
					]
				},
				{
					type: "group",
					field_id: "date_of_violation",
					name: {
						en: "Date of Violation",
						ar: "تاريخ الانتهاك"
					},
					keys: [
						"date_of_violation",
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "calendar"
							},
						},
					]
				},
				{
					type: "single",
					field_id: "due_date",
					name: {
						en: "Due Date",
						ar: "تاريخ الاستحقاق"
					},
					keys: [
						"due_date",
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "calendar-alert"
							},
						},
					]
				},
				{
					type: "single",
					field_id: "location",
					name: {
						en: "Location",
						ar: "موقعك"
					},
					keys: [
						"location",
					],
				}
			]
		};
	}
	
	// endregion
	
	// region Fuel Log
	
	fuelLogTableWidgetData () {
		return {
			columnStructure: this.fuelLogTableStructure()[0],
			//data: this.dataSource,
			data: this.fuelLogData(),
			typeStructure: this.fuelLogTableStructure(),
            configuration: this.fuelLogTableConfiguration()
		};
	}
	
	fuelLogData () {
		return [
			{
				group: undefined,
				data: [
					{
						type_id: 0,
						vehicle: ["3218", "AV38238"],
						fuel_type: "Super",
						department: "Procurement",
						time: ["10 Dec, 04:30"],
						odometer: "25,245",
						fuel_amount: ["82 L"],
						station_name: ["Internal", "Station 67", "Dubai Police", "Rashid Khursheed"],
						filled_by: "Manual",
						reference: "ER10547"
					},
					{
						type_id: 0,
						vehicle: ["3218", "AV38238"],
						fuel_type: "Super",
						department: "Planning",
						time: ["15 Dec, 04:30"],
						odometer: "252,245",
						fuel_amount: ["88 L"],
						station_name: ["Internal", "Station 22", "Dubai Police", "Rashid Salman"],
						filled_by: "Manual",
						reference: "ER10327"
					},
					{
						type_id: 0,
						vehicle: ["3218", "AV38238"],
						fuel_type: "Super",
						department: "Procurement",
						time: ["10 Dec, 04:30"],
						odometer: "25,245",
						fuel_amount: ["82 L"],
						station_name: ["Internal", "Station 67", "Dubai Police", "Rashid Khursheed"],
						filled_by: "Manual",
						reference: "ER10547"
					},
					{
						type_id: 0,
						vehicle: ["3218", "AV38238"],
						fuel_type: "Super",
						department: "Procurement",
						time: ["10 Dec, 04:30"],
						odometer: "25,245",
						fuel_amount: ["82 L"],
						station_name: ["Internal", "Station 67", "Dubai Police", "Rashid Khursheed"],
						filled_by: "Manual",
						reference: "ER10547"
					},
					{
						type_id: 0,
						vehicle: ["3218", "AV38238"],
						fuel_type: "Super",
						department: "Procurement",
						time: ["10 Dec, 04:30"],
						odometer: "25,245",
						fuel_amount: ["82 L"],
						station_name: ["Internal", "Station 67", "Dubai Police", "Rashid Khursheed"],
						filled_by: "Manual",
						reference: "ER10547"
					}
				]
			}
		];
	}
	
	fuelLogTableStructure() {
		return {
			0: [
				{
					type: "group",
					field_id: "vehicle",
					name: {
						en: "Vehicle",
						ar: "Vehicle"
					},
					keys: [
						"vehicle_plate",
						"other_number"
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "pound-box"
							},
						},
						{
							type: "chip",
							icon: {
								position: "before",
								name: "pound"
							},
						}
					]
				},
				{
					type: "single",
					field_id: "fuel_type",
					name: {
						en: "Fuel Type",
						ar: "Fuel Type"
					},
					keys: [
						"fuel_type",
					],
				},
				{
					type: "single",
					field_id: "department",
					name: {
						en: "Department",
						ar: "Department"
					},
					keys: [
						"department",
					],
				},
				{
					type: "single",
					field_id: "time",
					keys: [
						"time"
					],
					name: {
						en: "Time",
						ar: "Time"
					},
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "calendar"
							},
						},
					]
				},
				{
					type: "single",
					field_id: "odometer",
					name: {
						en: "Odometer",
						ar: "Odometer"
					},
					keys: [
						"odometer",
					],
				},
				{
					type: "single",
					field_id: "fuel_amount",
					name: {
						en: "Fuel Amount",
						ar: "Fuel Amount"
					},
					keys: [
						"fuel_amount"
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "water"
							},
						},
					]
				},
				{
					type: "group",
					field_id: "station_name",
					name: {
						en: "Station Name",
						ar: "Station Name"
					},
					keys: [
						"source",
						"station_name",
						"provider",
						"person",
					],
					front_end_type: [
						{
							type: "chip",
							icon: {
								position: "before",
								name: "gas-station"
							},
						},
						{
							type: "chip",
							icon: {
								position: "before",
								name: "office-building"
							},
						},
						{
							type: "chip",
							icon: {
								position: "before",
								name: "office-building"
							},
						},
						{
							type: "chip",
							icon: {
								position: "before",
								name: "account"
							},
						},
					]
				},
				{
					type: "single",
					field_id: "filled_by",
					name: {
						en: "Filled By",
						ar: "Filled By"
					},
					keys: [
						"filled_by",
					],
				},
				{
					type: "single",
					field_id: "reference",
					name: {
						en: "Reference",
						ar: "Reference"
					},
					keys: [
						"reference",
					],
				}
			]
		};
	}
	
	fuelLogTableConfiguration(): TableWidgetConfiguration {
        return {
            globalHeaders: true,
            hasParentChildRelation: false,
            defaultPadding: true,
            showGroupFilter: false,
            haveSearch: true,
            search: {
                searchLevel: "global",
                searchLabel: {
                    "en": "Search..",
                    "ar": "بحث.."
                },
                searchLogic: "frontend",
                // searchKeys: ["issue_id"]
            }
        };
    }

    trafficFinesTableConfiguration(): TableWidgetConfiguration {
        return {
            globalHeaders: true,
            hasParentChildRelation: false,
            defaultPadding: true,
            showGroupFilter: false,
            haveSearch: true,
            search: {
                searchLevel: "global",
                searchLabel: {
                    "en": "Search..",
                    "ar": "بحث.."
                },
                searchLogic: "frontend",
                // searchKeys: ["issue_id"]
            }
        };
    }
    
	// endregion
	
	// endregion
	
	// endregion
}
