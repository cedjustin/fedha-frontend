import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  carouselData: any = [];
  loadingData = 0;
  connection: any = {
    error: 0,
    message: ''
  };
  dataLoaded = 0;
  currentslide: any = {
    name: null,
    linktoimage: null
  };

  constructor(private http: HttpService) { }

  // get carousel data
  _getCarouselData() {
    this.loadingData = 1;
    this.http._getCarousel().subscribe(
      res => {
        this.loadingData = 0;
        this.carouselData = res.response.data;
        this.carouselData.length > 0 ? this.dataLoaded = 1 : this.dataLoaded = 0;
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

  // set current slide
  _setCurrentSlide(slide: object) {
    this.currentslide = slide;
  }

  // update a slide
  _updateSlide() {
    this.http._updCarousel(this.currentslide).subscribe(
      res => {
        // tslint:disable-next-line: triple-equals
        if (res.response.error == 0) {
          this._getCarouselData();
        } else {
          console.log(res.response);
        }
      },
      err => {
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
      }
    )
  }

  ngOnInit() {
    this._getCarouselData();
  }

}
