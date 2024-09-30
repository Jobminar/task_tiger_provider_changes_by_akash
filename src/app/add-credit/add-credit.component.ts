import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RazorpayService } from '../razorpay.service';

@Component({
  selector: 'app-add-credit',
  templateUrl: './add-credit.component.html',
  styleUrl: './add-credit.component.css'
})
export class AddCreditComponent {
  // navToBack(){
  //   this.location.back();
  // }
  // constructor(private location:Location,
  //             private http:HttpClient,
  //             private razorPayService:RazorpayService
  // ){

  // }
  // credits:number[]=[20,50,100,250];
  // selectedValue:number=0;
  // AmountToPay:number=0;
  // selected(item:number){
   
  //   this.selectedValue=item
  //   console.log(this.selectedValue);
  //   this.AmountToPay=this.selectedValue
  // }

  // payOnline: boolean = false;
  // deductNextPayout: boolean = false;

  // togglePayOnline(event:any) {
  //   console.log(event);
  //   this.payOnline = !this.payOnline;
  //   if (this.payOnline) {
  //     this.deductNextPayout = false;
  //   }
  //   this.makePayment();
  //   console.log(this.payOnline);
  // }

  // toggleDeductNextPayout() {
  //   this.deductNextPayout = !this.deductNextPayout;
  //   if (this.deductNextPayout) {
  //     this.payOnline = false;
  //   }
  // }

  // makePayment() {
  //   const amount = 100; // amount in rupees
  //   const currency = 'INR';
  //   const oredr="qwertyui"
  //   this.razorPayService.payWithRazorpay(amount, oredr, currency);
  //   // this.http.post<any>('http://localhost:3000/createOrder', { amount, currency })
  //   //   .subscribe(order => {
  //   //     this.razorPayService.payWithRazorpay(amount, order.id, currency);
  //   //   }, error => {
  //   //     console.error(error);
  //   //   });
  // }
  


  navToBack(){
    this.location.back();
  }
  constructor(private location: Location,
              private http: HttpClient,
              private razorPayService: RazorpayService) {}

  credits: number[] = [20, 50, 100, 250];
  selectedValue: number = 0;
  AmountToPay: number = 0;
  entredAmount(){
    this.AmountToPay=this.selectedValue
  }
  selected(item: number) {
    this.selectedValue = item;
    this.AmountToPay = this.selectedValue;
  }

  payOnline: boolean = false;
  deductNextPayout: boolean = false;

  togglePayOnline(event: any) {
    this.payOnline = !this.payOnline;
    if (this.payOnline) {
      this.deductNextPayout = false;
      this.makePayment();
    }
  }

  toggleDeductNextPayout() {
    this.deductNextPayout = !this.deductNextPayout;
    if (this.deductNextPayout) {
      this.payOnline = false;
    }
  }

  makePayment() {
    const amount = this.AmountToPay;
    const currency = 'INR';
    const orderId = 'order_id_from_backend'; // Example order ID from backend
    this.razorPayService.payWithRazorpay(amount, orderId, currency);
  }

  
}
