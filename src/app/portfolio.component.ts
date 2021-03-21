import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Stock } from './models/stock';
import { BrokerService } from './services/broker.service';
import { QuoteService } from './services/quote.service';

@Component({
  selector: 'app-portfolio',
  template: `
    <table mat-table [dataSource]="dataSource" matSort>
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
        <td mat-cell *matCellDef="let stock"
          [ngClass]="getStyleClass(stock)">
          {{ stock.symbol }}
        </td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
        <td mat-cell *matCellDef="let stock"
          [ngClass]="getStyleClass(stock)">
          {{ stock.quantity }}
        </td>
      </ng-container>

      <ng-container matColumnDef="cost">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost basis</th>
        <td mat-cell *matCellDef="let stock"
          [ngClass]="getStyleClass(stock)">
          {{ stock.cost / 100 | currency: "USD" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="current">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Current price</th>
        <td mat-cell *matCellDef="let stock"
          [ngClass]="getStyleClass(stock)">
          {{ stock.current / 100 | currency: "USD" }}
        </td>
      </ng-container>

      <ng-container matColumnDef="candle">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Monthly</th>
        <td mat-cell *matCellDef="let stock">
          <app-candle [symbol]="stock.symbol"></app-candle>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns">
      </tr>
    </table>
  `,
  styles: [
    'table { width: 100% }',
    '.stock-up { color: #04bf09 }', 
    '.stock-down { color: red }',
  ]
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['symbol', 'quantity', 'cost', 'current', 'candle']
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private brokerService: BrokerService, private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.brokerService.stocks$.subscribe(stocks => this.dataSource.data = stocks);
    this.quoteService
      .quote$
      .subscribe(quote => {
        const found = this.dataSource.data.find(stock => stock.symbol === quote.symbol);
        if (found) {
          found.current = quote.price;
        }
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getStyleClass(stock: Stock): string {
    if (stock.current > stock.closePrice) {
      return 'stock-up';
    } else if (stock.current < stock.closePrice) {
      return 'stock-down';
    } else {
      return '';
    }
  }
}
