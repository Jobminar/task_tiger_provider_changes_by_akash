import { Component } from '@angular/core';
import { JobDetailsService } from '../job-details.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.css'
})
export class JobDetailsComponent {
  
  navToBack(){
    this.location.back();
  }
  navToHelp(){
    this.router.navigate(['help'])
  }
  constructor(private jobDetailsService:JobDetailsService,
              private location:Location,
              private router:Router
  )
  {
    this.jobDetailsService.getSelectedJob()
    console.log( this.jobDetailsService.getSelectedJob());
  
  }


    
  orderDetails= {
    _id: "669e626966dc877d8f903918",
    providerId: "669caa1c061e2bbc2ae85c1c",
    status: "Accepted",
    orderId: {
        _id: "669cec5b2646b0e97309c544",
        userId: "669115768f0d9e6728c61edd",
        addressId: "669caa31061e2bbc2ae85c24",
        address: {
            latitude: 17.4975851,
            longitude: 78.3961531,
            pincode: "500060",
            city: "Hyderabad",
            state: "Telangana",
            username: "Ramarao",
            mobileNumber: "9490856692"
        },
        paymentId: "pay_ObBS9ZdsRoztUF",
        categoryIds: [
            "Lock smith"
        ],
        subCategoryIds: [
            "Key duplication & replacement"
        ],
        items: [
            {
                serviceName: "Lost car key replacement & programming (transponder keys)",
                serviceVariants: [
                    {
                        variantName: "Normal cleaning",
                        price: 5000,
                        serviceTime: 239,
                        metric: "quantity",
                        min: 1,
                        max: 2
                    }
                ],
                quantity: 1,
                selectedDate: "22",
                selectedTime: "9AM - 10AM",
                scheduledDate: "22-6-2024 9AM - 10AM"
            }
        ]
    }
}

nameOfUser:any;
schedule:any;
address:any;
noJobs:any=this.orderDetails.orderId
}
