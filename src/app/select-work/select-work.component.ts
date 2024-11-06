import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../login-service.service';
import { JobDetailsService } from '../job-details.service';
import { RouteTrackingService } from '../route-tracking.service';
import { UserDetailsService } from '../user-details.service';
import { DailogeBoxService } from '../dailoge-box.service';

@Component({
  selector: 'app-select-work',
  templateUrl: './select-work.component.html',
  styleUrl: './select-work.component.css',
})
export class SelectWorkComponent implements OnInit{
  
  searchQuery: string = '';
  previousUrl: string | undefined;
  workSeleceted:any[]=[];
  items :any[]=[];

  ngOnInit(): void {
    this.previousUrl = this.routeTrackingService.getPreviousUrl();
    this.items=this.jobDetails.items;
    this.getWork();
    console.log(this.items);
  }
  constructor(
    private router: Router,
    private logInservice: LoginServiceService,
    private jobDetails: JobDetailsService,
    private routeTrackingService: RouteTrackingService,
    private userDetailsService:UserDetailsService,
    private readonly dialogeService:DailogeBoxService
  ) {

  }

// searching work  
  onInputChange(event: Event) {
    console.log(this.searchQuery);
    const filterItem = this.jobDetails.items.filter((item: { names: string }) =>
      item.names.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(filterItem);
    this.items = filterItem;
  }

  // getting selected services
  getWork(){
    this.userDetailsService.getWork(localStorage.getItem('providerId')).subscribe(
      (response)=>{
          console.log(response);
        //  console.log(response[0].works);
        
         this.workSeleceted=response.works;
         this.autoCheckServices();
      },(err)=>{
        console.log(err);
      }
    )
  }


  public onChange(event: Event, item: any): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        const indexOfChecked = this.items.indexOf(item);
        this.jobDetails.items[indexOfChecked].checked = true;
        console.log('Item checked:', this.items.indexOf(item));
        console.log('Item checked:', item.names);
      
        console.log("categoryId",item.id);
        this.logInservice.categoryId=item.id
        this.logInservice.setWork(item.names,item.id);
        this.router.navigate(['subServices']);
        // Perform additional actions related to the checked item
      }
    }
  }

  selectedCat(item:any){
    console.log("clciked");
    const indexOfChecked = this.items.indexOf(item);
    this.jobDetails.items[indexOfChecked].checked = true;
    console.log('Item checked:', this.items.indexOf(item));
    console.log('Item checked:', item.names);
  
    console.log("categoryId",item.id);
    this.logInservice.categoryId=item.id
    this.logInservice.setWork(item.names,item.id);
    this.router.navigate(['subServices']);
  }

 
  autoCheckServices() {
    // Loop through the selected work and match it with available items
    // console.log(this.items);
    this.workSeleceted.forEach(work => {
      // Find a matching item based on categoryId
      const matchedItem = this.items.find((item :any)=> item.names === work.categoryId.name);
      console.log(matchedItem);
      if (matchedItem ) {
        // Loop through the subcategories in the work data
        // console.log(matchedItem);
        // console.log(work);
        if (matchedItem ) {
          matchedItem .checked = true;  // Set the subcategory as checked
        }
     
      }
    });
  }
  
  send() {
    // console.log(this.items.filter(item=>item.checked)
      // const checkedItems = this.items.filter(
      //   (item: { checked: boolean }) => item.checked === true
      // );
      // console.log(checkedItems);
      // console.log(this.jobDetails.userDetails.providerName);
      // if ( this.jobDetails.userDetails  && this.jobDetails.userDetails.providerName != undefined)
      // {
      //   const work=this.logInservice.workDetails.flat()
      //   this.UpdatingUserWork(work);
      //   console.log(this.jobDetails.userDetails.providerName);
      // }
      // this.router.navigate(['manageServices']);
      if(this.jobDetails?.userDetails?.providerName && this.jobDetails.userDetails?.providerName!==undefined){
        this.router.navigate(['manageServices']);
      }else{
        this.router.navigate(['aboutUser']);
      }
  }

  workForSending:any[]=[];
  UpdatingUserWork(workItems:any){
    console.log(workItems);
    // const formData=new FormData();
    // formData.append('work', workItems);
    // console.log(this.jobDetails.responseId);
    const workId=this.userDetailsService.workResponseId
    console.log("work before",this.userDetailsService.workResponse);
    console.log("id before",workId);
   this.workForSending.push(this.userDetailsService.workResponse)
   this.workForSending.push(workItems)
   console.log(this.workForSending.flat());
    this.logInservice.updateUserWork(this.workForSending.flat(),workId);

    
  }



}
