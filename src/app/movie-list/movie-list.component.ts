import { Movie } from "../models/movie.type";
import { MovieService } from "../services/movie.service";
import { SearchResult } from "../models/search-result.ype";
import { Genre } from "../models/genre.type";
import { Actor } from "../models/actor.type";
import { SeriesService } from "../services/series.service";
import { Series } from "../models/series.type";
import { Season } from "../models/season.type";
import { Router } from "@angular/router";
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})

export class MovieListComponent implements OnInit {
  movies: Movie[] = [] ;// Initialize as an empty array
  series: Series[] = [] ; // Initialize as an empty array
  genres: Genre[] = [] ; // Initialize as an empty array
  searchQuery: string = '';
  isTextboxFocused: boolean = false;
  moviesSelected: boolean = true;
  seriesSelected: boolean = false;
  selectedType: string = "";
  currentPage: number = 1;
  pageSize: number = 10;
  totalResults: number = 0;
  totalPages: number = 0;


  selectMovies() {
    this.moviesSelected = true;
    this.seriesSelected = false;
    this.currentPage = 1;
    this.loadMovies();
    this.selectedType =  "";
  }
  
  selectSeries() {
    this.moviesSelected = false;
    this.seriesSelected = true;
    this.currentPage = 1;
    this.loadSeries();
    this.selectedType =  "";
  }
  

  selectType(type: string) {
    if (type === 'movies' || type === 'series') {
      this.moviesSelected = type === 'movies';
      this.seriesSelected = type === 'series';
      // Call the corresponding method or perform any other actions for selecting movies or series
    } else if (type === 'popular') {
      this.getPopular();
      this.selectedType = type;
    } else {
      this.selectedType = type;
      // Call the corresponding method or perform any other actions for selecting the other buttons
    }
  }
  

  constructor(private movieService: MovieService, private seriesService: SeriesService, private router: Router) {}

  ngOnInit() {
    this.loadMovies();
    this.loadSeries();
    this.getPopular();
    this.loadGenres();
    this.searchMovies();
  }

  navigateToMovieDetails(movieId: number) {
    console.log(movieId);
    this.router.navigate(["/movie-details", movieId]);
  }

  navigateToSeriesDetails(tvId: number) {
    console.log(tvId);
    this.router.navigate(["/tv-details", tvId]);
  }

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
  

  loadMovies() {
    this.movieService.searchMovies(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
  }

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
  

  searchMovies() {
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
    console.log(this.series);
  }

  getPopular(){
    if(this.moviesSelected){
      this.movieService.getPopularMovies().subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
    } else {
      this.seriesService.getPopularSeries().subscribe((data: SearchResult<Series[]>) => {
        this.series = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries();
        this.fetchSeasonsForSeries();
        //this.fetchActorsForMovies();
      });
    }
  }

  getTopRated(){
    if(this.moviesSelected){
      this.movieService.getTopRatedMovies().subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
    } else {
      this.seriesService.getTopRatedSeries().subscribe((data: SearchResult<Series[]>) => {
        this.series = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries();
        this.fetchSeasonsForSeries();
        //this.fetchActorsForMovies();
      });
    }
  }

  getNowPlaying(){
    if(this.moviesSelected){
      this.movieService.getNowPlayingMovies().subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
    } else {
      this.seriesService.getNowPlayingSeries().subscribe((data: SearchResult<Series[]>) => {
        this.series = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries();
        this.fetchSeasonsForSeries();
        //this.fetchActorsForMovies();
      });
    }
  }

  getTrending(){
    if(this.moviesSelected){
      this.movieService.getTrendingMovies().subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForMovies();
        this.fetchActorsForMovies();
      });
    } else {
      this.seriesService.getTrendingSeries().subscribe((data: SearchResult<Series[]>) => {
        this.series = data.results.flatMap((page) => page); // Flatten the array of pages
        this.totalResults = data.total_results;
        this.totalPages = data.total_pages;
        this.fetchImagesForSeries();
        this.fetchSeasonsForSeries();
        //this.fetchActorsForMovies();
      });
    }
  }

  

  fetchImagesForMovies() {
    const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
  
    for (const movie of this.movies) {
      this.movieService.getMovieImages(movie.id).subscribe((imageData: any) => {
        if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
          movie.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
          
          // Check if movie.images array is empty
          if (movie.images.length === 0) {
            // Add a placeholder image to the movie.images array
            movie.images.push({
              file_path: placeholderImagePath,
              // You can add more properties if needed, such as width and height
            });
          }
          
          movie.imagesLoaded = true;
        }
      });
    }
  }

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

  fetchSeasonsForSeries() {
    for (const ser of this.series) {
      this.seriesService.getSeasons(ser.id).subscribe((seasonData: Season[]) => {
        console.log(seasonData);
        ser.seasons = seasonData;
        console.log(ser.seasons);
      });
    }
  }  


  fetchActorsForMovies() {
    for (const movie of this.movies) {
      this.movieService.getActors(movie.id).subscribe((actorData: Actor[]) => {
        movie.actors = actorData;
      });
    }
  }

  getImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }
  
  goToPage(page: number) {
    
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      if(this.moviesSelected) this.loadMovies();
      else this.loadSeries();
    }
  }
  

  get availablePages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  getGenresByIds(genreIds: number[]): string {
    if (!this.genres || !genreIds) {
      return '';
    }

    const genreNames: string[] = genreIds.map((id) => {
      const genre = this.genres.find((genre) => genre.id === id);
      return genre ? genre.name : '';
    });

    return genreNames.join(', ');
  }

  
}
