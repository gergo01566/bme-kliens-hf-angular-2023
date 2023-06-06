// movie-list.component.ts
import { Movie } from "../models/movie.type";
import { MovieService } from "../services/movie.service";
import { SearchResult } from "../models/search-result.ype";
import { Genre } from "../models/genre.type";
import { Actor } from "../models/actor.type";
import { SeriesService } from "../services/series.service";
import { Series } from "../models/series.type";
import { Season } from "../models/season.type";
import { ActivatedRoute, Router } from "@angular/router";

import { Component, OnInit } from '@angular/core';
/**
 * Az @Component dekorátor beállítja a komponens szelektorát, a HTML sablonját és a CSS stílusát.
 */
@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})

/**
 * MovieListComponent - Angular komponens, amely felelős a sorozatok és filmek listázásáért
 */
export class MovieListComponent implements OnInit {
  movies: Movie[] = [] ;
  series: Series[] = [] ; 
  genres: Genre[] = [] ; 
  searchQuery: string = '';
  isTextboxFocused: boolean = false;
  moviesSelected: boolean = true;
  seriesSelected: boolean = false;
  selectedType: string = "";
  currentPage: number = 1;
  pageSize: number = 10;
  totalResults: number = 0;
  totalPages: number = 0;

  /**
   * Az osztály konstruktora inicializálja a szolgáltatásokat és az útválasztót a szükséges függőségekkel.
   * @param movieService 
   * @param seriesService 
   * @param router 
   * @param route 
   */
  constructor(private movieService: MovieService, private seriesService: SeriesService, private router: Router, private route: ActivatedRoute) {}

  /**
   * Az ngOnInit metódus az Angular OnInit interfész implementációja. Ez a metódus fut le, amikor a komponens inicializálódik. 
   * A metódus feliratkozik a route.params eseményre, ami az URL paramétereinek változását figyeli. 
   * Az URL paraméterek alapján beállítja a kiválasztott kategóriát (moviesSelected, seriesSelected), 
   * a kiválasztott típust (selectedType) és az aktuális oldalszámot (currentPage). 
   * Ezt követően meghívja az adatok betöltéséhez szükséges metódusokat (loadMovies, loadSeries, getPopular, loadGenres, search).
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['category'] == 'movie'){
        this.moviesSelected = true;
        this.seriesSelected = false;
      } else if (params['category'] == 'series') {
        this.seriesSelected = true;
        this.moviesSelected = false;
      }      
      this.selectedType = params['type'];
      this.currentPage = +params['pageNumber'] || 1;
      console.log(this.currentPage);
      console.log(this.moviesSelected);
      console.log(this.selectedType)
    });
    this.loadMovies();
    this.loadSeries();
    this.getPopular();
    this.loadGenres();
    this.search();
  }

  /**
   * A selectMovies metódus kiválasztja a filmek kategóriát. 
   * Beállítja moviesSelected értékét true-ra, seriesSelected értékét false-ra, az currentPage értékét 1-re, 
   * majd meghívja a loadMovies metódust az aktuális filmek betöltéséhez.
   * Ez a függvény akkor hívódik meg, amikor a felhasználó a filmek gombra kattintott.
   */
  selectMovies() {
    this.moviesSelected = true;
    this.seriesSelected = false;
    this.currentPage = 1;
    this.loadMovies();
    this.selectedType =  "";
  }

  /**
   * A selectSeries metódus kiválasztja a sorozatok kategóriát. 
   * Beállítja moviesSelected értékét false-ra, seriesSelected értékét true-ra, az currentPage értékét 1-re, 
   * majd meghívja a loadSeries metódust az aktuális sorozatok betöltéséhez.
   * Ez a függvény akkor hívódik meg, amikor a felhasználó a sorozatok gombra kattintott.
   */
  selectSeries() {
    this.moviesSelected = false;
    this.seriesSelected = true;
    this.currentPage = 1;
    this.loadSeries();
    this.selectedType =  "";
  }

  /**
   * A selectType metódus kiválasztja a megadott típust. Ha a type "movies" vagy "series", akkor beállítja a moviesSelected és seriesSelected értékét ennek megfelelően. 
   * Ha a type "popular", akkor meghívja a getPopular metódust és beállítja a selectedType értékét erre. 
   * @param type - beállítja a selectedType értékét a megadott type-ra.
   */
  selectType(type: string) {
    if (type === 'movies' || type === 'series') {
      this.moviesSelected = type === 'movies';
      this.seriesSelected = type === 'series';
    } else if (type === 'popular') {
      this.getPopular();
      this.selectedType = type;
    } else {
      this.selectedType = type;
    }
  }

  /**
   * A navigateToMovieDetails metódus a film részleteinek oldalára navigál. 
   * Beállítja az URL-t a megfelelő útvonalra (/movie-details), a film azonosítóját (movieId), valamint a kategóriát (category), a típust (type) és az oldalszámot (page) URL paraméterként.
   * @param movieId 
   */
  navigateToMovieDetails(movieId: number) {
    this.router.navigate(["/movie-details", movieId], { queryParams: { category: 'movie', type: this.selectedType, page: this.currentPage} });
  }

  /**
   * A navigateToSeriesDetails metódus a sorozat részleteinek oldalára navigál. 
   * Beállítja az URL-t a megfelelő útvonalra (/tv-details), a sorozat azonosítóját (tvId), valamint a kategóriát (category), a típust (type) és az oldalszámot (page) URL paraméterként.
   * @param tvId 
   */
  navigateToSeriesDetails(tvId: number) {
    this.router.navigate(["/tv-details", tvId], { queryParams: { category: 'series', type: this.selectedType, page: this.currentPage}});
  }

  /**
   * A loadGenres metódus lekéri a filmekhez tartozó műfajokat a MovieService szolgáltatáson keresztül 
   * a getGenres metódus segítségével, és beállítja a genres tömböt.
   */
  loadGenres() {
    this.movieService.getGenres().subscribe((movieData: any) => {
      const movieGenres = movieData.genres;
      this.seriesService.getGenres().subscribe((seriesData: any) => {
        const seriesGenres = seriesData.genres;
        const mergedGenres = this.mergeGenres(movieGenres, seriesGenres);
        this.genres = mergedGenres;
      });
    });
  }

  /**
   * Az mergeGenres függvény tehát összefésüli a filmek és sorozatok műfajait, és visszaadja egyetlen tömbben, kizárva a duplikációkat.
   * @param movieGenres  - összes film műfajai
   * @param seriesGenres  - összes sorozat műfajai
   * @returns genres - mergelt
   */
  mergeGenres(movieGenres: Genre[], seriesGenres: Genre[]): Genre[] {
    const mergedGenres: Genre[] = [...movieGenres];
    for (const seriesGenre of seriesGenres) {
      const isDuplicate = mergedGenres.some((movieGenre) => movieGenre.id === seriesGenre.id);
      if (!isDuplicate) {
        mergedGenres.push(seriesGenre);
      }
    }
    return mergedGenres;
  }
  
  /**
   * A loadMovies metódus meghívja a MovieService szolgáltatás getMovies metódusát, 
   * hogy lekérje a filmek listáját a megadott oldalszámmal és oldalmérettel. 
   * Az eredményt beállítja a movies tömbbe, valamint frissíti a totalResults és totalPages értékeket.
   */
  loadMovies() {
    this.movieService.searchMovies(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page);
        this.totalResults = data.total_results;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
  }
  /**
   * A loadSeries metódus hasonlóképpen működik a loadMovies metódushoz, csak itt a SeriesService szolgáltatás getSeries metódusát hívja meg a sorozatok lekéréséhez.
   */
  loadSeries() {
      this.seriesService.searchSeries(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe((data: SearchResult<Series[]>) => {
        this.series = data.results.flatMap((page) => page);
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries();
        this.fetchSeasonsForSeries();
      });
  }
  
  /**
   * A searchMovies metódus megvizsgálja, hogy van-e keresési lekérdezés (searchQuery) és hogy melyik kategória 
   * (moviesSelected vagy seriesSelected) van kiválasztva. A megfelelő szolgáltatás searchMovies vagy 
   * searchSeries metódusát hívja meg a keresés elvégzéséhez. Ha nincs keresési lekérdezés, 
   * akkor visszaállítja az eredeti filmeket és sorozatokat a loadMovies és loadSeries metódusok segítségével.
   */
  search() {
    if (this.moviesSelected) {
      this.movieService.searchMovies(this.searchQuery, this.currentPage, this.pageSize)
        .subscribe((data: SearchResult<Movie[]>) => {
          this.movies = data.results.flatMap((page) => page);
          this.totalResults = data.total_results;
          this.totalPages = data.total_pages;
          this.fetchImagesForMovies();
          this.fetchActorsForMovies();
        });
    } else {
      this.seriesService.searchSeries(this.searchQuery, this.currentPage, this.pageSize)
        .subscribe((data: SearchResult<Series[]>) => {
          this.series = data.results.flatMap((page) => page);
          this.totalResults = data.total_results;
          this.totalPages = data.total_pages;
          this.fetchImagesForSeries();
          this.fetchSeasonsForSeries();
        });
    }
    this.selectedType = '';
  }

  /**
   * A getPopular metódus lekéri a népszerű filmeket vagy sorozatokat 
   * a MovieService vagy SeriesService szolgáltatáson keresztül a getPopularMovies 
   * vagy getPopularSeries metódusok segítségével. Az eredményt a megfelelő tömbbe helyezi.
   */
  getPopular(){
    if(this.moviesSelected){
      this.movieService.getPopularMovies().subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
    } else {
      this.seriesService.getPopularSeries().subscribe((data: SearchResult<Series[]>) => {
        this.series = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries();
        this.fetchSeasonsForSeries();
      });
    }
  }

  /**
   * Legjobbra értékelt filmek vagy sorozatok lekérdezése
   */
  getTopRated(){
    if(this.moviesSelected){
      // Ha a filmek vannak kiválasztva, lekéri a legjobban értékelt filmeket
      this.movieService.getTopRatedMovies().subscribe((data: SearchResult<Movie[]>) => {
        // Az adatok érkezésekor frissíti a this.movies tömböt a kapott eredményekkel
        this.movies = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies(); // Képek lekérése a filmekhez
        this.fetchActorsForMovies(); // Színészek lekérése a filmekhez
      });
    } else {
      // Ha a sorozatok vannak kiválasztva, lekéri a legjobban értékelt sorozatokat
      this.seriesService.getTopRatedSeries().subscribe((data: SearchResult<Series[]>) => {
        // Az adatok érkezésekor frissíti a this.series tömböt a kapott eredményekkel
        this.series = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries(); // Képek lekérése a sorozatokhoz
        this.fetchSeasonsForSeries(); // Évszakok lekérése a sorozatokhoz
      });
    }
  }

  /**
   * Azokat a filmeket vagy sorozatokat kérdezi le amelyikeket most játszák
   */
  getNowPlaying(){
    if(this.moviesSelected){
      // Ha a filmek vannak kiválasztva, lekéri a jelenleg játszott filmeket
      this.movieService.getNowPlayingMovies().subscribe((data: SearchResult<Movie[]>) => {
        // Az adatok érkezésekor frissíti a this.movies tömböt a kapott eredményekkel
        this.movies = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies(); // Képek lekérése a filmekhez
        this.fetchActorsForMovies(); // Színészek lekérése a filmekhez
      });
    } else {
      // Ha a sorozatok vannak kiválasztva, lekéri a jelenleg játszott sorozatokat
      this.seriesService.getNowPlayingSeries().subscribe((data: SearchResult<Series[]>) => {
        // Az adatok érkezésekor frissíti a this.series tömböt a kapott eredményekkel
        this.series = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries(); // Képek lekérése a sorozatokhoz
        this.fetchSeasonsForSeries(); // Évszakok lekérése a sorozatokhoz
      });
    }
  }

  /**
   * A felkapott sorozatokat vagy filmeket kérdezi le
   */
  getTrending(){
    if(this.moviesSelected){
      // Ha a filmek vannak kiválasztva, lekéri a trendi filmeket
      this.movieService.getTrendingMovies().subscribe((data: SearchResult<Movie[]>) => {
        // Az adatok érkezésekor frissíti a this.movies tömböt a kapott eredményekkel
        this.movies = data.results.flatMap((page) => page); 
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies(); // Képek lekérése a filmekhez
        this.fetchActorsForMovies(); // Színészek lekérése a filmekhez
      });
    } else {
      // Ha a sorozatok vannak kiválasztva, lekéri a trendi sorozatokat
      this.seriesService.getTrendingSeries().subscribe((data: SearchResult<Series[]>) => {
        // Az adatok érkezésekor frissíti a this.series tömböt a kapott eredményekkel
        this.series = data.results.flatMap((page) => page); // Lapok tömbjét lapok nélküli tömbbé alakítja
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries(); // Képek lekérése a sorozatokhoz
        this.fetchSeasonsForSeries(); // Évszakok lekérése a sorozatokhoz
      });
    }
  }
  
  /**
   * Képek lekérdezése a filmekhez
   */
  fetchImagesForMovies() {
    const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
  
    for (const movie of this.movies) {
      // A movieService segítségével lekéri a filmhez tartozó képeket
      this.movieService.getMovieImages(movie.id).subscribe((imageData: any) => {
        if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
          // Ha vannak háttérképek az adott filmhez, akkor frissíti a movie.images tömböt
          movie.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
          
          if (movie.images.length === 0) {
            // Ha nincs elérhető kép, akkor helyettesítő képet ad a movie.images tömbhöz
            movie.images.push({
              file_path: placeholderImagePath,
            });
          }
          
          movie.imagesLoaded = true;
        }
      });
    }
  }

  /**
   * Fetchs images for series
   */
  fetchImagesForSeries() {
    const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
  
    for (const ser of this.series) {
      this.seriesService.getSeriesImages(ser.id).subscribe((imageData: any) => {
        if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
          ser.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
  
          if (ser.images.length === 0) {
            ser.images.push({
              file_path: placeholderImagePath,
            });
          }
          ser.imagesLoaded = true;
        }
      });
    }
  }

  /**
   * Évadok lekérdezése a sorozatokhoz
   */
  fetchSeasonsForSeries() {
    for (const ser of this.series) {
      // A seriesService segítségével lekéri a sorozat évadait
      this.seriesService.getSeasons(ser.id).subscribe((seasonData: Season[]) => {
        ser.seasons = seasonData; // Az évadokat hozzárendeli a sorozat objektumhoz
      });
    }
  }

  /**
   * A filmhez tartozó színészek lekérdezése a MovieService segítségével.
   * Beállítja a komponens property-jébe a kapott adatokat.
   */
  fetchActorsForMovies() {
    for (const movie of this.movies) {
      this.movieService.getActors(movie.id).subscribe((actorData: Actor[]) => {
        movie.actors = actorData;
      });
    }
  }

  /**
   * Egy kép URL-t generál a TMDB (The Movie Database) szolgáltatásból. 
   * Az alap kép URL-t (baseImageUrl) és a képméretet (imageSize) összeadva és a fájl elérési útvonalát (filePath) hozzáfűzve kapjuk meg a teljes kép URL-t.
   * @param fájl elérési útvonala a weben 
   * @returns  
   */
  getImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }

  /**
   * Ugrás a következő oldalra, ahol a többi film vagy sorozat található
   * @param page 
   */
  goToPage(page: number) {
    // Ellenőrzi, hogy a megadott oldalszám a megengedett tartományban van-e
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // Beállítja az aktuális oldalszámot
      if (this.moviesSelected) {
        this.loadMovies(); // Betölti a filmeket az új oldalszámhoz
      } else {
        this.loadSeries(); // Betölti a sorozatokat az új oldalszámhoz
      }
    }
  }

  /**
   * Máfajok lekérdezése ID alapján
   * @param genreIds 
   * @returns genres by ids 
   */
  getGenresByIds(genreIds: number[]): string {
    // Ellenőrzi, hogy a this.genres és a genreIds változók léteznek-e
    if (!this.genres || !genreIds) {
      return '';
    }
  
    const genreNames: string[] = genreIds.map((id) => {
      // Megkeresi az adott azonosítóhoz tartozó műfajt a this.genres tömbben
      const genre = this.genres.find((genre) => genre.id === id);
      return genre ? genre.name : ''; // Ha talált műfajt, visszaadja a nevét, különben üres stringet ad vissza
    });
  
    return genreNames.join(', '); // Összefűzi a műfajok neveit vesszővel elválasztva
  }

  
}
