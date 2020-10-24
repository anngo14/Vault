import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private u: UserService, private r: Router) { }

  canActivate(): boolean {
    if(this.u.loggedIn()){
      return true;
    } else{
      this.r.navigate(['/login']);
      return false;
    }
  }
  
}
