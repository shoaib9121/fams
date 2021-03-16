import {NgModule} from "@angular/core";
import {CommonModule, CurrencyPipe, DecimalPipe} from "@angular/common";
import {AppsRoutingModule} from "./apps-routing.module";
import {CoreComponent} from "./core/core.component";
import {TopBarComponent} from "./core/top-bar/top-bar.component";
import {SidenavComponent} from "./core/sidenav/sidenav.component";
import {NgxSpinnerModule} from 'ngx-spinner';
import {
	MatButtonModule,
	MatButtonToggleModule,
	MatExpansionModule,
	MatIconModule,
	MatListModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatToolbarModule,
	MatFormFieldModule,
	MatSelectModule,
	MatMenuModule,
	MatDialogModule,
	MatIconRegistry,
	MatChipsModule,
	MatTooltipModule,
	MatTableModule,
	MatSlideToggleModule,
	MatCheckboxModule,
	MatInputModule,
	MatRippleModule,
	MatAutocompleteModule,
	MatCardModule, MatDividerModule, MatStepperModule, MatOptionModule, MatTabsModule
	
} from "@angular/material";

import {MatPaginatorModule} from '@angular/material/paginator';
import {FlexLayoutModule} from "@angular/flex-layout";
import {DomSanitizer} from "@angular/platform-browser";
import {TableWidget} from "./core/shared/widgets/table-widget/table.widget";
import {CdkTableModule} from "@angular/cdk/table";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MdePopoverModule } from '@material-extended/mde';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ColorPickerModule} from "ngx-color-picker";
import { SecurePipe } from "./core/shared/pipes/secure.pipe";
import { NotificationComponent } from "./ops/components/user/insurance/notification/notification.component";
import { MatBadgeModule } from "@angular/material/badge";
import { TimeAgoPipe } from "./core/shared/pipes/time-ago.pipe";
import { TotalPagesPipe } from './core/shared/widgets/table-widget/table.widget';
import { EmptyStateComponent } from "./core/shared/components/empty-state/empty-state.component";

@NgModule({
	declarations: [
		CoreComponent,
		TopBarComponent,
		SidenavComponent,
		TableWidget,
		SecurePipe,
		NotificationComponent,
		TimeAgoPipe,
		TotalPagesPipe,
		EmptyStateComponent
	],
	imports: [
		CommonModule,
		AppsRoutingModule,
		FlexLayoutModule,
		MatToolbarModule,
		MatSidenavModule,
		MatButtonToggleModule,
		MatListModule,
		MatExpansionModule,
		MatIconModule,
		MatSnackBarModule,
		MatButtonModule,
		MatFormFieldModule,
		MatChipsModule,
		MatTableModule,
		MatFormFieldModule,
		FormsModule,
		ReactiveFormsModule,
		MatTooltipModule,
		MatAutocompleteModule,
		MdePopoverModule,
		MatCardModule,
		MatSelectModule,
		MatMenuModule,
		NgxSpinnerModule,
		MatDialogModule,
		MatSlideToggleModule,
		MatCheckboxModule,
		CdkTableModule,
		MatInputModule,
		MatRippleModule,
		NgxMaterialTimepickerModule,
		MatBadgeModule,
		MatPaginatorModule
	],
	providers: [
		CurrencyPipe,
		DecimalPipe,
		SecurePipe,
	],
	entryComponents: [
		SidenavComponent,
	],
	exports: [
		TableWidget,
		MatIconModule,
		MatChipsModule,
		MatSidenavModule,
		MatDividerModule,
		MatTableModule,
		CdkTableModule,
		MatInputModule,
		MatFormFieldModule,
		ReactiveFormsModule,
		FlexLayoutModule,
		MatStepperModule,
		MatOptionModule,
		MatAutocompleteModule,
		MatSelectModule,
		FormsModule,
		MatToolbarModule,
		MatButtonModule,
		ColorPickerModule,
		MatExpansionModule,
		MatCardModule,
		MatTooltipModule,
		MatCheckboxModule,
		MatTabsModule,
		NgxSpinnerModule,
		MatDialogModule,
		SecurePipe,
		TimeAgoPipe,
		MatPaginatorModule,
		TotalPagesPipe,
		EmptyStateComponent
	],
})
export class AppsModule {
	constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
		matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg'));
		matIconRegistry.addSvgIcon("custom-awesome-horse-head", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-awesome-horse-head.svg'));
		matIconRegistry.addSvgIcon("custom-car-accident", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-car-accident.svg'));
		matIconRegistry.addSvgIcon("custom-contract", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-contract.svg'));
		matIconRegistry.addSvgIcon("custom-marine", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-marine.svg'));
		matIconRegistry.addSvgIcon("custom-reimbursements", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-reimbursements.svg'));
		matIconRegistry.addSvgIcon("custom-cash", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-cash.svg'));
		matIconRegistry.addSvgIcon("custom-chart-timeline-variant", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/custom-chart-timeline-variant.svg'));
		matIconRegistry.addSvgIcon("reserved", domSanitizer.bypassSecurityTrustResourceUrl('./assets/svg-icons/reserved.svg'));
	}
}
