import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { azureApi } from '../constents/apis';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  private apiUrl=azureApi;
  currentLocation$ = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
  constructor( private http:HttpClient) { }

  public onlineStatus: boolean = false;

  // setting online status
  setonlineStatus(status: boolean, text: string): void {
    this.onlineStatus = status;
    localStorage.setItem('onlineStatus', status.toString());  // Store boolean as string
    localStorage.setItem('onlineText', text);  // Store text
  }

  getonlineStatus(): { status: boolean; text: string } {
    const storedOnlineStatus = localStorage.getItem('onlineStatus');
    const storedOnlineText = localStorage.getItem('onlineText');

    return {
      status: storedOnlineStatus === 'true',  
      text: storedOnlineText || 'Go'  
    };
  }
  getCoordinates(): Observable<google.maps.LatLngLiteral | null>{

    navigator.geolocation.getCurrentPosition(
      (position)=>{
        const location={
          lat:position.coords.latitude,
          lng:position.coords.longitude
        }
        this.currentLocation$.next(location);
      },
      (error)=>{
        console.log(error);
      }
    )
    return this.currentLocation$.asObservable();
  }

  sendCordinates(location:any):Observable<any>{
    const api= this.apiUrl+'providers/provider-cordinates';
    const userID=localStorage.getItem('providerId');
    console.log(location);
    const requestBody={
      providerId:userID,
      longitude:location.location.lng,
      latitude:location.location.lat
    }
    // alert(requestBody.latitude);
    console.log(requestBody);
    return this.http.post(api,requestBody)
  }
  getCoordinatesFromPlaceName(placeName: string): Observable<any> {
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=AIzaSyCJQHv3pYfnPd6F3ju1DXZ7jm46PJbncuk`;
    return this.http.get(geocodingApiUrl);
  }
}

