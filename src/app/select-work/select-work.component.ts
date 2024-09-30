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

  onInputChange(event: Event) {
    console.log(this.searchQuery);
    const filterItem = this.jobDetails.items.filter((item: { names: string }) =>
      item.names.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    console.log(filterItem);
    this.items = filterItem;
  }

  ngOnInit(): void {
    this.previousUrl = this.routeTrackingService.getPreviousUrl();
    console.log('Previous URL:', this.previousUrl);
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
  items = this.jobDetails.items;

  send() {
    // console.log(this.items.filter(item=>item.checked)
      const checkedItems = this.items.filter(
        (item: { checked: boolean }) => item.checked === true
      );
      console.log(checkedItems);
      // console.log(this.jobDetails.userDetails.providerName);
      if ( this.jobDetails.userDetails  && this.jobDetails.userDetails.providerName != undefined)
      {
        const work=this.logInservice.workDetails.flat()
        this.UpdatingUserWork(work);
      } 
      else{
        if (checkedItems.length < 1) {
          alert('please select any one service');
        } else {
          this.logInservice.sendWorkDetails().subscribe(
            (response)=>{
              console.log(response);
              this.dialogeService.openDialog("Service has been added");
              this.router.navigate(['aboutUser']);
            },(err)=>{
              console.log(err);
            }
          )
         
        }
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
