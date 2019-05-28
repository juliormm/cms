import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule, AppRoutingModule, CoreModule.forRoot() ],
  bootstrap: [AppComponent]
})
export class AppModule { }
