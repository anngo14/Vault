import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  insertUrl: string = "https://pwdvault.herokuapp.com/api/addAccount";
  removeUrl: string = "https://pwdvault.herokuapp.com/api/removeAccount";
  updateUrl: string = "https://pwdvault.herokuapp.com/api/updateAccount";

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  addAccount(e: string, c: number, l: string, a: account):any{
    let json = {
      email: e,
      category: c,
      label: l,
      account: a
    };
    return this.http.post(this.insertUrl, json, this.httpOptions);
  }
  removeAccount(e: string, c: number, l: string, u: string):any{
    let json = {
      email: e,
      category: c,
      label: l,
      user: u
    };
    return this.http.post(this.removeUrl, json, this.httpOptions);
  }
  updateAccount(e: string, c: number, l: string, a: account[]){
    let json = {
      email: e,
      category: c,
      label: l,
      accounts: a
    }
    return this.http.post(this.updateUrl, json, this.httpOptions);
  }
}
