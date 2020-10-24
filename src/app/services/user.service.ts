import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  registerUrl: string = "http://localhost:5000/register";
  loginUrl: string = "http://localhost:5000/login";

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  registerUser(email: string, pass: string): any{
    let user = {
      "email": email,
      "pass": pass
    };

    return this.http.post(this.registerUrl, user, this.httpOptions);
  }
  loginuser(email: string, pass: string): any{
    let user = {
      "email": email,
      "pass": pass
    };

    return this.http.post(this.loginUrl, user, this.httpOptions);
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }
  getToken(){
    return localStorage.getItem('token');
  }
}
