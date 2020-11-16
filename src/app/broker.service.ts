import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';

import {Stock} from './stock';

@Injectable()
export class BrokerService {
  private cash = 250;

  private cashSource = new BehaviorSubject(this.cash);
  private stockSource = new Subject<Stock>();

  cash$ = this.cashSource.asObservable();
  stock$ = this.stockSource.asObservable();

  changeCash(newVal: number): void {
    this.cashSource.next(newVal);
  }

  changeStock(stock: Stock, qty: number): void {
    if (this.cash < stock.price * qty) {
      console.error('Insufficient fund.');
      return;
    }

    this.cash -= stock.price * qty;
    this.changeCash(this.cash);

    stock.quantity = Math.max(0, stock.quantity + qty);
    this.stockSource.next(stock);
  }
}