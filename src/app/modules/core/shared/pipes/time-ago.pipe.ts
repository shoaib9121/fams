import { Pipe, PipeTransform, NgZone, ChangeDetectorRef, OnDestroy } from "@angular/core";
import { GlobalVariables } from '../../../../global-variables.service';

@Pipe({
	name : 'timeAgo',
	pure : false
})
export class TimeAgoPipe implements PipeTransform, OnDestroy {
	private timer: number;
	constructor(private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone, private globalVariables: GlobalVariables) {}
	transform( value: string ) {
		this.removeTimer();
		let d = new Date(value);
		let now = new Date();
		let seconds = Math.round(Math.abs((now.getTime() - d.getTime())/1000));
		let timeToUpdate = (Number.isNaN(seconds)) ? 1000 : this.getSecondsUntilUpdate(seconds) *1000;
		this.timer = this.ngZone.runOutsideAngular(() => {
			if (typeof window !== 'undefined') {
				return window.setTimeout(() => {
					this.ngZone.run(() => this.changeDetectorRef.markForCheck());
				}, timeToUpdate);
			}
			return null;
		});
		let minutes = Math.round(Math.abs(seconds / 60));
		let hours = Math.round(Math.abs(minutes / 60));
		let days = Math.round(Math.abs(hours / 24));
		let months = Math.round(Math.abs(days/30.416));
		let years = Math.round(Math.abs(days/365));
		if (Number.isNaN(seconds)){
			return '';
		} else if (seconds <= 60) {
			return this.globalVariables.translation['now'][this.globalVariables.LNG];
		} else if (minutes <= 60) {
			return minutes + ' ' + this.globalVariables.translation['minutes ago'][this.globalVariables.LNG];
		} else if (minutes < 120) {
			return this.globalVariables.translation['an hour ago'][this.globalVariables.LNG];
		} else if (hours <= 3) {
			return hours + ' ' + this.globalVariables.translation['hours ago'][this.globalVariables.LNG];
		} else if (hours > 24 && hours <= 48) {
			return this.globalVariables.translation['one day ago'][this.globalVariables.LNG];
		} else if (days >= 48) {
			return days + ' ' + this.globalVariables.translation['days ago'][this.globalVariables.LNG];
		} else if (days <= 45) {
			return this.globalVariables.translation['one month ago'][this.globalVariables.LNG];
		} else if (days <= 345) {
			return months + ' ' + this.globalVariables.translation['months ago'][this.globalVariables.LNG];
		} else if (days <= 545) {
			return this.globalVariables.translation['one year ago'][this.globalVariables.LNG];
		} else { // (days > 545)
			return years + ' ' + this.globalVariables.translation['years ago'][this.globalVariables.LNG];
		}
	}

	ngOnDestroy(): void {
		this.removeTimer();
	}

	private removeTimer() {
		if (this.timer) {
			window.clearTimeout(this.timer);
			this.timer = null;
		}
	}
	
	private getSecondsUntilUpdate(seconds:number) {
		let min = 60;
		let hr = min * 60;
		let day = hr * 24;
		if (seconds < min) { // less than 1 min, update every 2 secs
			return 2;
		} else if (seconds < hr) { // less than an hour, update every 30 secs
			return 30;
		} else if (seconds < day) { // less then a day, update every 5 mins
			return 300;
		} else { // update every hour
			return 3600;
		}
	}
}