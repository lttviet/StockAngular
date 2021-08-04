import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Candle } from '../models/candle';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CandleService {
  constructor(private http: HttpClient) {}

  getCandle(symbol: string): Observable<Candle> {
    const baseURL = environment.urls.baseAPI;
    const url = `${baseURL}/candle/${symbol.toUpperCase()}`;
    return this.http.get<Candle>(url);
  }
}