import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TelematicsRoutingModule } from './telematics-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LiveComponent, liveDialog } from './components/live/live.component';
import { HistoryComponent } from './components/history/history.component';
import { SettingsComponent } from './components/settings/settings.component';
import {
  MatTabsModule, MatSlideToggleModule, MatSortModule,
  MatSidenavModule,
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
  MatDialogModule,
  MatButtonToggleModule,
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppsModule } from '../apps.module';
import { ChartsModule } from 'ng2-charts';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


@NgModule({
  declarations: [DashboardComponent, LiveComponent, HistoryComponent, liveDialog],
  imports: [
    CommonModule,
    TelematicsRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    CommonModule,
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
    ChartsModule,
    MatDialogModule, 
    CdkTableModule,
    NgxMaterialTimepickerModule,
    MatButtonToggleModule
  ],
  entryComponents: [
    liveDialog,
  ],

})
export class TelematicsModule { }
