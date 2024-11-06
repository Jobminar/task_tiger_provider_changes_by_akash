//-> login,signup,resend,local storage,
// adding the number in the user details,
// complete deatils of the user like name ,age ,about work

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { DailogeBoxService } from './dailoge-box.service';
import { azureApi } from '../constents/apis';
@Injectable({
  providedIn: 'root',
})
export class LoginServiceService {
  
  apiUrl=azureApi;
  userDetails: any[] = [];
  workDetails: any[] = [];
  userNumber: any;
  userId: any;
  alreadyHasAccount: boolean = false;
  isAccountVerify: boolean = true;
  api = '';
  responseOtp:any;
  name: string = '';
  pincode: any;
  radius: any;
  workName: any;
  workId:any;
  age: any;
  gender: any;
  experience: any = 0;
  selectedSubCategories:string='';
  categoryId:any;
  selectedServiceId:any;
  userFromServer: any = [];
  constructor(private http: HttpClient,
     private router: Router,
     private readonly dialogService:DailogeBoxService
  ) {}
  setLogInApi() {
    this.api = this.apiUrl+'providers/provider-auth/login';
    console.log(this.api);
  }
  setSignUpApi() {
    this.api =this.apiUrl+ 'providers/provider-auth/signup';
    console.log(this.api);
  }

  
  setLog(number: any) {
    console.log(number);
    console.log(this.api);
    const requestBody = {
      phone: number,
    };
    console.log(requestBody);
    this.http.post(this.api, requestBody).subscribe(
      (response) => {
        console.log(response);
      this.responseOtp=response;
        this.userNumber = number;
        this.router.navigate(['verify']);
      },
      (error) => {
        console.log(error);
        console.log(error.error);
        console.log(error.error.message);
        if (error.error.message==="User does not exist. Please sign up first.") {
          alert("Account was not found. Please signUp first.");
          this.router.navigate(['selectAccount'])
          
        } else {
          alert("something went wrong.Please retry again");
        }
      }
    );
  }

  showOtp(){
    alert(this.responseOtp.otp)
  }
  resendOtp() {
    console.log(this.userNumber);
    console.log(this.api);
    const requestBody = {
      phone: this.userNumber,
    };
    console.log(requestBody);
    this.http.post(this.api, requestBody).subscribe(
      (response) => {
        console.log(response);
        // this.userNumber=number;
        // this.router.navigate(['verify'])
      },
      (error) => {
        console.log(error);
      }
    );
  }

  verifyOtp(otp: any): Observable<any> {
    const requestBody = {
      otp: otp,
      phone:this.userNumber
    };
    const api =this.apiUrl+'providers/provider-auth/verify-otp';
    return this.http.post(api, requestBody);
  }

  setUserInLocalStroage(id: string) {
    localStorage.setItem('providerId', id);
  }
  setUser(id: string) {
    this.userDetails.push({ number: this.userNumber });
    console.log(this.userDetails);
    localStorage.setItem('providerId', id); //seting the in local strorage
    this.userId = localStorage.getItem('providerId');
  }

  getUserId(): Observable<any> {
    const providerId = localStorage.getItem('providerId');
    console.log(providerId);
    return of(providerId);
  }

  removeUser() {
    localStorage.removeItem('providerId');
  }

  setWork(work: any,id:any) {
    this.workName = work;
    this.workId=id
  }

  setSubCat(item:any){
   
    this.selectedSubCategories=item
    console.log(this.selectedSubCategories);
  }
  
  
  setservices(serviceId:any){
    console.log("serviceId",serviceId);
    this.selectedServiceId=serviceId;
  }
  setAge(age: any) {
    console.log(age);
    this.age = age;
    console.log(this.age);
  }
  setExperiance(experience: any) {
    console.log(experience);
    this.experience = experience;
  }

  setWorkDetails() {
    this.workDetails=[];
    console.log(this.selectedSubCategories);
    const work = [
      {
        categoryId:this.workId,
        //  nameOfService: this.workName, 
         experience: this.experience,
         subcategoryId:this.selectedSubCategories ,
         serviceId:this.selectedServiceId
      },
    ];
    this.workDetails=work;
    console.log(this.workDetails);
  }

// get api for sub categories
  
  getSubCategory(){
    const api= this.apiUrl+`core/sub-categories/category/${this.categoryId}`
    return this.http.get<any>(api);
  }
 
  getServices(catId:string,subCatId:string):Observable<any>{
    const api=`${this.apiUrl}/core/services/filter/${catId}/${subCatId}`;
    return this.http.get<any>(api);
  }

  // UserDetails(data: any) {
  //   console.log(data);
  //   const api = 'https://api.coolieno1.in/v1.0/providers/provider-details';
  //   this.http.post(api, data).subscribe(
  //     (response: any) => {
  //       console.log('Success', response);
  //       this.userFromServer = response;
  //       // this.formatingResponse(response);
  //       this.router.navigate(['home']);
  //       // Optionally, navigate to another page or show success message
  //       // this.router.navigate(['success']); // Example navigation
  //     },
  //     (error: HttpErrorResponse) => {
  //       console.error('Error', error);
  //       // Handle different types of errors
  //       if (error.error instanceof ErrorEvent) {
  //         // Client-side error (e.g., network error)
  //         alert('A network error occurred. Please try again later.');
  //       } else {
  //         // Server-side error
  //         alert('An error occurred. Please try again later.');
  //       }
  //     }
  //   );
  // }

  sendWorkDetails(){
    const api= this.apiUrl+`providers/provider-work`;
    // console.log(this.workDetails);
    const work=this.workDetails;
    const userId=localStorage.getItem('providerId')
   
    const requestBody={
      providerId:userId,
      works:work
    }
    console.log(requestBody);
    return this.http.post(api,requestBody);
  }

  UserDetails(data: any) {
    const dataAsObject: any[] = []
    data.forEach((value: any, key: any) => {
      dataAsObject.push(key =value);
    });
    console.log(dataAsObject);
    console.log(data);
    const api = this.apiUrl+'providers/provider-details';
    this.http.post(api, data).subscribe(
      (response: any) => {
        console.log('Success', response);
        this.userFromServer = response;
        this.router.navigate(['aadharVerify']);
      },
      (error: HttpErrorResponse) => {
        console.error('Error', error);
        if (error.error instanceof ErrorEvent) {
          // Client-side error (e.g., network error)
          alert('A network error occurred. Please try again later.');
        } else {
          // Server-side error
          alert('An error occurred. Please try again later.');
        }
        // Log detailed error information
        console.error(`Backend returned code ${error.status}, body was: `, error.error);
      }
    );
  }
  
  

  formatingResponse(response: any) {
    console.log(response.work);
    // Assuming 'response.work' is an array
    // if (response.work && response.work.length > 0) {
    //   response.work.shift();
    // }
    console.log(response.work);
    const jsonArray = JSON.parse(response.work);

    // Flatten the nested arrays
    const flattenedArray = jsonArray.flat();

    this.userFromServer.work = flattenedArray;
    console.log(this.userFromServer);
  }

  updateUserWork(work: any, id: any) {
    console.log(work);
    const userId=localStorage.getItem('providerId')
    console.log(id);
    const requestBody={
      providerId:userId,
      works:work
    }
    console.log("work in service",requestBody);
    const api = this.apiUrl+`providers/provider-work`;
    this.http.post(api, requestBody).subscribe(
      (response) => {
        console.log(response);
        this.dialogService.openDialog("Service has been updated");
        this.router.navigate(['home']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getPhoneNumber(): Observable<any> {
    const id = localStorage.getItem('providerId');
    const api = this.apiUrl+`providers/provider-auth/${id}`;

    this.http.get<any>(api).subscribe(
      (response) => {
        this.userNumber = response.phone;
        console.log(this.userNumber);
      },
      (error) => {
        console.log(error);
      }
    );

    return this.userNumber;
  }


  setDefult(){
    this.userDetails = [];
    this.workDetails = [];
    this.userNumber=null;
    this.userId='';
    this.alreadyHasAccount= false;
    this.isAccountVerify= true;
    this.api = '';
    this.responseOtp='';
    this.name= '';
    this.pincode='';
    this.radius=undefined;
    this.workName='';
    this.workId='';
    this.age='';
    this.gender='';
    this.experience= 0;
    this.selectedSubCategories='';
    this.categoryId='';
    this.userFromServer = [];
    
  }
}
