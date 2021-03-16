
import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {CoreComponent} from "./core/core.component";


const routes: Routes = [
	{
		path: "",
		component: CoreComponent,
		children: [
			{
				path: "insurance",
				loadChildren: () => import("./ops/ops.module").then(mod => mod.OpsModule),
			},
			{
				path: "fams",
				loadChildren: () => import("./ops/ops.module").then(mod => mod.OpsModule),
			},
			{
				path: "crm",
				loadChildren: () => import("./ops/ops.module").then(mod => mod.OpsModule),
			},
			{
				path: "iServe",
				loadChildren: () => import("./iserve/i-serve.module").then(mod => mod.IServeModule),
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AppsRoutingModule {
}
