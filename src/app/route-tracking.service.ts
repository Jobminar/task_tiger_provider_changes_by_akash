import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, pairwise } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteTrackingService {

  private previousUrl: string | undefined;
  private currentUrl: string | undefined;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe((events: any[]) => {
        this.previousUrl = events[0].url;
        this.currentUrl = events[1].url;
      });
  }

  public getPreviousUrl(): string | undefined {
    return this.previousUrl;
  }
}
