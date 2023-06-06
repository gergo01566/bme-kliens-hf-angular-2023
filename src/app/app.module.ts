import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing-model';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details/movie-details.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SeriesDetailsComponent } from './series-details/series-details.component';
import { ActorDetailsComponent } from './actor-details/actor-details.component';


/**
 * AppModule, amely felelős az alkalmazás fő moduljának konfigurálásáért.
 * A kódban beimportáltam a különböző modulokat és komponenseket, majd ezeket felhasználva konfiguráltam az alkalmazás fő modulját
 */

@NgModule({
  declarations: [
    AppComponent,
    MovieListComponent,
    MovieDetailsComponent,
    SeriesDetailsComponent,
    ActorDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatMenuModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
