import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <h1>{{message}}</h1>

    <form class="login-form" *ngIf="!authService.isLoggedIn">
      <mat-form-field class="form-full-width" appearance="fill">
        <mat-label>Email</mat-label>
        
        <input matInput 
          placeholder="viet@example.com" 
          [formControl]="email" required
          (keyup.enter)="login()">

        <mat-error *ngIf="email.invalid">{{ getErrorMessage() }}</mat-error>   
      </mat-form-field>

      <button mat-stroked-button (click)="login()">Login</button>
    </form>

    <button mat-stroked-button (click)="logout()" *ngIf="authService.isLoggedIn">Logout</button>
  `,
  styles: [
    '.login-form { max-width: 500px }',
    '.form-full-width { width: 100% }'
  ]
})
export class LoginComponent {
  message: string;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(public authService: AuthService, public router: Router) {
    this.message = this.getMessage();
  }

  getMessage(): string {
    return this.authService.isLoggedIn ? 'Logout' : 'Login';
  }

  getErrorMessage(): string {
    if (this.email.hasError('required')) {
      return 'Please enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  login(): void {
    if (this.getErrorMessage()) {
      return;
    }

    this.message = "Logging in...";

    this.authService.login().subscribe(() => {
      if (this.authService.isLoggedIn) {
        this.message = this.getMessage();
        this.router.navigate(['/profile']);
      }
    })
  }

  logout(): void {
    this.authService.logout();
    this.message = this.getMessage();
  }
}
