import { Component } from '@angular/core';
import { UserDetailsService } from '../user-details.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrl: './packages.component.css'
})
export class PackagesComponent {
  navToBack(){
    this.location.back();
  }
  isEnrolled: boolean=true;
  packages:any=[
    // {
    //   name:'silver',
    //   image:'assets/packages/silver coin 1.png',
    //   works:'Get 30 extra works',
    //   bonus:'Get 10% bonus'
    // },
    // {
    //   name:'Gold',
    //   image:'assets/packages/gold coin.png',
    //    works:'Get 50 extra works',
    //   bonus:'Get 20% bonus'
    // },{
    //   name:'Diamond',
    //   image:'assets/packages/diamond.png',
    //    works:'Get 50 extra works',
    //   bonus:'Get 20% bonus'
    // }
   
  ]
  constructor(private userDetails:UserDetailsService,private location:Location){
    this.getPackage()
  }
  getPackage(){
    this.userDetails.getPackages().subscribe(
      (response)=>{
        console.log(response);
        this.packages=response
      },
      (error)=>{
        console.log(error);
      }
    )
  }
}
