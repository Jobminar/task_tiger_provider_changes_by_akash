import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pancard',
  templateUrl: './pancard.component.html',
  styleUrl: './pancard.component.css'
})
export class PancardComponent {

  constructor(private router:Router)
  {

  }
  skip(){
    this.router.navigate(['bankDetails'])
  }
  submit(){
    this.router.navigate(['bankDetails'])
  }
}
