import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MovieDetailsComponent } from "./movie-details/movie-details/movie-details.component";
import { MovieListComponent } from "./movie-list/movie-list.component";
import { SeriesDetailsComponent } from "./series-details/series-details.component";
import { ActorDetailsComponent } from "./actor-details/actor-details.component";

/**
 * Ez a modul felelős az alkalmazás útvonalainak kezeléséért és biztosítja, hogy az adott útvonalhoz tartozó komponensek megfelelően betöltődjenek a böngészőben.
 * Az útvonalak a Routes osztály példányai, amelyeknek a path tulajdonságában adjuk meg az útvonalakat és a component tulajdonságában a hozzájuk tartozó komponenseket.
 */

const routes: Routes = [
    { path: 'discover/:category/:type/:pageNumber', component: MovieListComponent },
    {
        path: '',
        redirectTo: '/discover',
        pathMatch: 'full'
    },
    {
        path: 'discover',
        component: MovieListComponent
    },
    {
        path: 'movie-details/:id',
        component: MovieDetailsComponent
    },
    {
        path: 'tv-details/:id',
        component: SeriesDetailsComponent
    },
    {
        path:'actor-details/:id',
        component: ActorDetailsComponent
    }
];

/**
 * Az AppRoutingModule modul az imports tömbben importálja a RouterModule-t és a routes tömböt használja az útvonalak konfigurálásához. 
 * Az exports tömbben pedig exportálja a konfigurált útvonalakat a használatra.
 */

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule {}


  