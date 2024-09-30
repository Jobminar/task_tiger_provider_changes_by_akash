// import { Component } from '@angular/core';
// import { LoginServiceService } from '../login-service.service';
// import { Router } from '@angular/router';
// import { JobDetailsService } from '../job-details.service';

// @Component({
//   selector: 'app-select-account',
//   templateUrl: './select-account.component.html',
//   styleUrl: './select-account.component.css'
// })
// export class SelectAccountComponent {
//   alreadyHasAccount:boolean=false;
//   newIsChecked:boolean=false;

//   constructor(private loginService:LoginServiceService,
//                private router:Router,
//               private jobDetailsService:JobDetailsService){
//                 const id=localStorage.getItem('providerId');
//                 console.log(id);
//                 this.jobDetailsService.getUserDetails(id);
//   }
//   toggleDisplay(){
//     console.log(this.alreadyHasAccount);
//     // setTimeout(()=>{
//     //   this.router.navigate(['log-in']);
//     // },1000)
    
//     // if (!this.alreadyHasAccount) {
//       this.loginService.alreadyHasAccount=true;
//       console.log(localStorage.getItem('providerId'));
//       if (localStorage.getItem('providerId')) {
//           // const id=localStorage.getItem('providerId');
//           // console.log(id);
//           // this.jobDetailsService.getUserDetails(id);
//           console.log("in select account",this.jobDetailsService.userDetails);
//         if (!this.jobDetailsService.userDetails) {
//             setTimeout(()=>{
//               this.router.navigate(['aboutUser']);
//             },1000)
           
//           }
//           else{
//             setTimeout(()=>{
//               this.router.navigate(['home']);
//             },1000)
           
//           }
       
//       }
//       else{
//         setTimeout(()=>{
//           this.router.navigate(['log-in']);
//         },1000)
       
//       }
      
//       this.loginService.setLogInApi();
      
//     // }
//   }
//   newToggleDisplay(){
//     this.newIsChecked = !this.newIsChecked;
//     // console.log(this.newIsChecked);
    
  
//     if (this.newIsChecked) {
//       this.loginService.setSignUpApi();
//       setTimeout(()=>{
//         this.router.navigate(['log-in']);
//       },1000)
//     }
//   }
//   isActive: boolean = false;
//   isDragging: boolean = false;
//   startX: number = 0;
  
//   onTouchStart(event: TouchEvent): void {
//     this.startX = event.touches[0].clientX;
//     this.isDragging = true;
//   }
  
//   onTouchMove(event: TouchEvent,accType:string): void {
//     if (this.isDragging) {
//       const moveX = event.touches[0].clientX - this.startX;
  
//       // Check if the user has moved the slider far enough to toggle its state
//       if (moveX > 50 && !this.isActive) {
//         this.isActive = true;
//         this.isDragging = false; // Stop further dragging
//        // Call success action after sliding
//       } else if (moveX < -50 && this.isActive) {
//         this.isActive = false;
//         this.isDragging = false; // Stop further dragging
        
//         if (accType==='new') {
//           this.setNewAccount(); // Call success action after sliding
//         }
//         if (accType==='existing') {
          
//         }
//       }
//     }
//   }
  
//   onTouchEnd(): void {
//     this.isDragging = false;
//   }
  
//   setNewAccount(): void {
//     this.loginService.setSignUpApi();
//     setTimeout(() => {
//       this.router.navigate(['log-in']);
//     }, 1000);
//   }
  
  
// }

import { Component } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';
import { JobDetailsService } from '../job-details.service';

@Component({
  selector: 'app-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['./select-account.component.css']
})
export class SelectAccountComponent {
  isExistingActive: boolean = false;
  isNewActive: boolean = false;
  startX: number = 0;
  isDragging: boolean = false;

  constructor(
    private loginService: LoginServiceService,
    private router: Router,
    private jobDetailsService: JobDetailsService
  ) {
    const id = localStorage.getItem('providerId');
    this.jobDetailsService.getUserDetails(id);
  }

  onTouchStart(event: TouchEvent, type: string): void {
    this.startX = event.touches[0].clientX;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent, type: string): void {
    if (this.isDragging) {
      const moveX = event.touches[0].clientX - this.startX;

      if (type === 'existing') {
        this.handleSlide(moveX, 'existing');
      } else if (type === 'new') {
        this.handleSlide(moveX, 'new');
      }
    }
  }

  onTouchEnd(type: string): void {
    this.isDragging = false;
  }

  onMouseDown(event: MouseEvent, type: string): void {
    this.startX = event.clientX;
    this.isDragging = true;
  }

  onMouseMove(event: MouseEvent, type: string): void {
    if (this.isDragging) {
      const moveX = event.clientX - this.startX;

      if (type === 'existing') {
        this.handleSlide(moveX, 'existing');
      } else if (type === 'new') {
        this.handleSlide(moveX, 'new');
      }
    }
  }

  onMouseUp(type: string): void {
    this.isDragging = false;
  }

  handleSlide(moveX: number, type: string): void {
    if (type === 'existing') {
      if (moveX > 50 && !this.isExistingActive) {
        this.isExistingActive = true;
        this.onToggleChange('existing');
        this.isDragging = false; // Stop further dragging
      } else if (moveX < -50 && this.isExistingActive) {
        this.isExistingActive = false;
        this.isDragging = false; // Stop further dragging
      }
    } else if (type === 'new') {
      if (moveX > 50 && !this.isNewActive) {
        this.isNewActive = true;
        this.onToggleChange('new');
        this.isDragging = false; // Stop further dragging
      } else if (moveX < -50 && this.isNewActive) {
        this.isNewActive = false;
        this.isDragging = false; // Stop further dragging
      }
    }
  }

  onToggleChange(accountType: string): void {
    if (accountType === 'existing') {
      this.loginService.setLogInApi();
      this.navigateBasedOnAccount();
    } else if (accountType === 'new') {
      this.loginService.setSignUpApi();
      setTimeout(() => {
        this.router.navigate(['log-in']);
      }, 1000);
    }
  }

  navigateBasedOnAccount(): void {
    if (localStorage.getItem('providerId')) {
      if (!this.jobDetailsService.userDetails) {
        setTimeout(() => {
          this.router.navigate(['aboutUser']);
        }, 1000);
      } else {
        setTimeout(() => {
          this.router.navigate(['home']);
        }, 1000);
      }
    } else {
      setTimeout(() => {
        this.router.navigate(['log-in']);
      }, 1000);
    }
  }
}
