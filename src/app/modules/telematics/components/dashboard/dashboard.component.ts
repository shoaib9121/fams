
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

  fleetSummery=[{
    name:{
      en:'Total vehicles',
      ar:''
    },
    count:10
  },
  {
    name:{
      en:'Total Drivers',
      ar:''
    },
    count:10
  },
  {
    name:{
      en:'Moving',
      ar:''
    },
    count:10
  },
  {
    name:{
      en:'Paused',
      ar:''
    },
    count:10
  },
  {
    name:{
      en:'Stopped',
      ar:''
    },
    count:10
  },
  {
    name:{
      en:'Not Connected',
      ar:''
    },
    count:10
  },];


  liveTrackingDataSource = [ {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "patrol | 80",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "patrol | 95",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "patrol | 95",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "9377",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "iserveId": "iServe | 02",
    "vehicle": "1002",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "1002",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "1002",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "9377",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "9377",
    "total_odometer":"5km"
  },
  {
    "moving_status": "",
    "temp": " ",
    "location": "Dubai",
    "vehicle": "9377",
    "total_odometer":"5km"
  }]

  latestViolationLabels: Label[] = ["Speed Violations","Zone Violations","Green Driving Violatons"];
	latestViolationData: ChartDataSets[] = [
		{
			data: [25,30,35],
			label: this.globalVars.translation["count"][this.globalVars.LNG]
		}
	];
	latestViolationType: ChartType = 'bar';
	latestViolationOptions: ChartOptions = {
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
	latestViolationColors: Color[] = [
		{backgroundColor: '#06B1B1'}
	];

  liveTrackingLabels=["vehicle","moving_status","total_odometer","temp","location"]
    
  constructor(public globalVars: GlobalVariables,) { 
	
  }

  maxSpeedData: ChartDataSets[] = [
    { data: [111,123,145,101], label: 'Speed' },
  ];

  maxSpeedLabels: Label[] = ['vip | l 503', 'patrol | 80', 'patrol | 90', '1068'];

  maxSpeedOptions = {
    responsive: true,
  };

  maxSpeedColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: '#ECECEC',
    },
  ];

  maxSpeedLegend = true;
  maxSpeedPlugins = [];
  maxSpeedType = 'line';




    inactiveVehicleLabels: Label[] = ['Idle','Stopped'];
    inactiveVehicleData: MultiDataSet = [
		[4,5]
  ];
  
	inactiveVehicleType: ChartType = 'doughnut';
	inactiveVehicleOptions: ChartOptions = {
		responsive: true,
		legend: {
			display: true,
			position: 'right',
			labels: {
				boxWidth: 10,
			},
		}
	};

	
  ngOnInit() {

	
		
		
		
  }

	
}
