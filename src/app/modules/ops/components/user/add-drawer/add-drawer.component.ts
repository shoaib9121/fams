import {
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewEncapsulation,
	ViewChild,
	TemplateRef,
	ViewContainerRef,
	ChangeDetectorRef
} from '@angular/core';
import {CreateItemService} from "./create-item.service";
import {DynamicReactiveFormComponent} from 'src/app/modules/core/shared/components/dynamic-reactive-form/dynamic-reactive-form/dynamic-reactive-form.component';
import {FieldConfig} from 'src/app/modules/core/shared/components/dynamic-reactive-form/shared';
import {Validators, FormArray} from '@angular/forms';
import {DataService} from 'src/app/shared/service/data.service';
import {GlobalVariables} from 'src/app/global-variables.service';
import {Portal, ComponentPortal, TemplatePortal} from '@angular/cdk/portal';
import {NgxSpinnerService} from "ngx-spinner";
import {ModuleDataService} from "../module-data/module-data.service";
import {DynamicMultiGroupFormComponent} from "../../../../core/shared/components/dynamic-reactive-form/dynamic-multi-group-reactive-form/dynamic-multi-group-form.component";
import { SharedService } from 'src/app/modules/core/shared/components/dynamic-reactive-form/shared/shared.service';
import { UserService } from '../user.service';

@Component({
	selector: 'app-add-drawer',
	templateUrl: './add-drawer.component.html',
	styleUrls: ['./add-drawer.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class AddDrawerComponent implements OnInit {
	/**
	 * Types of items that can be created
	 */
	@Input() types: any;
	/**
	 * Whole form element depending on the type
	 */
	@Input() fieldsTemplates: any;
	
	/**
	 * Module ID for which the item should  be created
	 */
	@Input() moduleId: any;
	
	/**
	 * To filter module via input search
	 */
	public searchModule: string;
	editOverview; any; //todo:  remove this
	@Output() submitted: EventEmitter<any> = new EventEmitter();
	@Output() cancelled: EventEmitter<any> = new EventEmitter();
	public selectedTab: number = 0;
	public selectedType: any;
	public selectedFieldsTemplate: any;
	public selectedTypeProcessFlowImage: any;
	public showProcessFlowInForm: boolean;
	
	@ViewChild('templatePortalContent', {static: false}) templatePortalContent: TemplateRef<any>;
	selectedPortal: Portal<any>;
	componentPortal: ComponentPortal<AddDrawerComponent>;
	templatePortal: TemplatePortal<any>;
	
	public typeGroups: any[];
	
	public typeGroupsOld = [
		{
			icon: "view_headline",
			name: {
				en: "Vehicle Claim",
				ar: "Vehicle Claim_AR"
			},
			types: [
				{
					icon: "view_headline",
					title: {
						en: "Vehicle Claim",
						ar: "Vehicle Claim_AR"
					},
					description: {
						en: "Vehicle Claim Description",
						ar: "Vehicle Claim Description_AR",
					},
					forms: [],
				},
				{
					icon: "view_headline",
					title: {
						en: "Vehicle Claim",
						ar: "Vehicle Claim_AR"
					},
					description: {
						en: "Vehicle Claim Description",
						ar: "Vehicle Claim Description_AR",
					}
				}
			]
		},
		{
			icon: "view_headline",
			name: {
				en: "Another Claim",
				ar: "Vehicle Claim_AR"
			},
			types: [
				{
					icon: "view_headline",
					title: {
						en: "Building Claim",
						ar: "Vehicle Claim_AR"
					},
					description: {
						en: "Vehicle Claim Description",
						ar: "Vehicle Claim Description_AR",
					}
				}
			]
		}
	];
	
	public drawerTitle: string;
	
	// region dynamic reactive forms
	public validationlist = [];
	@ViewChild(DynamicReactiveFormComponent, {static: false}) form: DynamicReactiveFormComponent;
	@ViewChild(DynamicMultiGroupFormComponent, {static: false}) multiForm: DynamicMultiGroupFormComponent;
	
	//#region JSON from API
	formData: Array<{ groupName: string, fields?: FieldConfig[], subGroups?: any, subGroupMultiple?: boolean, required?: boolean }> = [
		{
			groupName: 'Attachments',
			fields: [
				{
					type: 'attachments',
					col: 'attachments',
					inputType: 'attachments',
					// extensions:[]
				}
			]
		},
		// {
		// 	groupName: 'General Information',
		// 	fields: [
		// 		{
		// 			type: 'input',
		// 			value: [],
		// 			label: 'Username',
		// 			inputType: 'text',
		// 			col: 'name',
		// 			update: true,
					
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'Name Required ASD'
		// 				},
		// 				{
		// 					name: 'pattern',
		// 					validator: '^[a-zA-Z]+$',
		// 					message: 'Accept only text'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			type: 'input',
		// 			value: [],
		// 			label: 'Email Address',
		// 			inputType: 'email',
		// 			col: 'email',
		// 			update: true,
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'Email Required'
		// 				},
		// 				{
		// 					name: 'pattern',
		// 					validator:
		// 						'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
		// 					,
		// 					message: 'Invalid email'
		// 				}
		// 			]
		// 		},
				
		// 		{
		// 			type: 'select',
		// 			value: [],
		// 			col: 'value1',
		// 			update: true,
		// 			multiple: true,
		// 			async: true,
		// 			options: [
		// 				{
		// 					value: 'Asset 1 '
		// 				},
		// 				{
		// 					value: 'Asset 2 ',
		// 				}
		// 			],
					
		// 			validations: [
		// 				{
		// 					type: 'required',
		// 					value: true,
		// 					message: 'Select is rquired'
		// 				},
		// 				{
		// 					type: 'pattern',
		// 					value: '/^\d+$/',
		// 					message: 'Select Pattern is required'
		// 				}
					
		// 			]
		// 		},
		// 		{
		// 			type: 'select',
		// 			value: [],
		// 			col: 'value2',
		// 			multiple: false,
		// 			update: true,
		// 			async: true,
		// 			options: [
		// 				{
		// 					value: 'asset 3'
		// 				},
		// 				{
		// 					value: 'asset 4',
		// 				}
		// 			],
		// 			validations: [
		// 				{
		// 					type: 'required',
		// 					value: false,
		// 					message: 'Select is rquired'
		// 				}
		// 				,
		// 				{
		// 					type: 'pattern',
		// 					value: '/^\d+$/'
		// 					,
		// 					message: 'Select Pattern is rquired'
							
		// 				}
		// 			]
		// 		},
		// 		{
		// 			type: 'select',
		// 			value: [],
		// 			col: 'value3',
		// 			multiple: false,
		// 			async: true,
		// 			update: true,
		// 			options: [
		// 				{
		// 					value: 'asset 5'
		// 				},
		// 				{
		// 					value: 'asset 6',
		// 				}
		// 			],
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'select Required'
		// 				}
		// 			]
		// 		}
		// 	]
		// },
		// {
		// 	groupName: 'Accident Result',
		// 	subGroupMultiple: true, // multiple groups can be filled/selected -> one, multiple or none
		// 	required: true, // at least one option has to be filled
		// 	subGroups: [
		// 		{
					
		// 			groupName: 'Internal repair',
		// 			fields: [
		// 				{
		// 					type: 'input',
		// 					label: 'Total Cost',
		// 					col: 'ex_total_cost',
		// 					inputType: 'text',
		// 					name: 'total',
		// 					update: true,
		// 					value: [],
		// 					validations: []
							
		// 				},
		// 				{
		// 					type: 'input',
		// 					label: 'Paid Cost',
		// 					col: 'ex_paid_amount',
		// 					inputType: 'text',
		// 					name: 'paid',
		// 					update: true,
		// 					value: [],
		// 					validations: []
							
		// 				},
		// 				{
		// 					type: 'input',
		// 					label: 'Remaning Cost',
		// 					col: 'ex_remaining_cost',
		// 					inputType: 'text',
		// 					name: 'remaning',
		// 					update: true,
		// 					value: [],
		// 					math: "this." + "mathService.sub('ex_total_cost', 'ex_paid_amount')",
		// 					validations: []
							
		// 				}
		// 			]
		// 		},
		// 		{
		// 			groupName: 'External repair',
		// 			fields: [
		// 				{
		// 					type: 'input',
		// 					label: 'Username',
		// 					col: 'value43',
		// 					inputType: 'text',
		// 					name: 'name',
		// 					update: true,
		// 					value: ['test'],
		// 					validations: [
		// 						{
		// 							name: 'required',
		// 							validator: Validators.required,
		// 							message: 'Name Required ASD'
		// 						},
		// 						{
		// 							name: 'pattern',
		// 							validator: '^[a-zA-Z]+$',
		// 							message: 'Accept only text'
		// 						}
		// 					]
							
		// 				},
		// 			]
		// 		},
		// 	]
		// },
		// {
		// 	groupName: 'Basic Information',
		// 	fields: [
		// 		{
		// 			type: 'input',
		// 			label: 'Total Cost',
		// 			col: 'tot_total_cost',
		// 			inputType: 'text',
		// 			name: 'total',
		// 			update: true,
		// 			value: [],
		// 			validations: []
					
		// 		},
		// 		{
		// 			type: 'input',
		// 			label: 'Paid Cost',
		// 			col: 'tot_paid_amount',
		// 			inputType: 'text',
		// 			name: 'paid',
		// 			update: true,
		// 			value: [],
		// 			validations: []
					
		// 		},
		// 		{
		// 			type: 'input',
		// 			label: 'Remaning Cost',
		// 			col: 'tot_remaining_cost',
		// 			inputType: 'text',
		// 			name: 'remaning',
		// 			update: true,
		// 			value: [],
		// 			math: "this." + "mathService.sub('tot_total_cost', 'tot_paid_amount')",
		// 			validations: []
					
		// 		}
		// 	]
		// },
		// {
		// 	groupName: 'Basic Information',
		// 	fields: [
		// 		{
		// 			type: 'input',
		// 			label: 'Username',
		// 			col: 'value44',
		// 			inputType: 'text',
		// 			name: 'name',
		// 			update: false,
		// 			value: [],
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'Name Required ASD'
		// 				},
		// 				{
		// 					name: 'pattern',
		// 					validator: '^[a-zA-Z]+$',
		// 					message: 'Accept only text'
		// 				}
		// 			]
					
		// 		},
		// 		{
		// 			type: 'input',
		// 			value: [],
		// 			col: 'value5',
		// 			label: 'Email Address',
		// 			inputType: 'email',
		// 			name: 'email',
		// 			update: true,
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'Email Required'
		// 				},
		// 				{
		// 					name: 'pattern',
		// 					validator:
		// 						'^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'
		// 					,
		// 					message: 'Invalid email'
		// 				}
		// 			]
		// 		},
		// 		// {
		// 		// 	type: 'select',
		// 		// 	col: 'value6',
		// 		// 	value: ['Asset 1', 'Asset 2'],
		// 		// 	name: 'value',
		// 		// 	update: true,
		// 		// 	multiple: true,
		// 		// 	async: true,
		// 		// 	options: [
		// 		// 		{
		// 		// 			value: 'Asset1'
		// 		// 		},
		// 		// 		{
		// 		// 			value: 'Asset2',
		// 		// 		}
		// 		// 	],
		// 		// 	validations: [
		// 		// 		{
		// 		// 			type: 'required',
		// 		// 			value: true,
		// 		// 			message: 'Select is rquired'
		// 		// 		},
		// 		// 		{
		// 		// 			type: 'pattern',
		// 		// 			value: '/^\d+$/',
		// 		// 			message: 'Select Pattern is required'
		// 		// 		}
					
		// 		// 	]
		// 		// },
		// 		{
		// 			type: 'date',
		// 			col: 'value8',
		// 			label: 'DOB',
		// 			value: ['148880000'],
		// 			update: false,              // here
		// 			name: 'dob',
		// 			mindate: '12/11/2019',
		// 			maxdate: '12/11/2020',
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					message: 'Date of Birth Required'
		// 				}
		// 				,
		// 				{
		// 					type: 'pattern',
		// 					value: '/^\d+$/',
		// 					message: 'Select Pattern is required'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			type: 'radiobutton',
		// 			col: 'value9',
		// 			label: 'Gender',
		// 			value: [],
		// 			name: 'gender',
		// 			update: true,
		// 			options: [
		// 				{
		// 					value: 'Male'
		// 				},
		// 				{
		// 					value: 'Female',
		// 				}
		// 			],
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'Gender Required'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			type: 'checkbox',
		// 			col: 'value10',
		// 			label: 'Accept Terms',
		// 			name: 'term',
		// 			value: [true],
		// 			update: true,
		// 			validations: [
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'checkbox Required'
		// 				}
		// 				,
		// 				{
		// 					name: 'required',
		// 					validator: Validators.required,
		// 					message: 'select Required'
		// 				}
		// 			]
					
		// 		},
			
		// 	]
		// }
	
	];
	sideDrawerWidth: any;
	
	//#endregion
	
	constructor(
		private createItemService: CreateItemService,
		private dataService: DataService,
		public globalVariables: GlobalVariables,
		private _viewContainerRef: ViewContainerRef,
		private ref: ChangeDetectorRef,
		public ngxSpinner: NgxSpinnerService,
		public moduleDataService: ModuleDataService,
		public formSharedService: SharedService,
		private userService: UserService
	) {
		this.drawerTitle = this.globalVariables.translation["Create New"][this.globalVariables.LNG];
	}
	
	formGroups: any;
	isSaveHide: boolean = false;
	
	selectedMultiGroupsTemplate: any[];
	public selectableTypes = [];
	
	ngOnInit() {
		this.ngxSpinner.show("create");
		this.typeGroups = this.moduleDataService.getTypeGroups();
		
		if (this.types && this.types.length == 1) {

			// this.selectedTab = 0;
			// console.log('typeGroups', this.typeGroups)
			// this.chooseType(this.typeGroups[0].values[0]);

			this.selectedType = +this.types[0];
			let pf_flag = false;
			this.selectedTypeProcessFlowImage = this.moduleDataService.getProcessFlowImages(this.selectedType);
			// console.log('selectedTypeProcessFlowImage', this.selectedType, this.selectedTypeProcessFlowImage);
			if (this.selectedTypeProcessFlowImage.hasOwnProperty(this.globalVariables.LNG) && this.selectedTypeProcessFlowImage[this.globalVariables.LNG] != "") {
				pf_flag = this.checkAlreadyAcknowlegedProcessFlow(this.selectedType);
			}
			else
				pf_flag = true;

			// console.log('pf_flag', pf_flag);

			if(!(pf_flag === false || typeof pf_flag == 'undefined')){
				this.selectedTab = 2;
				this.selectedFieldsTemplate = this.fieldsTemplates[this.selectedType];
				this.formSharedService.setTypeId(this.selectedType);
				
				this.selectedFieldsTemplate.forEach((groups, groupsIndex) => {
					groups.fields.forEach((field, fieldsIndex) => {
						if (groups.groupName.en === "Claim Info") {
							field.update = false;
							if (field.col === "create_date") {
								field.value = [new Date()];
							}
						}
					});
				});


				if (this.moduleDataService.getMultiGroups(this.selectedType)) {
					this.selectedMultiGroupsTemplate = JSON.parse(JSON.stringify(this.moduleDataService.getMultiGroups(this.selectedType)));
				}
			}
			else{
				this.selectedTab = 1;
			}
		} 
		else {
			this.selectedTab = 0;
			if (this.moduleDataService.getAllowedTypes()) {
				this.moduleDataService.getAllowedTypes().forEach((typeIndex, index) => {
					this.selectableTypes.push({
						id: this.moduleDataService.getModuleTypes()[typeIndex].id,
						name: this.moduleDataService.getModuleTypes()[typeIndex].name,
					});
				});
			} else {
				this.moduleDataService.getModuleTypes().forEach((type, index) => {
					this.isSaveHide = true;
					this.selectableTypes.push({
						id: type.id,
						name: type.name,
					});
				});
			}
		}
		this.checkDrawerWidth();
	}

	
	/**
	 * drawer width
	 */
	checkDrawerWidth() {
		let viewpermission = this.moduleDataService.getViewPermissions();
		try {
			if (viewpermission.drawer_templates) {
				this.sideDrawerWidth = viewpermission.drawer_templates.add_template.side_drawer.width;
				this.sideDrawerWidth = this.userService.responsiveDrawerWidth('add', this.sideDrawerWidth, true);
			}
		} catch{ }
	}
	
	@Output() ifDirtyValues: EventEmitter<any> = new EventEmitter();
	
	checkIsFormDirty(val) {
		this.ifDirtyValues.emit(val);
	}
	
	ngAfterViewInit() {
		let cal = [
			{
				sub: [
					{
						add: [
							{
								mul: [6, 5, 10]
							},
							{
								div: [19, 5]
							}
						]
					},
					{
						div: [54, 5]
					}
				]
			}
		];
		
		this.multiArraytoStringformula(cal, true);
		this.componentPortal = new ComponentPortal(AddDrawerComponent);
		this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
		this.ref.detectChanges();
		this.ngxSpinner.hide("create");
		this.ngxSpinner.hide("create");
	}
	
	formula: string = "";
	
	multiArraytoStringformula(cal, isMain) {
		if (isMain) {
			this.formula = "";
		} else {
		}
		cal.forEach((element, idx, array) => {
			
			let currEle = Object.keys(element)[0];
			if (currEle) {
				this.formula += currEle + '(';
				this.multiArraytoStringformula(element[currEle], false);
				if (!isMain) {
					this.formula += ',';
				}
			} else {
				if (idx === array.length - 1) {
					this.formula += element;//+ '),';
				} else {
					this.formula += element + ',';
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

	checkAlreadyAcknowlegedProcessFlow(typeID){
		let userknownProcessFlows: any = window.localStorage.getItem("process_flows_acknowledged") || '{}';
		let pf_flag = false;
		if (userknownProcessFlows != '') {
			userknownProcessFlows = JSON.parse(userknownProcessFlows);
			if(userknownProcessFlows.hasOwnProperty(this.moduleId) && userknownProcessFlows[this.moduleId] && Array.isArray(userknownProcessFlows[this.moduleId]) && userknownProcessFlows[this.moduleId].length > 0){
				pf_flag = userknownProcessFlows[this.moduleId].find(pl => pl == typeID);
			}
		}
		
		if (pf_flag === false || typeof pf_flag == 'undefined') {
			if(!userknownProcessFlows.hasOwnProperty(this.moduleId)) 
				userknownProcessFlows[this.moduleId] = [];
			userknownProcessFlows[this.moduleId].push(typeID);
			window.localStorage.setItem("process_flows_acknowledged", JSON.stringify(userknownProcessFlows));
		}
		return pf_flag;
	}
	
	/**
	 * Goes to next tab after a type has been chosen
	 *
	 * @param type
	 */
	chooseType(type: any): void {
		this.selectedTab += 1;
		this.selectedType = type.id;
		this.selectedTypeProcessFlowImage = this.moduleDataService.getProcessFlowImages(this.selectedType);
		this.showProcessFlowInForm = false;
		this.formSharedService = this.selectedType;
		this.searchModule = '';
		
		if (!this.selectedTypeProcessFlowImage.hasOwnProperty(this.globalVariables.LNG) || (this.selectedTypeProcessFlowImage.hasOwnProperty(this.globalVariables.LNG) && this.selectedTypeProcessFlowImage[this.globalVariables.LNG] == "")) {
			this.chooseForm();
			return;
		}
		
		let pf_flag = this.checkAlreadyAcknowlegedProcessFlow(type.id);
		
		/*let userknownProcessFlows: any = window.localStorage.getItem("process_flows_acknowledged") || '{}';
		let pf_flag = false;
		// console.log('userknownProcessFlows A', userknownProcessFlows)
		if (userknownProcessFlows != '') {
			userknownProcessFlows = JSON.parse(userknownProcessFlows);
			// console.log('userknownProcessFlows B', userknownProcessFlows)
			if(userknownProcessFlows.hasOwnProperty(this.moduleId) && userknownProcessFlows[this.moduleId] && Array.isArray(userknownProcessFlows[this.moduleId]) && userknownProcessFlows[this.moduleId].length > 0){
				pf_flag = userknownProcessFlows[this.moduleId].find(pl => pl == type.id);
			}
		}
		
		if (pf_flag === false || typeof pf_flag == 'undefined') {
			if(!userknownProcessFlows.hasOwnProperty(this.moduleId)) 
				userknownProcessFlows[this.moduleId] = [];
			userknownProcessFlows[this.moduleId].push(type.id);
			window.localStorage.setItem("process_flows_acknowledged", JSON.stringify(userknownProcessFlows));
		}
		//if already known/see before, then skip to the form view
		else {*/
		if(!(pf_flag === false || typeof pf_flag == 'undefined')) {
			this.chooseForm();
			this.showProcessFlowInForm = true;
		}
		
	}
	
	chooseForm(): void {
		this.selectedTab += 1;
		this.selectedFieldsTemplate = this.fieldsTemplates[this.selectedType];
		this.isSaveHide = false;
		this.selectedFieldsTemplate.forEach((groups, groupsIndex) => {
			// if (groups.groupName.en === "Claim Info") {
			groups.fields.forEach((field, fieldsIndex) => {
				if (groups.groupName.en === "Claim Info") {
					field.update = false;
					if (field.col === "create_date") {
						field.value = [new Date()];
					}
				} else if (!field.multiple && Array.isArray(field.value) && field.value.length == 0) {
					field.value = "";
				}
			});
			if (groups.subGroups) {
				groups.subGroups.forEach(subGroup => {
					subGroup.fields.forEach((field, fieldIndex) => {
						field.value = "";
					});
				});
			}
			// }
		});
        if (this.moduleDataService.getMultiGroups(this.selectedType)) {
            this.selectedMultiGroupsTemplate = JSON.parse(JSON.stringify(this.moduleDataService.getMultiGroups(this.selectedType)));
        }
		// this.componentPortal = new ComponentPortal(AddDrawerComponent);
		// this.templatePortal = new TemplatePortal(this.templatePortalContent, this._viewContainerRef);
		this.ref.detectChanges();
		this.ngxSpinner.hide("create");
	}
	
	tabBack() {
		this.selectedTab -= 1;
	}
	@Input() isIncident = false;
	eventSubmitted() {
		this.ngxSpinner.show('create');
		let formObject;
		if (this.selectedFieldsTemplate && this.selectedFieldsTemplate.length > 0) {
			formObject = this.form.getFlatObject(); //this.getObject(this.form.formGroups);
		}
		
		let multiFormObjects = [];
		if (this.form.multiForms && this.form.multiForms.formGroups) {
			multiFormObjects = this.form.multiForms.getFormValue();
		}
		
		this.createItemService.createNewItem(this.moduleId, this.selectedType, formObject, multiFormObjects, this.form.attachmentsService.attachments)
			.subscribe((data) => {
				if (data.status == 200) {
					if (this.isIncident) {
						this.createItemService.incidentCreated(data.content.id, {status: 25})
						.subscribe((tmp) => {
							this.submitted.emit(data.content);
						});
					} else {
						this.submitted.emit(data.content);
					}
				}
				this.ngxSpinner.hide('create');
			});
	}
	
	checkForName(formObject) {
		if (this.moduleDataService.viewId == 233 || this.moduleDataService.viewId == 232) {
			formObject.name = {
				en: formObject.name,
				ar: formObject.name,
			}
		}
		
		return formObject;
	}
	
	getObject(formGroups) {
		const value = formGroups.value;
		let formArray = value.reduce(function(result, current) {
			return Object.assign(result, current);
		}, {});
		
		return formArray;
	}
	
	eventCancelledDrawer() {
		this.cancelled.emit("cancelled");
	}
	
	
	onBasicDetailsSubmit() {
	
	}

	public inputSearchQuery(val: string){
		this.searchModule = val;
	}
}
