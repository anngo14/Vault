import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { password } from '../models/password';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  insertUrl: string = 'http://localhost:5000/api/insert';
  checkUrl: string = 'http://localhost:5000/api/check';

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
}
