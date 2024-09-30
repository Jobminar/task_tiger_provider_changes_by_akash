import { group } from '@angular/animations';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { LoginServiceService } from '../login-service.service';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  myForm:FormGroup
  showError:boolean=false
  constructor(private router:Router,
              private fb:FormBuilder,
              private auth:AuthService,
              private http:HttpClient,
              private logInService:LoginServiceService
  )
  {
    this.myForm = this.fb.group({
      phoneNumber: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }
  validate(){
    
    if (this.myForm.value.phoneNumber.length===10) {
      this.showError=false
      
    }
    else{
      this.showError=true
    }
  }
  login(){
    
    this.logInService.setLog(this.myForm.value.phoneNumber)
  //   console.log(this.myForm.value.phoneNumber);
  //  const api='https://api.coolieno1.in/v1.0/providers/provider-auth/signup'
   
  //   const requestBody={
  //     phone:this.myForm.value.phoneNumber
  //   }
  //   console.log(requestBody);
  //   this.http.post(api,requestBody).subscribe(
  //     (response)=>{
  //       console.log(response);
  //       this.router.navigate(['verify'])
  //     }
  //     ,(error)=>{
  //       console.log(error);
  //     }
  //   )
      
    // this.router.navigate(['verify'])
  }
}
