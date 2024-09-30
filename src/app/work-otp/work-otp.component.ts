import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-work-otp',
  templateUrl: './work-otp.component.html',
  styleUrl: './work-otp.component.css'
})
export class WorkOtpComponent {
  @ViewChild('input1') input1!: ElementRef 
  @ViewChild('input2') input2!: ElementRef
  @ViewChild('input3') input3!: ElementRef 
  @ViewChild('input4') input4!: ElementRef 
  otp: FormGroup;

  navTOBack(){
    this.location.back()
  }
  constructor(private form: FormBuilder,
            private orderService:OrdersService,
              private router:Router,
            private location:Location)
  { 
    this.getOtp()
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
  getOtp(){
    // this.orderService.verifyOtp().subscribe(
    //   (response)=>{
    //     console.log(response);
    //   },
    //   (err)=>{
    //     console.log(err);
    //   }
    // )
  }
  verifyOtp() {
    const otpValue = this.otp.value;
    const otp=otpValue.inputOne+otpValue.inputTwo+otpValue.inputThree+otpValue.inputFour 
    // console.log("OTP:", this.otp.value);
    console.log(otp);
    this.orderService.verifyStartOrder(otp).subscribe(
      (response)=>{
        console.log(response);
        this.router.navigate(['completeWork']);
      },(err)=>{
        console.log(err);
      }
    )
    this.router.navigate(['completeWork']);
  }

 
  


}
