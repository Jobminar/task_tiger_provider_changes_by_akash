import { Injectable } from '@angular/core';
import { azureApi } from '../constents/apis';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AfterorderService {

  private apiUrl=azureApi;
  constructor(private readonly http:HttpClient) { }

  // getting the order details byusing id from notifications
  getOrderDetails(orderId:string):Observable<any>{
    
    const api=`${this.apiUrl}users/order/order/${orderId}`;
    return this.http.get<any>(api);
  }
}
