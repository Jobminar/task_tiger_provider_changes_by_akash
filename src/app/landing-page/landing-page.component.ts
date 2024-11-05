import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GetOrdersService } from '../get-orders.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
    constructor(private router:Router,
                private getOrderService:GetOrdersService
    ){
      if (this.getOrderService.getOrderId()) {
        this.router.navigate(['getOrder',this.getOrderService.getOrderId])
      } else {
        setTimeout(()=>{
          this.router.navigate(['started'])
        },4000)
      }
     
    }
}
