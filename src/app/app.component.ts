import { Component } from '@angular/core';

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
export class AppComponent {
  title = 'Stock market simulator';
}
