import { Component, OnDestroy, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

import { QuoteService, Quote, QuoteResponse } from './services/quote.service';

@Component({
  selector: 'app-search',
  template: `
    <input #symbol
      (keyup.enter)="search(symbol.value)"
    >

    <button
      (click)="search(symbol.value)"
    >
      Search
    </button>

    <div *ngIf="quote">
      <app-info [quote]="quote"></app-info>
    </div>
  `,
  providers: [QuoteService]
})
export class SearchComponent implements OnInit, OnDestroy {
  private lastSymbol = ''; 
  quote: Quote;

  constructor(private quoteService: QuoteService) {
  }

  ngOnInit(): void {
    this.quoteService.connect();
    this.quoteService.socket$.pipe(
      map((data: QuoteResponse) => {
        if (data.data) {
          return {
            symbol: data.data[0].s,
            current: data.data[0].p,
            timestamp: data.data[0].t
          } as Quote
        }
      })
    ).subscribe(
      q => this.quote = q,
      err => console.error(err)
    );
  }

  ngOnDestroy(): void {
    this.quoteService.socket$.unsubscribe();
  }

  search(symbol: string): void {
    // TODO error if symbol not found
    symbol = symbol.toUpperCase();
    this.quote = null;

    if (this.lastSymbol !== '') {
      this.quoteService.socket$
        .next({type: 'unsubscribe', symbol: this.lastSymbol});
    }
    this.lastSymbol = symbol;

    this.quoteService.socket$.next({type: 'subscribe', symbol});
  }
}
