import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';
import { OrdersService } from '../orders.service';
import { GetOrdersService } from '../get-orders.service';
import { MapBoxService } from '../map-box.service';

@Component({
  selector: 'app-get-order',
  templateUrl: './get-order.component.html',
  styleUrl: './get-order.component.css'
})
export class GetOrderComponent implements OnInit,OnDestroy{
  timeLeft: number = 120; // 2 minutes in seconds
  interval: any;
  order:any;
  
  providerCurrentLocation:any;
  workSeleceted:any
  extractedDetails:any[]=[]
  parsedOrder: any;
  constructor(private router:Router,
              private jobDetailsService:JobDetailsService,
              private orderService:OrdersService,
              private mapboxService:MapBoxService,
              private getOrderService:GetOrdersService){

    // console.log(this.jobDetailsService.workDetails);
    
     this.workSeleceted=this.jobDetailsService.workDetails
      // this.getOrder()
    // this.router.navigate(['getOrder'])
  }
  ngOnInit() {
    this.startTimer();
    this.providerCurrentLocation=this.mapboxService.placeName
    this.order=this.getOrderService.order
    
    this.details()
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.current=this.timeLeft
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  get minutes(): number {
    return Math.floor(this.timeLeft / 60);
  }

  get seconds(): number {
    return this.timeLeft % 60;
  }

  current: number = 0;
  max: number = 120;
  radius: number = 100;
  color: string = 'rgba(255, 0, 0, 1)';
  background: string = 'rgba(253, 5, 0, 0.4)';
  cancelRate:number=0;
  workingHours:number=0;
  credits:number=0;


    serviceName:any=[{
      name:'cleaning'
    },
    {
      name:'tank cleaning'
    },{
      name:'tankcleaning'
    }
  ]


// working on order
userAddress:any;
userCoordinates:[number,number]=[0,0]

details(): void {
  this.order=JSON.parse(this.order.order);
  this.orderService.oredrDetails=this.order
  this.parsedOrder = this.order
  this.getCartId(this.order)
  // Extract required fields and push into the new array
  this.extractedDetails.push({
    fullAddress: `${this.parsedOrder.addressId.city}, ${this.parsedOrder.addressId.state}, ${this.parsedOrder.addressId.pincode}`,
    latitude: this.parsedOrder.addressId.latitude,
    longitude: this.parsedOrder.addressId.longitude,
    categoryName: this.parsedOrder.items[0].categoryId.name,
    subCategoryName: this.parsedOrder.items[0].subCategoryId.name,
    quantity: this.parsedOrder.items[0].quantity,
    scheduledDate: this.parsedOrder.items[0].scheduledDate,
    price: this.parsedOrder.items[0].serviceId.serviceVariants[0].price
  });

  console.log(this.extractedDetails);
  this.userCoordinates=[this.extractedDetails[0].longitude,this.extractedDetails[0].latitude]
  this.orderService.userFullAddress=this.extractedDetails[0].fullAddress;
  this.mapboxService.userCordinates=this.userCoordinates;

}

  orderIds:any[]=[]
 

 
  acceptStatus:any;

  
  getCartId(data: any) {
    
    let orderId=this.order._id;
    
    const displayCategory = (index: number) => {
     
        let checkInterval = setInterval(() => {
          if (this.acceptStatus) {
            clearInterval(checkInterval);
            if (this.acceptStatus) {
              this.acceptStatus=false
              // User accepted, exit the loop
              this.acceptedOrder(orderId)
              console.log("User accepted, exiting the loop");
               // Reset acceptStatus
              return;
            } else {
              // User declined, proceed to the next index
              console.log("User declined, moving to the next item");
              this.acceptStatus = false; // Reset acceptStatus
              displayCategory(index + 1);
            }
          }
        }, 1000);
  
        // Automatically move to the next item after 5 seconds if no action is taken
        setTimeout(() => {
          if (this.acceptStatus === null) {
            clearInterval(checkInterval);
            console.log("Automatically moving to the next item");
            displayCategory(index + 1);
          }
        }, 120000);
      
    };
  
    // Start the display chain
    displayCategory(0);
  }
  


  accepted() {
    this.acceptStatus = true;
   
  }
  
  declined() {
    this.acceptStatus = false;
    console.log("declined");
    this.acceptStatus=false
    this.timeLeft=120
    this.router.navigate(['home']);
  }

  acceptedOrder(element:any){
    console.log(element);
    this.orderService.accept(element).subscribe(
      (response: any)=>{
        console.log(response);
        this.orderService.orderIds=response.orderHistoryId
        
        this.router.navigate(['arrived']);
      },(err)=>{
        console.log(err);
      }
    )
  }
}
