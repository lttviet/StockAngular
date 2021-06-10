import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <app-summary></app-summary>
    <app-search class="app-search"></app-search>
    
    <div fxLayout="row wrap" fxLayoutGap="1em">
    
    <app-portfolio fxFlex></app-portfolio>
    <app-history fxFlex></app-history>
  `,
})
export class ProfileComponent {
}
