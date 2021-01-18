import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  template: `
    <mat-card>
      <mat-card-title>
        {{ title }}
      </mat-card-title>
      <mat-card-content>
        {{ number / 100 | currency: "USD" }}
      </mat-card-content>
    </mat-card>
  `
})
export class SummaryCardComponent {
  @Input() title: string;
  @Input() number: number;
}
