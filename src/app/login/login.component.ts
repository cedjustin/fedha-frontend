import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginUserData = {};
  loginResponse: any = {
    response: {
      error: 0
    }
  };

  signInMessage = 'SIGN IN';

  constructor(private auth: AuthService, private router: Router) { }

  _login() {
    this.signInMessage = 'SIGNING IN...';
    this.loginResponse.response.error = 0;
    this.auth._login(this.loginUserData).subscribe(
      res => {
        this.loginResponse = res;
        if (res.response.error === 1) {
          this.signInMessage = 'SIGN IN';
          console.log(this.loginResponse);
        } else {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userinfo', JSON.stringify(res.response.data));
          this.router.navigate(['/admin/dashboard']);
        }
      },
      err => {
        this.loginResponse.response.message = 'Connection problem, check your internet';
        this.loginResponse.response.error = 1;
      }
    );
  }

  ngOnInit() {
    if (this.auth._loggedIn()) {
      this.router.navigate(['/admin/dashboard']);
    } else { }
  }

}
