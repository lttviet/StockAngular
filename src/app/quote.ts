export interface Quote {
  current: number;
  timestamp: number;
}

export interface QuoteResponse {
  o: number;
  h: number;
  l: number;
  c: number;
  pc: number;
  t: number;
}
