import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Stock } from './stock';

@Injectable()
export class BrokerService {
  private cash = 250;
  private portfolio: Stock[] = [];

  private cashSource = new BehaviorSubject(this.cash);
  private portfolioSource = new BehaviorSubject<Stock[]>(this.portfolio);

  cash$ = this.cashSource.asObservable();
  portfolio$ = this.portfolioSource.asObservable();

  buy(symbol: string, price: number, qty: number): void {
    const totalCost = price * qty;

    if (this.cash < totalCost) {
      console.error('Insufficient fund.');
      return;
    }

    this.cash -= totalCost;
    this.cashSource.next(this.cash);

    const found = this.portfolio.find(stock => stock.symbol === symbol);
    if (found) {
      found.quantity += qty;
      found.cost += totalCost;
    } else {
      this.portfolio.push({
        symbol,
        quantity: qty,
        cost: totalCost
      });
    }
    console.log(this.portfolio);
    this.portfolioSource.next(this.portfolio);
  }

  sell(symbol: string, price: number, qty: number): void {
    const found = this.portfolio.find(stock => stock.symbol === symbol);
    if (!found || found.quantity < qty) {
      console.error('Not enough stock to sell');
      return;
    }

    const total = price * qty;
    this.cash += total;
    this.cashSource.next(this.cash);

    found.quantity -= qty;
    found.cost -= total;
    console.log(this.portfolio);
    this.portfolioSource.next(this.portfolio);
  }
}