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

  // a function to check if token hasn't expired
  _checkToken() {
    return this.http.get<any>(this._rootUrl + 'token-checker');
  }

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

  // get all post by condition
  _getPostsByCondition(condition: any, offset: any, value: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        condition,
        offset,
        value
      })
    };
    return this.http.get<any>(this._rootUrl + 'get-posts-by-condition', httpOptions);
  }

  // get all posts on sale
  _getAllPostsOnSale(sortby: any, offset: any, order: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        sortby,
        offset,
        order
      })
    };
    return this.http.get<any>(this._rootUrl + 'get-posts-on-sale', httpOptions);
  }

  // get all posts on discount
  _getAllPostsOnDiscount(sortby: any, offset: any, order: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        sortby,
        offset,
        order
      })
    };
    return this.http.get<any>(this._rootUrl + 'get-posts-on-discount', httpOptions);
  }

  // category and gender

  // add gender
  _addGender(gender: object) {
    return this.http.post<any>(this._rootUrl + 'add-gender', gender);
  }

  // add color
  _addColor(color: object) {
    return this.http.post<any>(this._rootUrl + 'add-color', color);
  }

  // add category
  _addCategory(category: object) {
    return this.http.post<any>(this._rootUrl + 'add-category', category);
  }

  // get gender
  _getGender() {
    return this.http.get<any>(this._rootUrl + 'get-gender');
  }

  // get category
  _getCategory() {
    return this.http.get<any>(this._rootUrl + 'get-category');
  }

  // get colors
  _getColors() {
    return this.http.get<any>(this._rootUrl + 'get-colors');
  }

  // get colors
  _getTypes() {
    return this.http.get<any>(this._rootUrl + 'get-types');
  }

  // delete gender
  _delGender(genderId: number) {
    return this.http.delete<any>(this._rootUrl + 'del-gender/' + genderId);
  }

  // delete category
  _delCategory(categoryId: number) {
    return this.http.delete<any>(this._rootUrl + 'del-category/' + categoryId);
  }

  // update gender
  _updGender(gender: object) {
    return this.http.put<any>(this._rootUrl + 'upd-gender', gender);
  }

  // update category
  _updCategory(category: object) {
    return this.http.put<any>(this._rootUrl + 'upd-category', category);
  }

  // update color
  _updColor(color: object) {
    return this.http.put<any>(this._rootUrl + 'upd-color', color);
  }

  // add a new post
  _addPost(post: object) {
    return this.http.post<any>(this._rootUrl + 'add-post', post);
  }

  // update post
  _updPost(post: object) {
    return this.http.put<any>(this._rootUrl + 'upd-post', post);
  }


  // del a new post
  _delPost(postid: number) {
    return this.http.delete<any>(this._rootUrl + 'del-post/' + postid);
  }

  // put a post on sale
  _putPostOnSale(data: object) {
    return this.http.put<any>(this._rootUrl + 'upd-put-on-sale', data);
  }

  // remove a post on sale
  _putPostFromSale(data: object) {
    return this.http.put<any>(this._rootUrl + 'upd-rm-on-sale', data);
  }

}
