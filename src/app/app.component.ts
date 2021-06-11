import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorService } from './services/error.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>{{title}}</span>
      <span fxFlex></span>
      <a mat-stroked-button routerLink="/login">Login</a>
    </mat-toolbar>

    <div class="app-view">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: ['.app-view { padding: 1em }', '.app-search { display: block; margin: 5px auto }']
})
export class AppComponent implements OnInit {
  title = 'Stock market simulator';

  constructor(private snackBar : MatSnackBar, private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe(err => {
      if (err === true) {
        this.snackBar.open("No Connection", "Dismiss");
      }
      else {
        this.snackBar.dismiss();
      }
    });
  }
}
