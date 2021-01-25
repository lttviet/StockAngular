import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  template: `
    <mat-card>
      <mat-card-title>
        History
      </mat-card-title>
      <mat-card-content>
        <mat-selection-list [multiple]="false">
          <mat-list-option *ngFor="let trade of trades" [value]="trade">
            {{trade}}
          </mat-list-option>
        </mat-selection-list>
      </mat-card-content>
    </mat-card>
  `
})
export class HistoryComponent {
  trades: string[] = [
    'Buy AAPL: 1 share at $111.22',
    'Sell AAPL: 2 shares at $333.33',
    'Test history'
  ]
}
