import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  showSearch = false;
  showFilter = false;

  constructor() { }
  phoneNumber = '(+12) 222 3456 888';

  changeShowSearch() {
    this.showSearch = !this.showSearch;
    this.showFilter = false;
  }

  changeFilterSearch() {
    this.showSearch = false;
    this.showFilter = !this.showFilter;
  }

  ngOnInit() {
  }

}
