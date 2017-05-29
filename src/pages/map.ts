import { NavController } from 'ionic-angular';
import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from "@angular/forms";
import { MapsAPILoader, GoogleMapsAPIWrapper } from 'angular2-google-maps/core';
import { DirectionsMapDirective } from '../app/map/google-map.directive';

declare var google:any;
declare var jQuery:any;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
  providers : [ GoogleMapsAPIWrapper ] 
})
export class MapPage {

  constructor(
      public navCtrl: NavController,
      private mapsAPILoader: MapsAPILoader,
      private ngZone: NgZone,
      private gmapsApi: GoogleMapsAPIWrapper,
      private _elementRef : ElementRef
    ) { }

    public latitude: number;
    public longitude: number;
    public destinationInput: FormControl;
    public destinationOutput: FormControl;
    public zoom: number;
    public iconurl: string;
    public mapCustomStyles : any;
    public estimatedTime: any;
    public estimatedDistance: any;
 
    //@ViewChild("pickupInput")
    //public pickupInputElementRef: ElementRef;
 
    //@ViewChild("pickupOutput")
    //public pickupOutputElementRef: ElementRef;
 
    //@ViewChild("scrollMe")
    //private scrollContainer: ElementRef;
 
    @ViewChild(DirectionsMapDirective) vc: DirectionsMapDirective;
 
    public origin :any ; // its a example aleatory position
    public destination : any; // its a example aleatory position

    
    ngOnInit() {
      //set google maps defaults
      this.zoom = 12;
      this.latitude = -23.6046273;
      this.longitude = -46.6961726;
      this.iconurl = '../image/map-icon.png';
 
     // this.mapCustomStyles = this.getMapCusotmStyles();
      //create search FormControl
      this.destinationInput = new FormControl();
      this.destinationOutput = new FormControl();
      //set current position
      this.setCurrentPosition();
      
      //load Places Autocomplete
      this.mapsAPILoader.load().then(() => {
          let inputOrigin = document.getElementById('txtDestinationInput').getElementsByTagName('input')[0];
          //let autocompleteInput = new google.maps.places.Autocomplete(this.pickupInputElementRef.nativeElement, {
          let autocompleteInput = new google.maps.places.Autocomplete(inputOrigin, {          
            types: ["address"]
          });
           
          let inputDestination = document.getElementById('txtDestinationOutput').getElementsByTagName('input')[0];     
          //let autocompleteOutput = new google.maps.places.Autocomplete(this.pickupOutputElementRef.nativeElement,{     
          let autocompleteOutput = new google.maps.places.Autocomplete(inputDestination,{  
            types: ["address"]
          });
        
          this.setupPlaceChangedListener(autocompleteInput, 'ORG');
          this.setupPlaceChangedListener(autocompleteOutput, 'DES');
      });
    }
    
    private setupPlaceChangedListener(autocomplete: any, mode: any ) {
      autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              //get the place result
              let place: google.maps.places.PlaceResult = autocomplete.getPlace();
              //verify result
              if (place.geometry === undefined) {
                return;
              }
              if (mode === 'ORG') {
                  this.vc.origin = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; 
                  this.vc.originPlaceId = place.place_id;
              } else {
                  this.vc.destination = { longitude: place.geometry.location.lng(), latitude: place.geometry.location.lat() }; // its a example aleatory position
                  this.vc.destinationPlaceId = place.place_id;
              }
  
              if(this.vc.directionsDisplay === undefined){ this.mapsAPILoader.load().then(() => { 
                    this.vc.directionsDisplay = new google.maps.DirectionsRenderer;
                  }); 
            }
          
              //Update the directions
              this.vc.updateDirections();      
              this.zoom = 12;
            });

         });
 
    }
 
    getDistanceAndDuration(){
      this.estimatedTime = this.vc.estimatedTime;
      this.estimatedDistance = this.vc.estimatedDistance;
    }
 
    scrollToBottom(): void {
      jQuery('html, body').animate({ scrollTop: jQuery(document).height() }, 3000);
    }
    /*private setPickUpLocation( place:any ) {
      //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;
    }*/
 
    private setCurrentPosition() {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 12;
        });
      }
    }
 
    /*private getMapCusotmStyles() {
      // Write your Google Map Custom Style Code Here.
    }*/

}
