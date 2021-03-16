import { Component, OnInit } from '@angular/core';
import { GlobalVariables } from 'src/app/global-variables.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settingsTypes = [
    {
      link:'/apps/telematics/settings/alarm',
      name: {
        en: 'Alarm Settings',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/vehicle-group',
      name: {
        en: 'Group Managment Vehicles',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/drivers-group',
      name: {
        en: 'Group Managment Driver',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/vehicles',
      name: {
        en: 'Vehicle Managment',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/filters',
      name: {
        en: 'Filter Tags',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/drivers',
      name: {
        en: 'Driver Managment',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/users',
      name: {
        en: 'User Managment',
        ar: ''
      },
      icons: []
    },
    {
      link:'/apps/telematics/settings/system',
      name: {
        en: 'System Settings',
        ar: ''
      },
      icons: []
    }
  ]
  constructor(public globalVars: GlobalVariables,public ngxSpinner: NgxSpinnerService) { 

  
  }

  ngOnInit() {
    
  }


  
  



 

  GroupManagmentVehicles()
  {
    
  }
}
@Component({
	selector: 'settings-dialog',
	templateUrl: 'settings-dialogue.html',
})
export class settingsDialog {
  constructor (public globals: GlobalVariables,public dialogRef: MatDialogRef<settingsDialog>,) {

    
	
	}

  onYesClick(str): void {
		this.dialogRef.close(true);
	}

}

