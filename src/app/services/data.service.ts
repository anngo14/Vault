import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { notifications } from '../models/notifications';
import { password } from '../models/password';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private notification = new BehaviorSubject(null);
  private password = new BehaviorSubject(null);
  private personal = new BehaviorSubject(true);
  private secret = new BehaviorSubject(true);
  private other = new BehaviorSubject(true);

  new_notify = this.notification.asObservable();
  pwd = this.password.asObservable();
  p = this.personal.asObservable();
  s = this.secret.asObservable();
  o = this.other.asObservable();

  constructor() { }

  setNotify(n: notifications){
    this.notification.next(n);
  }
  setPassword(p: password){
    this.password.next(p);
  }
  setP(s: boolean){
    this.personal.next(s);
  }
  setS(s: boolean){
    this.secret.next(s);
  }
  setO(s: boolean){
    this.other.next(s);
  }
}
