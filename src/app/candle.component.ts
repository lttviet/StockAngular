import { Component, Input, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

import { CandleService } from './services/candle.service';

@Component({
  selector: 'app-candle',
  template: `
    <figure [id]="symbol + '-candle'"></figure>
  `
})
export class CandleComponent implements AfterViewInit {
  @Input() symbol: string;

  private svg;
  private width = 100;
  private height = 20;

  constructor(private candleService : CandleService) {}

  ngAfterViewInit(): void {
    this.createSvg();

    this.candleService
      .getCandle(this.symbol)
      .subscribe(data => {
        this.drawBars(data.dailyChange);
      });
  }

  private createSvg(): void {
    this.svg = d3.select(`figure#${this.symbol}-candle`).append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g');
  }

  private drawBars(data: number[]): void {
    const barWidth = this.width / data.length;

    const x = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, this.width]);

    const y = d3.scaleLinear()
      .domain([Math.min(...data), Math.max(...data)])
      .range([this.height, 0]);
    
    this.svg.selectAll('.bar').data(data)
      .enter()
      .append('rect')
        .attr('class', 'bar')
        .attr('x', (d, i) => x(i))
        .attr('y', d => d > 0 ? y(d) : y(0))
        .attr('width', barWidth)
        .attr('height', d => Math.abs(y(d) - y(0)))
        .attr('fill', d => d > 0 ? ' #04bf09' : 'red');
  }
}
