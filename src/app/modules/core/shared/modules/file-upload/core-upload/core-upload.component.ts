import { Component, OnInit} from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
	selector: 'app-core-upload',
	templateUrl: './core-upload.component.html',
	styleUrls: ['./core-upload.component.scss']
})
export class CoreUploadComponent implements OnInit{
	public attachmentsLength;
	public attachmentsGroup: FormGroup;
	public attachmentsSubscp: any;
	constructor(public globalVariables: GlobalVariables) {
		this.attachmentsGroup = new FormGroup({
			attachments: new FormControl()
		});
	}

	ngOnInit() {}
}
