import { Injectable } from '@angular/core';
import { concat, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';

export interface Cash {
  id: string,
  cash: number
}

export interface Stock {
  symbol: string;
  cost: number;
  quantity: number;
}

// TODO merge with signalR.service
@Injectable()
export class BrokerService {
  private cashDoc: AngularFirestoreDocument<Cash>;
  private stocksCollection: AngularFirestoreCollection<Stock>;

  cash$: Observable<number>;
  portfolio$: Observable<Stock[]>;

  constructor(private firestore: AngularFirestore) {
    this.cashDoc = this.firestore.doc<Cash>('portfolio/1');
    this.cash$ = this.cashDoc.valueChanges().pipe(
      map(p => p.cash)
    )
    this.stocksCollection = this.firestore.collection<Stock>('portfolio/1/stocks');
    this.portfolio$ = this.stocksCollection.valueChanges({ idField: 'id' });
  }

  private updateCash(newCash: number): void {
    this.cashDoc.update({ cash: newCash });
  }

  private findStock(symbol: string): Observable<(Stock & { id: string })[]> {
    return this.firestore.collection<Stock>(
      'portfolio/1/stocks', 
      ref => ref.where('symbol', '==', symbol.toUpperCase()).limit(1)
    ).valueChanges({ idField: 'id' }).pipe(
      first(),
    );
  }

  private buyStock(stock: Stock): Observable<void> {
    return this.findStock(stock.symbol).pipe(
      map(found => {
        if (found.length > 0) {
          this.stocksCollection.doc(found[0].id).update({
            quantity: found[0].quantity + stock.quantity,
            cost: found[0].cost + stock.cost
          });
        } else {
          this.stocksCollection.add(stock);
        }
      }),
    );
  }

  private sellStock(stock: Stock): Observable<void> {
    return this.findStock(stock.symbol).pipe(
      map(found => {
        if (found.length > 0 && found[0].quantity >= stock.quantity) {
          this.stocksCollection.doc(found[0].id).update({
            quantity: found[0].quantity - stock.quantity,
            cost: found[0].cost - stock.cost
          });
        } else {
          console.log('Not enough stock to sell.')
        }
      }),
    );
  }

  buy(symbol: string, price: number, qty: number): void {
    const totalCost = price * qty;
    const stock: Stock = {
      symbol,
      cost: totalCost,
      quantity: qty
    }

    concat(
      this.cash$.pipe(
        first(cash => cash >= totalCost),
        map(cash => this.updateCash(cash - totalCost)),
      ),
      this.buyStock(stock)
    ).subscribe();
  }

  sell(symbol: string, price: number, qty: number): void {
    const total = price * qty;
    const stock: Stock = {
      symbol,
      cost: total,
      quantity: qty
    }

    concat(
      this.cash$.pipe(
        first(),
        map(cash => this.updateCash(cash + total))
      ),
      this.sellStock(stock)
    ).subscribe()
  }
}