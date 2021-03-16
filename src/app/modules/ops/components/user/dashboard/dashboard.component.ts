import {AfterViewInit, Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, Inject, HostListener, ChangeDetectorRef} from '@angular/core';
import {MatSidenav, MatDialogRef, MatDialog, MatSnackBar, MAT_SNACK_BAR_DATA, MAT_DIALOG_DATA} from "@angular/material";
import {NgxSpinnerService} from "ngx-spinner";
import {DashboardComponent as InsuranceDashboard} from "../insurance/dashboard/dashboard.component";
import {DashboardComponent as FamsDashboard} from "../fams/dashboard/dashboard.component";
import { GlobalVariables } from 'src/app/global-variables.service';
import { timer } from 'rxjs';
import { DashboardWorkshopStaffComponent } from '../dashboard-workshop-staff/dashboard-workshop-staff.component';
import { DashboardWorkshopManagerComponent } from '../dashboard-workshop-manager/dashboard-workshop-manager.component';
import { DashboardStoreComponent } from '../dashboard-store/dashboard-store.component';
import { DashboardServiceManagerComponent } from '../dashboard-service-manager/dashboard-service-manager.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('dashboard', {static: false, read: ViewContainerRef}) viewContainerRef: ViewContainerRef;
  
  constructor(public globalVars: GlobalVariables, private componentFactoryResolver: ComponentFactoryResolver) {
  }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    var cur_user_type_id = JSON.parse(window.localStorage.getItem("user_info")).type_id;

    // Workshop Staff
    if(cur_user_type_id == '5'){
        let addStaffDashboardFactory = this.componentFactoryResolver.resolveComponentFactory(DashboardWorkshopStaffComponent);
        timer(0).subscribe(val => {
          this.viewContainerRef.createComponent(addStaffDashboardFactory).instance;
        })
    }
    // Service Manager
    else if(cur_user_type_id == '6'){
      let dashboardServiceManagerFactory = this.componentFactoryResolver.resolveComponentFactory(DashboardServiceManagerComponent);
      timer(0).subscribe(val => {
        this.viewContainerRef.createComponent(dashboardServiceManagerFactory).instance;
      })       
    }
    // Workshop Manager
    else if(cur_user_type_id == '7'){
        let dashboardWorkshopManagerFactory = this.componentFactoryResolver.resolveComponentFactory(DashboardWorkshopManagerComponent);
        timer(0).subscribe(val => {
          this.viewContainerRef.createComponent(dashboardWorkshopManagerFactory).instance;
        })       
    }
    // Store
    else if(cur_user_type_id == '8'){
        let dashboardStoreFactory = this.componentFactoryResolver.resolveComponentFactory(DashboardStoreComponent);
        timer(0).subscribe(val => {
          this.viewContainerRef.createComponent(dashboardStoreFactory).instance;
        })       
    }
    // Insurance
    else if(this.globalVars.getCurrentApplicationName() == 'insurance'){
        let addInsuranceDashboardFactory = this.componentFactoryResolver.resolveComponentFactory(InsuranceDashboard);
        timer(0).subscribe(val => {
          this.viewContainerRef.createComponent(addInsuranceDashboardFactory).instance;
        })       
    }
    // Fams
    else if(this.globalVars.getCurrentApplicationName() == 'fams'){
        let addFamsDashboardFactory = this.componentFactoryResolver.resolveComponentFactory(FamsDashboard);
        timer(0).subscribe(val => {
          this.viewContainerRef.createComponent(addFamsDashboardFactory).instance;
        });
    }
  }

}
