import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { UserDetailsService } from '../user-details.service';
import { DailogeBoxService } from '../dailoge-box.service';
import { Location } from '@angular/common';
import { azureApi } from '../../constents/apis';
import { catchError, forkJoin, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
@Component({ 
  selector: 'app-sub-services',
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent implements OnInit{
  workSeleceted:any[]=[];
last: any;
selectedIndex:number=0;
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
    this.items=[];
    const catIds=this.loginService.workId;
    console.log(catIds);
    this.loginService.getSubCategories(catIds).subscribe({
     next: (response)=>{
        console.log(response);
        this.items=response.filter((response) => response !== null);
        // Assuming 'response' is the array of arrays like [array(34), array(12), array(24)]
        this.items = this.items.map((subArray:any) =>
          subArray.filter((item:any, index:any, self:any) =>
            index === self.findIndex((t:any) => _.isEqual(t, item))
          )
        );
        console.log(this.items);
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
          this.initializeSelectedIndex();
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
  
  selectAll(event:Event,item:any){
    
    const checked = event.target as HTMLInputElement;
    let catId:any[]=[];
    let subCatId:any[]=[];
    if(checked.checked){
      item.map((i:any)=>{
        this.logInService.setSubCat(i._id,i.categoryId);
        i.checked=true;
      })
    }

    if(!checked.checked){
      this.logInService.selectedSubCategories=[];
    this.logInService.catIdForServices=[];
      item.map((i:any)=>{
       
        i.checked=false;
      })
    }
  }
  // selectVariant(index: number): void {
  //   // this.filteredVarients = [];
  //   // console.log(index, 'index ');
  //   // this.servicesService.selectedUiVarientIndex = index;
  //   this.selectedIndex = index;

  //   const selectedVariantName = this.services[this.selectedCat].uiVariant[this.selectedIndex];
  //   console.log('uivareint name', selectedVariantName);
  //   this.nameOfUiVarientSelected = selectedVariantName;
  //   console.log("sub category at filtering the services by varients",this.subCategory);
  //   // console.log(this.nameOfUiVarientSelected, 'name');
  //   if (selectedVariantName != 'None') {
  //     const filteredVariants = this.subCategory.filter(
  //       (item: any) =>
  //         item.variantName?.toLowerCase() === selectedVariantName?.toLowerCase()
  //     );
  //     this.filteredSubCat = filteredVariants;
  //   } else {
  //     this.filteredSubCat = this.subCategory;
  //   }
   
  //   console.log('sub category after filtering ui vaeints', this.filteredSubCat);
    
  //   this.selectSubCategory(0);
  // }

  initializeSelectedIndex() {
    for (const cat of this.allCatDetails) {
      // Set default index to 0 for each category
      this.selectedIndexMap[cat._id] = 0;
  
      // Set default UI variant as the first one (index 0) for each category
      if (cat.uiVariant.length > 0) {
        this.selectedUiMap[cat._id] = cat.uiVariant[0]; // Default to the first variant
      }
    }
  }
  selectedUiMap: { [key: string]: string } = {};
  selectedIndexMap: { [key: string]: number } = {};
  selectVariant(index: number, item: any, categoryId: string) {
    // this.selectedIndex=index;
    this.selectedIndexMap[categoryId] = index; 
    this.selectedUiMap[categoryId] = item; // Associate selected variant with the specific category/service
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
    this.logInService.setSubCat(item._id,item.categoryId);
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
       
        this.logInService.setSubCat(item._id,item.categoryId);
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
      if(!isChecked){
       console.log(item.categoryId,item);
        this.logInService.selectedSubCategories=this.logInService.selectedSubCategories.filter(id=>id !== item._id);
        // this.logInService.catIdForServices= this.logInService.catIdForServices.filter(id => id !== item.categoryId);
        item.checked=false;
        console.log(this.logInService.selectedSubCategories);
        console.log(this.logInService.catIdForServices);
       
      }
    }
  }
  navToBack(){
    this.location.back();
  }

}
