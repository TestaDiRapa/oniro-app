import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class IsDocGuard implements CanLoad  {
  constructor(private autService: AuthenticationService){}
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    console.log('isDoc', !this.autService.getUserType());
    return !this.autService.getUserType();
  }
}
