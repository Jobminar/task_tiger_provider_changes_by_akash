import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RazorpayService } from '../razorpay.service';

@Component({
  selector: 'app-credit',
  templateUrl: './credit.component.html',
  styleUrl: './credit.component.css'
})
export class CreditComponent {
  buttons = ['All', 'Recharge', 'Expenses', 'Penalties'];
  activeButton = 'All';
  credits:any;
  history:any[]=[];
  filteredCreditHistory:any[]=[];
  navBack(){
    this.location.back();
  }
  navToAddCredit(){
    this.router.navigate(['addCredit']);
  }
  constructor(private location:Location,
              private router:Router,
              private razorpayServie:RazorpayService)
  {
    this.credits=this.razorpayServie.userCredit;
    console.log(this.razorpayServie.userCredit);
    this.getCredit();
  }
  setActiveButton(button: string) {
    this.activeButton = button;
    this.filter(this.activeButton)
  }

  getCredit(){
    this.razorpayServie.getCredits().subscribe({
      next:(response)=>{
        console.log(response);
        this.credits=response.creditBalance;
        this.history=response.transactions;
        this.filteredCreditHistory=this.history;
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  filter(button:any){
      const creditHistory=this.history
      let filterCredit:any;
      if (button!='All') {
        filterCredit= creditHistory.filter((i:any)=>{
          return i.type.toLowerCase().includes(button.toLowerCase())
         })

         this.filteredCreditHistory=filterCredit
      }
      else{
        this.filteredCreditHistory=creditHistory;
      }
    console.log(this.filteredCreditHistory);
  }
}
