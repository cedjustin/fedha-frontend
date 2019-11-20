import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private http: HttpService) { }

  currentRoute: any;

  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userinfo');
    this.router.navigate(['/admin']);
  }

  _getCurrentRoute() {
    this.currentRoute = this.router.url;
  }

  _changeRoute(route: string) {
    this.currentRoute = route;
    this.router.navigate([route]);
  }

  _checkToken() {
    this.http._checkToken().subscribe(
      res => {
        if (res.error === 1) {
          this.signout();
        } else {

        }
      },
      err => {
        console.log();
      }
    );
  }

  ngOnInit() {
    this._getCurrentRoute();
    this._checkToken();
  }

}
