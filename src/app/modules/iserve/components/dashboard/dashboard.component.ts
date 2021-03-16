import { Component, OnInit } from '@angular/core';
import {Label, MultiDataSet, Color} from 'ng2-charts';
import {ChartType, ChartDataSets, ChartOptions} from 'chart.js';
import { GlobalVariables } from 'src/app/global-variables.service';
import { DashboardService } from 'src/app/modules/iserve/components/dashboard/dashboard.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	ActiveBookingsTime: any;
	bookingsSummery:any


  constructor(public globalVars: GlobalVariables,public dashboardService: DashboardService,private ngxSpinner: NgxSpinnerService) { 
	//   this.initDashboard()
  }

  vehicleModels = [];
  vehicleModelsDatas = [];

	// Graph data for Vehicles booking by Vehicle Models
	mostUsedTodayChartLabels: Label[] = this.vehicleModels;
	mostUsedTodayChartData: MultiDataSet = [
		this.vehicleModelsDatas,
	];
	mostUsedTodayChartType: ChartType = 'doughnut';
	mostUsedTodayChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'right',
			labels: {
				boxWidth: 10,
			},
		}
	};

	// Graph data for Booking Locations
	bookingLocationLabels = [];
	bookingLocationDataOpen = [];
	bookingLocationDataClose = [];

	bookingLocationChartLabels: Label[] = this.bookingLocationLabels;
	bookingLocationChartData: ChartDataSets[] = [
		{
			data: this.bookingLocationDataOpen,
			label: this.globalVars.translation["Pickup"][this.globalVars.LNG]
		},
		{
			data: this.bookingLocationDataClose,
			label: this.globalVars.translation["Dropoff"][this.globalVars.LNG]
		}
	];
	bookingLocationChartType: ChartType = 'bar';
	bookingLocationChartOptions: ChartOptions = {
		responsive: true,
		scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
		legend: {
			display: true,
			position: 'bottom',
			align: 'end',
			labels: {
				boxWidth: 10,
			},
		},
	};
	public bookingLocationChartColors: Color[] = [
		{backgroundColor: '#9999FF'},
		{backgroundColor: 'rgb(103, 206, 23)'}
	];

	vehicleModelsMost=[]
	vehicleModelsMostData=[]
	// Graph data for Avarage Most Used Vehicles
	mostUsedVehicleChartLabels: Label[] = this.vehicleModelsMost;
	mostUsedVehicleChartData: ChartDataSets[] = [
		{
			data: this.vehicleModelsMostData,
			label: this.globalVars.translation["count"][this.globalVars.LNG]
		}
	];
	mostUsedVehicleChartType: ChartType = 'bar';
	mostUsedVehicleChartOptions: ChartOptions = {
		responsive: true,
		scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
		legend: {
			display: true,
			position: 'top',
			align: 'end',
			labels: {
				boxWidth: 10,
			},
		}
	};
	mostUsedVehicleChartColors: Color[] = [
		{backgroundColor: 'rgb(0, 168, 247)'}
	];

	// data for Claim Details
	activeBookings=[] 
	activeBookingsDataSource = [];
   

	dashBoardDatas:any
		


	
  ngOnInit() {

		this.initDashboard()
		this.getActiveBooking()
		//auto refresh of activeBookingData
		this.ActiveBookingsTime = setInterval(() => {
			this.getActiveBooking()
		}, 10000);
		
		
		
  }

	ngOnDestroy() {
		if (this.ActiveBookingsTime) {
			clearInterval(this.ActiveBookingsTime);
		}
	}

	
   /**initialise the dashboard datas */
  initDashboard()
  {
	  this.ngxSpinner.show("dashboard");
	  this.dashboardService.getDashboardDAta().subscribe((data) => {
	
		 this.dashBoardDatas=data
	

		 for(let i=0;i<this.dashBoardDatas.data.mostUsedVehiclesToday.length;i++)
		 {
			 this.vehicleModels.push(this.dashBoardDatas.data.mostUsedVehiclesToday[i].name)
			 this.vehicleModelsDatas.push(this.dashBoardDatas.data.mostUsedVehiclesToday[i].value)
		 }
		 for(let i=0;i<this.dashBoardDatas.data.mostUsedVehicles.length;i++)
		 {
			 this.vehicleModelsMost.push(this.dashBoardDatas.data.mostUsedVehicles[i].name)
			 this.vehicleModelsMostData.push(this.dashBoardDatas.data.mostUsedVehicles[i].value)
		 }

		 for(let i=0;i<this.dashBoardDatas.data.bookingLocations.length;i++)
		 {
			 
			 this.bookingLocationChartLabels.push(this.dashBoardDatas.data.bookingLocations[i].name)
			 this.bookingLocationDataOpen.push(this.dashBoardDatas.data.bookingLocations[i].Pickup)
			 this.bookingLocationDataClose.push(this.dashBoardDatas.data.bookingLocations[i].DropOff)
		 }

		 this.ngxSpinner.hide("dashboard");
	});
	}
	

    /**Active bookings */
	getActiveBooking()
	{
		
		this.dashboardService.getActiveBookings().subscribe((data)=>{
			console.log(data)
			this.activeBookingsDataSource=data.data.bookingInfo
			this.activeBookings=data.data.header
			console.log('booking table data',this.activeBookingsDataSource)
			
		})


		this.dashboardService.getBookingsSummery().subscribe((data)=>{
			this.bookingsSummery=data.data.dashboardInfo
			console.log('booking summery',this.bookingsSummery)
		})
	}

	
}
