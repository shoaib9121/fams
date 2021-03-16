import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VehiclesComponent, DialogQrCode,DialogVehicleConfirm} from './components/vehicles/vehicles.component';
import {IServeRoutingModule} from "./i-serve-routing.module";
import {
	MatInputModule,
	MatIconModule,
	MatSidenavModule,
	MatTableModule,
	MatToolbarModule,
	MatListModule,
	MatMenuModule,
	MatButtonModule,
	MatChipsModule,
	MatStepperModule,
	MatFormFieldModule,
	MatSelectModule,
	MatTabsModule,
	MatExpansionModule,
	MatCardModule,
	MatAutocomplete,
	MatAutocompleteModule,
	MatRadioModule,
	MatRadioGroup,
	MatButtonToggleModule,
	MatTooltipModule,
	MatDialogModule,
	MatSlideToggleModule,

} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UsersComponent} from './components/users/users.component';
import {MapviewComponent} from './components/mapview/mapview.component';
import {LocationsComponent} from './components/locations/locations.component';
import {BookingsallComponent} from './components/bookingsall/bookingsall.component';
import {AppsModule} from "../apps.module";
import { BookingstodayComponent } from './components/bookingstoday/bookingstoday.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ChartsModule} from "ng2-charts";

@NgModule({
	declarations: [VehiclesComponent, UsersComponent, MapviewComponent, LocationsComponent, BookingsallComponent, DialogQrCode, DialogVehicleConfirm, BookingstodayComponent,BookingsallComponent, DashboardComponent],
	imports: [
		CommonModule,
		IServeRoutingModule,
		MatTableModule,
		MatToolbarModule,
		MatListModule,
		MatMenuModule,
		MatIconModule,
		MatSidenavModule,
		FlexLayoutModule,
		MatChipsModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		FormsModule,
		MatTabsModule,
		MatExpansionModule,
		MatCardModule,
		MatButtonModule,
		MatAutocompleteModule,
		ReactiveFormsModule,
		MatCardModule,
		FlexLayoutModule,
		MatRadioModule,
		MatButtonToggleModule,
		MatTooltipModule,
		MatChipsModule,
		AppsModule,
		MatDialogModule,
		MatSlideToggleModule,
		NgxSpinnerModule,
    ChartsModule,
	],
	entryComponents: [
		DialogQrCode, DialogVehicleConfirm
	],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA
	]
})
export class IServeModule {
}
