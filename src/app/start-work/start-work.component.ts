import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { MapBoxService } from '../map-box.service';
import { Location } from '@angular/common';
import { GoogleMapService } from '../google-map.service';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-start-work',
  templateUrl: './start-work.component.html',
  styleUrl: './start-work.component.css'
})
export class StartWorkComponent implements AfterViewInit {
  userFullAddress: any;
  toggleChecked: boolean = false;
  orderHistoryId:string |null='';
  order:any;
  @ViewChild('map') mapElement!: ElementRef; // Bind the map container
 private locationTrackingSubscription!:Subscription
  userCoordinates :any; // Default user location
  providerCoordinates: any;

  constructor(
    private router: Router,
    private readonly routerParam:ActivatedRoute,
    private orderService: OrdersService,
    private googleMapsService: GoogleMapService,
    private location: Location,
    private readonly afterOrderService:AfterorderService
  ) {}

  ngAfterViewInit() {
    // this.userCoordinates={lat: 17.4831, lng: 78.3176};
    // Call map initialization after view is ready
    this.getOrderId();
   
  }

  getOrderId(){
    this.routerParam.paramMap.subscribe({
      next:(res)=>{
        const id=res.get('id')
        if (id) {
          this.orderHistoryId=res.get('id');
          this.getOrderDetails(this.orderHistoryId);
        }
        
      }
    })
  }
  
    getOrderDetails(orderid:string | null){
      if(orderid){
        this.orderHistoryId=orderid;
        this.afterOrderService.getOrderDetails(orderid).subscribe({
          next:(res)=>{
            console.log(res);
            this.order=res;
            this.getUserLocationCoordinates();
          },
          error:(err:HttpErrorResponse)=>{
            console.log(err);
          }
        })
      }
    }

  async initializeMap(userCoordinates:any) {
    const userLocation = userCoordinates
    this. getUserFullAddress(userLocation);
   this.locationTrackingSubscription= this.googleMapsService.getCoordinates().subscribe((providerLocation) => {
      if (!providerLocation) {
        console.error('Provider coordinates are null');
        return;
      }

      // Initialize Google Map
      this.googleMapsService.initializeMap(providerLocation, this.mapElement.nativeElement);

      // Add markers
      this.googleMapsService.addProviderMarker(providerLocation);
     
      this.googleMapsService.addUserMarker(userLocation);

      // Optionally show directions
      this.googleMapsService.showDirections(providerLocation, userLocation);
 
    });
  }
  // getUserLocation(){
  //   console.log("cing user");
  //   const role ='user';
  //   const address= this.order.addressId
  //   console.log(this.order);
  //   const coordinated={
  //     lat:address.latitude,
  //     lng:address.longitude
  //   }
  //   this.userCoordinates=coordinated;
   
  // }
  async getUserLocationCoordinates(): Promise<google.maps.LatLngLiteral> {
    console.log("inside user location");
    const response = this.order?.addressId
    if (response) {
      const coordinated={
        lat:response.latitude,
        lng:response.longitude
      }
      console.log("user coordinates",coordinated);
      this.initializeMap(coordinated);
      return coordinated;
    }
    else{
      const coordinated={
        lat:0,
        lng:0
      } 
      this.initializeMap(coordinated);
      return coordinated;
    } 

   
  }

// getting user full address from google service getplacenamefromcoordinates method by passing the user cordinates getting from the orderdetails
  getUserFullAddress(userLocation:any){
    const lat: number=userLocation.lat;
    const lng: number=userLocation.lng
    this.googleMapsService.getPlaceNameFromCoordinates(lat,lng).subscribe({
      next:(res)=>{
        console.log("user full address",res);
        console.log(res.results[0].formatted_address);
        this.userFullAddress=res.results[0].formatted_address;
      }
    })
  }
  // Method to navigate back
  navTOBack() {
    this.location.back();
  }

  toggleDisplay(event: any) {
    this.toggleChecked = !this.toggleChecked;
    this.router.navigate(['work/otp', this.orderHistoryId]);
  }

  navToChat() {
    const role = {
      role:'user',
      id:this.order.userId
    }
    this.router.navigate(['help/chatbot'],{queryParams:role});
  }

  ngOnDestroy(): void {
    if (this.locationTrackingSubscription) {
      this.locationTrackingSubscription.unsubscribe();
      console.log('Stopped tracking provider’s location.');
    }
  }
}