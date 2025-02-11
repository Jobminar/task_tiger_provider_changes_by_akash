import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { JobDetailsService } from '../job-details.service';
import { HttpClient } from '@angular/common/http';
import { DailogeBoxService } from '../dailoge-box.service';
import { azureApi } from '../../constents/apis';
import { catchError, combineLatest, of } from 'rxjs';
import { UserDetailsService } from '../user-details.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.css'
})
export class VerifyComponent implements OnInit{
  @ViewChild('input1') input1!: ElementRef 
  @ViewChild('input2') input2!: ElementRef
  @ViewChild('input3') input3!: ElementRef 
  @ViewChild('input4') input4!: ElementRef 
  private apiUrl=azureApi;
  otp: FormGroup;
  userNumber:number=0;
  constructor(private form: FormBuilder,
             private readonly logInService:LoginServiceService,
             private readonly jobDetailsService:JobDetailsService,
             private readonly loginServices:LoginServiceService,
              private readonly router:Router,
              private readonly userDetailsService:UserDetailsService, 
              private readonly dialogeService:DailogeBoxService,
            private http:HttpClient) { 

    this.otp = this.form.group({
      inputOne: '',
      inputTwo: '',
      inputThree: '',
      inputFour: ''
    });
  }

  ngOnInit(): void {
    this.userNumber=this.logInService.userNumber;
      this.logInService.showOtp();
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

    if(position===4){
      this.login()
    }
  }

  onKeyDown(event: KeyboardEvent, currentInputIndex: number) {
    console.log("called",event,currentInputIndex);
    const input = event.target as HTMLInputElement;
    console.log("input :",input.value );
    console.log(currentInputIndex == 1);
    // Move focus to the previous input field if backspace is pressed and the current field is empty
    if (event.key === 'Backspace' && !input.value && currentInputIndex>1) {
      const previousInput =currentInputIndex - 1
      console.log("previous input",`#input${currentInputIndex - 1}`);
      if (previousInput) {
        switch(previousInput){
          case 3: this.input3.nativeElement.focus();
          break;
          case 2:this.input2.nativeElement.focus();
          break;
          case 1:this.input1.nativeElement.focus();
          break;
          default:console.log("something went wrong");
        }
        
      }
    }
  }
  async login() {
   
    const otpValue = this.otp.value;
    // Send OTP to backend
    const otp=otpValue.inputOne+otpValue.inputTwo+otpValue.inputThree+otpValue.inputFour 
    console.log("OTP:", this.otp.value);
  

   this.logInService.verifyOtp(otp).subscribe(
    async (response:any)=>{
      console.log("log in done",response)
      console.log(response.providerId);
      await this.logInService.setUser(response.providerId);
      this.storeUserData()
      await this.chekingUser();
     
      // this.router.navigate(['location'])
      
    },(error:any)=>{
      console.log('error',error);
      alert(error.error.message);
    }
   )
  }

 
  
  storeUserData()
  {
    // const userData = {
    //   email: this.logInService.emailId,
    //   phone: this.logInService.phoneNumber
    // };

   
    // this.logInService.setItems('user_data', userData);
  }
  countdownValue!: number;
  countdownInterval: any;
  minutes!: number;
  seconds!: number;
  resendToggling="resend";


  resend(){
   this.logInService.resendOtp();
   this.resendToggling="countdown";
  this.startCountdown()
    // const email=this.logInService.emailId
    // const phone=this.logInService.phoneNumber
    // this.logInService.logIn(email,phone).subscribe(
    //   (response)=>{
    //     console.log("response",response)
    //     Swal.fire({
    //       icon: 'success',
    //       title: 'Otp send Successful!',
    //       text: 'otp send to your mobile number',
    //       timer: 2000, // Timer for 2 seconds
    //       timerProgressBar: true, // Show timer progress bar
    //     });
    //     this.resendToggling="countdown";
    //     this.startCountdown()
    //   },
    //   (error)=>
    //   {
    //     console.log("error",error)
    //     Swal.fire({
    //       icon: 'error',
    //       title: 'otp sending Failed!',
    //       text: 'Invalid username or password.',
    //     });
    //   }
    // )
  }

  startCountdown(): void {
    let totalSeconds = 120; // Initial value in seconds
    this.updateDisplay(totalSeconds);

    this.countdownInterval = setInterval(() => {
      totalSeconds -= 1;
      if (totalSeconds <= 0) {
        this.stopCountdown();
        this.resendToggling="resend";
      } else {
        this.updateDisplay(totalSeconds);
      }
    }, 1000); // Update every second
  }
  stopCountdown(): void {
    clearInterval(this.countdownInterval);
  }
  ngOnDestroy(): void {
    this.stopCountdown();
  }
  updateDisplay(totalSeconds: number): void {
    this.minutes = Math.floor(totalSeconds / 60);
    this.seconds = totalSeconds % 60;
  }

  async chekingUser(){
   
    // this.jobDetailsService.getUserDetails(localStorage.getItem('providerId'));
    // await console.log(this.jobDetailsService.userDetails);
    //  if (!this.jobDetailsService.userDetails) {
    //   this.router.navigate(['aboutUser']);
    // } else {
    //   this.navTo();
    // }
    const id=localStorage.getItem('providerId')
    // const api = `https://api.coolieno1.in/v1.0/providers/provider-details/${id}`;
    const api=`${this.apiUrl}providers/provider-details/${id}`
      this.http.get<any>(api).subscribe(
        (data) => {
          console.log("response", data);
          console.log( data.providerName);
          this.logInService.alreadyHasAccount=true;
          this.navTo();  
        },
        (error) => {
          console.log(error);
          this.dialogeService.openDialog("Please add your Details");
          this.router.navigate(['aboutUser']);
        }
      );
  }
  navTo(){
  
      const providerId = localStorage.getItem('providerId');
    
      const address = this.logInService.getAddress().pipe(
        catchError((error) => {
          console.error('address', error);
          return of('not found'); // Return an empty array in case of error
        })
      );
    
      const details = this.userDetailsService.getUserDetails(providerId).pipe(
        catchError((error) => {
          console.error('details', error);
          return of('not found'); // Return an empty array in case of error
        })
      );
    
      const work = this.userDetailsService.getWork(localStorage.getItem('providerId')).pipe(
        catchError((error) => {
          console.error('work', error);
          return of('not found'); // Return an empty array in case of error
        })
      );
    
      const training = this.http.get<any>(`${azureApi}providers/provider-watched-video/${providerId}`).pipe(
        catchError((error) => {
          console.error('training', error);
          return of('not found'); // Return an empty array in case of error
        })
      );
    
      combineLatest([details, address, work, training]).subscribe(
        ([response1, response2, response3, response4]:any) => {
          console.log('API 1 Response:', response1);
          console.log('API 2 Response:', response2);
          console.log('API 3 Response:', response3);
          console.log('API 4 Response:', response4);
          const routes = [
            { condition: response1.provider.firstName ? response1 : 'not found', message: 'Please complete your registration', route: 'aboutUser' },
            { condition: response2, message: 'Please complete your registration', route: 'addAddress' },
            { condition: response3, message: 'Please provide your address', route: 'selectWork' },
            { condition: response4 , message: 'Please complete your training', route: 'induction' }
          ];
          
          for (let route of routes) {
            if (route.condition === 'not found') {
              this.dialogeService.openDialog(route.message);
              this.router.navigate([route.route]);
              break;
            }
          }
          
          // If none of the conditions are met, navigate to 'home'
          if (routes.every(route => !route.condition)) {
            this.router.navigate(['home']);
          }
          // Handle responses here
        },
        (error) => {
          // This should not get triggered because each individual observable handles its own error
          console.error('Error in combining responses', error);
        }
      );
    
  }

}
