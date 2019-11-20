import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {

  constructor(private http: HttpService) { }

  gender = {
    name
  };
  category = {
    name
  };
  loadingData = 1;
  connection: object = {
    error: 0,
    message: ''
  };
  genders: any;
  categories: any;
  noGender = false;
  noCategory = false;
  currentCategory: object = {
    name,
    id: ''
  };
  currentGender: object = {
    name,
    id: ''
  };

  _getGender() {
    this.loadingData = 1;
    this.genders = [];
    this.http._getGender().subscribe(
      res => {
        this.loadingData = 0;
        if (res.response.error === 1 && res.response.message === 'you have no gender in db') {
          this.noGender = true;
        } else {
          this.noCategory = true;
          this.genders = res.response.data;
        }
      },
      err => {
        this.loadingData = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
        console.log(err);
      }
    );
  }

  _getCategory() {
    this.loadingData = 1;
    this.categories = [];
    this.http._getCategory().subscribe(
      res => {
        this.loadingData = 0;
        if (res.response.error === 1 && res.response.message === 'you have no categories in db') {
          this.noCategory = true;
        } else {
          this.noCategory = false;
          this.categories = res.response.data;
        }
      },
      err => {
        this.loadingData = 0;
        this.connection = {
          error: 1,
          message: 'Connection problem, check your internet and refresh the page'
        };
        console.log(err);
      }
    );
  }

  _addGender() {
    if (this.gender.name === '') {
      console.log('empty');
    } else {
      this.http._addGender(this.gender).subscribe(
        res => {
          if (res.response.error === 1) {

          } else {
            this._getGender();
          }
        },
        err => { console.log(err); }
      );
    }
  }

  _addCategory() {
    if (this.category.name === '') {
      console.log('empty');
    } else {
      this.http._addCategory(this.category).subscribe(
        res => {
          if (res.response.error === 1) {

          } else {
            this._getCategory();
          }
        },
        err => { console.log(err); }
      );
    }
  }

  _editCategory(category: object) {
    this.currentCategory = category;
  }

  _editGender(gender: object) {
    this.currentGender = gender;
  }

  _delGender() {
    // @ts-ignore
    this.http._delGender(this.currentGender.id).subscribe(
      res => {
        if (res.response.error === 1) {
          console.log(res.response);
        } else {
          this._getGender();
        }
      },
      err => { }
    );
  }

  _delCategory() {
    // @ts-ignore
    this.http._delCategory(this.currentCategory.id).subscribe(
      res => {
        if (res.response.error === 1) {
          console.log(res.response);
        } else {
          this._getCategory();
        }
      },
      err => { }
    );
  }

  _updGender() {
    this.http._updGender(this.currentGender).subscribe(
      res => {
        if (res.response.error === 1) {
          console.log(res.response);
        } else {
          this._getGender();
        }
      },
      err => { }
    );
  }

  _updCategory() {
    this.http._updCategory(this.currentCategory).subscribe(
      res => {
        if (res.response.error === 1) {
          console.log(res.response);
        } else {
          this._getCategory();
        }
      },
      err => { }
    );
  }

  ngOnInit() {
    this._getGender();
    this._getCategory();
  }

}
