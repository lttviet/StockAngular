import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Candle } from '../models/candle';

@Injectable({
  providedIn: 'root',
})
export class CandleService {
  constructor(private http: HttpClient) {}

  getCandle(symbol: string): Observable<Candle> {
    const url = `https://localhost:5001/api/candle/${symbol.toUpperCase()}`;
    return this.http.get<Candle>(url);
  }
}