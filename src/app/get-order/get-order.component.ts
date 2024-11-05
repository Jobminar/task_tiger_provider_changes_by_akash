import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';
import { OrdersService } from '../orders.service';
import { GetOrdersService } from '../get-orders.service';
import { MapBoxService } from '../map-box.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterorderService } from '../afterorder.service';
import { GoogleMapService } from '../google-map.service';
import { catchError, of, retry, timeout } from 'rxjs';
import { Location } from '@angular/common';

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
  providerCurrentLocationPlace:string='';

  
  current: number = 0;
  max: number = 120;
  radius: number = 100;
  color: string = 'rgba(255, 0, 0, 1)';
  background: string = 'rgba(253, 5, 0, 0.4)';
  cancelRate:number=0;
  workingHours:number=0;
  credits:number=0;
// working on order
  userAddress:string='';
  userCoordinates:[number,number]=[0,0];
  orderIds:any[]=[]
  acceptStatus:any; 
  orderId:string='';
  extractedDetails:any[]=[];
  constructor(private readonly router:Router,
              private readonly jobDetailsService:JobDetailsService,
              private readonly orderService:OrdersService,
              private readonly mapboxService:MapBoxService,
              private readonly routerParam:ActivatedRoute,
              private readonly location:Location,
              private readonly afterOrderService:AfterorderService,
              private readonly googleMapService:GoogleMapService,
              private readonly getOrderService:GetOrdersService){
     this.workSeleceted=this.jobDetailsService.workDetails
  }

  ngOnInit() {
    this.getProvderLocation();
    this.startTimer();
    this.getOrderId()
    // this.getOrderDetails();
  }


  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.current=this.timeLeft
      } else {
        clearInterval(this.interval);
        this.getOrderService.clearOrderId();
        this.router.navigate(['home']);
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
    serviceName:any=[{
      name:'cleaning'
    },
    {
      name:'tank cleaning'
    },{
      name:'tankcleaning'
    }
  ]


  getCartId(data: any) {
    
    let orderId=this.order._id;
    const displayCategory = (index: number) => {
     
        let checkInterval = setInterval(() => {
          if (this.acceptStatus) {
            clearInterval(checkInterval);
            if (this.acceptStatus) {
              this.acceptStatus=false
              // User accepted, exit the loop
              this.acceptedOrder();
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

    /**
   * getting order id from url which is passing from notifications
   * 
   */
    getOrderId(){
      this.routerParam.paramMap.subscribe(
        {
          next:(res)=>{
            console.log(res);
            const orderId=res.get('id');
            this.getOrderDetails(orderId);
          },error:(err:HttpErrorResponse)=>{
            console.log(err);
          }
        }
      )
    }
  
    getOrderDetails(orderid:string | null){
      if(orderid){
        this.orderId=orderid;
        console.log(orderid);
        this.afterOrderService.getOrderFromOrderId(orderid).subscribe({
          next:(res)=>{
            console.log(res);
            this.order=res;
            this.getUserLocation();
          },
          error:(err:HttpErrorResponse)=>{
            console.log(err);
          }
        })
      }
    }
  accepted() {
    this.acceptStatus = true;
    this.acceptedOrder();
  }
  
  declined() {
    this.acceptStatus = false;
    console.log("declined");
    this.acceptStatus=false;
    this.timeLeft=120;
    this.getOrderService.clearOrderId();
    this.router.navigate(['home']);
  }

  acceptedOrder(){
    console.log("order accepted");
    this.orderService.accept(this.orderId,this.order.totalAmount,this.order.userId._id).subscribe(
      (response: any)=>{
        console.log(response);
        // this.orderService.orderIds=response.orderHistoryId
        setTimeout(()=>{
          this.router.navigate(['arrived',response.orderHistory.orderId]);
        },2000)
    
      },(err)=>{
        console.log(err);
      }
    )
  }
  // getting provider current location
  getProvderLocation(){
    this.googleMapService.getCoordinates().subscribe({
      next:(res)=>{
        console.log(res);
        this.providerCurrentLocation=res;
        const role='provider';
        this.getPlaceNameFromCorr(this.providerCurrentLocation,role)
      },error:(err)=>{
        console.log(err);
      }
    })
  }

  // getting user current location name
  getUserLocation(){
    console.log("cing user");
    const role ='user';
    const address= this.order.addressId
    console.log(this.order);
    const coordinated={
      lat:address.latitude,
      lng:address.longitude
    }
    this.getPlaceNameFromCorr(coordinated,role);
  }
 
getPlaceNameFromCorr(coordinates: {lat: number, lng: number}, role: string) {
  this.googleMapService.getPlaceNameFromCoordinates(coordinates.lat, coordinates.lng)
    .pipe(
      timeout(10000),  // Set a timeout for slow networks
      retry(2),        // Retry the API call in case of failure
      catchError((err) => {
        console.error('Failed to get place name:', err);
        return of({ results: [{ formatted_address: 'Unknown Location' }] }); // Fallback for both provider and user
      })
    )
    .subscribe({
      next: (res) => {
        const formattedAddress = res.results[0].formatted_address || 'Unknown Location';
        if (role === 'provider') {
          this.providerCurrentLocationPlace = formattedAddress;
          console.log('Provider location:', formattedAddress);
        } else if (role === 'user') {
          this.userAddress = formattedAddress;
          console.log('User location:', formattedAddress);
        }
      },
      error: (err) => {
        console.error('Error fetching place name:', err);
      }
    });
}
}
