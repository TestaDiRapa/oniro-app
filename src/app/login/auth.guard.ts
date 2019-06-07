import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad  {

  constructor(private authService: AuthenticationService,
              private router: Router) {}

    canLoad(_route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      return  this.authService.getAuthentication();
}
}
