import { ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { WebSocketService } from 'src/app/shared/service/web-socket.service';
import { GlobalVariables } from "src/app/global-variables.service";
import { MdePopoverTrigger } from '@material-extended/mde';
import { Router, NavigationEnd } from '@angular/router';
import { PushNotificationsService } from 'ng-push';
import { NotificationService } from './notification.service';


@Component({
	selector: 'app-notification',
	templateUrl: './notification.component.html',
	styleUrls: ['./notification.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit {
	@ViewChild(MdePopoverTrigger, { static: false }) trigger: MdePopoverTrigger;
	public notifications: any[] = [];
	public unreadNotiLength:number;
	public drawerItemRecord;
	constructor(private webSocketAPI: WebSocketService, public globalVars: GlobalVariables, private router: Router, private _pushNotifications: PushNotificationsService, 
		public changeDetectorRef: ChangeDetectorRef, private _notificationService: NotificationService, private ngZone: NgZone) {
		this.unreadNotiLength = 0;
		this.drawerItemRecord = null;
	}

	ngOnInit() {
		this.webSocketAPI._connect();
		this.webSocketAPI.notification.subscribe((data: any) => {
			this.webSocketAPI.acknowledgeNotification(this.globalVars.loadUserInfo().id);
			this.setNotification(JSON.parse(data.body));
			console.log(this.globalVars.loadUserInfo().id);
			console.log("notification is called")
			this.notify(JSON.parse(data.body))
		});
	}

	// desktop notification 
	notify(message){

		let options = { //set options
			body: message.message[this.globalVars.LNG],
			icon: "assets/dubai-police.svg" //adding an icon
		}
		this._pushNotifications.create(this.setNotificationTitle(message.type), options).subscribe( //creates a notification
			res => {
				res.notification.onclick = (event)=> {
					// let url = `/apps/insurance/user/claims/29/71/91`;
					// this.router.navigate([url]);
					// alert(url+'\n'+ message.message)
					event.preventDefault(); // prevent the browser from focusing the Notification's tab
					// window.open('http://www.mozilla.org', '_blank');
					console.log('message notification', message.message);
					this.onNotificationClick(message)
				}
			},
			err => console.log(err)
		);
	}

	/**
	 * Populate notifications array by setting additional properties i.e is_read, title.
	 * If notification found in Local Storage then set notification is_read status true otherwise false.
	 *
	 */
	setNotification(notification) {
		let notInLocalStorage = [], notifications;
		notifications = window.localStorage.getItem(`notifications_${this.globalVars.getCurrentApplicationName()}`);
		notification.title = this.setNotificationTitle(notification.type);
		
		if (notifications) {
			notInLocalStorage = JSON.parse(notifications);
			notification.is_read = !!notInLocalStorage.find((noti) => notification.id == noti.id);
		}
		
		if(!notification.hasOwnProperty('is_read')) {
			notification.is_read = false;
		};
		
		if(!notification.is_read) {
			this.unreadNotiLength++
		};
		
		this.notifications.push(notification);
		
		// Sorting latest notifications at top
		this.notifications.sort(sortDate);​

		// This loop is sorting the read notifications to bottom
		// var len = this.notifications.length;
		// for (var i = 0; i < len; i++) {
		// 	if (this.notifications[i].is_read) {
		// 		this.notifications.push(this.notifications.splice(i, 1)[0]);
		// 		i--; // decrement i since the element removed
		// 		len--; // decrement len to avoid moved element
		// 	}
		// }

		this.changeDetectorRef.detectChanges();
	}

	setNotificationTitle(notificationType) {
		switch (notificationType) {				
			default:
				return this.globalVars.translation[this.globalVars.getCurrentApplicationName() == 'insurance' ? "Claim Update" : "Request Update"][this.globalVars.LNG];
		}
	}

	onNotificationClick(notification) {
		console.log("onNotificationClick", notification);
		let notificationsArr = [], notifications, appNotificationsItem = `notifications_${this.globalVars.getCurrentApplicationName()}`;
		notifications = window.localStorage.getItem(appNotificationsItem);
		
		// Notifications field_id does not exist
		if (!notifications) { 
			notification['is_read'] = true;
			notificationsArr.push(notification)
		} else { 
			// Notifications field_id does exist
			notificationsArr = JSON.parse(notifications);
			let index = notificationsArr.findIndex((notificationElement => notificationElement.id == notification.id));
			if (index == -1) {
				notification['is_read'] = true;
				notificationsArr.push(notification)
			}
		}
		this.unreadNotiLength--;
		window.localStorage.setItem(appNotificationsItem, JSON.stringify(notificationsArr));
		
		let noNavigationChange = false;
		
		
		let url = `/apps/${this.globalVars.getCurrentApplicationName()}/user/${this.globalVars.getCurrentApplicationName() == "insurance" ? 'claims' : 'requests'}/${notification.moduleId}/${notification.viewId}/${notification.roleId}`;
		if (url == this.router.url) {
			noNavigationChange = true;
		}
		notification.noNavigationChange = noNavigationChange;
		// this._notificationService.fireNotificationsEvent(notification);
		this._notificationService.notificationData = notification;
		this._notificationService.allowDrawerOpening = true;
		this.trigger.closePopover();

		// This check is needed because our application tends to navigate route outside of angular zone and logs error in certain state.
		if(NgZone.isInAngularZone()){
			this.router.navigate([url]);
		}else{
			this.ngZone.run( () => {
				this.router.navigate([url]);
			})
		}
		
		this.changeDetectorRef.detectChanges(); // this might not needed here.
	}
}

/**
 * This method sorts records by date property i.e. createdAt
 * @param d1 date one
 * @param d2 date two
 */
function sortDate( d1, d2 ){  
	let dateA = new Date(d1.createdAt).getTime(), dateB = new Date(d2.createdAt).getTime();
	return dateA < dateB ? 1 : -1;  
};
