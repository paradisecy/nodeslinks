import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {NgxGraphModule} from '@swimlane/ngx-graph';
import {DxGanttModule} from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxGraphModule,
    DxGanttModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
