// movie-details.component.ts
import { Component,  OnInit} from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.type';
import { MovieService } from 'src/app/services/movie.service';
import { Actor } from 'src/app/models/actor.type';
import { Genre } from 'src/app/models/genre.type';

/**
 * MovieDetailsComponent-et a @Component dekorátorral jelöljük, és megadjuk a szükséges beállításokat (sablon, stíluslapok stb.).
 */
@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})

/**
 * MovieDetailsComponent class
 */
export class MovieDetailsComponent implements OnInit {
    movieId: number = 0;
    movie!: Movie;

  /**
   * Konstruktor, amelyben injektáljuk a szükséges szolgáltatásokat és osztályokat.
   * @param movieService - A MovieService példány a filmekkel kapcsolatos műveletek elvégzéséhez.
   * @param route - Az ActivatedRoute példány a route paraméterek eléréséhez.
   * @param router - A Router példány a navigációhoz.
   */
  constructor(private movieService: MovieService, private route: ActivatedRoute, private router: Router, private location: Location) {}

  /**
   * Az inicializáció során lefutó metódus.
   * Feliratkozik a route paraméterekre, lekéri a film részleteit és beállítja a komponens property-jeit.
   */
  ngOnInit() {
      this.route.params.subscribe(params => {
        this.movieId = +params['id'];
      });
      this.fetchMovieDetails();
  }

  /**
   * A film részleteinek lekérdezése a MovieService segítségével.
   * Beállítja a komponens property-jeit a kapott adatok alapján.
   * Lekéri a film képeit és beállítja azokat a megfelelő property-kbe.
   * Lekéri a filmhez tartozó színészeket és műfajt.
   * Hiba esetén a hibát kiírja a konzolra
   */
  fetchMovieDetails() {
      this.movieService.getMovieById(this.movieId).subscribe(
        (movie: Movie) => {
          this.movie = movie;
    
          this.movieService.getMovieImages(this.movieId).subscribe((imageData: any) => {
            const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
            if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
              this.movie.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
              
              if (this.movie.images.length === 0) {
                this.movie.images.push({
                  file_path: placeholderImagePath,
                });
              }
              this.movie.imagesLoaded = true;
            }
          });
    
          this.fetchActorsForMovies();
          this.fetchGenreForMovie();
        },
        (error) => {
          console.error(error);
        }
      );
    }

  /**
   * A színész részleteinhez navigálás
   * Átirányít a '/actor-details' útvonalra a színész azonosítóval
   * A film azonosítóját is query paraméterként megadja, a későbbi visszanivágáláshoz
   * @param actorId - A színész azonosítója.
   */
  navigateToActorDetails(actorId: number) {
    const queryParams = this.route.snapshot.queryParams;
    const category = this.route.snapshot.queryParamMap.get('category');
    const type = this.route.snapshot.queryParamMap.get('type');
    const pageNumber = this.route.snapshot.queryParamMap.get('page');

    this.router.navigate(['/actor-details', actorId], { queryParams: { movieId: this.movieId, category, type, pageNumber } });
  }
    
  /**
   * Egy kép URL-t generál a TMDB (The Movie Database) szolgáltatásból ha a kép nem null, egyébként egy placeholder image-t. 
   * Az alap kép URL-t (baseImageUrl) és a képméretet (imageSize) összeadva és a fájl elérési útvonalát (filePath) hozzáfűzve kapjuk meg a teljes kép URL-t.
   * @param fájl elérési útvonala a weben 
   * @returns  
   */
  getImageURL(filePath: string) {
    if(filePath == null){
      return 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';
    }
      const baseImageUrl = 'https://image.tmdb.org/t/p/';
      const imageSize = 'w500';
      return baseImageUrl + imageSize + filePath;
  }

  /**
   * Visszalépés a korábbi oldalra.
   * Ellenőrzi, hogy van-e 'type' és 'page' query paraméter.
   * a van, akkor a '/discover' útvonalra navigál a megfelelő kategóriával, típussal és oldalszámmal.
   * Ha nincs, akkor a '/discover' útvonalra navigál alapértelmezett beállításokkal.
   */
  goBack() {
    const queryParams = this.route.snapshot.queryParams;
    const category = this.route.snapshot.queryParamMap.get('category');
    const type = this.route.snapshot.queryParamMap.get('type');
    const pageNumber = this.route.snapshot.queryParamMap.get('page');

    if(type == null){
      this.router.navigate(['/discover'], { queryParams });
    }else {
      this.router.navigate(['/discover', category, type, pageNumber], { queryParams });
    }
  
  }

  /**
   * A filmhez tartozó színészek lekérdezése a MovieService segítségével.
   * Beállítja a komponens property-jébe a kapott adatokat.
   */
  fetchActorsForMovies() {
      this.movieService.getActors(this.movieId).subscribe((actorData: Actor[]) => {
        this.movie.actors = actorData;
      });
  }
  /**
   * A filmhez tartozó műfaj lekérdezése a MovieService segítségével.
   * Beállítja a komponens property-jébe a kapott adatok alapján.
   */
  fetchGenreForMovie() {
    this.movieService.getGenres().subscribe((genreData: Genre[]) => {
      if (genreData.length > 0) {
        const genre: Genre = {
          id: genreData[0].id, 
          name: genreData[0].name 
        };
        this.movie.genre = genre.name;
      }
    });
  }
}
