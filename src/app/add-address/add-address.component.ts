import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { azureApi } from '../../constents/apis';

import { Subscription } from 'rxjs';
import { isPlatformBrowser, Location } from '@angular/common';

@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrl: './add-address.component.css'
})
export class AddAddressComponent implements OnInit, AfterViewInit, OnDestroy{
  
  addressForm: FormGroup; 
  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object,
    private location:Location) 
    { 
      this.addressForm = this.fb.group({ 
        houseNo: ['', Validators.required], 
        address: ['', Validators.required],
        providerId:localStorage.getItem('providerId'), 
        landMark: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', Validators.required]
           });
  } 
  ngOnInit(): void {
    // Initialize any necessary data or subscriptions here
  }
  onSubmit() 
  { 
    if (this.addressForm.valid) 
      {
        console.log(this.addressForm.value);
        const api=`${azureApi}providers/provider-address `
         this.http.post(api, this.addressForm.value) .subscribe({
          next:(response )=> { 
            console.log('Address saved successfully', response);
            
           }, error :(err:HttpErrorResponse)=> 
            { 
              console.error('Error saving address', err);
             }
      }); 
          } 
  }

  loading = false;
  destinationInput: string = '';
  suggestions: any[] = [];
  map: any;
  userMarker: any;
  destinationMarker: any;
  addressObject:any={};
  private currentLocation: [number, number] = [0, 0];
  private autocompleteService: any;
  private geocoder: any;
  private positionWatchId: number | null = null; // Store watch position ID
  private subscriptions: Subscription = new Subscription();


  ngAfterViewInit(): void {
   
      this.initializeMap();
    
  }

  ngOnDestroy(): void {
    // Stop watching position and clean up
    if (this.positionWatchId !== null) {
      navigator.geolocation.clearWatch(this.positionWatchId);
    }
    this.subscriptions.unsubscribe();
    this.map=null;
  }

 

  private initializeMap(): void {
    this.loading = true;
    if (isPlatformBrowser(this.platformId)) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = [
            position.coords.longitude,
            position.coords.latitude,
          ];
          this.loading = false;

          // Initialize Google Maps
          // this.map = new google.maps.Map(document.getElementById('map'), {
          //   center: { lat: this.currentLocation[1], lng: this.currentLocation[0] },
          //   zoom: 12,
          // });

          // Initialize Services
          this.autocompleteService = new google.maps.places.AutocompleteService();
          this.geocoder = new google.maps.Geocoder();
          
          // Add User Marker
          this.userMarker = new google.maps.Marker({
            position: { lat: this.currentLocation[1], lng: this.currentLocation[0] },
            map: this.map,
            title: 'You are here',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' +
                encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#0000FF" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
                  </svg>`),
              scaledSize: new google.maps.Size(40, 40), // Adjust size as needed
            },
          });

          // Watch User's Position
          this.positionWatchId = navigator.geolocation.watchPosition(
            (pos) => {
              const newLocation = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              this.currentLocation = [newLocation.lng, newLocation.lat];

              if (this.userMarker) {
                this.userMarker.setPosition(newLocation);
              }
            },
            (error) => {
              this.loading = false;
              console.error('Error watching position:', error);
            }
          );

          // Add click event on map to place destination marker
          this.map.addListener('click', (event: any) => {
            this.addDestinationMarker(event.latLng);
          });
        },
        (error) => {
          this.loading = false;
          console.error('Error getting current location:', error);
        }
      );
    }
  }

  fetchSuggestions(): void {
    if (!this.destinationInput) {
      this.suggestions = [];
      return;
    }

    // Fetch suggestions from Google Places Autocomplete Service
    this.autocompleteService.getPlacePredictions(
      { input: this.destinationInput },
      (predictions: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.suggestions = predictions;
        } else {
          console.error('Error fetching suggestions:', status);
        }
      }
    );
  }

  selectSuggestion(suggestion: any): void {
    this.destinationInput = suggestion.description;
    console.log(this.destinationInput);
    this.suggestions = [];
    this.geocoder.geocode({ placeId: suggestion.place_id }, (results: any[], status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location;
     
       console.log(results[0]);
       this.formatAddressData(results[0],location.lat(), location.lng());
        this.addDestinationMarker(location);
      } else {
        console.error('Error geocoding place ID:', status);
      }
    });
  }

  private addDestinationMarker(location: any): void {
    if (this.destinationMarker) {
      this.destinationMarker.setMap(null);
    }

    // Add Destination Marker
    this.destinationMarker = new google.maps.Marker({
      position: location,
      map: this.map,
      title: this.destinationInput,
      draggable: true,
    });

    // Reverse geocoding on marker drag end
    this.destinationMarker.addListener('dragend', () => {
      const position = this.destinationMarker.getPosition();
      this.reverseGeocode(position.lat(), position.lng());
    });

    this.map.panTo(location);
  }

  private reverseGeocode(lat: number, lng: number): void {
    this.geocoder.geocode({ location: { lat, lng } }, (results: any[], status: any) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        this.destinationInput = results[0].formatted_address;
        const location = results[0].geometry.location
        this.formatAddressData(results[0],location.lat(), location.lng());
        console.log(results);
        console.log(`Full address: ${results[0].formatted_address}`);
      } else {
        console.error('No address found or error in geocoding:', status);
      }
    });
  }


  // formating the incomming address
  formatAddressData(data: any, lat: number, lng: number) {

    const formattedAddress = {
      address: '',
      city: '',
      landmark: '',
      state: '',
      pincode: '',
      appartment: '',
      lat: lat,  // Update latitude
      lng: lng,
      hno: '',
    };

    // Use reduce to populate the formattedAddress based on place_type
    for (let i = 0; i < data.address_components.length; i++) {
      const contextItem = data.address_components[i];

      // Check for relevant types and populate formattedAddress
      if (contextItem.types.includes('sublocality_level_1')) {
        formattedAddress.landmark = contextItem.long_name;
      } else if (contextItem.types.includes('locality')) {
        formattedAddress.city = contextItem.long_name;
      } else if (contextItem.types.includes('administrative_area_level_1')) {
        formattedAddress.state = contextItem.long_name;
      } else if (contextItem.types.includes('postal_code')) {
        formattedAddress.pincode = contextItem.long_name;
      } else if (
        contextItem.types.includes('sublocality_level_2') ||
        contextItem.types.includes('administrative_area_level_3')
      ) {
        // Concatenate parts of the address
        formattedAddress.address += contextItem.long_name + ', ';
      } else if (contextItem.types.includes('sublocality_level_3')) {
        formattedAddress.appartment = contextItem.long_name;
      } else if (contextItem.types.includes('premise')) {
        formattedAddress.hno = contextItem.long_name;
      }
    }
    this.addressObject=formattedAddress
    console.log(formattedAddress);
    this.assignValues(formattedAddress);
  }

  assignValues(formattedAddress:any){
   this.addressForm.patchValue({
    houseNo:formattedAddress.hno,
    address:formattedAddress.address,
    landMark:formattedAddress.landmark,
    city:formattedAddress.city,
    state:formattedAddress.state,
    pincode:formattedAddress.pincode
   })
   console.log(this.addressForm.value);
  }
  confirmLocation(): void {
    // Handle location confirmation logic
    console.log('Location confirmed:', this.destinationInput);
    // this.saveAddress(this.addressObject)
    
  }

  navTo(){
    this.location.back();
  }

}
