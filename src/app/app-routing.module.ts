import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import {environment} from "../environments/environment";
import {AuthorizationGuard} from "./authorization.guard";


const routes: Routes = [
    {
        path: "apps",
        loadChildren: () => import("./modules/apps.module").then(mod => mod.AppsModule),
        canLoad: [AuthorizationGuard],
    },
    {
        path: "login",
        // TODO: Add Auth Guard: if authenticated -> redirect to ""
        loadChildren: () => import("./login/login.module").then(mod => mod.LoginModule),
    },
    {
        path: "",
        pathMatch: "full",
        redirectTo: "apps",
        canLoad: [AuthorizationGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(
        routes,
        {
            enableTracing: environment.routes.enableTracing,
            onSameUrlNavigation: "reload",
        }
    )],
    exports: [RouterModule]
})
export class AppRoutingModule { }
