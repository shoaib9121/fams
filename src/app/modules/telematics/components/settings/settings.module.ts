import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { AlarmSettingsComponent } from './alarm-settings/alarm-settings.component';
import { SettingsComponent, settingsDialog } from './settings.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppsModule } from 'src/app/modules/apps.module';
import { MatSidenavModule,
  MatToolbarModule,
  MatCardModule,
  MatTableModule,
  MatSelectModule,
  MatInputModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatChipsModule,
  MatIconModule,
  MatButtonModule,
  MatListModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTabsModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatStepperModule,} from '@angular/material';
import { GroupVehiclesComponent } from './group-vehicles/group-vehicles.component';
import { GroupDriverComponent } from './group-driver/group-driver.component';
import { VehicleManagmentComponent } from './vehicle-managment/vehicle-managment.component';
import { FilterTagsComponent } from './filter-tags/filter-tags.component';
import { DriverManagmentComponent } from './driver-managment/driver-managment.component';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';


@NgModule({
  declarations: [settingsDialog,AlarmSettingsComponent,SettingsComponent, GroupVehiclesComponent, GroupDriverComponent, VehicleManagmentComponent, FilterTagsComponent, DriverManagmentComponent, UserManagmentComponent, SystemSettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTabsModule,
    NgxSpinnerModule,
    AppsModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatStepperModule
  ],
	entryComponents: [
		settingsDialog,
	],
})
export class SettingsModule { }
