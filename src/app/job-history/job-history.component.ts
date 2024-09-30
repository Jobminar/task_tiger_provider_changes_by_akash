import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { JobDetailsService } from '../job-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-history',
  templateUrl: './job-history.component.html',
  styleUrl: './job-history.component.css'
})
export class JobHistoryComponent {
  navToBack(){
    this.location.back()
  }
  constructor(private location:Location,
              private jobDetailsService:JobDetailsService,
              private router:Router
  ){

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
  ]

  selectedJob(item:any){
    console.log(item);
    this.jobDetailsService.selectedJobDetails(item);
    this.router.navigate(['jobDetails'])
  }
}
