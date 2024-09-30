import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrdersService } from '../orders.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  navTOBack(){
    this.location.back()
  }
  constructor(private form: FormBuilder,
            private orderService:OrdersService,
              private router:Router,private location:Location)
  { 
               
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

  login() {
    const otpValue = this.otp.value;
    const otp=otpValue.inputOne+otpValue.inputTwo+otpValue.inputThree+otpValue.inputFour 
    // console.log("OTP:", this.otp.value);
    console.log(otp);
    this.orderService.verifyAfterComplete(otp).subscribe(
      (response)=>{
        console.log(response);
        this.router.navigate(['home']);
      },(err)=>{
        console.log(err);
      }
    )
    
  }

 
  



}
