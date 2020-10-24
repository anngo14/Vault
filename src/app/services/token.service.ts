import { HttpInterceptor } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next){
    let userService = this.injector.get(UserService);
    let tokenizedReq = req.clone({
      setHeaders: {
        Authorization: "Bearer " + userService.getToken()
      }
    });
    return next.handle(tokenizedReq);
  }
}
