import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { password } from '../models/password';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  insertUrl: string = 'http://localhost:5000/api/insert';
  deleteUrl: string = 'http://localhost:5000/api/delete';
  checkUrl: string = 'http://localhost:5000/api/check';
  personalUrl: string = 'http://localhost:5000/api/personal';
  secretUrl: string = 'http://localhost:5000/api/secret';
  otherUrl: string = 'http://localhost:5000/api/other';

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  addPwd(e: string, c: number, pwd: password): any{
    let json = {
      email: e,
      category: c,
      password: pwd
    };
    return this.http.post(this.insertUrl, json, this.httpOptions);
  }
  checkExisting(e: string, l: string, c: number): any{
    let json = {
      email: e,
      label: l,
      category: c
    };
    return this.http.post(this.checkUrl, json, this.httpOptions);
  }
  getPersonal(e: string): any{
    let json = {
      email: e
    };
    return this.http.post(this.personalUrl, json, this.httpOptions);
  }
  getSecret(e: string): any{
    let json = {
      email: e
    };
    return this.http.post(this.secretUrl, json, this.httpOptions);
  }
  getOther(e: string): any{
    let json = {
      email: e
    };
    return this.http.post(this.otherUrl, json, this.httpOptions);
  }
  delete(e: string, c: number, l: string): any{
    let json = {
      email: e,
      category: c,
      label: l
    };
    return this.http.post(this.deleteUrl, json, this.httpOptions);
  }
}
