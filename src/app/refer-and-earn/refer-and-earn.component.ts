import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-refer-and-earn',
  templateUrl: './refer-and-earn.component.html',
  styleUrl: './refer-and-earn.component.css'
})
export class ReferAndEarnComponent {

  navToBack(){
    this.location.back();
  }

  constructor(private location:Location)
  {

  }
}
