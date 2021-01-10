import { Component, OnInit } from '@angular/core';

import { BrokerService } from './services/broker.service';

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
  cash: number;

  constructor(private brokerService: BrokerService) { }

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService
      .connected$
      .subscribe(connected => {
        if (connected) {
          this.brokerService.getInitialCash();
        }
      })
  }
}
