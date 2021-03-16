import { Component, EventEmitter, Output } from '@angular/core';
import { GlobalVariables } from '../../../../../global-variables.service';

@Component({
	selector: 'app-search-filter',
	templateUrl: './search-filter.component.html',
	styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {

	public searchModal: string;
	ifSearchBox: boolean = false;
	@Output() inputQuery: EventEmitter<any> = new EventEmitter<any>();

	constructor(public globalVariables: GlobalVariables) { }

	inputChanges() {
		this.inputQuery.emit(this.searchModal);
	}

	toggleSearchBox(){
		this.ifSearchBox = !this.ifSearchBox;
		this.inputQuery.emit(''); 
		this.searchModal= '';
	}
}
