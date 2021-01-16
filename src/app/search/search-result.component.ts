import { Component, OnInit, Input } from '@angular/core';
import { noop } from 'rxjs';

import { BrokerService } from '../services/broker.service';
import { Stock } from '../models/stock';
import { Order } from '../models/order';
import { Quote } from '../models/quote';

@Component({
  selector: 'app-search-result',
  template: `
    <p>
      {{ quote.symbol | uppercase }}
      - {{ quote.price | currency: "USD" }}
      - {{ quote.timestamp | date: 'long'}}

      <button
        mat-raised-button color="primary"
        (click)="buy(quote.symbol)"
        [disabled]="cash < quote.price"
      >
        Buy
      </button>

      <button
        mat-raised-button color="warn"
        (click)="sell(quote.symbol)"
        [disabled]="!canSell(quote.symbol)"
      >
        Sell
      </button>
    </p>
  `
})
export class SearchResultComponent implements OnInit {
  @Input() quote: Quote;
  cash: number;
  stocks: Stock[];

  constructor(private brokerService: BrokerService) {}

  ngOnInit(): void {
    this.brokerService.cash$.subscribe(cash => this.cash = cash);
    this.brokerService.stocks$.subscribe(stocks => this.stocks = stocks);
  }

  buy(symbol: string): void {
    const order: Order = {
      symbol: symbol.toUpperCase(),
      price: this.quote.price.toFixed(2),
      quantity: 1
    }
    this.brokerService
      .buyStock(order)
      .subscribe(
        noop,
        console.error,
        () => console.log("Bought")
      );
  }

  sell(symbol: string): void {
    const order: Order = {
      symbol: symbol.toUpperCase(),
      price: this.quote.price.toFixed(2),
      quantity: 1
    }
    this.brokerService
      .sellStock(order)
      .subscribe(
        noop,
        console.error,
        () => console.log("Sold")
      );
  }

  canSell(symbol: string): boolean {
    if (!this.stocks) {
      return false;
    }
    
    return this.stocks
      .find(stock => stock.symbol === symbol)
      ?.quantity > 0;
  }
}
