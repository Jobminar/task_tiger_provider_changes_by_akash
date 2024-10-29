import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JobDetailsService } from '../job-details.service';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrl: './job-history.component.css'
})
export class JobHistoryComponent implements OnInit{

  filteredJobs:any;
  navToBack(){
    this.location.back()
  }
  constructor(private location:Location,
              private jobDetailsService:JobDetailsService,
              private router:Router,
              private orderService:OrdersService
  ){

  }

  ngOnInit(): void {
      this.getOrderDetails();
  }
  jobs:any[]=[
    {
      date:'12/02/122',
      name:'anil',
      value:'100',
      paymentDone:'100'
    },
    {
      date:'12/02/122',
      name:'anil',
      value:'100',
      paymentDone:'100'
    },
    {
      date:'12/02/122',
      name:'anil',
      value:'100',
      paymentDone:'100'
    }
  ];

  getOrderDetails() {
    this.orderService.orderHistory().subscribe({
      next: (response) => {
        console.log(response);
        this.jobs = response.data; // Assuming response is an array of order objects
        this.filterOrder(); // Call filterOrder after fetching the order history
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  filterOrder() {
    this.filteredJobs = this.jobs.filter((job: any) => {
      return job.status && job.status.toLowerCase() === 'completed'; // Case-insensitive comparison
    });
    console.log(this.filteredJobs);
    this.jobs=this.filteredJobs;
  }
  selectedJob(item:any){
    console.log(item);
    this.jobDetailsService.selectedJobDetails(item);
    this.router.navigate(['jobDetails'])
  }
}
