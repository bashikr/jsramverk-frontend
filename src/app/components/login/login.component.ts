import { Component } from '@angular/core';
import { AuthAPIService } from 'src/app/services/auth.api.service';
import { NgForm } from '@angular/forms';
import { LoginCred } from './login.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  public failMessage: string = '';
  public successMessage: string = '';

  public loginObj: LoginCred = {
    email: '',
    password: '',
  };

  constructor(private authAPIService: AuthAPIService, private router: Router) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.failMessage = '';
    this.successMessage = '';

    this.authAPIService.loginReq(form.value).subscribe(
      (res) => {
        this.successMessage = 'You have logged in successfully!';
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        }, 2000);
      },
      (error) => {
        this.failMessage = error;
        this.router.navigateByUrl('/login');
      }
    );
  }
}
