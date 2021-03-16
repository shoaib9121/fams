import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ModuleDefinitionComponent} from "./components/module-definition/module-definition.component";
import {ViewPrivilegeComponent} from "./components/view-privilege/view-privilege.component";
import {RolesComponent} from "./components/roles/roles.component";
import {WorkspaceComponent} from "./components/workspace/workspace.component";
import {DepartmentComponent} from './components/department/department.component';
import { UserAccountComponent } from './components/user-account/user-account.component';


const routes: Routes = [
	{
		path: "admin",
		children: [
			{
				path: "3/10/:roleId",
				component: DepartmentComponent,
			},
			{
				path: "4/7/:roleId",
				component: ModuleDefinitionComponent,
			},
			{
				path: "7/13/:roleId",
				component: ViewPrivilegeComponent,
			},
			{
				path: "5/9/:roleId",
				component: RolesComponent,
			},
			{
				path: "7/12/:roleId",
				component: WorkspaceComponent,
			},
			{
				path: "3/9/:roleId",
				component: DepartmentComponent,
			},
			{
				path: "2/8/:roleId",
				component: UserAccountComponent,
			}
		],
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRoutingModule {
}
