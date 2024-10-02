import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { mergeMapTo } from 'rxjs';
import { azureApi } from '../constents/apis';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, Token } from '@capacitor/push-notifications';
@Injectable({
  providedIn: 'root'
})
export class GetOrdersService {

  apiUrl=azureApi;
  userCordinates:any;
  token:any;
  order:any;
  constructor(
    private afMessaging: AngularFireMessaging,
    private http:HttpClient,
    private router:Router
  ) {
    this.listenForMessages();
  }

  requestPermission() {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          PushNotifications.register();

          PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
            this.token = token.value;
            this.sendTokenToBackend(token.value);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification: PushNotification) => {
            console.log('Push received: ', notification);
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
            console.log('Push action performed: ', notification);
          });
        }
      });
    } else {
      this.afMessaging.requestToken.subscribe({
        next: (token:any) => {
          console.log('FCM token:', token);
          this.token = token;
          this.sendTokenToBackend(token);
        },
        error: error => {
          console.error('Error getting token', error);
        }
      });
    }
  }


  
  listenForMessages() {
    console.log("listing...................");
    this.afMessaging.messages.subscribe((message) => {
      console.log(message);
      alert(message)
      this.router.navigate(['getOrder'])
      console.log(message.notification);
      console.log(message.data?.['order']);
      console.log(message.notification?.title);
      // if (message.notification?.title ==='New Order!') {
      //   this.order=message.data
      //   console.log("object");
      //   this.router.navigate(['getOrder'])
      // }
    //  alert(message)
    },
  (err)=>{
    console.log(err);
  });
  }

  
  sendTokenToBackend(token:string){
    alert(token)
    const api=this.apiUrl+"providers/provider-token";
    const requestBody={
      providerId:localStorage.getItem('providerId'),
      token:token
    }
    alert(requestBody.providerId);
    alert(requestBody.token)
    this.http.post(api,requestBody).subscribe({
      next:(response)=>{
        console.log(response);
        alert("token send sucessfully")
      },
      error:(err:HttpErrorResponse)=>{
        console.log(err);
        alert("error");
        alert(err.error.message)
      }
  })
  }

  


}
