import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-helps',
  templateUrl: './helps.component.html',
  styleUrl: './helps.component.css'
})
export class HelpsComponent {
  navToBack(){
    this.location.back();
  }

  constructor(private location:Location)
  {

  }
}
