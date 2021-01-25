import { Component, OnDestroy, OnInit } from '@angular/core';

import { QuoteService } from '../services/quote.service';
import { Quote } from '../models/quote';

// TODO try reactive form
@Component({
  selector: 'app-search',
  template: `
    <mat-form-field>
      <mat-label>Stock</mat-label>

      <input matInput type="text" placeholder="AAPL" class="stock-input"
        [matAutocomplete]="auto"
        (keyup.enter)="search()"
        [(ngModel)]="currentSymbol"
        (ngModelChange)="filteredSymbols = filter(currentSymbol)">
      
      <mat-autocomplete #auto="matAutocomplete">
        <mat-option *ngFor="let symbol of filteredSymbols" [value]="symbol">
          {{symbol}}
        </mat-option>
      </mat-autocomplete>

      <button matSuffix mat-icon-button aria-label="Search"
        [disabled]="!currentSymbol"
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
  quote: Quote = {price: 103, symbol: 'TEST', timestamp: 1024}
  currentSymbol = '';
  // max 50, free api usage
  symbols: string[] = [
    'AAPL', 'AA', 'BB', 'MSFT', 'FB', 'GE', 'GME',
    'TLSA', 'AMD'
  ];
  filteredSymbols: string[] = this.symbols;

  constructor(private quoteService: QuoteService) {
  }

  ngOnInit(): void {
    this.quoteService.quote$.subscribe(quote => {
      if (quote.symbol && quote.symbol === this.currentSymbol) {
        this.quote = quote;
      }
    });
  }

  ngOnDestroy(): void {
    this.quoteService.stop();
  }

  search(): void {
    if (!this.currentSymbol) {
      return;
    }

    // TODO error if symbol not found
    this.quote = null;

    // TODO unsubscribe last search
    // Take into account current porfolio?
    this.quoteService.subscribe(this.currentSymbol.toUpperCase());
  }

  filter(value: string): string[] {
    if (value) {
      return this.symbols.filter(s => s.startsWith(value.toUpperCase()));
    }
    return this.symbols;
  }
}
