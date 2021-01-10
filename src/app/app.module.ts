import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { InfoComponent } from './info.component';
import { PortfolioComponent } from './portfolio.component';
import { SummaryComponent } from './summary/summary.component';
import { SummaryCardComponent } from './summary/summary-card.component';


@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    SearchComponent,
    PortfolioComponent,
    SummaryComponent,
    SummaryCardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
