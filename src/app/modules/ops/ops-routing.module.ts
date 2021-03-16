import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {SystemComponent} from "./modules/admin/components/core/system.component";
import {UserComponent} from "./components/user/user.component";
import {DashboardComponent} from "./components/user/dashboard/dashboard.component";

const routes: Routes = [
	{
		path: "system",
		component: SystemComponent,
		loadChildren: () => import("./modules/admin/admin.module").then(mod => mod.AdminModule),
	},
	{
		path: "user/admin",
		pathMatch: "prefix",
		redirectTo: "system/admin/3/10/21" // Redirecting to Departments
	},
	{
		path: "user/dashboard",
		component: DashboardComponent,
	},
	{
		path: "user/:menu",
		component: UserComponent,
	},
	{
		path: "user/:menu/:moduleId/:viewId/:roleId",
		component: UserComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class OpsRoutingModule {
}
