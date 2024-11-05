import { Component } from '@angular/core';

import { Location } from '@angular/common';
import { GetOrdersService } from './get-orders.service';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'CoolieNo.1_Provider';
  myObject: { [key: string]: any } = {};
  constructor(
    private location: Location,
    private messagingService: GetOrdersService,
    private readonly router: Router
  ) {
    this.initializePushNotifications();
    this.checkForOrderNavigation();
    this. gettingNotification();
   
  }
  ngOnInit() {
    
    // this.messagingService.requestPermission();
    // setTimeout(() => {
    //   this.myObject = this.messagingService.token
    //     ? { token: this.messagingService.token }
    //     : {};
    // }, 5000);
    // this.messagingService.listenForMessages();
    
    this.monitorNetworkStatus();
    this.registerBackButtonListener();
  }

  initializePushNotifications() {
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      const orderId = notification.notification.data?.orderId;
      alert(orderId);
      if (orderId) {
        this.messagingService.setOrderId(orderId);
        this.router.navigate(['getOrder', orderId]);
      }
    });
  }
  private checkForOrderNavigation() {
    const orderId = this.messagingService.getOrderId();
    if (orderId) {
      this.router.navigate(['getOrder', orderId]);
      this.messagingService.clearOrderId(); // Clear the order ID after navigating
    }
  }
  gettingNotification(){
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        PushNotifications.getDeliveredNotifications().then(result => {
          const notifications = result.notifications; // Access the notifications array
          
          notifications.forEach(notification => {
            if (notification.title === 'New Order') {
              const orderId = notification.data?.orderId;
              if (orderId) {
                this.router.navigate(['getOrder', orderId]);
              }
            }
          });
        }).catch(error => {
          console.error('Error fetching delivered notifications:', error);
        });
      }
    });
  }
  
  registerBackButtonListener() {
    App['addListener']('backButton', (event: any) => {
      if (event.canGoBack) {
        // If there is a page to go back to, let the app handle it
        this.location.back();
        console.log('Back button pressed, navigating back');
      } else {
        // If there's no page to go back to, exit the app
        console.log('Back button pressed, exiting app');
        App['exitApp'](); // Close the app
      }
    });
  }

  async monitorNetworkStatus() {
    const status = await Network.getStatus();

    if (!status.connected) {
      this.router.navigate(['not-found']); // Navigate to Not Found page if network is unavailable
    }

    Network.addListener('networkStatusChange', (status) => {
      if (!status.connected) {
        this.router.navigate(['not-found']);
      }
    });
  }
}
