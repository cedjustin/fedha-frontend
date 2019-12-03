import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fade',
      [
        state('void', style({ opacity: 0 })),
        transition(':enter', [animate(300)]),
        transition(':leave', [animate(500)]),
      ]
    )]
})
export class HomeComponent implements OnInit {

  constructor(@Inject(DOCUMENT) document, private http: HttpService, private router: Router) { }

  title = 'Fedha';
  nameBrand = 'FEDHA';
  d = new Date();
  year = this.d.getFullYear();
  phoneNumber = '(+12) 222 3456 888';
  emailAddress = 'example@example.com';
  likedPosts = [];
  likedPostExists = false;
  currentRoute: any;

  _getCurrentRoute() {
    this.currentRoute = this.router.url;
  }

  // a function to get local data
  _checkLikedPosts() {
    const value = JSON.parse(localStorage.getItem('likedPosts'));
    if (value === null || value.length === 0) {
      this.likedPostExists = false;
    } else {
      this.likedPostExists = true;
    }
  }

  _changeRoute(route: string) {
    this.currentRoute = route;
    this.router.navigate([route]);
  }


  ngOnInit() {
    this._getCurrentRoute();
    setInterval(() => { this._checkLikedPosts(); }, 1000);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 600) {
      const element = document.getElementById('navbar');
      element.classList.add('sticky');
    } else {
      const element = document.getElementById('navbar');
      element.classList.remove('sticky');
    }
  }

}
