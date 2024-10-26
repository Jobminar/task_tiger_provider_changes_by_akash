import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapBoxService } from '../map-box.service';
import { OrdersService } from '../orders.service';
import { Location } from '@angular/common';
import { GoogleMapService } from '../google-map.service';
import { DailogeBoxService } from '../dailoge-box.service';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-arvied',
  templateUrl: './arvied.component.html',
  styleUrl: './arvied.component.css'
})
export class ArviedComponent implements OnInit{
  toggleChecked: boolean = false;
  userFullAddress: any;
  userCoordinates: any; // Will hold the user's fixed location
  providerCoordinates: any; // Will hold the provider's live location
  distanceThreshold: number = 200; // 200 meters distance threshold for arrival
  orderHistoryId:string | null='';
  order:any;
  
  @ViewChild('map', { static: true }) mapElement!: ElementRef;
  private locationTrackingSubscription?: Subscription;
  constructor(
    private readonly router: Router,
    private readonly routerParam:ActivatedRoute,
    private readonly mapboxService: MapBoxService,
    private readonly orderService: OrdersService,
    private readonly location: Location,
    private readonly googleMapsService: GoogleMapService,
    private readonly dailogeBoxService:DailogeBoxService,
    private readonly afterOrderService:AfterorderService
  ) {}

  ngOnInit(): void {
    this.userFullAddress = this.orderService.userFullAddress;
    // this.userCoordinates = this.orderService.getUserCoordinates(); // Get the user's fixed location
    // this.userCoordinates={lat: 17.4831, lng: 78.3176};
  this.getOrderId();

  }

  // retrieve the orderId details from the url which we are passing from after accepting order;

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
          this.getUserLocation();
        },
        error:(err:HttpErrorResponse)=>{
          console.log(err);
        }
      })
    }
  }
    // getting user current location name
    getUserLocation(){
      console.log("cing user");
      const role ='user';
      const address= this.order?.addressId
      console.log(this.order);
      const coordinated={
        lat:address?.latitude,
        lng:address?.longitude
      }
      this.userCoordinates=coordinated;
      this.initializeMap();
    }

 initializeMap(): void {
    this.googleMapsService.getCoordinates().subscribe({
      next: (providerCoords) => {
        if (!providerCoords) {
          console.error('Provider coordinates are null');
          return;
        }

        this.providerCoordinates = providerCoords;

        if (!this.userCoordinates) {
          console.error('User coordinates are null');
          return;
        }

        // Initialize map and add markers
        this.googleMapsService.initializeMap(this.providerCoordinates, this.mapElement.nativeElement);
        this.googleMapsService.addProviderMarker(this.providerCoordinates);
        this.googleMapsService.addUserMarker(this.userCoordinates);

        // Display directions between provider and user
        this.googleMapsService.showDirections(this.userCoordinates, this.providerCoordinates);

        // Start tracking provider's movement and check arrival
        this.trackProviderAndCheckArrival();
        this.getUserFullAddress();
      },
      error: (err) => {
        console.error('Error fetching provider coordinates:', err);
      }
    });
  }

  getUserFullAddress(){
    const lat: number=this.userCoordinates.lat;
    const lng: number= this.userCoordinates.lng
    this.googleMapsService.getPlaceNameFromCoordinates(lat,lng).subscribe({
      next:(res)=>{
        console.log("user full address",res);
        console.log(res.results[0].formatted_address);
        this.userFullAddress=res.results[0].formatted_address;
      }
    })
  }

  // Track provider's location and check if within 200 meters of user
  trackProviderAndCheckArrival(): void {
    this.locationTrackingSubscription=this.googleMapsService.trackProviderLocation().subscribe((currentLocation) => {
      this.providerCoordinates = currentLocation;
      this.googleMapsService.updateProviderMarker(this.providerCoordinates);

      const distance = this.googleMapsService.calculateDistance(
        this.userCoordinates.lat,
        this.userCoordinates.lng,
        this.providerCoordinates.lat,
        this.providerCoordinates.lng
      );

      console.log('Distance between user and provider:', distance);

      // Update directions when provider's location changes
      this.googleMapsService.showDirections(this.userCoordinates, this.providerCoordinates);

      if (distance <= this.distanceThreshold) {
        this.toggleChecked = true; // Arrival button enabled
      }
    });
  }

  // Navigate back
  navTOBack() {
    this.location.back();
  }

  // Toggle action when provider marks arrival
  toggleDisplay(event: any) {

    if (this.toggleChecked) {
      console.log('Arrived at user location');
      this.router.navigate(['startWork',this.orderHistoryId]);
    }
    console.log('Arrived at user location');
    this.router.navigate(['startWork',this.orderHistoryId]);
  }
  handleDisabledClick() {
    console.log("insideeeeeeee");
    if (!this.toggleChecked) {
      this.dailogeBoxService.openDialog('You are not arrives at location.');
    }
  }
  // Cancel order
  cancel() {
    this.orderService.cancelOrder().subscribe(
      (response) => {
        console.log(response);
        this.router.navigate(['home']);
      },
      (err) => {
        console.log(err);
      }
    );
  }



  ngOnDestroy(): void {
    if (this.locationTrackingSubscription) {
      this.locationTrackingSubscription.unsubscribe();
      console.log('Stopped tracking provider’s location.');
    }
  }
}