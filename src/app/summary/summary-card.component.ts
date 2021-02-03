import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-card',
  template: `
    <mat-card>
      <mat-card-subtitle>
        {{ title }}
      </mat-card-subtitle>

      <mat-card-content class="number">
        {{ number / 100 | currency: "USD" }}
      </mat-card-content>
    </mat-card>
  `,
  styles: ['.number { font-size: 2em }']
})
export class SummaryCardComponent {
  @Input() title: string;
  @Input() number: number;
}
