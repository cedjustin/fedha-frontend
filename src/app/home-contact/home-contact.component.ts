import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { HttpService } from '../http.service';
import { google } from 'google-maps';

@Component({
  selector: 'app-home-contact',
  templateUrl: './home-contact.component.html',
  styleUrls: ['./home-contact.component.scss']
})
export class HomeContactComponent implements OnInit {

  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  map: google.maps.Map;
  lat = -1.945707;
  lng = 30.060912;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 8,
    styles: [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          {
            saturation: 0
          }
        ]
      },
      {
        stylers: [
          {
            weight: 2
          }
        ]
      },
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#212121'
          }
        ]
      },
      {
        elementType: 'labels.icon',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#212121'
          }
        ]
      },
      {
        featureType: 'administrative',
        elementType: 'geometry',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#9e9e9e'
          }
        ]
      },
      {
        featureType: 'administrative.land_parcel',
        stylers: [
          {
            visibility: 'off'
          }
        ]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#bdbdbd'
          }
        ]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
          {
            color: '#181818'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161'
          }
        ]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1b1b1b'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#2c2c2c'
          }
        ]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8a8a8a'
          }
        ]
      },
      {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
          {
            color: '#373737'
          }
        ]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#3c3c3c'
          }
        ]
      },
      {
        featureType: 'road.highway.controlled_access',
        elementType: 'geometry',
        stylers: [
          {
            color: '#4e4e4e'
          }
        ]
      },
      {
        featureType: 'road.local',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#616161'
          }
        ]
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#757575'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#000000'
          }
        ]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#3d3d3d'
          }
        ]
      }
    ]
  };
  marker = new google.maps.Marker({
    position: this.coordinates,
    map: this.map,
  });
  loadingData = 0;
  connection: any = {
    error: 0,
    message: ''
  };
  dataLoaded = 0;
  shopinfo: any = [{
    location: null,
    phone: null
  }];
  senderEmail = null;
  senderMessage = null;
  sendingMessage = 'SEND';

  constructor(private http: HttpService) { }

  _getShopInfo() {
    this.http._getShopInfo().subscribe(
      res => {
        this.shopinfo = res.response.data;
        this.shopinfo[0].about = JSON.parse(this.shopinfo[0].about);
        localStorage.setItem('shopinfo', JSON.stringify(this.shopinfo));
        this._getLocalData();
        this.loadingData = 0;
      },
      err => {
        this.loadingData = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    );
  }

  _getLocalData() {
    const value = JSON.parse(localStorage.getItem('shopinfo'));
    if (value == null) {
      this.loadingData = 1;
      this._getShopInfo();
      this.dataLoaded = 1;
    } else {
      this.shopinfo = value;
      this.dataLoaded = 1;
    }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    this.mapInitializer();
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement,
      this.mapOptions);
    this.marker.setMap(this.map);
  }

  // send email
  _sendEmail() {
    if (this.senderEmail === null || this.senderMessage === null || this.sendingMessage === 'SENT') { } else {
      this.sendingMessage = 'SENDING';
      const senderInfo = {
        email: this.senderEmail,
        message: this.senderMessage
      };
      this.http._postAnEmail(senderInfo).subscribe(
        res => {
          // tslint:disable-next-line: triple-equals
          if (res.response.error == 0) {
            this.sendingMessage = 'SENT';
          } else {this.sendingMessage = 'SEND'; }
        },
        err => {
          this.sendingMessage = 'SEND';
          console.log(err);
        }
      );
    }
  }

  ngOnInit() {
    this._getLocalData();
    this._getShopInfo();
  }

}
