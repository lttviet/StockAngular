import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedIn$: Subject<firebase.default.User | null> = new BehaviorSubject(null);

  constructor(private auth: AngularFireAuth, private router: Router) {
    this.auth.onAuthStateChanged(this.loggedIn$);
  }

  async emailLogInLink(email: string): Promise<boolean> {
    const logInURL: string = environment.urls.logInLink;

    const actionCodeSettings = {
      url: logInURL,
      handleCodeInApp: true,
    };
    
    try {
      await this.auth.sendSignInLinkToEmail(email, actionCodeSettings);
      window.localStorage.setItem('email', email);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
  }

  async login(url: string): Promise<boolean> {
    const email = window.localStorage.getItem('email') || '';

    if (!email) {
      console.error('No email saved in localStorage.')
      return;
    }

    if (await this.auth.isSignInWithEmailLink(url)) {
      try {
        await this.auth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('email');
        this.router.navigate(['/profile']);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }

  getUser(): Observable<firebase.default.User> {
    return this.loggedIn$.pipe(first());
  }
}
