import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  // tslint:disable-next-line: variable-name
  private _rootUrl = 'https://fedha.herokuapp.com/api/';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    })
  };

  constructor(private http: HttpClient) { }

  _login(userInfo: object) {
    return this.http.post<any>(this._rootUrl + 'login', userInfo, this.httpOptions);
  }

  // http calls to help with pagination

  // get all products count
  _getAllProductsCount() {
    return this.http.get<any>(this._rootUrl + 'all-posts-count');
  }

  // get sales products count
  _getSalesProductsCount() {
    return this.http.get<any>(this._rootUrl + 'sales-posts-count');
  }

  // get discounted prduct count
  _getDiscountedProductsCount() {
    return this.http.get<any>(this._rootUrl + 'discounted-posts-count');
  }

  // get all
  _getAllPosts(sortby: any, offset: any, order: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        sortby,
        offset,
        order
      })
    };
    return this.http.get<any>(this._rootUrl + 'get-posts', httpOptions);
  }

}
