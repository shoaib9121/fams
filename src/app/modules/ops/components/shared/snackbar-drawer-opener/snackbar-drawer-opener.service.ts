import { Injectable, EventEmitter, Output } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class SnackbarDrawerOpenerService {

	recordData;
	@Output() public fireDrawerOpener: EventEmitter<any>;
    constructor( private globalVariables: GlobalVariables
	) {
		this.fireDrawerOpener = new EventEmitter();
	}
	
	/**
	 * Event fired from Snackbar when record is created or updated and event being subsribed in UserComponent
	 *
	 */
	public fireDrawerOpenerEvent(data) {
        this.fireDrawerOpener.emit(data);
    }

}
