import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {

  constructor(private router:Router){
    // this.router.navigate(['getOrder'])
  }
  //   workSeleceted:any
  // constructor(private router:Router,
  //             private jobDetailsService:JobDetailsService,
  //           private orderService:OrdersService){

  //   console.log(this.jobDetailsService.workDetails);
    
  //    this.workSeleceted=this.jobDetailsService.workDetails
  //     this.getOrder()
  //   // this.router.navigate(['getOrder'])
  // }

  // orderIds:any[]=[]
  // getOrder(){
  //   console.log("inside");
  //   let workingId:any[]=[]
  //   this.workSeleceted.forEach((i: any)=>{
  //     workingId.push(i.id);
  //   })
  //   console.log(workingId);
  //   this.orderService.getOrder(workingId).subscribe(
  //     (response)=>{
  //       console.log(response);
  //       this.getCartId(response.data)
  //     },(error)=>{
  //       console.log(error);
  //     }
  //   )
  // }
  // getCartId(data:any){
  //   data.forEach((i:any)=>{
  //     this.orderIds.push(i.cartId._id)
  //   })

  //   this.getOrderDetails(this.orderIds)
  // }
  // getOrderDetails(orderId:any){
  //  for (let index = 0; index < orderId.length; index++) {
  //   const element = orderId[index];
  //   if (index===0) {
      
  //   } else {
      
  //   }
    
  //  }
  // }
}
