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
  new_notify = this.notification.asObservable();
  pwd = this.password.asObservable();

  constructor() { }

  setNotify(n: notifications){
    this.notification.next(n);
  }
  setPassword(p: password){
    this.password.next(p);
  }
}
