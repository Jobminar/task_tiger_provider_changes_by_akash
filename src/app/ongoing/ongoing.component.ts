import { Location } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FotterComponent } from '../fotter/fotter.component';
import { RazorpayService } from '../razorpay.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.component.html',
  styleUrl: './ongoing.component.css'
})
export class OngoingComponent {
  @ViewChild('footer') footer!: FotterComponent;
  buttons = ['Ongoing', 'Pending', 'Completed', 'Cancelled'];
  activeButton = 'Ongoing';
  credits:any;
  text:String=this.activeButton;
  filterStatus:string="Accepted";
  order:any;
  navBack(){
    this.location.back();
  }
 
  constructor(private location:Location,
              private router:Router,
              private razorpayService:RazorpayService,
            private orderService:OrdersService)
  {
    this.credits=this.razorpayService.userCredit;
    this.getOrderDetails();
  }

  
  getOrderDetails(){
    this.orderService.orderHistory().subscribe(
      {
        next:(response)=>{
          console.log(response);
          this.order=response;
          this.filterOrder();
        },
        error:(err)=>{
          console.log(err);
        }
      }
    )
  }
  setActiveButton(button: string) {
    this.activeButton = button;
    this.text=button;
    this.assignOrder();
  }

  assignOrder(){
    switch(this.activeButton){
      case 'Ongoing':this.filterStatus="Accepted";
      break;
      case 'Pending':this.filterStatus="InProgress";
      break;
      case 'Completed':this.filterStatus="Completed";
      break;
      case 'Cancelled' : this.filterStatus="Cancelled";
      break
    }

    this.filterOrder()
    
  }
  filteredOrder:any;
  filterOrder(){
    const filterOrder=this.order.filter((i: any)=>{
      return i.status.toLowerCase().includes(this.filterStatus.toLowerCase());i.status.toLowerCase().includes(this.filterStatus.toLowerCase())
    })

    console.log(filterOrder);
    this.filteredOrder=filterOrder;
  }
  navTo(nav:string){
    switch(nav){
      case 'credit': this.router.navigate(['credits']);
      break;
      case 'notification':this.router.navigate(['notification']);
      break;
      case 'menu': this.router.navigate(['menu'])
    }
  }

  navToArrived(){
    this.router.navigate(['arrived'])
  }
}
