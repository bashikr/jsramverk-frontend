import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterObj } from './register.interface';
import { AuthAPIService } from 'src/app/services/auth.api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  public emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';
  public successMessage: string = '';
  public failMessage: string = '';

  public registerObj: RegisterObj = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  constructor(private authAPIService: AuthAPIService, private router: Router) {}

  onRegister(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.successMessage = '';
    this.failMessage = '';

    this.authAPIService.registerReq(form.value).subscribe(
      (res) => {
        this.successMessage = 'Registration success!';
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      (error) => {
        this.failMessage = 'User is already registered!';
      }
    );
  }
}
