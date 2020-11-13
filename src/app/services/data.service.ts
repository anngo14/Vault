import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { notifications } from '../models/notifications';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private notification = new BehaviorSubject(null);
  new_notify = this.notification.asObservable();

  constructor() { }

  setNotify(n: notifications){
    this.notification.next(n);
  }
}
