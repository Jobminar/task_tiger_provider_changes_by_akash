import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { azureApi } from '../constents/apis';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient) { }
  private apiUrl=azureApi;
  api=this.apiUrl+'providers/provider-auth/signup';
  setLog(number:any){
    console.log(number);
    const requestBody={
      phone:number
    }
    console.log(requestBody);
    this.http.post(this.api,requestBody).subscribe(
      (response)=>{
        console.log(response);
      }
      ,(error)=>{
        console.log(error);
      }
    )
  }

// removing all the variables
  setDefult(){
    this.api='';
    this.apiUrl='';
  }
}
