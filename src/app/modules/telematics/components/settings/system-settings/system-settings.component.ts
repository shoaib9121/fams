import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
  @ViewChild('fileInput',{static:false})
  fileInput;
  dashboardModules= ['Fleet Statistics', 'Vehicle Statistics', 'Maximum Speed Measured', 'Maintenance Statistics', 'Overspeed','Zone Violation', ' Live Tracking Map1', ' Live Tracking Map2', ' Live Tracking Map3', 'Green Driving','Inactive Vehicles','Engine Idle'];
  constructor() { }

  ngOnInit() {
  }
  onClickFileInputButton(): void {
    this.fileInput.nativeElement.click();
  }
}
