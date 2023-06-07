// actor-details.component.ts
import { Component, OnInit } from '@angular/core';
import { Actor } from '../models/actor.type';
import { ActorService } from '../services/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import {  ParamMap } from '@angular/router';
/**
 * ActorDetailsComponent-et a @Component dekorátorral jelöljük, és megadjuk a szükséges beállításokat (sablon, stíluslapok stb.).
 */
@Component({
  selector: 'app-actor-details',
  templateUrl: './actor-details.component.html',
  styleUrls: ['./actor-details.component.css']
})
/**
 * ActorDetailsComponent - Angular komponens, amely felelős egy színész részleteinek megjelenítéséért és kezeléséért.
 */
export class ActorDetailsComponent implements OnInit{
  
  actorId: number = 0;
  actor!: Actor;
  movieId: number = 0;

/**
 * Az Angular életciklus metódusa, és a komponens inicializálásakor fut le.
 * @param actorService 
 * @param route 
 * @param router 
 */

constructor(
    private actorService: ActorService,
    private route: ActivatedRoute,
    private router: Router
){}
/**
 * Az ngOnInit metódusban feliratkozunk az aktuális útvonal paramétereinek változására (params), és beállítjuk a actorId értékét az URL-ből kapott id paraméter alapján.
 */
ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.actorId = +params['id'];
    });
    this.loadActorDetails();}

/**
 * Lekérdezzük a színész részleteit az ActorService-en keresztül. 
 * Ha a színész életrajza üres (biography), akkor további részleteket kérünk az angol nyelvű életrajzról az ActorService segítségével.
 */
loadActorDetails() {
  this.actorService.getActor(this.actorId).subscribe(
    (actor: Actor) => {
      this.actor = actor;

      if (this.actor.biography === '') {
        this.actorService.getActorDetailsInEnglish(this.actorId).subscribe(
          (actorDetails: Actor) => {
            this.actor.biography = actorDetails.biography;
          }
        );
      }

      this.fetchMoviesToActor();
    }
  );
}


  
/**
 * Visszatér a film részletei oldalra
 */
goBackToMovieDetails() {
  const movieId = this.route.snapshot.queryParamMap.get('movieId');
  const category = this.route.snapshot.queryParamMap.get('category');
  const type = this.route.snapshot.queryParamMap.get('type');
  const pageNumber = this.route.snapshot.queryParamMap.get('pageNumber');

  if (movieId && category  && pageNumber) {
    this.router.navigate(['/movie-details', movieId], {
      queryParams: { category, type, page: pageNumber },
    });
  } else {
    this.router.navigate(['/discover']);
  }
}

/**
 * Lekérdezzük a színészhez kapcsolódó filmeket az ActorService segítségével. 
 * Ha a válasz tartalmaz adatot (response.cast), akkor az adatokat feldolgozzuk és beállítjuk a actor.movies tömböt.
 */
fetchMoviesToActor() {
  this.actorService.getMoviesByActor(this.actorId).subscribe((response: any) => {
    if (response.cast) {
      this.actor.movies = response.cast.map((movie: any) => {
        const placeholderImagePath = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';

        return {
          title: movie.title,
          character: movie.character,
          poster_path: movie.poster_path ? movie.poster_path : placeholderImagePath
        };
      });
    }
  });
}

/**
 * Egy kép URL-t generál a TMDB (The Movie Database) szolgáltatásból. 
 * Az alap kép URL-t (baseImageUrl) és a képméretet (imageSize) összeadva és a fájl elérési útvonalát (filePath) hozzáfűzve kapjuk meg a teljes kép URL-t.
 * @param fájl elérési útvonala a weben 
 * @returns  
 */
getImageURL(filePath: string) {
  if(filePath == 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png'){
    return filePath;
  }
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500';
    return baseImageUrl + imageSize + filePath;
}

}


