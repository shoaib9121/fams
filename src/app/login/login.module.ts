import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {LoginRoutingModule} from "./login-routing.module";
import {LoginComponent} from "./login.component";
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule} from "@angular/material";
import {ReactiveFormsModule} from "@angular/forms";
import {NgxSpinnerModule} from "ngx-spinner";
import { HttpClientModule } from '@angular/common/http';


@NgModule({
	declarations: [LoginComponent],
	imports: [
		CommonModule,
		LoginRoutingModule,
		MatCardModule,
		MatFormFieldModule,
		HttpClientModule,
		MatInputModule,
		MatIconModule,
		MatButtonModule,
		ReactiveFormsModule,
		NgxSpinnerModule,
	]
})
export class LoginModule {
}
