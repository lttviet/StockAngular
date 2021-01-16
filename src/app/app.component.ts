import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ErrorService } from './services/error.service';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      {{title}}
    </mat-toolbar>

    <div class="app-view">
      <app-summary></app-summary>

      <app-search></app-search>

      <div fxLayout="row">
        <app-portfolio fxFlex="1 1 50%"></app-portfolio>
      </div>
    </div>
  `,
  styles: ['.app-view { padding: 1em }']
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
