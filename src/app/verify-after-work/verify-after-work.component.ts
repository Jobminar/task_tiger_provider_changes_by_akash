import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrdersService } from '../orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-after-work',
  templateUrl: './verify-after-work.component.html',
  styleUrl: './verify-after-work.component.css'
})
export class VerifyAfterWorkComponent {
  @ViewChild('input1') input1!: ElementRef 
  @ViewChild('input2') input2!: ElementRef
  @ViewChild('input3') input3!: ElementRef 
  @ViewChild('input4') input4!: ElementRef 
  otp: FormGroup;
  orderHistoryId:string | null='';
  order:any;
  navTOBack(){
    this.location.back()
  }
  constructor(private form: FormBuilder,
            private orderService:OrdersService,
              private router:Router,
              private readonly afterOrderService:AfterorderService,
              private readonly routerParam:ActivatedRoute,
              private location:Location)
  { 
       this.getOrderId();        
    this.otp = this.form.group({
      inputOne: '',
      inputTwo: '',
      inputThree: '',
      inputFour: ''
    });
  }

  onInput(event: any, position: number) {
    const inputValue = event.target.value;
    if (inputValue.length === 1) {
      switch (position) {
        case 1:
          this.input2.nativeElement.focus();
          break;
        case 2:
          this.input3.nativeElement.focus();
          break;
        case 3:
          this.input4.nativeElement.focus();
          break;
        case 4:
          // Focus on next input or do something else when the last input is filled
          break;
        default:
          break;
      }
    }
  }

  getOrderId() {
    this.routerParam.paramMap.subscribe({
      next: (res) => {
        const id = res.get('id');
        if (id) {
          this.orderHistoryId = id;
         this.getOrderDetails(id);
        }
      },
    });
  }

  getOrderDetails(orderId: string | null) {
    if (orderId) {
      this.orderHistoryId = orderId;
      this.afterOrderService.getOrderDetails(orderId).subscribe({
        next: (res) => {
          this.order = res;
          // this.orderId = res.orderId?._id;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        }
      });
    }
  }
  login() {
    const otpValue = this.otp.value;
    const otp=otpValue.inputOne+otpValue.inputTwo+otpValue.inputThree+otpValue.inputFour 
    // console.log("OTP:", this.otp.value);
    console.log(otp);
    this.orderService.verifyAfterComplete(otp,this.orderHistoryId).subscribe(
      (response)=>{
        console.log(response);
        const role={
          userId:this.order.userId,
          orderHistoryId:this.orderHistoryId
        }
        this.router.navigate(['feedback'],{queryParams:role});
      },(err)=>{
        console.log(err);
      }
    )
    
  }

 
  



}
