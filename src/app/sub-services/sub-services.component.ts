import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../user-details.service';
import { DailogeBoxService } from '../dailoge-box.service';
import { Location } from '@angular/common';
import { azureApi } from '../../constents/apis';
import { catchError, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent implements OnInit{
  workSeleceted:any[]=[];
last: any;
  constructor(private loginService:LoginServiceService,
              private logInService:LoginServiceService,
              private router:Router,
              private http:HttpClient,
              private readonly location:Location,
              private readonly dailougeService:DailogeBoxService,
            private userDetailsService:UserDetailsService){
    

    // this.router.navigate(['aboutWork']);
  }

  ngOnInit(): void {
    this.getSubServices();
     
  }

  // getting subServices
  getSubServices(){
    const catIds=this.loginService.workId;
    this.loginService.getSubCategories(catIds).subscribe({
     next: (response)=>{
        console.log(response);
        this.items=response.filter((response) => response !== null);
        this.getWork();
        this.getDetailsOfCat()
      },error:(err)=>{
        console.log(err);
      }
  })
  }

  allCatDetails:any[]=[];
  getDetailsOfCat() {
    const catIds = this.loginService.workId;
    const requests = catIds.map((id) => {
      const api = `${azureApi}core/categories/${id}`;
      return this.http.get<any>(api).pipe(
        catchError((error) => {
          console.error(`Failed to fetch data for category ID ${id}:`, error);
          return of(null); // Return `null` or an empty object to continue the sequence
        })
      );
    });
  
    // Use forkJoin to execute all requests in parallel and combine their results
    forkJoin(requests).subscribe(
      (results) => {
        console.log('All categories data:', results);
  
  this.allCatDetails=results.filter( (res) => res!==null);
  this.loginService.workId=[];
        // You can perform further logic here if needed, like updating your component state
      },
      (error) => {
        console.error('Error fetching categories data:', error);
      }
    );
  }
  

  // Use forkJoin to execute all requests in parallel and combine their results
   
  
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
  autoCheckServices() {
    // Loop through the selected work
    this.workSeleceted.forEach(work => {
      // Find the items that match the categoryId from work in the items array
      const matchedSubcategories = this.items.filter((item: any) => item.categoryId === work.categoryId._id);
      
      if (matchedSubcategories.length > 0 ) {
        // Since work.subcategoryId is an object, not an array, we can check it directly
        const subcategory = work.subcategoryId;
        
        // For each matched subcategory, set checked if it matches the subcategoryId
        matchedSubcategories.forEach((subItem: any) => {
          if (subItem._id === subcategory._id) {
            subItem.checked = true;  // Set the subcategory as checked
            console.log(`Checked subcategory: ${subItem.name}`);
          }
        });
      }
    });
  }
  
  
  send(){
    // this.logInService.setWorkDetails();
    if (this.logInService.selectedSubCategories.length>0) {
      // this.router.navigate(['aboutWork']);
      this.router.navigate(['services']);
    } else {
      this.dailougeService.openDialog("Please select atleat one sub-category ");
     
    }
    
  }
  slect(item:any){
    const indexOfChecked = this.items.indexOf(item);
    console.log("categoryId",item._);
    this.logInService.setSubCat(item._id);
    if (this.logInService.selectedSubCategories.length>0) {
      // this.router.navigate(['aboutWork']);
      this.router.navigate(['services']);
    } else {
      this.dailougeService.openDialog("Please select atleat one sub-category ");
    }
  }
  items:any=[]
  onChange(event: any, item: any){
    const target = event.target as HTMLInputElement;
    console.log(item);
    if (target) {
      const isChecked = target.checked;
      if (isChecked) {
        const indexOfChecked = this.items.indexOf(item);
        // this.jobDetails.items[indexOfChecked].checked = true;
        // console.log('Item checked:', this.items.indexOf(item));
        // console.log('Item checked:', item.names);
        // console.log('Item checked:', item);
      
        console.log("categoryId",item._);
        this.logInService.setWork(item,item.categoryId)
        this.logInService.setSubCat(item._id);
        if (this.logInService.selectedSubCategories.length>0) {
          // this.router.navigate(['aboutWork']);
          // this.router.navigate(['services']);
        } else {
          this.dailougeService.openDialog("Please select atleat one sub-category ");
        }
        // this.logInservice.categoryId=item.id
        // this.logInservice.setWork(item.names,item.id);
        // this.router.navigate(['subServices']);
        // Perform additional actions related to the checked item
      }
    }
  }
  navToBack(){
    this.location.back();
  }
}
