import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  registerUrl: string = "https://pwdvault.herokuapp.com/api/register";
  loginUrl: string = "https://pwdvault.herokuapp.com/api/login";
  changePasswordUrl: string = "https://pwdvault.herokuapp.com/api/changeMasterPassword";
  deleteUserUrl: string = "https://pwdvault.herokuapp.com/api/deleteUser";
  checkUserUrl: string = "https://pwdvault.herokuapp.com/api/checkExistingUser";
  wipeDataUrl: string = "https://pwdvault.herokuapp.com/api/wipeData";

  constructor(private http: HttpClient, private r: Router) { }

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
  checkUser(email: string): any{
    let user = {
      email: email
    };
    return this.http.post(this.checkUserUrl, user, this.httpOptions);
  }
  loginuser(email: string, pass: string): any{
    let user = {
      "email": email,
      "pass": pass
    };

    return this.http.post(this.loginUrl, user, this.httpOptions);
  }
  changeMaster(email: string, pass: string): any{
    let json = {
      email: email,
      pass: pass
    };
    return this.http.post(this.changePasswordUrl, json, this.httpOptions);
  }
  deleteuser(email: string): any{
    let json = {
      email: email
    };
    return this.http.post(this.deleteUserUrl, json, this.httpOptions);
  }
  wipeUser(email: string): any {
    let json = {
      email: email
    };
    return this.http.post(this.wipeDataUrl, json, this.httpOptions);
  }
  loggedIn(){
    return !!localStorage.getItem('token');
  }
  getToken(){
    return localStorage.getItem('token');
  }
  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.r.navigate(['/login']);
    setTimeout(() => { window.location.reload() }, 100);
  }
}
