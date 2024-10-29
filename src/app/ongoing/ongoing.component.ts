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
  
  buttons = ['Ongoing', 'Pending', 'Accepted','Completed', 'Cancelled'];
  activeButton = 'Ongoing';
  credits: any;
  text: String = this.activeButton;
  filterStatus: string = "InProgress"; // Default filter status to "InProgress" for ongoing orders
  order: any[] = []; // Assuming the order is an array of objects
  filteredOrder: any[] = []; // Filtered orders array

  constructor(
    private location: Location,
    private router: Router,
    private razorpayService: RazorpayService,
    private orderService: OrdersService
  ) {
   this.getCredits();
    this.getOrderDetails();
  }

  getCredits(){
    this.razorpayService.getCredits().subscribe({
      next:(response)=>{
        console.log(response);
        this.credits=response.credits;
    
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
  navBack() {
    this.location.back();
  }

  // Fetch order history details
  getOrderDetails() {
    this.orderService.orderHistory().subscribe({
      next: (response) => {
        console.log(response);
        this.order = response.data; // Assuming response is an array of order objects
        this.filterOrder(); // Call filterOrder after fetching the order history
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  // Set the active button and filter orders accordingly
  setActiveButton(button: string) {
    this.activeButton = button;
    this.text = button;
    this.assignOrder(); // Update filter criteria
  }

  // Assign the correct status to filter based on the button pressed
  assignOrder() {
    switch (this.activeButton) {
      case 'Ongoing':
        this.filterStatus = "InProgress"; // Change status to filter for ongoing orders
        break;
      case 'Pending':
        this.filterStatus = "Workstart"; // Change status to filter for pending orders
        break;
        case 'Accepted':
          this.filterStatus = "Accepted"; // Change status to filter for pending orders
          break;
      case 'Completed':
        this.filterStatus = "Completed"; // Change status to filter for completed orders
        break;
      case 'Cancelled':
        this.filterStatus = "Cancelled"; // Change status to filter for cancelled orders
        break;
    }
    this.filterOrder(); // Apply the filter based on status
  }

  // Filter the order array based on the status
  filterOrder() {
    console.log(this.order);
    this.filteredOrder = this.order.filter((i: any) => {
      return i.status && i.status.toLowerCase() === this.filterStatus.toLowerCase();
    });
    console.log(this.filteredOrder);
  }

  // Navigation function to different routes
  navTo(nav: string) {
    switch (nav) {
      case 'credit':
        this.router.navigate(['credits']);
        break;
      case 'notification':
        this.router.navigate(['notification']);
        break;
      case 'menu':
        this.router.navigate(['menu']);
        break;
    }
  }

  navToArrived(item:any) {
    if (this.activeButton==='Ongoing') {
      this.router.navigate(['completeWork',item._id]);
    }
    else if(this.activeButton==='Pending'){
      this.router.navigate(['arrived',item._id]);
    }
  
  }

  navToChat(userId:string){
    const role={
      role:'user',
      id:userId
    }
    this.router.navigate(['help/chatbot'], { queryParams: role });
  }
}