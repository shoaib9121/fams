import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import { HistoryComponent } from './components/history/history.component';
import { SettingsComponent } from './components/settings/settings.component';
import { LiveComponent } from './components/live/live.component';


const routes: Routes = [
	{
		path: "dashboard",
		component: DashboardComponent,
	},
	{
		path: "live",
		component: LiveComponent,
		
	},
	{
		path: "history",
		component: HistoryComponent,
	},
	{
		path: "settings",
		loadChildren: () => import("./components/settings/settings.module").then(mod => mod.SettingsModule)
	},
	{
		path: "",
		pathMatch: "full",
		redirectTo: "dashboard",
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class TelematicsRoutingModule {
}
