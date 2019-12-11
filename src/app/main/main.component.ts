import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  carouselData: any;
  loading = 0;
  dataloaded = 0;


  constructor(private http: HttpService, private router: Router) { }
  phoneNumber = '(+12) 222 3456 888';

  _getCarouselData() {
    this.http._getCarousel().subscribe(
      res => {
        this.carouselData = res.response.data;
        localStorage.setItem('carouseldata', JSON.stringify(res.response.data));
        this.loading = 0;
      },
      err => {
        this.loading = 0;
      }
    );
  }

  _navigate(value: any) {
    localStorage.setItem('sortstatus', value);
    this.router.navigate(['/home/shop']);
  }

  _getLocalData() {
    const value = JSON.parse(localStorage.getItem('carouseldata'));
    if (value == null) {
      this.loading = 1;
      this._getCarouselData();
      this.dataloaded = 1;
    } else {
      this.carouselData = value;
      this.dataloaded = 1;
      this._getCarouselData();
    }
  }


  ngOnInit() {
    localStorage.removeItem('sortstatus');
    localStorage.removeItem('searchedValue');
    this._getLocalData();
    this._getCarouselData();
  }

}
