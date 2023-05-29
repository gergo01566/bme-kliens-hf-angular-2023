import { Component, OnInit } from "@angular/core";
import { Movie } from "../models/movie.type";
import { MovieService } from "../services/movie.service";
import { SearchResult } from "../models/search-result.ype";
import { Genre } from "../models/genre.type";
import { Actor } from "../models/actor.type";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[]; // Initialize as an empty array
  genres: Genre[]; // Initialize as an empty array
  searchQuery: string = '';
  isTextboxFocused: boolean = false;

  constructor(private movieService: MovieService) {}

  currentPage: number = 1;
  pageSize: number = 10;
  totalResults: number = 0;
  totalPages: number = 0;

  ngOnInit() {
    this.loadMovies();
    this.loadGenres();
  }

  loadGenres() {
    this.movieService.getGenres().subscribe((data: any) => {
      this.genres = data.genres; // Adjust the mapping based on the API response structure
      console.log(this.genres);
      console.log('ok' + this.getGenresByIds([28,15]));
    });
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
  

  searchMovies() {
    this.movieService.searchMovies(this.searchQuery, this.currentPage, this.pageSize)
      .subscribe((data: SearchResult<Movie[]>) => {
        this.movies = data.results.flatMap((page) => page); // Flatten the array of pages
        console.log(this.movies);
  
        this.totalResults = data.total_results; // Assign total_results to a variable
        console.log(this.totalResults);
  
        this.totalPages = data.total_pages; // Assign total_pages to a variable
        console.log(this.totalPages);
  
        this.fetchImagesForMovies();
        this.fetchActorsForMovies(); // Return
      });
  }
  

  fetchImagesForMovies() {
    for (const movie of this.movies) {
      this.movieService.getMovieImages(movie.id).subscribe((imageData: any) => {
        if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
          movie.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
          movie.imagesLoaded = true;
        }
      });
    }
  }

  fetchActorsForMovies() {
    for (const movie of this.movies) {
      this.movieService.getActors(movie.id).subscribe((actorData: Actor[]) => {
        movie.actors = actorData;
        console.log(movie.actors);
      });
    }
  }
  

  getMovieImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }


  
  goToPage(page: number) {
    console.log(this.totalPages);
    
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMovies();
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
