import {RolesService} from './roles.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {GlobalVariables} from 'src/app/global-variables.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
	selector: 'app-roles',
	templateUrl: './roles.component.html',
	styleUrls: ['./roles.component.scss']
})

export class RolesComponent implements OnInit {
	
	@ViewChild('drawer', {static: false}) drawer: MatSidenav;
	public drawerType: string;
	public roles: any = [];
	public rolesCopy: any;
	public tableWidgetData: {
		columnStructure: Array<object>,
		data: Array<object>,
		typeStructure: any,
		configuration: object
	};
	
	public roleForm: FormGroup;
	selectedRowId: number;
	
	public columnStructure: any;
	
	constructor(
		public globalVars: GlobalVariables,
		public rolesService: RolesService,
		private formBuilder: FormBuilder,
		public ngxSpinner: NgxSpinnerService,
	) {
		this.columnStructure = [
			{
				name: {
					"en": 'ID',
					"ar": '#'
				},
				field_id: 'id',
				type: 'single'
			},
			{
				name: {
					"en": "Name English",
					"ar": "اسم الانجليزية",
				},
				field_id: "name_english",
				type: "single",
			},
			{
				name: {
					"en": "Name Arabic",
					"ar": "الاسم العربية",
				},
				field_id: "name_arabic",
				type: "single",
			}
		];
		this.drawerType = "add";
	}
	
	ngOnInit() {
		this.ngxSpinner.show("create");
		this.initFormStructure();
		this.fetchRoles();
	}
	
	initFormStructure () {
		this.roleForm = this.formBuilder.group({});
		this.roleForm.addControl("name", this.formBuilder.group({
			en: ["", Validators.required],
			ar: ["", Validators.required],
		}));
	}
	
	fetchRoles() {
		this.roles = [];
		this.rolesService.fetchRoles()
			.subscribe(data => {
				this.rolesCopy = data.content;
				
				data.content.forEach(userRole => {
					this.roles.push({
						id: userRole.id,
						type_id: 0,
						name_english: userRole.name.en,
						name_arabic: userRole.name.ar
					});
				});
				
				this.initTableData();
			});
	}
	
	initTableData() {
		this.tableWidgetData = {
			columnStructure: this.columnStructure,
			data: [
				{
					data: this.roles
				}
			],
			typeStructure: {
				0: this.columnStructure
			},
			configuration:  {
				globalHeaders: true,
				hasParentChildRelation: false,
				defaultPadding: true,
				showGroupFilter: true,
				haveSearch: false,
				search: {}
			}
		};
		this.ngxSpinner.hide("create");
	}
	
	saveRole() {
		this.ngxSpinner.show("create");
		if (this.selectedRowId) {
			let data = {
				id: this.selectedRowId,
				name: this.roleForm.value.name
			};
			console.log(data);
			this.rolesService.updateRole(this.selectedRowId, this.roleForm.value)
			.subscribe(data => {
				if (data.status == 200) {
					console.log(data.content.data);
					this.selectedRowId = null;
					this.drawer.toggle();
					this.ngOnInit();
				}
			});
		} else {
			console.log(this.roleForm.value);
			this.rolesService.addRole((this.roleForm.value))
			.subscribe(data => {
				if (data.status == 200) {
					console.log(data.content.data);
					this.drawer.toggle();
					this.ngOnInit();
				}
			});
		}
		this.ngxSpinner.hide("create");
	}
	
	openDrawer(type: string, row = null) {
		this.drawerType = type;
		
		switch (this.drawerType) {
			case "add":
				this.roleForm.patchValue({
					name: {en: '', ar: ''}
				});
				break;
			case "edit":
				this.roleForm.patchValue({
					name: {en: row.name_english, ar: row.name_arabic}
				});
				break;
			default:
				break;
		}
		
		this.drawer.toggle();
	}
	
	drawerClosed(event) {
		this.drawer.toggle();
	}
	
	rowClicked(row) {
		this.selectedRowId = row.id;
		console.log("row clicked", row);
		this.openDrawer('edit', row);
	}
	
}
