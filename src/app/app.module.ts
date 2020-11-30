import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SearchComponent } from './search.component';
import { InfoComponent } from './info.component';
import { PortfolioComponent } from './portfolio.component';


@NgModule({
  declarations: [
    AppComponent,
    InfoComponent,
    SearchComponent,
    PortfolioComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
