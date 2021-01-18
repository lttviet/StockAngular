import { Component, OnInit } from '@angular/core';

import { BrokerService } from '../services/broker.service';

@Component({
  selector: 'app-summary',
  template: `
    <div fxLayout="row wrap" fxLayoutGap="0.5em">
      <app-summary-card [title]="'Portfolio Value'" [number]="portfolioValue" fxFlex>
      </app-summary-card>

      <app-summary-card [title]="'Cash'" [number]="cash" fxFlex>
      </app-summary-card>
    </div>
  `
})
export class SummaryComponent implements OnInit {
  cash: number;
  portfolioValue: number;

  constructor(private brokerService: BrokerService) { }

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService.portfolioValue$.subscribe(pv => this.portfolioValue = pv);
  }
}
