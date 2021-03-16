import { NgModule, Pipe, PipeTransform } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OpsRoutingModule } from "./ops-routing.module";
import {
	MatButtonModule,
	MatChipsModule,
	MatIconModule,
	MatListModule,
	MatMenuModule,
	MatSidenavModule,
	MatTableModule,
	MatToolbarModule,
	MatStepperModule,
	MatFormFieldModule,
	MatInputModule,
	MatSelectModule,
	MatTabsModule,
	MatExpansionModule,
	MatCardModule,
	MatGridListModule,
	MatCheckboxModule,
	MatDatepickerModule,
	MatRadioModule,
	MatAutocompleteModule,
	MatNativeDateModule,
	MatDialogModule,
	MatTooltipModule,
	MatRippleModule,
	MatProgressBarModule,
	MatSlideToggleModule,
	MatProgressSpinnerModule
} from "@angular/material";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { UserComponent } from "./components/user/user.component";
import { ValidationDialog } from "./components/shared/validation-dialog/validation.dialog";
import { StatusUpdateSnackbar } from "./components/shared/status-update-snackbar/status-update.snackbar";
import { ConfirmationDialog } from "../core/shared/components/dialogs/confirmation-dialog/confirmation-dialog";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddDrawerComponent } from "./components/user/add-drawer/add-drawer.component";
import { DynamicReactiveFormComponent } from "../core/shared/components/dynamic-reactive-form/dynamic-reactive-form/dynamic-reactive-form.component";
import { ButtonComponent } from "../core/shared/components/dynamic-reactive-form/button/button.component";
import { CheckboxComponent } from "../core/shared/components/dynamic-reactive-form/checkbox/checkbox.component";
import { DateComponent } from "../core/shared/components/dynamic-reactive-form/date/date.component";
import { InputComponent } from "../core/shared/components/dynamic-reactive-form/input/input.component";
import { TableComponent } from "../core/shared/components/dynamic-reactive-form/table/table.component";
import { RadiobuttonComponent } from "../core/shared/components/dynamic-reactive-form/radiobutton/radiobutton.component";
import { SelectComponent } from "../core/shared/components/dynamic-reactive-form/select/select.component";
import { DynamicFieldDirective } from "../core/shared/components/dynamic-reactive-form/dynamic-field/dynamic-field.directive";

// Services
import { UserService } from "./components/user/user.service";
import { AttachmentsService } from "../core/shared/components/dynamic-reactive-form/attachments/attachments.service";

// Pipes
// import { TimeAgoPipe } from "../core/shared/pipes/time-ago.pipe";
import { SearchFilterPipe } from '../core/shared/pipes/search-filter.pipe';
import { ThousandSuffixesPipe } from '../core/shared/pipes/thousand-suffixes.pipe';

import {
	BoardWidgetComponent,
	BoardWidgetDialog,
	BoardWidgetNotclaimDialog
} from "../core/shared/widgets/board-widget/board-widget.component";
import { RegisterTemplateFormModelDirective } from "../core/shared/components/dynamic-reactive-form/register-child/register-child-component.directive";
import { AppsModule } from "../apps.module";
import { PortalModule } from "@angular/cdk/portal";
import { NgxSpinnerModule } from "ngx-spinner";
import { EditDrawerComponent } from "./components/user/edit-drawer/edit-drawer.component";
import { DashboardComponent } from "./components/user/dashboard/dashboard.component";
import { ChartsModule } from "ng2-charts";
import { StatusComponent } from "../core/shared/components/dynamic-reactive-form/status/status.component";
import { ButtonConfirmComponent } from "./components/user/edit-drawer/buttonconfirmdialog/buttonconfirmdialog.component";
import { MdePopoverModule } from "@material-extended/mde";
import { MatBadgeModule } from "@angular/material/badge";
import { AssetsReportComponent, ComponentDialog } from "./components/user/assets-report/assets-report.component";
import { StaticSelectComponent } from "../core/shared/components/dynamic-reactive-form/static-select/static-select.component";
import { ColorPickerModule } from "ngx-color-picker";
import { DashboardComponent as InsuranceDashboard } from "./components/user/insurance/dashboard/dashboard.component";
import { DashboardComponent as FamsDashboard } from "./components/user/fams/dashboard/dashboard.component";
import { DownloadFileDirective } from "../core/shared/directives/download-file.directive";
import { TextAreaComponent } from "../core/shared/components/dynamic-reactive-form/text-area/text-area.component";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { TimeComponent } from "../core/shared/components/dynamic-reactive-form/time/time.component";
import { OptionsScrollDirective } from "../core/shared/components/dynamic-reactive-form/shared/options-scroll.directive";
import { SystemComponent } from "./modules/admin/components/core/system.component";
import { DynamicMultiGroupFormComponent } from "../core/shared/components/dynamic-reactive-form/dynamic-multi-group-reactive-form/dynamic-multi-group-form.component";
import { NameObjectComponent } from "../core/shared/components/dynamic-reactive-form/name-object/name-object.component";
import { MultiSelectComponent } from "../core/shared/components/dynamic-reactive-form/multi-select/multi-select.component";
import { FileUploadModule } from "../core/shared/modules/file-upload/file-upload.module";
import { ImageDialogComponent } from "../core/shared/components/dialogs/image-dialog/image-dialog.component";
import { RemoveSpacePipe } from "../core/shared/components/dynamic-reactive-form/shared/replace-all.pipe";
import { StaticDataService } from "../core/shared/services/static-data/static-data.service";
import { AttachmentsComponent } from "../core/shared/components/dynamic-reactive-form/attachments/attachments.component";
import { SpinnerSnackbarService } from "../core/shared/components/spinner-snackbar/spinner-snackbar.service";
import { SpinnerComponent } from "../core/shared/components/spinner-snackbar/spinner-snackbar.component";
import { SideDrawerComponent } from './components/user/side-drawer/side-drawer.component';
import { SideAttachmentsComponent } from './components/user/side-attachments/side-attachments.component';
import { SideNotesComponent } from './components/user/side-notes/side-notes.component';
import { SideListComponent } from './components/user/side-list/side-list.component';
import { SideActivityComponent } from './components/user/side-activity/side-activity.component';
import { DynamicReactiveFormDialogComponent } from '../core/shared/components/dynamic-reactive-form/dynamic-reactive-form-dialog/dynamic-reactive-form-dialog.component';
import { SearchFilterComponent } from "../core/shared/components/search-filter/search-filter.component";
import { CommentsDialogComponent } from './components/user/assets-report/comments-dialog/comments-dialog.component';
import { TableDialogComponent } from '../core/shared/components/dynamic-reactive-form/table-dialog/table-dialog.component';
import { TableObjectComponent } from '../core/shared/components/dynamic-reactive-form/table-object-component/table-object.component';
import { SideTimeTrackerComponent } from './components/user/side-time-tracker/side-time-tracker.component';
import { DashboardWorkshopStaffComponent } from './components/user/dashboard-workshop-staff/dashboard-workshop-staff.component';
import { DashboardWorkshopManagerComponent } from './components/user/dashboard-workshop-manager/dashboard-workshop-manager.component';
import { DashboardStoreComponent } from './components/user/dashboard-store/dashboard-store.component';
import { DashboardServiceManagerComponent } from './components/user/dashboard-service-manager/dashboard-service-manager.component';
import { SnackbarDrawerOpener } from "./components/shared/snackbar-drawer-opener/snackbar-drawer-opener";
import { BarcodeDialog } from '../core/shared/dialogs/barcode-dialog/barcode.dialog';
import { AlertDialog } from "../core/shared/dialogs/alert-dialog/alert.dialog";

@NgModule({
	declarations: [
		UserComponent,
		AddDrawerComponent,
		EditDrawerComponent,
		BoardWidgetComponent,
		AssetsReportComponent,
		ComponentDialog,
		StatusUpdateSnackbar,
		DashboardComponent,
		ButtonConfirmComponent,

		// region DYNAMIC REACTIVE FORMS
		DynamicReactiveFormComponent,
		DynamicMultiGroupFormComponent,
		ButtonComponent,
		CheckboxComponent,
		DateComponent,
		TimeComponent,
		NameObjectComponent,
		InputComponent,
		RadiobuttonComponent,
		SelectComponent,
		DynamicFieldDirective,
		ConfirmationDialog,
		ValidationDialog,
		BoardWidgetDialog,
		BoardWidgetNotclaimDialog,
		RegisterTemplateFormModelDirective,
		TableComponent,
		TableObjectComponent,
		StatusComponent,
		StaticSelectComponent,
		MultiSelectComponent,
		TextAreaComponent,
		DownloadFileDirective,
		OptionsScrollDirective,
		// region
		DashboardComponent,
		InsuranceDashboard,
		FamsDashboard,
		SystemComponent,
		RemoveSpacePipe,
		ImageDialogComponent,
		TableDialogComponent,
		AttachmentsComponent,
		SpinnerComponent,
		SideDrawerComponent,
		SideAttachmentsComponent,
		SideNotesComponent,
        SideListComponent,
		DynamicReactiveFormDialogComponent,
		SearchFilterPipe,
		SearchFilterComponent,
		CommentsDialogComponent,
		ThousandSuffixesPipe,
		SideTimeTrackerComponent,
		DashboardWorkshopStaffComponent,
		DashboardWorkshopManagerComponent,
		DashboardStoreComponent,
		DashboardServiceManagerComponent,
		SnackbarDrawerOpener,
        BarcodeDialog,
		AlertDialog,
		SideActivityComponent,
	],
	imports: [
		FormsModule,
		ReactiveFormsModule,
		CommonModule,
		OpsRoutingModule,
		MatTableModule,
		MatToolbarModule,
		MatListModule,
		MatMenuModule,
		MatIconModule,
		MatButtonModule,
		MatSidenavModule,
		FlexLayoutModule,
		MatChipsModule,
		MatStepperModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatTabsModule,
		MatExpansionModule,
		MatCardModule,
		MatGridListModule,
		MatCheckboxModule,
		MatDatepickerModule,
		MatRadioModule,
		MatAutocompleteModule,
		MatSelectModule,
		MatNativeDateModule,
		MatDialogModule,
		DragDropModule,
		MatTooltipModule,
		MatChipsModule,
		MdePopoverModule,
		MatBadgeModule,
		AppsModule,
		PortalModule,
		NgxSpinnerModule,
		ChartsModule,
		MatRippleModule,
		MatProgressBarModule,
		ColorPickerModule,
		NgxMaterialTimepickerModule,
		MatSlideToggleModule,
		FileUploadModule,
		MatProgressSpinnerModule
	],
	entryComponents: [
		AddDrawerComponent,
		EditDrawerComponent,
		AssetsReportComponent,
		ComponentDialog,
		StatusUpdateSnackbar,
		ButtonConfirmComponent,
		// region DYNAMIC REACTIVE FORMS
		ButtonComponent,
		CheckboxComponent,
		DateComponent,
		TimeComponent,
		InputComponent,
		RadiobuttonComponent,
		StatusComponent,
		NameObjectComponent,
		StaticSelectComponent,
		MultiSelectComponent,
		TextAreaComponent,
		SelectComponent, ConfirmationDialog, BoardWidgetDialog, ValidationDialog,
		TableComponent, BoardWidgetNotclaimDialog,
		TableObjectComponent,
		// region
		InsuranceDashboard,
		FamsDashboard,
		ImageDialogComponent,
		AttachmentsComponent,
		SpinnerComponent,
		SideDrawerComponent,
		SideAttachmentsComponent,
		SideNotesComponent,
		SideListComponent,
		SideActivityComponent,
		DynamicReactiveFormDialogComponent,
		TableDialogComponent,
		SideTimeTrackerComponent,
		DashboardWorkshopStaffComponent,
		DashboardWorkshopManagerComponent,
		DashboardStoreComponent,
		DashboardServiceManagerComponent,
		SnackbarDrawerOpener,
        BarcodeDialog,
		AlertDialog
	],
	providers: [
		UserService,
		StaticDataService,
		AttachmentsService,
		SpinnerSnackbarService
	],
	exports: [
		RegisterTemplateFormModelDirective,

	],
})
export class OpsModule {
}

