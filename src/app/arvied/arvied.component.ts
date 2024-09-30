import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MapBoxService } from '../map-box.service';
import { OrdersService } from '../orders.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-arvied',
  templateUrl: './arvied.component.html',
  styleUrl: './arvied.component.css'
})
export class ArviedComponent implements OnInit{
 toggleChecked:boolean=false
  userFullAddress:any;


  navTOBack(){
    this.location.back()
  }
 constructor(private router:Router,
            private mapboxService:MapBoxService,
            private orderService:OrdersService,
            private location:Location
 ){

 }

 ngOnInit(): void {
 this.intalizeMap()
 }

 async intalizeMap(){
  const userCoordinates:[number,number]=this.mapboxService.userCordinates;
  console.log(userCoordinates);
  
  this.mapboxService.initializeMap()
  console.log(this.mapboxService.mapStatus);
  // Once initialization is complete, add the destination marker
  this.userFullAddress=this.orderService.userFullAddress;
  await this.mapboxService.addDestinationMarker(userCoordinates);
  
 }

  toggleDisplay(event:any){
    this.toggleChecked=!this.toggleChecked
    console.log(this.toggleChecked);
    this.router.navigate(['startWork'])
  }

  cancel(){
    this.orderService.cancelOrder().subscribe(
      (response)=>{
        console.log(response);
        this.router.navigate(['home']);
      },(err)=>{
        console.log(err);
      }
    )
  }
}
