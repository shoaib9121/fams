import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {VehiclesComponent} from "./components/vehicles/vehicles.component";
import {UsersComponent} from "./components/users/users.component";
import {MapviewComponent} from "./components/mapview/mapview.component";
import {BookingsallComponent} from "./components/bookingsall/bookingsall.component";
import {BookingstodayComponent} from "./components/bookingstoday/bookingstoday.component";
import {LocationsComponent} from "./components/locations/locations.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {AuthorizationGuard} from "../../authorization.guard";

const routes: Routes = [
	{
		path: "dashboard",
		component: DashboardComponent,
	},
	{
		path: ":menu/vehicles",
		component: VehiclesComponent,
	}, {
		path: ":menu/users",
		component: UsersComponent,
	}, {
		path: ":menu/mapview",
		component: MapviewComponent,
	}, {
		path: ":menu/bookingall",
		component: BookingsallComponent,
	}, {
		path: ":menu/bookingtoday",
		component: BookingstodayComponent,
	}, {
		path: ":menu/locations",
		component: LocationsComponent,
	},
	{
		path: "admin",
		pathMatch: "full",
		redirectTo: ":menu/vehicles",
	},
	{
		path: "dashboard/users",
		pathMatch: "prefix",
		redirectTo: "dashboard",
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class IServeRoutingModule {
}
