import { Injectable, EventEmitter, Output } from "@angular/core";

@Injectable({
	providedIn: "root"
})

export class NotificationService {

    allowDrawerOpening: boolean;
    notificationData: any;
    @Output() public fireNotifications: EventEmitter<any>;

    constructor () {
        this.fireNotifications = new EventEmitter();
        this.notificationData = null;
	}
	
    // public fireNotificationsEvent(notification) {
    //     this.fireNotifications.emit(notification);
    // }

}

