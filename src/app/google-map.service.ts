import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { azureApi } from '../constents/apis';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  private apiUrl=azureApi;
  map: any;
  directionsService: any;
  directionsRenderer: any;
  mapStatus: boolean = false;
  providerMarker: any;
  currentLocation$ = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);
  constructor( private http:HttpClient) {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
   }

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
  // get place from coordinates
  getPlaceNameFromCoordinates(lat: number, lng: number): Observable<any> {
    const geocodingApiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCJQHv3pYfnPd6F3ju1DXZ7jm46PJbncuk`;
    return this.http.get(geocodingApiUrl);
  }

  // initializeMap(coordinates: [number, number], mapElement: HTMLElement): void {
  //   this.map = new google.maps.Map(mapElement, {
  //     center: { lat: coordinates[1], lng: coordinates[0] },
  //     zoom: 15,
  //   });
  //   this.mapStatus = true;
  // }

  addDestinationMarker(coordinates: [number, number]): void {
    new google.maps.Marker({
      position: { lat: coordinates[1], lng: coordinates[0] },
      map: this.map,
      title: 'Destination',
    });
  }

  // getCoordinates(): Observable<google.maps.LatLngLiteral | null> {
  //   const currentLocation$ = new BehaviorSubject<google.maps.LatLngLiteral | null>(null);

  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const location = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude
  //       };
  //       currentLocation$.next(location);
  //     },
  //     (error) => {
  //       console.log('Geolocation error:', error);
  //     }
  //   );

  //   return currentLocation$.asObservable();
  // }

  // Initialize map with provider's initial location
  initializeMap(coordinates: google.maps.LatLngLiteral, mapElement: HTMLElement): void {
    this.map = new google.maps.Map(mapElement, {
      center: { lat: coordinates.lat, lng: coordinates.lng },
      zoom: 15,
    });
  }

  // Add marker for provider's current location
  addProviderMarker(coordinates: google.maps.LatLngLiteral): void {
    this.providerMarker = new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: 'Provider Location',
    });
  }

  // Add marker for user's location (fixed)
  addUserMarker(coordinates: google.maps.LatLngLiteral): void {
    new google.maps.Marker({
      position: coordinates,
      map: this.map,
      title: 'User Location',
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png' // Red marker for user
    });
    this.directionsRenderer.setMap(this.map);
  }

  // Update provider's marker as they move
  updateProviderMarker(coordinates: google.maps.LatLngLiteral): void {
    if (this.providerMarker) {
      this.providerMarker.setPosition(coordinates);
    }
  }


    // Add this method to display directions
    showDirections(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }): void {
      if (!origin || !destination) {
        console.error('Invalid origin or destination for directions.');
        return;
      }
  
      const request = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.DRIVING,
      };
  
      this.directionsService.route(request, (result: any, status: string) => {
        if (status === 'OK') {
          this.directionsRenderer.setDirections(result);
        } else {
          console.error('Error fetching directions:', status);
        }
      });
    }

  // Track provider's real-time movement
  trackProviderLocation(): Observable<google.maps.LatLngLiteral> {
    const providerLocation$ = new BehaviorSubject<google.maps.LatLngLiteral>(null!);

    navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        providerLocation$.next(location);
      },
      (error) => {
        console.log('Tracking error:', error);
      }
    );

    return providerLocation$.asObservable();
  }

  // Calculate the distance between two locations (Haversine formula)
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371e3; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  }

  setDefult(){
    
  }
}

