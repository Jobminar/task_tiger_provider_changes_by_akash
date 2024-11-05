import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { mergeMapTo } from 'rxjs';
import { azureApi } from '../constents/apis';
import { PushNotification, PushNotificationActionPerformed, PushNotifications, Token } from '@capacitor/push-notifications';
import { Location } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class GetOrdersService {
  private orderId: string | null = null;
  apiUrl=azureApi;
  userCordinates:any;
  token:any;
  order:any;
  constructor(
    private afMessaging: AngularFireMessaging,
    private http:HttpClient,
    private router:Router,
    private readonly location:Location
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
            this.handleInAppNotification(notification);
            console.log('Push received: ', notification);
          });

          PushNotifications.addListener('pushNotificationActionPerformed', (notification: PushNotificationActionPerformed) => {
            console.log('Push action performed: ', notification);
            this.handleNotificationClick(notification);
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
    this.afMessaging.messages.subscribe((message: any) => {
      console.log(message);
  
      const notificationTitle = message.notification?.title;
      const orderId = message.data?.['orderId'];
  
      if (notificationTitle === 'New Order' && orderId) {
        this.router.navigate(['getOrder', orderId], { replaceUrl: true }).then(() => {
          // Replace the current state to prevent back navigation to this page
          this.location.replaceState('home');
        });
      } else {
        // console.warn('Order ID missing or title mismatch');
      }
    },
    (err) => {
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
  // New Method: Handle In-App Notification
  handleInAppNotification(notification: any) {
    alert('inapp notification')
    const title = notification.notification?.title || notification.title;
    const body = notification.notification?.body || notification.body;
    const data = notification.data;
    if (title && body) {
      alert(title)
      // Display toast or other UI for in-app notification
      // this.toasterService.showSuccess(body, title);
      if (title==='New Order') {
        alert(data.orderId)
        // this.router.navigate(['getOrder', data.orderId]);
        setTimeout(() => {
          this.router.navigate(['getOrder', data.orderId]).then(() => {
            this.location.replaceState('home'); // Clear history stack for Android navigation
          });
        }, 3000);
      
      }
      // alert("new order created")
    }
  }
  
 // Handle notification click (when user taps notification from the notification tray)
 handleNotificationClick(notification: any) {
  const data = notification.data?.['orderId'];
  const title = notification.notification?.title 
  const body = notification.notification?.body ;
  
  if (title) {
    // Navigate to a specific page based on the notification data
    if (title==='New Order') {
      // this.router.navigate(['getOrder', data.orderId]);
    
        alert('inside nav')
        // this.router.navigate(['getOrder', data.orderId]);
        setTimeout(() => {
          alert(data)
          this.router.navigate(['getOrder', data])
        }, 3000);
       
     
    }
  
  } else {
    // Default action if no specific data is present
    // this.router.navigate(['getOrder', { replaceUrl: true }]);
  }
}

setOrderId(orderId: string) {
  this.orderId = orderId;
}

getOrderId(): string | null {
  return this.orderId;
}

clearOrderId() {
  this.orderId = null;
}

}
