import { Component, OnInit } from '@angular/core';
import { JobDetailsService } from '../job-details.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent implements OnInit{
  
  navToBack(){
    this.location.back();
  }
  navToHelp(){
    this.router.navigate(['help'])
  }
  constructor(private jobDetailsService:JobDetailsService,
              private location:Location,
              private router:Router
  )
  {
    this.jobDetailsService.getSelectedJob()
    console.log( this.jobDetailsService.getSelectedJob());
  
  }
  ngOnInit(): void {
      this.orderDetails=this.jobDetailsService.getSelectedJob();
  }

    
  orderDetails:any;
nameOfUser:any;
schedule:any;
address:any;
// noJobs:any=this.orderDetails.orderId
}
