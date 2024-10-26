import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../orders.service';
import { Location } from '@angular/common';
import { AfterorderService } from '../afterorder.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-work-otp',
  templateUrl: './work-otp.component.html',
  styleUrl: './work-otp.component.css'
})
export class WorkOtpComponent implements OnInit{
  @ViewChild('input1') input1!: ElementRef 
  @ViewChild('input2') input2!: ElementRef
  @ViewChild('input3') input3!: ElementRef 
  @ViewChild('input4') input4!: ElementRef 
  otp!: FormGroup;
  orderHistoryId:string| null='';
  order:any;
  orderId:string='';
  navTOBack(){
    this.location.back()
  }
  constructor(private form: FormBuilder,
            private orderService:OrdersService,
            private readonly routerParam:ActivatedRoute,
            private readonly afterOrderService:AfterorderService,
              private router:Router,
              private readonly dialougeBOxService:DailogeBoxService,
            private location:Location)
  { 
   
  }

  ngOnInit(): void {
    this. getOrderId();
    this.getOtp();
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
           this.orderId=res._id;
           this.getOrderHistoryId(this.orderId)
          },
          error:(err:HttpErrorResponse)=>{
            console.log(err);
          }
        })
      }
    }
    getOrderHistoryId(id:string){
      this.afterOrderService.getOrderHistoryId(id).subscribe({
        next:(res)=>{
          console.log(res);
          this.orderHistoryId=res.data._id;
        },error:(err:HttpErrorResponse)=>{
          console.log(err);
        }
      })
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
    const requestBody={
          orderHistoryId:this.orderHistoryId,
          uniqueNumber:otp,
          userId:this.order.userId,
          orderId:this.orderId
    }
    console.log(requestBody);
    this.orderService.verifyStartOrder(requestBody).subscribe({
      next:(response)=>{
        console.log(response);
        this.dialougeBOxService.openDialog('OTP verified sucessfully');
        this.router.navigate(['workImage',this.orderId]);
      },error:(err)=>{
        console.log(err);
        this.dialougeBOxService.openDialog(err.error.message);
      }
  })
    // this.router.navigate(['completeWork']);
  }

 
  


}
