import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private email = new BehaviorSubject("");
  user = this.email.asObservable();

  constructor() { }

  setUser(e: string){
    this.email.next(e);
  }
}
