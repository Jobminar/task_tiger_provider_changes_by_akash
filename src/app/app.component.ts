import { Component } from '@angular/core';

import { Location } from '@angular/common';
import { GetOrdersService } from './get-orders.service';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { Router } from '@angular/router';
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
   
  }
  ngOnInit() {
    // this.messagingService.requestPermission();
    // setTimeout(() => {
    //   this.myObject = this.messagingService.token
    //     ? { token: this.messagingService.token }
    //     : {};
    // }, 5000);
    this.messagingService.listenForMessages();
    this.monitorNetworkStatus();
    this.registerBackButtonListener();
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
