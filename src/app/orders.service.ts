import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { azureApi } from '../constents/apis';
@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  orderIds:any;
  oredrDetails:any[]=[]
  userFullAddress:any;
  private apiUrl=azureApi;
  constructor(private http:HttpClient) { }

  getOrder(id:any):Observable<any>{
   const api= this.apiUrl+`users/order/category/${id}`
    return this.http.get<any>(api);
  }

  getOrderDetails(id:any):Observable<any>{
    const api='';
    return this.http.get<any>(api); 
  }

  accept(id:any,price:number,userId:string){
    const requestBody={
      orderId :id,
      price:price,
      userId:userId,
      providerId:localStorage.getItem('providerId')
    }
    console.log(requestBody);
   const api= this.apiUrl+'users/order-history/accept-order';
   return this.http.post(api,requestBody)
  }

  verifyOtp(){
    const api= this.apiUrl+'users/order-history/verify-start-order';
    const request={
      orderId :this.orderIds
    }
   return this.http.post(api,request)
  }

  verifyStartOrder(requestBody:{orderHistoryId:any,uniqueNumber:string}){
    const api= `${this.apiUrl}users/order-history/verify-start-order`;
    return this.http.post<any>(api,requestBody);
  }

  cancelOrder(){
    const api= this.apiUrl+'users/order-history/cancel-order';
    const requestBody={
      orderHistoryId:this.orderIds,
      providerId:localStorage.getItem('providerId'),
      reason:'nothing'
    }
    console.log(requestBody);
    return this.http.post(api,requestBody);
  }

  sendingImageBeforeWork(formData:FormData):Observable<any>{
    const api=`${this.apiUrl}users/order-history/before-work-upload-image`;
    return this.http.post<any>(api,formData)
  }
  completeOrder(requestBody:any){
    const api= this.apiUrl+'users/order-history/order-completed-generateotp';

    return this.http.post(api,requestBody)
  }

  verifyAfterComplete(otp:any,orderHistoryId:string|null,orderId:string){
    const api= this.apiUrl+'users/order-history/order-completed-verify'
    const requestBody={
      orderHistoryId:orderHistoryId,
      orderId:orderId,
      // providerId:localStorage.getItem('providerId'),
      otp:otp
    }
    console.log(requestBody);
    return this.http.post<any>(api,requestBody)
  }

  orderHistory():Observable<any>{
    const providerId=localStorage.getItem('providerId');
    const api= this.apiUrl+`users/order-history/provider/${providerId}` ;
    // const api= this.apiUrl+`users/order-history`;
    return this.http.get<any>(api);

  }

  setDefult(){
    this.orderIds='';
    this.oredrDetails=[]
    this.userFullAddress='';
  }
}
