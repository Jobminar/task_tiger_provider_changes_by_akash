import { Component } from '@angular/core';
import { UserDetailsService } from '../user-details.service';
import { Location } from '@angular/common';
import { RazorpayService } from '../razorpay.service';
import { DailogeBoxService } from '../dailoge-box.service';
declare var Razorpay: any;

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.css'] // Corrected property name to 'styleUrls'
})
export class PackagesComponent {
    isEnrolled: boolean = true;
    packages: any[] = [];
    purchasedPackages: any[] = []; // Stores purchased package details

    constructor(
        private userDetails: UserDetailsService,
        private location: Location,
        private razorPayService: RazorpayService,
        private readonly dailougeBoxService:DailogeBoxService
    ) {
        this.getPackage();
        this.getPurchasedPackages();
    }

    navToBack() {
        this.location.back();
    }

    getPackage() {
        this.userDetails.getPackages().subscribe(
            (response) => {
                console.log(response);
                this.packages = response;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getPurchasedPackages() {
        const providerId = localStorage.getItem('providerId');
        this.userDetails.getPurchasedPackages(providerId).subscribe(
            (response) => {
                console.log('Purchased packages:', response);
                this.purchasedPackages = response;
                this.getExpiryDate(response.packageName);
            },
            (error) => {
                console.error('Error fetching purchased packages:', error);
            }
        );
    }

    getExpiryDate(packageName: string) {
      const purchasedPackage = this.purchasedPackages.find(p => p.packageName === packageName);
      return purchasedPackage ? purchasedPackage.expiryDate.split('T')[0] : 'N/A';
  }
  

    isPackageActivated(packageItem: any): boolean {
        return this.purchasedPackages.some(
            (purchasedPackage) => purchasedPackage.packageName === packageItem.packageName
        );
    }
    buy(item: any) {
      // Check if the user has any activated package
      if (this.isAnyPackageActivated()) {
        this.dailougeBoxService.openDialog('You already have an active package. Please wait until it expires.');
          // alert('You already have an active package. Please wait until it expires.');
          return;
      }
  
      // Validate package data before proceeding
      if (!this.validatePackageData(item)) {
        this.dailougeBoxService.openDialog('Package data is not valid. Please check the package details.');
          // alert('Package data is not valid. Please check the package details.');
          return;
      }
  
      const amount = item.priceRs;
      const currency = 'INR';
  
      this.razorPayService.createOrder(amount).subscribe({
          next: (response) => {
              console.log('Order created:', response);
              this.payWithRazorpay(amount, response.id, currency, item);
          },
          error: (error) => {
              console.error('Error creating order:', error);
              this.dailougeBoxService.openDialog(error.error.message);
          }
      });
  }
  
  // New method to check if any package is activated
  private isAnyPackageActivated(): boolean {
      return this.purchasedPackages.length > 0 && this.purchasedPackages.some(p => new Date(p.expiryDate) > new Date());
  }
  

    private validatePackageData(item: any): boolean {
        // Check if the necessary fields are available and valid
        return item && item.packageName && item.priceRs && item.discountPlatformCom !== undefined && item.comments && item.validity && item.image;
    }

    payWithRazorpay(amount: number, orderId: string, currency: string, item: any) {
        const options = {
            key: 'rzp_test_b8XfUOQ4u8dlSq',
            amount: amount * 100,
            currency: currency,
            name: 'Coolie no.1',
            description: 'Test Transaction',
            image: 'assets/location/logo-v3 3.png',
            handler: (response: any) => {
                console.log(response);
                this.addPackages(response.razorpay_payment_id, item);
            },
            prefill: {
                name: 'Customer Name',
                email: 'customer@example.com',
                contact: '9999999999'
            },
            theme: { color: '#3399cc' },
            modal: {
                ondismiss: function () {
                    console.log('Checkout form closed');
                }
            }
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();
    }

    addPackages(paymentId: string, item: any) {
      const providerId: any = localStorage.getItem('providerId');
  
      // Create the request body as a plain object
      const requestBody = {
          providerId: providerId,
          packageName: item.packageName,
          priceRs: item.priceRs,
          discountPlatformCom: item.discountPlatformCom,
          // comments: item.comments,
          validity: item.validity,
          paymentId: paymentId,
          image:item.image
      };
  
      // Log the request body
      console.log('Request Body:', requestBody);
  
      // Call the API to add the package
      this.userDetails.buyingPackages(requestBody).subscribe({
          next: (response) => {
              console.log('Package added successfully:', response);
              this.getPurchasedPackages(); // Refresh the purchased packages
          },
          error: (error) => {
              console.error('Error adding package:', error);
              this.dailougeBoxService.openDialog(error.error.message);
          }
      });
  }
  
  
  


}
