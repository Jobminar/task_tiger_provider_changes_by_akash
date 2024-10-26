import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { azureApi } from '../constents/apis';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
// import Razorpay from 'razorpay';
declare var Razorpay: any;
@Injectable({
  providedIn: 'root'
})
export class RazorpayService {


  private apiUrl=azureApi;
  userId=localStorage.getItem('providerId');
  userCredit:number=0;
  constructor(private http:HttpClient,private readonly location:Location) { }

  payWithRazorpay(amount: number, orderId: string, currency: string) {
    const options = {
      key: 'rzp_test_b8XfUOQ4u8dlSq', // Replace with your Razorpay key
      amount: amount* 100, // amount in paise
      currency: currency,
      name: 'Coolie no.1', // your business name
      description: 'Test Transaction',
      image: 'assets/location/logo-v3 3.png',
      // order_id: "12121212", // This will be created from backend
      
      handler: (response: any) => {
        // handle payment success
        console.log(response);
        this.addingCredit(amount)
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Razorpay Corporate Office'
      },
      theme: {
        color: '#3399cc'
      },
      modal: {
        ondismiss: function() {
          console.log('Checkout form closed');
        },
        escape: false,
        backdropclose: false,
        handleback: true // Ensure full screen on mobile devices
      }
    };

    const rzp1 = new Razorpay(options);
    rzp1.open();
  }

  createOrder(totalPrice: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      amount: totalPrice,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };
    const api=`${this.apiUrl}core/razor-pay/create-order`
    return this.http.post(api, body, { headers });
  }

 
  addingCredit(amount:any){
    const api= this.apiUrl+'providers/provider-credits/recharge'
    const requestBody={
      providerId:this.userId,
      amount:amount
      
    }
    return this.http.post(api,requestBody).subscribe(
      (response)=>{
        console.log(response);
        
        this.getNow()
      },(err)=>{
        console.log(err);
      }
    )
  }

  getCredits(){
    const api= this.apiUrl+`providers/provider-credits/${this.userId}`
    return this.http.get<any>(api)
  }

  getNow(){
    this.getCredits().subscribe(
      (res)=>{
        console.log(res);
        this.userCredit=res.credits;
        this.location.back();
      },(err)=>{
        console.log(err);
      }
    )
  }

  getCreditHistory(){
    const api= this.apiUrl+`providers/provider-credits/${this.userId}`
    return this.http.get<any>
  }


  setDefault(){
    this.userId='';
    this.userCredit=0;
  }
}
