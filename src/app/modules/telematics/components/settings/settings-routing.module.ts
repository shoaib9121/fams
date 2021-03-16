import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { AlarmSettingsComponent } from './alarm-settings/alarm-settings.component';
import { GroupDriverComponent } from './group-driver/group-driver.component';
import { GroupVehiclesComponent } from './group-vehicles/group-vehicles.component';
import { DriverManagmentComponent } from './driver-managment/driver-managment.component';
import { VehicleManagmentComponent } from './vehicle-managment/vehicle-managment.component';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { FilterTagsComponent } from './filter-tags/filter-tags.component';
const routes: Routes = [
	{
		path: "",
		component: SettingsComponent,
		children: [
			{
				path: "alarm",
				component: AlarmSettingsComponent
			},
			{
				path: "vehicle-group",
				component: GroupVehiclesComponent,
			},
			{
				path: "drivers-group",
				component: GroupDriverComponent,
			},
			{
				path: "vehicles",
				component: VehicleManagmentComponent,
			},
			{
				path: "drivers",
				component: DriverManagmentComponent,
			},
			{
				path: "users",
				component: UserManagmentComponent,
			},
			{
				path: "system",
				component: SystemSettingsComponent,
			},
			{
				path: "filters",
				component: FilterTagsComponent,
			}
		]
	},


]

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule { }
