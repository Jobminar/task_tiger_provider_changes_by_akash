import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';
import { OrdersService } from '../orders.service';
import { GetOrdersService } from '../get-orders.service';
import { MapBoxService } from '../map-box.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterorderService } from '../afterorder.service';
import { GoogleMapService } from '../google-map.service';
import { catchError, of, retry, timeout } from 'rxjs';
import { Location } from '@angular/common';
import { azureApi } from '../../constents/apis';

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
              private http:HttpClient,
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
            this.getAvailability()
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
        // this.orderService.orderIds=response.orderHistoryId;
        this.upadtingStartAndJobEndTime();
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

  /**
   * getting provider availability to upadate the job start time and end time to prevent the provider next job time
   * getting the date and time then matching it with the schedule time and date from the order then if
   * the schedule date and time lie in between the time of provider availbility then get id of the availbiity record 
   * for calling the api
   * 
   */

  availabilityResponse:any[]=[];
  availabilityId:string='';
  getAvailability(){
    const providerId=localStorage.getItem('providerId');
    const api=`${azureApi}providers/provider-date/${providerId}`
    this.http.get<any>(api).subscribe(
      response => {
        console.log(response);
        this.availabilityResponse = response;
        this.availabilityId=this.getIdOfAvaibility();
        
      },
      error => {
        console.log(error);
      }
    );
  };

  
  getIdOfAvaibility():any{
    const inputDate= this.order.items[0].scheduledDate.split(' ')[0];
    const inputTime = this.order.items[0].scheduledDate.split(' ')[1];
     // Check if the slot is available for the input date and time
    console.log(inputDate,inputTime,'date and time from order id');
    const inputDateFormatted = this.formatDate(inputDate); // Format the input date

    const matchedSlot = this.availabilityResponse.filter(slot => {
      // Format dates for comparison (only compare YYYY-MM-DD)
      const slotDate = new Date(slot.slotTime.date).toISOString().split('T')[0];

      console.log(slotDate,inputDateFormatted,"slotdate and inputdate");
      // If dates do not match, skip this slot
      if (slotDate !== inputDateFormatted) return false;

      // Extract start and end times and convert to 24-hour format
      const [startTime, endTime] = slot.slotTime.time.split('-');
      const [inputHour, inputPeriod] = inputTime.match(/(\d+)(AM|PM)/)?.slice(1) || [];

      // Invalid input time format
      if (!inputHour || !inputPeriod) return false;

      // Convert times to 24-hour format
      const startHour = this.convertTo24HourFormat(startTime.slice(0, 2), startTime.slice(2));
      const endHour = this.convertTo24HourFormat(endTime.slice(0, 2), endTime.slice(2));
      const inputHour24 = this.convertTo24HourFormat(inputHour, inputPeriod);

      // Check if input time falls within the slot time range and availability is true
      return inputHour24 >= startHour && inputHour24 < endHour && slot.availability;
    })[0]; // Get the first matched slot (if any)

    // Return the _id of the matched slot, or null if no match is found
    console.log(matchedSlot);
    return matchedSlot ? matchedSlot._id : null;
  }
  
  formatDate(inputDate: string): string {
    const dateParts = inputDate.split('-');
    
    // If the input date is in dd-mm-yyyy format
    if (dateParts[0].length === 2) {
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Convert to yyyy-mm-dd format
    }
    
    // If the input date is already in yyyy-mm-dd format
    return inputDate; 
  }
  convertTo24HourFormat(hour: string, period: string): number {
    let hour24 = parseInt(hour);
    if (period === 'PM' && hour24 < 12) hour24 += 12; // Convert PM to 24-hour format
    if (period === 'AM' && hour24 === 12) hour24 = 0; // Convert 12AM to 00
    return hour24;
  }

  upadtingStartAndJobEndTime(){
    const api=`${azureApi}providers/provider-date/${this.availabilityId}`
    const date =this.order.items[0].scheduledDate.split(' ')[0];
    const time=this.order.items[0].scheduledDate.split(' ')[1];
    const addedExtraTime=this.add30Minutes(time);
    const requestBody={
      jobStartTime:this.order.items[0].scheduledDate,
      jobEndTime:`${date} ${addedExtraTime}`
    }
    console.log(requestBody);
    this.http.patch(api,requestBody).subscribe({
      next:(res)=>{
        console.log("updated the start and end time",res);
      },error:(err:HttpErrorResponse)=>{
        console.log(err);
      }
    })
  }
 
  add30Minutes(inputTime: string): string {
   
    const [hour, period] = inputTime.match(/(\d+)(AM|PM)/)?.slice(1) || [];
    if (!hour || !period) return inputTime;
  
    // Convert the input time to 24-hour format
    let hour24 = this.convertTo24HourFormat(hour, period);
 
    // Add 30 minutes
    let minutes = 30+this.order.items[0].serviceId.serviceTime;
    let totalMinutes = (hour24 * 60) + minutes; // Calculate total minutes
  
    // Convert back to hours and minutes
    let newHour24 = Math.floor(totalMinutes / 60) % 24; // Get new hour (24-hour format)
    let newMinutes = totalMinutes % 60; // Get remaining minutes
  
    // Convert back to 12-hour format
    const newPeriod = newHour24 >= 12 ? 'PM' : 'AM';
    const newHour = newHour24 % 12 || 12; // Convert 0 to 12 (for 12:00 AM)
   
    // Format the new time with minutes
    return `${newHour}:${newMinutes.toString().padStart(2, '0')}${newPeriod}`;
  }
  
}
