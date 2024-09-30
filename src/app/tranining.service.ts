import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { azureApi } from '../constents/apis';
@Injectable({
  providedIn: 'root'
})
export class TraniningService {

  private apiUrl=azureApi;
  constructor(private http:HttpClient) { }

  apiForVideo:any= this.apiUrl+'admin'
  getingVideos():Observable<any>
  {
    
    return this.http.get<any>(`${this.apiForVideo}/training`)
  }

  gettingInductionVeideos():Observable<any>{
    return this.http.get<any>(`${this.apiForVideo}/induction`)
  }
}
