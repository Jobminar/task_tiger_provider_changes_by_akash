import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { azureApi } from '../constents/apis';
@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  workResponseId:any;
  workResponse:any=[]
  currentLocation:any;
  currentCordinates:any;
  userRegistered:any;
 private api:string=azureApi;
  constructor(private http:HttpClient) { }

 
  selectWork(work:string):any
  {
    return work;
  }

  getWork(id:any){
    const aaa=this.api + `providers/work/${id}`
    console.log(aaa);
    return this.http.get<any>(aaa)
  }
  getFinancialDetails():Observable<any>{
    const api= this.api+`providers/provider-finance/${localStorage.getItem('providerId')}`;
   return this.http.get<any>(api)
  }

  getPackages():Observable<any>{
    const api= this.api+'admin/provider-package';
    return this.http.get<any>(api);
  }

  // userCertificated
  getCertificated(id:any):Observable<any>{
     const api= this.api+`providers/provider-certificate/${id}`;
    return this.http.get<any>(api)
  }
 
  setDefult(){
    this.workResponseId='';
    this.workResponse=[]
    this.currentLocation='';
    this.currentCordinates='';
    this.userRegistered='';
    this.api='';
  }
}
