import { Component, OnInit } from '@angular/core';

import { Stock } from './stock';
import { BrokerService } from './broker.service';

@Component({
  selector: 'app-company',
  template: `
    <p>
      {{stock.symbol}} - {{stock.price | currency: "USD"}}
      <button
        (click)="buyStock(stock)"
        [disabled]="cash < stock.price"
        >
        Buy
      </button>
      <button
        (click)="sellStock(stock)"
        [disabled]="stock.quantity === 0"
      >
        Sell
      </button>
    </p>
    <p>
      Shares: {{stock.quantity}}
    </p>
    <p>
      Market Value: {{stock.quantity * stock.price}}
    </p>
  `
})
export class CompanyComponent implements OnInit {
  cash: number;
  stock: Stock = { symbol: 'AAPL', price: 120, quantity: 0 };

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
  }

  buyStock(stock: Stock): void {
    this.brokerService.changeStock(stock, 1);
  }

  sellStock(stock: Stock): void {
    this.brokerService.changeStock(stock, -1);
  }
}
