import { Component, OnInit } from "@angular/core";
import { Movie } from "../models/movie.type";
import { MovieService } from "../services/movie.service";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = []; // Initialize as an empty array
  searchQuery: string = '';
  isTextboxFocused: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.movieService.getPopularMovies().subscribe((data: any) => {
      this.movies = data.results.filter((movie: any) => movie.poster_path !== null);
      this.fetchImagesForMovies();
    });
  }

  searchMovies() {
    this.movieService.searchMovies(this.searchQuery).subscribe((data: any) => {
      this.movies = data.results;
      this.fetchImagesForMovies();
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
  
  

  getMovieImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }
}
