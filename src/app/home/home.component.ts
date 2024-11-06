import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TraniningService } from '../tranining.service';
import { JobDetailsService } from '../job-details.service';
import { LoginServiceService } from '../login-service.service';
import { FotterComponent } from '../fotter/fotter.component';
import { UserDetailsService } from '../user-details.service';
import { RazorpayService } from '../razorpay.service';
import { MapBoxService } from '../map-box.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { OrdersService } from '../orders.service';
import { DailogeBoxService } from '../dailoge-box.service';
import { GoogleMapService } from '../google-map.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild('footer') footer!: FotterComponent;
  isDrawerOpen: boolean = false;
  data: any[] = [];
  bucketName = 'coolie1-dev';
  region = 'ap-south-1';
  nextWorking: any = [];
  isAccountVerify: any;
  loading:boolean=false;
  ngOnInit(): void {
    const storedOnlineStatus = localStorage.getItem('onlineStatus');
    const storedOnlineText = localStorage.getItem('onlineText');

    if (storedOnlineStatus !== null) {
      this.online = storedOnlineStatus === 'true'; // Convert string to boolean
    }

    if (storedOnlineText !== null) {
      this.onlineText = storedOnlineText;
    }

    this.isAccountVerify = this.logInService.isAccountVerify;
    this.trainingService.getingVideos().subscribe(
      (response) => {
        console.log(response);
        this.data = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.router.navigate(['menu']);
  }

  navToCredit() {
    this.router.navigate(['credits']);
  }

  navToNotification() {
    this.router.navigate(['notification']);
  }

  navToCal() {
    this.router.navigate(['calender']);
  }

  constructor(
    private readonly  router: Router,
    private readonly  http: HttpClient,
    private readonly  trainingService: TraniningService,
    private readonly  logInService: LoginServiceService,
    private readonly  userDetailsService: UserDetailsService,
    private readonly  jobDetailsService: JobDetailsService,
    private readonly  razorpayService: RazorpayService,
    private readonly  mapboxService: MapBoxService,
    private readonly  orderService: OrdersService,
    private readonly dialogService:DailogeBoxService,
    private readonly googleMapService:GoogleMapService

  ) {
   
    console.log(this.nextWorking.length);
    this.getBanners();
    this.getProviderDetails();
    this.workingDates();
    this.getAvalibility();
    this.getWork();
    this.getCredit();
    this.getPendingOrders();
  }
  ads: any[] = [
    {
      src: 'assets/demo/ad.png',
    },
    {
      src: 'assets/demo/ad.png',
    },
    {
      src: 'assets/demo/ad.png',
    },
    {
      src: 'assets/documents/pancard.png',
    },
  ];

  //geting details about jobs and provider details

  async getProviderDetails() {
    this.jobDetailsService.getUserDetails(localStorage.getItem('providerId'));
    setTimeout(() => {
      this.navToAboutUser();
    }, 2000);
  }
  navToAboutUser() {
    if(!localStorage.getItem('providerId')){
      this.router.navigate(['selectAccount']);
    }
    let entered;
    this.jobDetailsService
      .getUserDetails(localStorage.getItem('providerId'))
      .subscribe((response) => {
        console.log(response);
        entered = response;
        if (entered && !this.jobDetailsService.getcheckingDetails()) {
          console.log("inside",this.jobDetailsService.getcheckingDetails());
          this.dialogService.openDialog('Please add the details');
          // alert("Please add the details")
          this.jobDetailsService.setCheckingDetails(true);
          this.router.navigate(['aboutUser']);
        }
      });
    console.log(entered);
  }
  workingDates() {
    this.nextWorking = this.dates.splice(0, 2);
    console.log(this.nextWorking);
  }
  getAvalibility() {
    this.jobDetailsService.getAvailability().subscribe(
      (response) => {
        console.log(response);
        this.formattingAvailbility(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getWork() {
    this.userDetailsService
      .getWork(localStorage.getItem('providerId'))
      .subscribe(
        (response) => {
          console.log(response);
          console.log(response._id);
          this.userDetailsService.workResponse = response.works;
          this.userDetailsService.workResponseId = response._id;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  
  dates: any[] = [];
  monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  formattingAvailbility(dates: any) {
    const today = new Date(); // Get the current date

    for (let index = 0; index < dates.length; index++) {
      const element = dates[index];
      const date = element.slotTime.date.split('T')[0];
      const currentDate = new Date(date);
      const day = this.dayNames[currentDate.getDay()];
      const month = this.monthNames[currentDate.getMonth()];
      const year = currentDate.getFullYear();
      const dateSelected = currentDate.getDate();

      // Check if the date is today or later
      if (
        currentDate >= today ||
        currentDate.toDateString() === today.toDateString()
      ) {
        // Check for duplicates
        const isDuplicate = this.dates.some(
          (d) =>
            d.date === dateSelected &&
            d.day === day &&
            d.month === month &&
            d.year === year
        );

        if (!isDuplicate) {
          this.dates.push({
            date: dateSelected,
            day: day,
            month: month,
            year: year,
            isWorking: 'working',
          });

          // Sort dates after adding
          this.dates.sort((a, b) => {
            // Convert month names to zero-based index for Date constructor
            const monthIndexA = this.monthNames.indexOf(a.month);
            const monthIndexB = this.monthNames.indexOf(b.month);

            // Ensure indices are valid
            if (monthIndexA === -1 || monthIndexB === -1) {
              return 0; // Or handle this case differently if needed
            }

            const dateA = new Date(a.year, monthIndexA, a.date);
            const dateB = new Date(b.year, monthIndexB, b.date);
            return dateA.getTime() - dateB.getTime(); // Compare time values
          });
        }
      }
    }
    this.workingDates();
  }

  credits: number = 0;
  getCredit() {
    this.razorpayService.getCredits().subscribe(
      (res) => {
        console.log(res);
        this.razorpayService.userCredit = res.creditBalance;
        this.credits = res.credits;
      },
      (err) => {
        console.log(err);
      }
    );
  }


  // get banners from backend 
getBanners(){
  this.userDetailsService.getBanners().subscribe({
    next:(res)=>{
      console.log(res);
      this.ads=res;
    },error:(err:HttpErrorResponse)=>{
      console.log(err);
    }
  })
}

  //online and off line status

  online: boolean = false;
  onlineText: string = 'Go';
  onlineStatus(): void {
    try {
     this.loading=true;
      const accountVerified = this.jobDetailsService.isVerify;
      console.log(accountVerified);
      // if (!accountVerified) {
      //   alert("Account is not verified...")
      //   // throw new Error('Account is not verified');
      //   return;
      // }
      this.online = !this.online;

      // this.onlineText = this.onlineText === 'Go' ? 'Off' : 'Go';
      // Toggle the online status

      this.onlineText = this.online ? 'Off' : 'Go';

      // Update the MapboxService state and localStorage
      this.googleMapService.onlineStatus = this.online;
      this.googleMapService.setonlineStatus(this.online, this.onlineText);

      // Store the updated state in localStorage
      localStorage.setItem('onlineStatus', this.online.toString());
      localStorage.setItem('onlineText', this.onlineText);
      if (this.online) {
        this.googleMapService. getCoordinates().subscribe(
          (location) => {
            console.log('Current Location:', location);
            this.sendCordinates(location);
            this.getname(location);
            alert(location?.lat);
            this.loading=false;
            // Perform any additional actions with the current location
          },
          (error:HttpErrorResponse) => {
            console.error('Error getting current location:', error);
            alert(error.error.message);
            this.loading=false;
          }
        );
      }
    } catch (error) {
      console.error('Error in onlineStatus method:', error);
    }
    console.log(this.online);
  }

  getname(location: any) {
    this.mapboxService.getPlaceNameFromCoordinates(location).subscribe(
      (placeName) => {
        console.log('Place Name:', placeName);
        this.userDetailsService.currentCordinates = location;
        this.userDetailsService.currentLocation = placeName;
        this.mapboxService.placeName = placeName;
        // Perform any additional actions with the place name and location
      },
      (error) => {
        console.error('Error getting place name:', error);
      }
    );
  }

  sendCordinates(location: any) {
    this.googleMapService.sendCordinates(location).subscribe({
     next:(response) => {
        console.log(response);
       alert(response.message)
      },
     error:(err) => {
        console.log(err);
        alert(err.errors.message)
      }
  });
  }

  sendTokens() {
    const api = '';
    const requestBody = {};
    this.http.post(api, requestBody).subscribe(
      (response) => {
        console.log(response);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // getting the pending orders
  noOfPendingOrders: number = 0;
  // getPendingOrders() {
  //   this.orderService.orderHistory().subscribe({
  //     next: (response) => {
  //       console.log(response);
  //       const pending = 'InProgress';
  //       const filter = response.filter((i: any) => {
  //         return i.status.toLowerCase().includes(pending.toLowerCase());
  //       });
  //       this.noOfPendingOrders = filter.length;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }


  getPendingOrders() {
    this.orderService.orderHistory().subscribe({
      next: (response) => {
        console.log(response);
  
        // Get today's date in the same format as 'scheduledDate'
        const today = new Date();
        const todayFormatted = today.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }).replace(/\//g, '-'); // Format: dd-mm-yyyy
  
        const pending = 'Accepted';
        const filter = response.data.filter((order: any) => {
          const scheduledDate = order.orderId.items[0].scheduledDate.split(' ')[0];          ;
          console.log("scheduleee================",scheduledDate);
          const status = order.status.toLowerCase();
          return status.includes(pending.toLowerCase()) && scheduledDate === todayFormatted;
        });
        console.log('filtered', filter);
        this.noOfPendingOrders = filter.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  
}
