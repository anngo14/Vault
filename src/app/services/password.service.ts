import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { password } from '../models/password';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  insertUrl: string = 'https://pwdvault.herokuapp.com/api/insert';
  updateUrl: string = 'https://pwdvault.herokuapp.com/api/update';
  deleteUrl: string = 'https://pwdvault.herokuapp.com/api/delete';
  checkUrl: string = 'https://pwdvault.herokuapp.com/api/check';
  personalUrl: string = 'https://pwdvault.herokuapp.com/api/personal';
  secretUrl: string = 'https://pwdvault.herokuapp.com/api/secret';
  otherUrl: string = 'https://pwdvault.herokuapp.com/api/other';

  alpha = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  alphaUpper = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  numerical = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  special = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '+', '=', '{', '}', '[', ']', '~', '<', '>', ',', '.', '/', '?', ':', ';'];

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
  updatePwd(e: string, c: number, pwd: password[]): any{
    let json = {
      email: e,
      category: c,
      passwords: pwd
    };
    return this.http.post(this.updateUrl, json, this.httpOptions);
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
  refreshPassword(p: string){
    let containsLower = false;
    let containsUpper = false;
    let containsNum = false;
    let containsSpecial = false;
    let length = p.length;
    
    for(let i = 0; i < p.length; i++){
      let c = p.charAt(i);
      if(this.alpha.includes(c)) containsLower = true;
      if(this.alphaUpper.includes(c)) containsUpper = true;
      if(this.numerical.includes(c)) containsNum = true;
      if(this.special.includes(c)) containsSpecial = true;
    }
    let refresh = this.generatePassword((containsLower || containsUpper), containsNum, containsSpecial, length);
    let pLower = false;
    let pUpper = false;
    let pNum = false;
    let pSpecial = false;
    while(pLower !== containsLower && pUpper !== containsUpper && pNum !== containsNum && pSpecial !== containsSpecial){
      refresh = this.generatePassword((containsLower || containsUpper), containsNum, containsSpecial, length);
      for(let i = 0; i < refresh.length; i++){
        let c = refresh.charAt(i);
        if(this.alpha.includes(c)) pLower = true;
        if(this.alphaUpper.includes(c)) pUpper = true;
        if(this.numerical.includes(c)) pNum = true;
        if(this.special.includes(c)) pSpecial = true;
      }
    }
    return refresh;
  }
  calculateEntropy(p: string){
    let containsLower = false;
    let containsUpper = false;
    let containsNum = false;
    let containsSpecial = false;
    let unique = 0;
    let entropy = 0;

    for(let i = 0; i < p.length; i++){
      let c = p.charAt(i);
      if(this.alpha.includes(c)) containsLower = true;
      if(this.alphaUpper.includes(c)) containsUpper = true;
      if(this.numerical.includes(c)) containsNum = true;
      if(this.special.includes(c)) containsSpecial = true;
    }

    if(containsLower) unique += this.alpha.length;
    if(containsUpper) unique += this.alphaUpper.length;
    if(containsNum) unique += this.numerical.length;
    if(containsSpecial) unique += this.special.length;

    unique = Math.pow(unique, p.length);
    entropy = Math.log(unique) / Math.log(2);
    return entropy;
  }
  generatePassword(alpha: boolean, numerical: boolean, special: boolean, length: number){
    let available = [];
    let password = "";
    if(alpha) {
      available = available.concat(this.alpha);
      available = available.concat(this.alphaUpper);
    }
    if(numerical) available = available.concat(this.numerical);
    if(special) available = available.concat(this.special);

    for(let i = 0; i < length; i++){
      let randomIndex = Math.floor(Math.random() * (available.length - 1));
      password += available[randomIndex];
    }
    return password
  }
}