import {Component, AfterViewInit} from "@angular/core";
import {OverlayContainer} from "@angular/cdk/overlay";
import { Subject } from 'rxjs';
//import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { PushNotificationsService } from 'ng-push';

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.css"]
})
export class AppComponent  {
	title = "Dubai Police Fleet Management";
	message: Subject<any>;
	
	constructor(overlayContainer: OverlayContainer, private _pushNotifications: PushNotificationsService) {
		overlayContainer.getContainerElement().classList.add("dp-light-theme");
		this._pushNotifications.requestPermission();
	}
}
