import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { Route, UrlSegment } from '@angular/router';
import { AuthGuard } from './login/auth.guard';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IsUserGuard implements CanLoad {

  constructor(private autService: AuthenticationService){}
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    console.log('isUser', this.autService.getUserType());
    return this.autService.getUserType();
  }

}
