import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <h1>{{message}}</h1>

    <form class="login-form" *ngIf="message === 'Login'">
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

    <button mat-stroked-button (click)="logout()" *ngIf="message === 'Logout'">Logout</button>
  `,
  styles: [
    '.login-form { max-width: 500px }',
    '.form-full-width { width: 100% }'
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  authSubscription: Subscription;
  message: string;
  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.loggedIn$.subscribe((user) => {
      this.message = user ? 'Logout' : 'Login';
    });
  }

  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
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

    this.authService.emailLogInLink(this.email.value);
    this.message = "Please check your email for login link.";
  }

  logout(): void {
    this.authService.logout();
  }
}
