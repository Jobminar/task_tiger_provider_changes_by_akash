
import { Location } from '@angular/common';
import { Component, ElementRef, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { JobDetailsService } from '../job-details.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UserDetailsService } from '../user-details.service';
import { azureApi } from '../../constents/apis';
import { DailogeBoxService } from '../dailoge-box.service';

import { parse, format } from 'date-fns';
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
    private userService: UserDetailsService,
    private readonly dailogeBoxService:DailogeBoxService
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
    this.getSelectedService();
    this.getDetails();
    this.getNextFourDays();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.daySelected = days[this.date.getDay()];
    
   
  }

  timing: any[] = [
    { time: '07AM-10AM', isSelected: false },
    { time: '10AM-01PM', isSelected: false },
    { time: '01PM-04Pm', isSelected: false },
    { time: '04PM-07Pm', isSelected: false },
    { time: '07PM-10Pm', isSelected: false }
    // { time: '12AM', isSelected: false },
    // { time: '01PM', isSelected: false },
    // { time: '02PM', isSelected: false },
    // { time: '03PM', isSelected: false },
    // { time: '04PM', isSelected: false },
    // { time: '05PM', isSelected: false },
    // { time: '06PM', isSelected: false },
    // { time: '07PM', isSelected: false },
    // { time: '08PM', isSelected: false },
    // { time: '09PM', isSelected: false },
    // { time: '10PM', isSelected: false }
  ];

  getSelectedService() {
    this.userService.getWork(localStorage.getItem('providerId')).subscribe(
      (response) => {
        console.log(response);
  
        // Filter response.works to include only unique categories
        const uniqueCategories = response.works.reduce((acc: any[], current: any) => {
          const categoryExists = acc.find(
            (item) => item.categoryId.name === current.categoryId.name
          );
  
          if (!categoryExists) {
            acc.push(current); // Add current work only if its category is not yet added
          }
  
          return acc;
        }, []);
  
        this.services = uniqueCategories; // Assign the filtered list to services
        // console.log(this.services);
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
      const filteredTimings = (i === 0) ? this.getFutureTimings() : [...this.timing];
      this.nextFourDays.push({
        date: formattedDate,
        day: days[currentDay.getDay()],
        workingStaus: false,
        timming: filteredTimings  // Clone the timing array for each date
      });
    }
    this.nextDaysOfIndex = this.nextFourDays[this.selectedIndex];
  }

  getFutureTimings() {
    const currentHour = this.date.getHours();
  
    const currentMinute = this.date.getMinutes();
    return this.timing.filter(item => {
      const timeString = item.time;
      let hour = parseInt(timeString.slice(0, -2));  // Extract the hour part
      const isAM = timeString.includes('AM');

      // Convert to 24-hour format if PM and not 12 PM
      if (!isAM && hour < 12) hour += 12;
      if (isAM && hour === 12) hour = 0;  // Handle 12 AM as midnight

      // Filter out past hours and if hour is same as current, check minutes
      return hour > currentHour 
    });
  }
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const month = date.toLocaleDateString('default', { month: 'long' });

    return `${day}-${month}-${year}`;
  }

  selectedIndex: number = 0;

  selected(item: any, index: any) {
    if(!this.selectedService){
      this.dailogeBoxService.openDialog('select the service from the above');
     
      return;
    }
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
    // this.timing.forEach(t => t.isSelected = false);
  }

  workingChange() {
    if(!this.monthSelected || !this.dateSelected || !this.yearSelected){
      
      this.isChecked = !this.isChecked;
      this.working=false;
      this.dailogeBoxService.openDialog('please select or confirm the date');
      
      return;
    }
    this.nextFourDays[this.selectedIndex].workingStaus = !this.nextFourDays[this.selectedIndex].workingStaus;
  }

  onToggleChange(event:any, item: any) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement?.checked ?? false;
    // item.isSelected = isChecked;
    console.log(isChecked);
    this.nextDaysOfIndex.timming.forEach((timeSlot: { time: any; isSelected: boolean; }) => {
      if (timeSlot.time === item.time) {
        timeSlot.isSelected = isChecked;
      }
    });

    // Update the timeSelected based on the user's choice
    this.timeSelected = isChecked ? item.time : '';

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
      this.dailogeBoxService.openDialog('The same time slot on the selected date for the selected service is already taken.');

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

    const date = parse(this.fullDate, 'yyyy-MM-dd', new Date());

    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.error('Invalid date:', this.fullDate);
        return; // Handle the error appropriately
    }
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    console.log(formattedDate);

    const requestBody = {
      providerId: this.userId,
      service: this.selectedService,
      slotTime:{
        date: this.fullDate,
        time: this.timeSelected
      },
      
      availability: this.working,
      jobStartTime:null,
      jobEndTime:null
    };
    console.log(requestBody);
    console.log(this.api);
    this.http.post(this.api, requestBody).subscribe(
      response => {
        console.log(response);
        this.dailogeBoxService.openDialog("Availability added successfully");
       
        this.timing.forEach(i => i.isSelected = false);
        console.log(this.timing);
        this.getDetails();
      },
      (error:HttpErrorResponse) => {
        console.log(error);
        this.dailogeBoxService.openDialog(error.error.message);
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
      const dayString = element.slotTime.date;
      const onlyDate = new Date(dayString);
      const day = onlyDate.getDate();
      const month = onlyDate.toLocaleDateString('default', { month: 'long' });
      const formattedDate = `${String(day).padStart(2, '0')}-${month}-${onlyDate.getFullYear()}`;

      this.nextFourDays.forEach((item: { date: string; workingStaus: boolean; timming: any[]; }) => {
        if (item.date === formattedDate) {
          item.workingStaus = element.availability;
          item.timming.forEach(t => {
            if (t.time === element.slotTime.time) {
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
            const dayString = element.slotTime.date;
            const onlyDate = new Date(dayString);
            const day = onlyDate.getDate();
            const month = onlyDate.toLocaleDateString('default', { month: 'long' });
            const formattedDate = `${String(day).padStart(2, '0')}-${month}-${onlyDate.getFullYear()}`;
      
            this.nextFourDays.forEach((item: { date: string; workingStaus: boolean; timming: any }) => {
              if (formattedDate === item.date) {
                item.workingStaus = true;
                item.timming.forEach((time: any) => {
                  if (time.time === element.slotTime.time) {
                    time.isSelected = true;
                  }
                });
              }
            });
          }
        });
      }
}
