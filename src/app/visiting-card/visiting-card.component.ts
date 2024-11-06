import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { JobDetailsService } from '../job-details.service';
import { UserDetailsService } from '../user-details.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-visiting-card',
  templateUrl: './visiting-card.component.html',
  styleUrl: './visiting-card.component.css'
})
export class VisitingCardComponent implements OnInit{
  private apiSubscription!:Subscription
  userImage:string=''
  userName:string='';
  userId=localStorage.getItem("providerId")
  workSeleceted:any[]=this.jobDetailsService?.userDetails?.work;
  phoneNumber:any;
  providerRating:string='';
  certificateImages:{images:string}[]=[{images:'assets/demo/awards.png'},{images:'assets/demo/certificate2.png'}];
  constructor(private readonly router:Router,
              private readonly location:Location,
              private readonly jobDetailsService:JobDetailsService,
              private readonly logInService:LoginServiceService,
              private readonly userService:UserDetailsService
  )
  {
   
  }

  ngOnInit(): void {
    this.signingDetails()
    this.getWork();
    this.getCertificates();
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

  signingDetails(){
    this.phoneNumber=this.jobDetailsService.userDetails?.phone;
    this.userName=this.jobDetailsService.userDetails?.providerName;
    this.userImage=this.jobDetailsService.userDetails?.image
    // this.workSeleceted=this.jobDetailsService.workDetails;
   
    // console.log(this.workSeleceted);
  }

  getWork(){
    this.userService.getWork(localStorage.getItem('providerId')).subscribe(
      (response)=>{
          console.log(response);
        //  console.log(response[0].works);
        
        //  this.workSeleceted=response.works
         this.workSeleceted = response.works.filter((value:any, index:any, self:any) => 
        index === self.findIndex((t:any) => (
          t.categoryId.name === value.categoryId.name
        ))
      );
      },(err)=>{
        console.log(err);
      }
    )
  }

  // getCertificates
  getCertificates(){
 const userId=localStorage.getItem('providerId');
    this.userService.getCertificated(userId).subscribe({
     next:(response)=>{
        console.log(response);
       let images:any[]=[];
       for (let index = 0; index < response.length; index++) {
        const element =response[index];
        images.push({images:element.image})
       }
      
       this.certificateImages=images;
      },
      error:(error)=>{
        console.log(error);
      },
      complete:()=>{
        this.apiSubscription?.unsubscribe();
      }
  })
  }
 
  navTo(){
    this.router.navigate(['manageServices']);
  }
  navToBack(){
    this.location.back();
  }
  navToVerification(){
    if (this.logInService.isAccountVerify) {
      this.router.navigate(['identityVerification'])
    } else {
      this.router.navigate(['aadharVerify'])
    }
   
  }

  navToCertificates(){
    this.router.navigate(['awards'])
  }
}
