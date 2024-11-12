import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-financial-details',
  templateUrl: './financial-details.component.html',
  styleUrl: './financial-details.component.css'
})
export class FinancialDetailsComponent {
  bankDetails:any=[];
  navToBack(){
    this.location.back()
  }
  constructor(private location:Location,
              private userDetails:UserDetailsService
  ){
    this.getUserDetails();
    this.bankDetails();
  }

  getUserDetails()
  {
    this.userDetails.getFinancialDetails().subscribe(
      (response)=>{
        console.log(response);
        this.bankDetails=response
      },(error)=>{
        console.log(error);
      }
    )
  }


}
