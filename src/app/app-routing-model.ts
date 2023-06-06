import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MovieDetailsComponent } from "./movie-details/movie-details/movie-details.component";
import { MovieListComponent } from "./movie-list/movie-list.component";
import { SeriesDetailsComponent } from "./series-details/series-details.component";
import { ActorDetailsComponent } from "./actor-details/actor-details.component";

const routes: Routes = [
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

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })

  export class AppRoutingModule {}


  