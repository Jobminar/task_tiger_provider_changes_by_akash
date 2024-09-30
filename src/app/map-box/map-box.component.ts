import { Component, Inject, PLATFORM_ID } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrl: './map-box.component.css'
})
export class MapBoxComponent {

  destinationInput: string = '';
  map: any;
  userMarker: mapboxgl.Marker | undefined;
  destinationMarker: mapboxgl.Marker | undefined;
  currentLocation: [number, number] = [0, 0];
  watchId: number | undefined;
  directionsLayerId: string = 'directions';
  popup: mapboxgl.Popup | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: object,
              private http:HttpClient) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      mapboxgl.accessToken = "pk.eyJ1IjoiY29vbGllbm8xLWFkbWluIiwiYSI6ImNsdWZjZGR1ZzBtZHcybnJvaHBiYTd2NzMifQ.TQ6FrqUIUUWv7J7n75A3tQ";
      this.initializeMap();
    }
  }

  ngOnDestroy() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
  }

  initializeMap() {
    if (isPlatformBrowser(this.platformId)) {
      navigator.geolocation.getCurrentPosition(position => {
        this.currentLocation = [position.coords.longitude, position.coords.latitude];

        this.map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.currentLocation,
          zoom: 12
        });

        this.map.addControl(new mapboxgl.NavigationControl());

        this.userMarker = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat(this.currentLocation)
          .setPopup(new mapboxgl.Popup().setText('You are here'))
          .addTo(this.map);

        this.watchId = navigator.geolocation.watchPosition(pos => {
          const newLocation: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          this.currentLocation = newLocation;

          if (this.userMarker) {
            this.userMarker.setLngLat(newLocation);
          }
        }, error => {
          console.error('Error watching position:', error);
        });
      });
    }
  }

  navigateToPlace() {
    if (!this.destinationInput) {
      console.error('Please enter the destination address or coordinates.');
      return;
    }

    // Check if input is coordinates (latitude,longitude) format
    const coordinatesRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
    if (coordinatesRegex.test(this.destinationInput)) {
      const [longitude, latitude] = this.destinationInput.split(',').map(coord => parseFloat(coord.trim()));
      this.addDestinationMarker([longitude, latitude]);
    } else {
      // Assume it's an address and use Geocoding API
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.destinationInput)}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (data.features.length === 0) {
            throw new Error('No results found');
          }
          const coordinates = data.features[0].geometry.coordinates;
          this.addDestinationMarker(coordinates);
        })
        .catch(error => {
          console.error('Error fetching destination coordinates:', error);
          alert('Error: Could not find the location. Please check your input.');
        });
    }
  }

  addDestinationMarker(coordinates: [number, number]) {
    if (this.destinationMarker) {
      this.destinationMarker.remove();
    }
    this.destinationMarker = new mapboxgl.Marker({ color: 'red' })
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(this.destinationInput))
      .addTo(this.map);

    this.map.flyTo({
      center: coordinates,
      zoom: 12
    });

    this.getDirections(coordinates);
  }

  getDirections(destinationCoords: [number, number]) {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${this.currentLocation[0]},${this.currentLocation[1]};${destinationCoords[0]},${destinationCoords[1]}?alternatives=true&geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('NoRoute');
        }
        return response.json();
      })
      .then(data => {
        console.log('Directions data:', data);
        if (data.routes.length === 0) {
          throw new Error('No routes found');
          
        }

        // Clear existing directions layer if present
        if (this.map.getSource(this.directionsLayerId)) {
          this.map.removeLayer(this.directionsLayerId);
          this.map.removeSource(this.directionsLayerId);
        }

        // Add route(s) to the map
        this.map.addSource(this.directionsLayerId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: data.routes[0].geometry // Display first route only
          }
        });

        this.map.addLayer({
          id: this.directionsLayerId,
          type: 'line',
          source: this.directionsLayerId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': 'red',
            'line-width': 5
          }
        });

        // Fit map to show entire route
        const bounds = new mapboxgl.LngLatBounds();
        data.routes[0].geometry.coordinates.forEach((point: any) => {
          bounds.extend(point);
        });
        this.map.fitBounds(bounds, { padding: 50 });
      })
      .catch(error => {
        console.error('Error fetching directions:', error);
        alert('Error: Could not find a route.');
      });
  }



  //sending the cordinates to backend

  sendCordinates():Observable<any>{
    const api='';
    const userID=localStorage.getItem('providerId')
    const requestBody={
      providerId:userID,
      cordinates:this.currentLocation
    }
    console.log(requestBody);
    return this.http.post(api,requestBody)
  }

}
