import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  providerDetails:any;
 private api:string=azureApi;
  constructor(private http:HttpClient) { }

  getUserDetails(id: any): Observable<boolean> {
    const api = this.api+`providers/provider-details/${id}`;

    if (this.providerDetails) {
      return of(this.providerDetails);
    } else {
      return new Observable<boolean>((observer) => {
        this.http.get<any>(api).subscribe(
          (data) => {
            console.log(data);
           this.providerDetails=data;
           observer.next(this.providerDetails);
           observer.complete();
          },
          (error) => {
            console.log(error);
            observer.error(error);
      });
    })
    }
  
}
  selectWork(work:string):any
  {
    return work;
  }

  getWork(id:any){
    const aaa=this.api + `providers/provider-work/${id}`
 
    console.log(aaa);
    return this.http.get<any>(aaa)
  }

  deleteWork(catId:string,subCatId:string){
    const api=`${this.api}/providers/provider-work/delete-subcategory`;
    const requestBody={
      providerId: localStorage.getItem('providerId'),
      workId: catId,
      subcategoryId:subCatId
    }

    return this.http.post(api,requestBody);
  }
  getFinancialDetails():Observable<any>{
    const api= this.api+`providers/provider-finance/${localStorage.getItem('providerId')}`;
   return this.http.get<any>(api)
  }

  getPackages():Observable<any>{
    const api= `${this.api}admin/admin-provider-package`;
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
