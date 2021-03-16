import {Injectable} from "@angular/core";
import {CanLoad, Route, UrlSegment, RouterStateSnapshot, UrlTree, Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
	providedIn: "root"
})
export class AuthorizationGuard implements CanLoad {
	
	constructor(private router: Router) {
	}
	
	canLoad(
		route: Route,
		segments: UrlSegment[]) {
		if (window.localStorage.getItem("jwt")) {
			return true;
		}
		
		this.router.navigate(["/login"]);
		return false;
	}
}
