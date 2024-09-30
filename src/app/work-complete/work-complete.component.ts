import { Component } from '@angular/core';
import { OrdersService } from '../orders.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-work-complete',
  templateUrl: './work-complete.component.html',
  styleUrl: './work-complete.component.css',
})
export class WorkCompleteComponent {
  total: number = 0;
  navTOBack(){
    this.location.back()
  }
  constructor(private orderService: OrdersService,
              private router:Router,private location:Location
  ) {
    // console.log( this.orderService.oredrDetails);
    // const order:any = this.orderService.oredrDetails;
    // console.log(order);
    // this.work=order.order?.items;
    // console.log(order.order.items);
    // this.work.forEach((i: any) => {
    //   this.total = this.total + i.price;
    // });
    this.getWorkDetails();
  }
  work: any = [];
  alreadyHasAccount = '';

  getWorkDetails(){
    const order:any = this.orderService.oredrDetails;
   
    console.log(order);
    for (let index = 0; index < order.items.length; index++) {
      const element = order.items[index];
      this.work.push(element)
    }
   
    console.log(order.items);
    this.work.forEach((i: any) => {
      this.total = this.total + i.serviceId.serviceVariants[0].price;
    });
  }
  toggleDisplay() {
    this.orderService.completeOrder().subscribe(
      (response)=>{
        console.log(response);
        this.router.navigate(['verifyAfterWork'])
      },(err)=>{
        console.log(err);
      }
    )
  }
}
