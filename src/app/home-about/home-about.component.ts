import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-home-about',
  templateUrl: './home-about.component.html',
  styleUrls: ['./home-about.component.scss']
})
export class HomeAboutComponent implements OnInit {

  loadingData = 0;
  connection: any = {
    error: 0,
    message: ''
  };
  dataLoaded = 0;
  shopinfo: any;

  constructor(private http: HttpService) { }

  _getShopInfo() {
    this.http._getShopInfo().subscribe(
      res => {
        this.shopinfo = res.response.data;
        this.shopinfo[0].about = JSON.parse(this.shopinfo[0].about);
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

  ngOnInit() {
    this._getLocalData();
    this._getShopInfo();
  }

}
