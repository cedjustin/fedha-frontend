import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  _loggedIn() {
    return !!localStorage.getItem('token');
  }

  _getToken() {
    return localStorage.getItem('token');
  }
}
