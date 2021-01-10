import { Component, OnDestroy, OnInit } from '@angular/core';

import { QuoteService } from '../services/quote.service';
import { Quote } from '../models/quote';

@Component({
  selector: 'app-search',
  template: `
    <mat-form-field>
      <mat-label>Stock</mat-label>

      <input matInput type="text" placeholder="AAPL" class="stock-input"
        (keyup.enter)="search()"
        [(ngModel)]="symbol">

      <button matSuffix mat-icon-button aria-label="Search"
        [disabled]="symbol === ''"
        (click)="search()">
        <mat-icon>search</mat-icon>
      </button>
    </mat-form-field>

    <div *ngIf="quote">
      <app-search-result [quote]="quote"></app-search-result>
    </div>
  `,
  styles: ['.stock-input { text-transform:uppercase }']
})
export class SearchComponent implements OnInit, OnDestroy {
  symbol = '';
  quote: Quote;

  constructor(private quoteService: QuoteService) {
  }

  ngOnInit(): void {
    this.quoteService.quote$.subscribe(quote => {
      if (quote.symbol === this.symbol) {
        this.quote = quote;
      }
    });
  }

  ngOnDestroy(): void {
    this.quoteService.stop();
  }

  search(): void {
    if (this.symbol === '')
    {
      return;
    }

    // TODO error if symbol not found
    this.symbol = this.symbol.toUpperCase();
    this.quote = null;

    // TODO unsubscribe last search
    // Take into account current porfolio?
    this.quoteService.subscribe(this.symbol);
  }
}
