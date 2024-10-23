import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../user-details.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-services',
  templateUrl: './manage-services.component.html',
  styleUrl: './manage-services.component.css'
})
export class ManageServicesComponent implements OnInit{

  works:any[]=[];
  constructor (private readonly location:Location,
              private readonly userDetailsService:UserDetailsService,
              private readonly router:Router
  ){

  }

  ngOnInit(): void {
      this.getWork();
  }

  getWork() {
    this.userDetailsService.getWork(localStorage.getItem('providerId'))
      .subscribe({
       next:(response) => {
          console.log(response);
          this.works=response.works;
        },
        error:(err) => {
          console.log(err);
        }
  });
  }

  removeSubcategory(workId: string, subcategoryId:string) {
  
    console.log(workId,'subCat', subcategoryId);
    this.userDetailsService.deleteWork(workId,subcategoryId).subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.getWork();
        },
        error:(err)=>{
          console.log(err);
        }
      }
    )
  }
  navToSelectWork(){
    this.router.navigate(['selectWork']);
  }
  navToBack(){
    console.log("back");
    this.location.back();
  }
}
