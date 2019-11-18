import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  title = 'Fedha';
  nameBrand = 'FEDHA';
  d = new Date();
  year = this.d.getFullYear();
  phoneNumber = '(+12) 222 3456 888';
  emailAddress = 'example@example.com';

  ngOnInit() {
  }

}
