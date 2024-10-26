import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';
import { LoginServiceService } from '../login-service.service';
import { Subscription } from 'rxjs';
import { OrdersService } from '../orders.service';
import { RazorpayService } from '../razorpay.service';
import { UserDetailsService } from '../user-details.service';
import { DailogeBoxService } from '../dailoge-box.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  
  userName:string='';
  userImage:String='';
  whatsAppStaus='on';
  providerRating:string='';
  private apiSubscription!:Subscription
  constructor(private location:Location,
              private router:Router,
              private loginService:LoginServiceService,
              private jobDetailsService:JobDetailsService,
              private ordersService:OrdersService,
              private razorpayService:RazorpayService,
              private userDetals:UserDetailsService,
              private readonly dialougeService:DailogeBoxService
  )
  {
    
  }

  ngOnInit(): void {
    this.jobDetailsService.getUserDetails(localStorage.getItem('providerId'))
    this.getUsername();
    this.getProviderRating();
  }
  
  getProviderRating(){
    this.jobDetailsService.getRating().subscribe({
      next:(res)=>{
        console.log(res);
        this.providerRating=res.averageRating;
      },error:(err:HttpErrorResponse)=>{
        console.log(err);
      }
    })
  }
  getUsername(){
    this.jobDetailsService.getUserDetails(localStorage.getItem('providerId')).subscribe({
      next:(response)=>{
        console.log(response);
      },
      complete:()=>{
        this.userName=this.jobDetailsService.userDetails?.providerName;
        this.userImage=this.jobDetailsService.userDetails?.image;
        console.log(this.jobDetailsService.userDetails);
        console.log(this.userName);
        this.apiSubscription?.unsubscribe();
      }
  })
   
  }
  options:any=[
    {
      icon:'calendar_today',
      name:'Calendar'
    },
    {
      icon:'work',
      name:'Job History'
    },
    {
      icon:'poker_chip',
      name:'Credits'
    },
    {
      icon:'tv_gen',
      name:'Training'
    },
    {
      icon:'featured_seasonal_and_gifts',
      name:'Invite a friend'
    },
    {
      icon:'question_mark',
      name:'Help Center'
    },
    {
      icon:'emoji_events',
      name:'Certificate & documents'
    }
  ]

  navTo(cat: string): void {
    console.log(cat);
    switch(cat) {
      case 'Calendar':
        this.router.navigate(['calender']);
        break;
      case 'Job History':
        this.router.navigate(['jobHistory']);
        break;
      case 'Credits':
        console.log('inside');
        this.router.navigate(['credits']);
        break;
      case 'Training':
        this.router.navigate(['training']);
        break;
      case 'Invite a friend':
        this.router.navigate(['referAndEarn']);
        break;
      case 'Help Center':
        this.router.navigate(['help']);
        break;
      case 'Certificate & documents':
        this.router.navigate(['awards']);
        break;
        case 'packages':
        this.router.navigate(['packages']);
        break;
      default:
        console.log('No matching case found');
    }
  }
  navToFinancial(){
    this.router.navigate(['financialDetails'])
  }
  navBack(){
    this.location.back()
  }
  navToVisiting(){
    const providerId=localStorage.getItem('providerId');
    this.userDetals.getUserDetails(providerId).subscribe({
      next: (res: any) => {
        console.log(res);
        this.router.navigate(['visitingCard']);
      },
      error: (err: any) => {
        console.log(err);
        this.dialougeService.openDialog("Provider details are missing");
        this.router.navigate(['aboutUser']);
      }
    });
   
  }
  logOut(){
    this.jobDetailsService.setDefault();
    this.loginService.setDefult();
    this.ordersService.setDefult();
    this.razorpayService.setDefault();
    this.userDetals.setDefult();
    this.loginService.removeUser();
    this.router.navigate(['selectAccount']);
    localStorage.clear();
  }
  statusChange(){
    if (this.whatsAppStaus==='on') {
      this.whatsAppStaus='off';
    }
    else if ( this.whatsAppStaus='off') {
      this.whatsAppStaus='on';
    } 
    
  }
}
