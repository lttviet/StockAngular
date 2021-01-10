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
        <td mat-cell *matCellDef="let stock">{{ stock.symbol }}</td>
      </ng-container>

      <ng-container matColumnDef="quantity">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Quantity</th>
        <td mat-cell *matCellDef="let stock">{{ stock.quantity }}</td>
      </ng-container>

      <ng-container matColumnDef="cost">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Cost basis</th>
        <td mat-cell *matCellDef="let stock">{{ stock.cost }}</td>
      </ng-container>

      <ng-container matColumnDef="current">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Current price</th>
        <td mat-cell *matCellDef="let stock">{{ stock.current }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `,
  styles: ['table { width: 100% }']
})
export class PortfolioComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['symbol', 'quantity', 'cost', 'current']
  dataSource: MatTableDataSource<Stock> = new MatTableDataSource([]);

  @ViewChild(MatSort) sort: MatSort;

  constructor(private brokerService: BrokerService, private quoteService: QuoteService) {}

  ngOnInit(): void {
    this.brokerService.stocks$.subscribe(stocks => this.dataSource.data = stocks);
    this.brokerService
      .connected$
      .subscribe(connected => {
        if (connected) {
          this.brokerService.getInitialStocks();
        }
      });
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
}
