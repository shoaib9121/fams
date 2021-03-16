import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppRoutingModule } from "./app-routing.module";
import { AuthorizationGuard } from "./authorization.guard";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BidiModule } from "@angular/cdk/bidi";
import { registerLocaleData } from "@angular/common";
import localeAr from "@angular/common/locales/ar-AE";
import localeExtra from "@angular/common/locales/extra/ar";
import { PushNotificationsModule } from 'ng-push';
import { JwtInterceptor } from "./modules/auth/jwt.interceptor";
import { NgxMaterialTimepickerModule } from "ngx-material-timepicker";
import { MatSnackBarModule } from "@angular/material";

registerLocaleData(localeAr, "ar-AE", localeExtra);

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		BidiModule,
		NgxMaterialTimepickerModule,
		PushNotificationsModule,
		MatSnackBarModule,
	],
	providers: [AuthorizationGuard, {provide: LocationStrategy, useClass: HashLocationStrategy}, {
		provide: HTTP_INTERCEPTORS,
		useClass: JwtInterceptor,
		multi: true
	},
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
