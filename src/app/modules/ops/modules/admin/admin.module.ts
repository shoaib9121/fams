import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminRoutingModule} from './admin-routing.module';
import {ModuleDefinitionComponent} from "./components/module-definition/module-definition.component";
import {ConfirmationDialogPermission, PermissionMatrixComponent, CloneDialogPermission} from "./components/permission-matrix/permission-matrix.component";
import {ViewPrivilegeComponent} from "./components/view-privilege/view-privilege.component";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {RolesComponent} from "./components/roles/roles.component";
import {ModuleDefinitionService} from "./components/module-definition/module-definition.service";
import {ViewPrivilegeService} from "./components/view-privilege/view-privilege.service";
import {RolesService} from "./components/roles/roles.service";
import {PermissionMatrixService} from "./components/permission-matrix/permission-matrix.service";
import {WorkspaceService} from "./components/workspace/workspace.service";
import {MatSlideToggleModule, MatDatepickerModule} from "@angular/material";
import {AppsModule} from "../../../apps.module";
import { DepartmentComponent } from './components/department/department.component';
import { UserAccountComponent } from './components/user-account/user-account.component';

@NgModule({
	declarations: [
		ModuleDefinitionComponent,
		PermissionMatrixComponent,
		ViewPrivilegeComponent,
		WorkspaceComponent,
		RolesComponent,
		ConfirmationDialogPermission,
		CloneDialogPermission,
		DepartmentComponent,
		UserAccountComponent
	],
	imports: [
		CommonModule,
		AdminRoutingModule,
		MatSlideToggleModule,
		AppsModule,
		MatDatepickerModule,
	],
	entryComponents: [PermissionMatrixComponent, ConfirmationDialogPermission, CloneDialogPermission],
	providers: [
		ModuleDefinitionService,
		ViewPrivilegeService,
		RolesService,
		PermissionMatrixService,
		WorkspaceService,
	]
})
export class AdminModule {
}
