

// import { Location } from '@angular/common';
// import { Component, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
// import { MatSlideToggleChange } from '@angular/material/slide-toggle';
// import { JobDetailsService } from '../job-details.service';
// import { HttpClient } from '@angular/common/http';
// import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { UserDetailsService } from '../user-details.service';

// @Component({
//   selector: 'app-calender',
//   templateUrl: './calender.component.html',
//   styleUrl: './calender.component.css'
// })
// export class CalenderComponent {
//   @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
//   date = new Date();
//   userId = localStorage.getItem('providerId');

//   defaultMonth = this.date.toLocaleDateString('default', { month: 'long' });
//   daySelected: any = String(this.date.getDate()).padStart(2, '0');
//   monthSelected: any = this.defaultMonth.substring(0, 3);
//   dateSelected: any = this.date.getDate();
//   yearSelected:any
//   isChecked: boolean = false;
//   working: boolean = false;
//   extendServices: boolean = false;
//   fullDate: any;
//   selectedItem: any;
//   services: any[] = [];
//   nextFourDays: any[] = [];
//   nextDaysOfIndex: any = [];
//   timeSelected: any;
//   dialogRef!: MatDialogRef<any>;

//   selectedService: string = '';

//   constructor(
//     private location: Location,
//     private renderer: Renderer2,
//     private el: ElementRef,
//     private http: HttpClient,
//     public dialog: MatDialog,
//     private jobDetailsService: JobDetailsService,
//     private userService:UserDetailsService
//   ) {}

//   extend() {
//     this.extendServices = !this.extendServices;
//   }

//   openServiceDialog(): void {
//     this.dialogRef = this.dialog.open(this.dialogTemplate);

//     this.dialogRef.afterClosed().subscribe(result => {
//       if (result) {
//         this.services = result;
//       }
//     });
//   }

//   onCancel(): void {
//     this.dialogRef.close();
//   }

//   onSubmit(): void {
//     this.dialogRef.close(this.services);
//   }

//   ngOnInit(): void {
//     this.getDetails();
//     this.getNextFourDays();
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     this.daySelected = days[this.date.getDay()];
//     this.getSelectedService();
//   }

//   timing: any[] = [
//     { time: '07:00AM - 10:00AM', isSelected: false },
//     { time: '10:00AM - 01:00PM', isSelected: false },
//     { time: '01:00PM - 04:00PM', isSelected: false },
//     { time: '04:00PM - 07:00PM', isSelected: false }
//   ];

//   getSelectedService() {
//     this.userService.getWork(localStorage.getItem('providerId')).subscribe(
//       (response)=>{
//           console.log(response);
//         //  console.log(response[0].works);
        
//          this.services=response[0].works
//       },(err)=>{
//         console.log(err);
//       }
//     )
    
//     // const demo = { nameOfService: 'cleaning' };
//     // this.services.push(demo);
//   }

//   availabilityService(serviceName: string) {
//     this.selectedService = serviceName;
//     this.showAvailabilityForService(serviceName);
//   }

//   getNextFourDays() {
//     const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//     const today = new Date();

//     for (let i = 0; i < 10; i++) {
//       const currentDay = new Date(today);
//       currentDay.setDate(today.getDate() + i);
//       const formattedDate = this.formatDate(currentDay);
//       this.nextFourDays.push({
//         date: formattedDate,
//         day: days[currentDay.getDay()],
//         workingStaus: false,
//         timming: this.timing.map(t => ({ ...t }))
//       });
//     }
//     this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
//   }

//   formatDate(date: Date): string {
//     const day = String(date.getDate()).padStart(2, '0');
//     const year = date.getFullYear();
//     const month = date.toLocaleDateString('default', { month: 'long' });
    
//     return `${day}-${month}-${year}`;
//   }

//   selectedIndex: number = 0;

//   selected(item: any, index: any) {
//     console.log(item);
//     this.isChecked = false;
//     if (item.workingStaus) {
//       this.working = true;
//     } else {
//       this.working = false;
//     }
//     this.selectedIndex = index;
//     this.dateSelected = item.date.toString().split('-')[0];
//     this.daySelected = item.day;
//     this.monthSelected = item.date.toString().split('-')[1];
//     this.yearSelected=item.date.toString().split('-')[2];
//     this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
//     console.log(this.nextDaysOfIndex);
//     console.log(this.monthSelected);
//   }

//   workingChange() {
//     this.nextFourDays[this.selectedIndex].workingStaus = !this.nextFourDays[this.selectedIndex].workingStaus;
//   }

//   onToggleChange(event: MatSlideToggleChange, item: any) {
//     if (event.checked) {
//         this.timeSelected = item.time;
//     } else {
//         this.timeSelected = "";
//     }

//     // Update all instances of the same time slot across different days
//     this.nextFourDays.forEach(day => {
//         day.timming.forEach((timeSlot: any) => {
//             if (timeSlot.time === item.time) {
//                 timeSlot.isSelected = event.checked;
//             }
//         });
//     });

//     console.log(this.dateSelected);

//     const currentDate = new Date(`${this.monthSelected} ${this.dateSelected} ${this.yearSelected}`);
//     currentDate.setDate(this.dateSelected);

//     const day = currentDate.getDate();
//     const month = currentDate.getMonth() + 1; // Adjust month to be 1-based

//     // Add leading zeros if needed
//     const formattedDay = day < 10 ? `0${day}` : day;
//     const formattedMonth = month < 10 ? `0${month}` : month;

//     const year = this.yearSelected;
//     this.fullDate = `${year}-${formattedMonth}-${formattedDay}`;
//     console.log(formattedMonth);
// }

//   submitAllData() {
//     console.log(this.checkDuplicate(this.fullDate, this.timeSelected, this.selectedService));
//     if (this.checkDuplicate(this.fullDate, this.timeSelected, this.selectedService)) {
//       alert('The same time slot on the selected date for the selected service is already taken.');
      
//     }
//     else{
//       this.sendingData();
//     }
//     // this.sendingData();
//   }

//   api=''
//   sendingData() {
//     if (this.timeSelected!="") {
//       this.api = 'https://api.coolieno1.in/v1.0/providers/provider-date';
//     } else {
//       this.api = 'https://api.coolieno1.in/v1.0/providers/provider-date/delete';
//     }
   
//     const requestBody = {
//       providerId: this.userId,
//       service: this.selectedService,
//       date: this.fullDate,
//       work: this.working,
//       time: this.timeSelected
//     };
//     console.log(requestBody);
//     console.log(this.api);
//     this.http.post(this.api, requestBody).subscribe(
//       response => {
//         console.log(response);
//         alert("Availabity added sucessfully");
//         this.timing.forEach(i=>i.isSelected=false)
//         console.log(this.timing);
//         this.getDetails();
//       },
//       error => {
//         console.log(error);
//         alert("Something went wrong");
//       }
//     );
//   }

//   availabilityResponse: any[] = [];
//   getDetails() {
//     const api = `https://api.coolieno1.in/v1.0/providers/provider-date/${this.userId}`;
//     this.http.get<any>(api).subscribe(
//       response => {
//         console.log(response);
//         this.availabilityResponse = response;
//         this.showAvailability(this.availabilityResponse);
//       },
//       error => {
//         console.log(error);
//       }
//     );
//   }

//   deleteData() {}

 
//   showAvailability(response: any) {
//     console.log(this.services);
  
//     response.forEach((element: any) => {
//       const dayString = element.date;
//       const onlyDate = new Date(dayString);
//       const day = onlyDate.getDate();
//       const month = onlyDate.toLocaleDateString('default', { month: 'long' });
//       const formattedDate = `${String(day).padStart(2, '0')}-${month}-${onlyDate.getFullYear()}`;
  
//       this.nextFourDays.forEach((item: { date: string; workingStaus: boolean; timming: any }) => {
//         if (formattedDate === item.date) {
//           item.workingStaus = true;
//           this.working = true;
  
//           item.timming.forEach((time: any) => {
//             if (time.time === element.time) {
//               const indexOfMatch = this.nextFourDays.indexOf(item);
//               const indexOfTime = this.nextFourDays[indexOfMatch].timming.indexOf(time);
//               if (this.nextFourDays[indexOfMatch].timming[indexOfTime].time === element.time) {
//                 this.nextFourDays[indexOfMatch].timming[indexOfTime].isSelected = true;
//               }
//             }
//           });
//         }
//       });
//     });
//   }
  
//   showAvailabilityForService(serviceName: string) {
   
//     console.log("new called");
//     this.nextFourDays.forEach(day => {
//       day.workingStaus = false;
//       day.timming.forEach((time: any) => {
//         time.isSelected = false;
//       });
//     });
  
//     // Set availability based on the selected service
//     console.log(this.availabilityResponse);
//     this.availabilityResponse.forEach((element: any) => {
//       if (element.service === serviceName) {
//         const dayString = element.date;
//         const onlyDate = new Date(dayString);
//         const day = onlyDate.getDate();
//         const month = onlyDate.toLocaleDateString('default', { month: 'long' });
//         const formattedDate = `${String(day).padStart(2, '0')}-${month}-${onlyDate.getFullYear()}`;
  
//         this.nextFourDays.forEach((item: { date: string; workingStaus: boolean; timming: any }) => {
//           if (formattedDate === item.date) {
//             item.workingStaus = true;
//             item.timming.forEach((time: any) => {
//               if (time.time === element.time) {
//                 time.isSelected = true;
//               }
//             });
//           }
//         });
//       }
//     });
//   }

//   checkDuplicate(date: string, time: string, service: string): boolean {
//     let present=false
//      this.availabilityResponse.some(item =>{
//       // console.log("inside");
//       // console.log("item",item.date.split('T')[0],item.time,"seleted",date,time);
//       if(item.date.split('T')[0].toString() == date && item.time.toString() == time){
//         console.log("present",true);
//         present=true
//       } 
//   });
//   return present
//   }

//   navToBack(){
//    this.location.back()
//   }
// }
import { Location } from '@angular/common';
import { Component, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { JobDetailsService } from '../job-details.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDetailsService } from '../user-details.service';
import { azureApi } from '../../constents/apis';
@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  date = new Date();
  userId = localStorage.getItem('providerId');
  private apiUrl=azureApi;
  defaultMonth = this.date.toLocaleDateString('default', { month: 'long' });
  daySelected: any = String(this.date.getDate()).padStart(2, '0');
  monthSelected: any = this.defaultMonth.substring(0, 3);
  dateSelected: any = this.date.getDate();
  yearSelected: any;
  isChecked: boolean = false;
  working: boolean = false;
  extendServices: boolean = false;
  fullDate: any;
  selectedItem: any;
  services: any[] = [];
  nextFourDays: any[] = [];
  nextDaysOfIndex: any = [];
  timeSelected: any;
  dialogRef!: MatDialogRef<any>;

  selectedService: string = '';

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private el: ElementRef,
    private http: HttpClient,
    public dialog: MatDialog,
    private jobDetailsService: JobDetailsService,
    private userService: UserDetailsService
  ) {}

  extend() {
    this.extendServices = !this.extendServices;
  }

  openServiceDialog(): void {
    this.dialogRef = this.dialog.open(this.dialogTemplate);

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.services = result;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.dialogRef.close(this.services);
  }

  ngOnInit(): void {
    this.getDetails();
    this.getNextFourDays();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.daySelected = days[this.date.getDay()];
    this.getSelectedService();
   
  }

  timing: any[] = [
    { time: '07:00AM - 10:00AM', isSelected: false },
    { time: '10:00AM - 01:00PM', isSelected: false },
    { time: '01:00PM - 04:00PM', isSelected: false },
    { time: '04:00PM - 07:00PM', isSelected: false }
  ];

  getSelectedService() {
    this.userService.getWork(localStorage.getItem('providerId')).subscribe(
      (response) => {
        console.log(response);
        this.services = response[0].works;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  availabilityService(serviceName: string) {
    this.selectedService = serviceName;
    this.showAvailabilityForService(serviceName);
  }

  getNextFourDays() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();

    for (let i = 0; i < 10; i++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + i);
      const formattedDate = this.formatDate(currentDay);
      this.nextFourDays.push({
        date: formattedDate,
        day: days[currentDay.getDay()],
        workingStaus: false,
        timming: this.timing.map(t => ({ ...t }))  // Clone the timing array for each date
      });
    }
    this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const month = date.toLocaleDateString('default', { month: 'long' });

    return `${day}-${month}-${year}`;
  }

  selectedIndex: number = 0;

  selected(item: any, index: any) {
    console.log(item);
    this.isChecked = false;
    if (item.workingStaus) {
      this.working = true;
    } else {
      this.working = false;
    }
    this.selectedIndex = index;
    this.dateSelected = item.date.toString().split('-')[0];
    this.daySelected = item.day;
    this.monthSelected = item.date.toString().split('-')[1];
    this.yearSelected = item.date.toString().split('-')[2];
    this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
    console.log(this.nextDaysOfIndex);
    console.log(this.monthSelected);

    // Clear previous selection for the new date
    this.timing.forEach(t => t.isSelected = false);
  }

  workingChange() {
    this.nextFourDays[this.selectedIndex].workingStaus = !this.nextFourDays[this.selectedIndex].workingStaus;
  }

  onToggleChange(event: MatSlideToggleChange, item: any) {
    this.nextDaysOfIndex.timming.forEach((timeSlot: { time: any; isSelected: boolean; }) => {
      if (timeSlot.time === item.time) {
        timeSlot.isSelected = event.checked;
      }
    });

    // Update the timeSelected based on the user's choice
    this.timeSelected = event.checked ? item.time : '';

    console.log(this.dateSelected);

    const currentDate = new Date(`${this.monthSelected} ${this.dateSelected} ${this.yearSelected}`);
    currentDate.setDate(this.dateSelected);

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Adjust month to be 1-based

    // Add leading zeros if needed
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    const year = this.yearSelected;
    this.fullDate = `${year}-${formattedMonth}-${formattedDay}`;
    console.log(formattedMonth);
  }

  submitAllData() {
    console.log(this.checkDuplicate(this.fullDate, this.timeSelected, this.selectedService));
    if (this.checkDuplicate(this.fullDate, this.timeSelected, this.selectedService)) {
      alert('The same time slot on the selected date for the selected service is already taken.');
    } else {
      this.sendingData();
    }
  }

  api = '';
  sendingData() {
    if (this.timeSelected != "") {
      // this.api = 'https://api.coolieno1.in/v1.0/providers/provider-date';
      this.api=`${this.apiUrl}providers/provider-date`
    } else {
      // this.api = 'https://api.coolieno1.in/v1.0/providers/provider-date/delete';
      this.api = `${this.apiUrl}providers/provider-date/delete`
    }

    const requestBody = {
      providerId: this.userId,
      service: this.selectedService,
      date: this.fullDate,
      availability: this.working,
      time: this.timeSelected
    };
    console.log(requestBody);
    console.log(this.api);
    this.http.post(this.api, requestBody).subscribe(
      response => {
        console.log(response);
        alert("Availability added successfully");
        this.timing.forEach(i => i.isSelected = false);
        console.log(this.timing);
        this.getDetails();
      },
      error => {
        console.log(error);
        alert("Something went wrong");
      }
    );
  }

  availabilityResponse: any[] = [];
  getDetails() {
    // const api = `https://api.coolieno1.in/v1.0/providers/provider-date/${this.userId}`;
    const api=`${this.apiUrl}providers/provider-date/${this.userId}`
    this.http.get<any>(api).subscribe(
      response => {
        console.log(response);
        this.availabilityResponse = response;
        this.showAvailability(this.availabilityResponse);
      },
      error => {
        console.log(error);
      }
    );
  }

  deleteData() {}

  showAvailability(response: any) {
    console.log(this.services);

    response.forEach((element: any) => {
      const dayString = element.date;
      const onlyDate = new Date(dayString);
      const day = onlyDate.getDate();
      const month = onlyDate.toLocaleDateString('default', { month: 'long' });
      const formattedDate = `${String(day).padStart(2, '0')}-${month}-${onlyDate.getFullYear()}`;

      this.nextFourDays.forEach((item: { date: string; workingStaus: boolean; timming: any[]; }) => {
        if (item.date === formattedDate) {
          item.workingStaus = element.work;
          item.timming.forEach(t => {
            if (t.time === element.time) {
              t.isSelected = true;
            }
          });
        }
      });
    });

    console.log(this.nextFourDays);
  }

  checkDuplicate(date: string, time: string, service: string): boolean {
    return this.availabilityResponse.some(item =>
      item.date === date && item.time === time && item.service === service
    );
  }

  navToBack() {
    this.location.back();
  }
  showAvailabilityForService(serviceName: string) {
   
        console.log("new called");
        this.nextFourDays.forEach(day => {
          day.workingStaus = false;
          day.timming.forEach((time: any) => {
            time.isSelected = false;
          });
        });
      
        // Set availability based on the selected service
        console.log(this.availabilityResponse);
        this.availabilityResponse.forEach((element: any) => {
          if (element.service === serviceName) {
            const dayString = element.date;
            const onlyDate = new Date(dayString);
            const day = onlyDate.getDate();
            const month = onlyDate.toLocaleDateString('default', { month: 'long' });
            const formattedDate = `${String(day).padStart(2, '0')}-${month}-${onlyDate.getFullYear()}`;
      
            this.nextFourDays.forEach((item: { date: string; workingStaus: boolean; timming: any }) => {
              if (formattedDate === item.date) {
                item.workingStaus = true;
                item.timming.forEach((time: any) => {
                  if (time.time === element.time) {
                    time.isSelected = true;
                  }
                });
              }
            });
          }
        });
      }
}
