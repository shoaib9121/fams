import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TimeTrackingService } from "./side-time-tracker.service";
import { TimeTrackingModel } from "./side-time-tracker.model";
import { NgxSpinnerService } from "ngx-spinner";
import { GlobalVariables } from "../../../../../global-variables.service";
import { EditItemService } from "../../user/edit-drawer/edit-item.service";

@Component({
  selector: 'app-side-time-tracker',
  templateUrl: './side-time-tracker.component.html',
  styleUrls: ['./side-time-tracker.component.scss']
})
export class SideTimeTrackerComponent implements OnInit {

  	/**
	 * Data that is needed for selected item
	 */
	@Input() data: any;

	/**
	 * Emitted when user presses cancel actionButton, indicating that no action should be taken by parent
	 */
	// @Output() cancelled: EventEmitter<any> = new EventEmitter();

	/**
	 * Emitted when user performs End State Event
	 */
	@Output() isStateUpdated: EventEmitter<any> = new EventEmitter();

	/**
	 * Title that is shown in the top bar
	 */
	public drawerTitle: string;
	
	/**
	 * An object that stores actual spinner and related properties
	 */	
	public spinnerProps: any;

	/**
	 * An object that stores actual clock duration and related properties
	 */	
	public stopWatch: any;

	public multiGroups;
	public estimatedTime: number; // provided as seconds
	public hours;
	public minutes;
	public seconds;

	constructor( 
		private _timeTrackingService: TimeTrackingService, 
		private ngxSpinner: NgxSpinnerService, 
		public globalVars: GlobalVariables,
		private _editItemService: EditItemService
	) { 
		
		this.initSpinnerProperties();
		this.initTickerProperties();
		this.defaultTimerValues();
		this.estimatedTime = 24*3600; // default is 24 hours
	}

	ngOnInit() {
		this.ngxSpinner.show("time-tracking");
		this.postTimeTracking('');
	}
	
	initSpinnerProperties(){
		this.spinnerProps = {
			value: 0,
			color: 'primary', // primary, accent, warn
			mode: 'determinate', // determinate, indeterminate
			strokeWidth: 5,
			diameter: 200,
		}
	}
	
	initTickerProperties() {
		this.stopWatch = {
			timer : null, // time interval
			now : 0, // current timer in seconds
			state: '' // current state i.e. start_time, end_time, pause_time, continue_time
		}
	}

	/**
	 * 
	 * @param event Where event is the identification if the method has been triggered implicitly of explicitly.
	 * If it has invoked explicitly then we want to post API request with state start_time
	 */		
	startTimer() {
		let secondsCounter = 0, tempCount = 0;
		this.stopWatch.timer = setInterval( () => { // stopwatch interval
			
			// Auto fill progress for the time that has already been passed and timer view is being opened at first place
			if(secondsCounter == 0){
				if(this.stopWatch.now){
					this.spinnerProps.value = (this.stopWatch.now/this.estimatedTime)*100;
				}
			}

			secondsCounter = this.stopWatch.now ? this.stopWatch.now : 0;

			let interval = 100/(+this.estimatedTime); // spinner incremental step
			if ((this.stopWatch.now + interval) >= this.estimatedTime) {
				this.spinnerProps.color = 'warn';
			}
			this.spinnerProps.value += interval;

			secondsCounter++;
			tempCount++;

			this.stopWatch.now++; // increment stopwatch
			var remain = this.stopWatch.now;
			var hours = Math.floor(remain / 3600);
			remain -= hours * 3600;
			var mins = Math.floor(remain / 60);
			remain -= mins * 60;
			var secs = remain;
	
			// Update display timer
			(hours<10) ?  this.hours = "0" + hours : this.hours = hours; 
			(mins<10)  ? this.minutes = "0" + mins : this.minutes = mins; 
			(secs<10)  ? this.seconds = "0" + secs : this.seconds = secs;

		}, 1000);

	}

	/**
	 * Prepares payload parameters for Time Tracking
	 * 
	 * @param state defines event state i.e. start_time, end_time, continue_time, pause_time 
	 */
	postTimeTracking(state: string, event?: any) {
		let done, duration; // part of payload parameters
		this.ngxSpinner.show("time-tracking");

		switch (state) {
			case 'start_time':
				done = false;
				duration = false;
				break;
			case 'end_time':
				done = true;
				duration = false;
				break;
			case 'continue_time':
				done = false;
				duration = true;
				break;
			case 'pause_time':
				done = false;
				duration = true;
				break;
				
			default:
				done = false;
				duration = true;
				break;
		}

		// Payload data for api
		let timerData: TimeTrackingModel = {
			id: +this.data.id,
			value: {
				done: done,
				duration: duration
			}
		}
		
		// Add state only if api has explicitly called
		if(event){
			timerData.value.state = state;
			this._editItemService.shouldRefreshViewOnClose = true;
		}

		this._timeTrackingService.postTimeTrackingAPI(timerData)
			.subscribe((data) => {
				if(data.hasOwnProperty("content")){
					let values = data.content.values;
					let durationObj: any = {};

					this.stopWatch.state = values.current_state;
					this.drawerTitle = values.isse_name ? values.isse_name : '';
					if(this.stopWatch.state == 'end_time'){

						// actual_time equivalent to Final Duration
						if(values.hasOwnProperty("actual_time")){
							durationObj = this.getHoursMinutesSeconds(values.actual_time);
						}
						this.endTimer();
					}
					else if(this.stopWatch.state === 'start_time' || this.stopWatch.state === 'continue_time'){
						
						if(values.hasOwnProperty("duration")){
							durationObj = this.getHoursMinutesSeconds(values.duration);
						}
						this.startTimer();
					}
					else if(this.stopWatch.state === 'pause_time'){
						
						if(values.hasOwnProperty("duration")){
							durationObj = this.getHoursMinutesSeconds(values.duration);
						}
						this.pauseTimer();
					}

					this.hours = durationObj.hours ? durationObj.hours : '00';
					this.minutes = durationObj.minutes ? durationObj.minutes : '00';
					this.seconds = durationObj.seconds ? durationObj.seconds : '00';
					
					if(this.hours && this.minutes && this.seconds){
						this.stopWatch.now = (+this.hours*3600) + (+this.minutes*60) + (+this.seconds); // convert to seconds
					}

					if(values.hasOwnProperty("estimated_time")){
						if(values.estimated_time != ''){
							let durationObj: any = {}, hrs, mins, secs;
							durationObj = this.getHoursMinutesSeconds(values.estimated_time);
							hrs = durationObj.hours;
							mins = durationObj.minutes;
							secs = durationObj.seconds;
							this.estimatedTime = (+hrs*3600) + (+mins*60) + (+secs); // convert to seconds
						}
					}
				}
				this.ngxSpinner.hide("time-tracking");
			})
	}

	pauseTimer() {
		clearInterval(this.stopWatch.timer);
	}

	endTimer() {
		clearInterval(this.stopWatch.timer);
	}

	defaultTimerValues() {
		this.hours = '00';
		this.minutes = '00';
		this.seconds = '00';
	}

	eventUpdatedDrawer() {
		this.isStateUpdated.emit('state_updated');
	}

	getHoursMinutesSeconds(duration: string){
		let durationObj: any = {};

		if(typeof duration == 'string'){
			let durationBreakdown = duration.split(':')
			durationObj.hours = durationBreakdown[0]; // hours
			durationObj.minutes = durationBreakdown[1]; // minutes
			durationObj.seconds = durationBreakdown[2]; // seconds
		}

		return durationObj;
	}
		
	// Todo: Remove this if resetting timer is not required
	resetTimer() {
		if (this.stopWatch.timer != null) { 
			this.pauseTimer(); 
			this.stopWatch.now = -1;
			this.spinnerProps.value = 1;
			this.initTickerProperties();
			this.initSpinnerProperties();
			this.defaultTimerValues();
		}
	}
}
