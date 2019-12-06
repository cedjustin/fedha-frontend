import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-shop-info',
  templateUrl: './shop-info.component.html',
  styleUrls: ['./shop-info.component.scss']
})
export class ShopInfoComponent implements OnInit {

  loadingData = 0;
  connection: any = {
    error: 0,
    message: ''
  };
  dataLoaded = 0;
  shopinfo: any;
  currentshopinfo: any = [{
    email: null,
    phone: null,
    location: null,
  }];

  constructor(private http: HttpService) { }

  _getShopInfo() {
    this.loadingData = 1;
    this.http._getShopInfo().subscribe(
      res => {
        this.shopinfo = res.response.data;
        this.shopinfo[0].about = JSON.parse(this.shopinfo[0].about);
        this.currentshopinfo = this.shopinfo;
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

  _updateShopInfo() {
    const data = this.currentshopinfo;
    data[0].about = JSON.stringify(data[0].about);
    this.http._updShopinfo(data[0]).subscribe(
      res => {
        // tslint:disable-next-line: triple-equals
        if (res.response.error == 0) {
          this._getShopInfo();
        }
      },
      err => {
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    );
  }



  ngOnInit() {
    this._getShopInfo();
  }

}
