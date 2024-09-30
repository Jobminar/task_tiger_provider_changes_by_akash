// import { Component } from '@angular/core';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

// @Component({
//   selector: 'app-fotter',
//   templateUrl: './fotter.component.html',
//   styleUrl: './fotter.component.css'
// })
// export class FotterComponent {
//   // activeIcon: any='home'// Default active icon

//   // changeColor(icon: string,item:string) {
//   //   this.activeIcon = icon;
//   //   this.router.navigate([item])
//   // }

 
//   // constructor(private router:Router,)
//   // {
   
//   // }

//   activeIcon: string = 'home'; // Default active icon

//   constructor(private router: Router) {}

//   ngOnInit() {
//     // Listen for route changes
//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         this.setActiveIcon(event.urlAfterRedirects);
//       }
//     });

//     // Set the initial active icon based on the current route
//     this.setActiveIcon(this.router.url);
//   }

//   changeColor(icon: string, item: string) {
//     this.activeIcon = icon;
//     this.router.navigate([item]);
//   }

//   setActiveIcon(url: string) {
//     if (url.includes('home')) {
//       this.activeIcon = 'home';
//     } else if (url.includes('ongoing')) {
//       this.activeIcon = 'Services';
//     } else if (url.includes('earnings')) {
//       this.activeIcon = 'Activity';
//     } else if (url.includes('target')) {
//       this.activeIcon = 'Account';
//     }
//   }
// }


import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-fotter',
  templateUrl: './fotter.component.html',
  styleUrls: ['./fotter.component.css']
})
export class FotterComponent {
  activeIcon: string = 'home'; // Default active icon

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen for route changes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveIcon(event.urlAfterRedirects);
      }
    });

    // Set the initial active icon based on the current route
    this.setActiveIcon(this.router.url);
  }

  changeColor(icon: string, item: string) {
    this.activeIcon = icon;
    this.router.navigate([item]);
  }

  setActiveIcon(url: string) {
    if (url.includes('home')) {
      this.activeIcon = 'home';
    } else if (url.includes('ongoing')) {
      this.activeIcon = 'Services';
    } else if (url.includes('earnings')) {
      this.activeIcon = 'Activity';
    } else if (url.includes('target')) {
      this.activeIcon = 'Account';
    }
  }
}

