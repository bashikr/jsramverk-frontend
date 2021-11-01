import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthAPIService } from './auth.api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authAPIService: AuthAPIService, private router: Router) {}

  canActivate() {
    if (this.authAPIService.isLoggedIn()) {
      this.router.navigateByUrl('/home');
      return true;
    }
    return !this.authAPIService.isLoggedIn();
  }
}
