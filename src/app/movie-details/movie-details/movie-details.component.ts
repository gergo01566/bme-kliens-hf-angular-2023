// movie-details.component.ts
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Movie } from 'src/app/models/movie.type';
import { MovieService } from 'src/app/services/movie.service';

import { CommonModule } from '@angular/common';
import { Actor } from 'src/app/models/actor.type';
import { Genre } from 'src/app/models/genre.type';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})

export class MovieDetailsComponent implements OnInit {
  movieId: number = 0;
  movie!: Movie;

  constructor(private movieService: MovieService  ,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      console.log(this.movie); // Display the movie ID
      // Perform any other logic with the movie ID
    });
    this.fetchMovieDetails();
    console.log(this.movie);
  }

  onItemChange(event: any) {
    console.log('Carousel onItemChange', event);
  }

  fetchMovieDetails() {
    this.movieService.getMovieById(this.movieId).subscribe(
      (movie: Movie) => {
        this.movie = movie;
        console.log(this.movie); // Display the fetched movie details
  
        this.movieService.getMovieImages(this.movieId).subscribe((imageData: any) => {
          const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
          if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
            this.movie.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
            
            // Check if movie.images array is empty
            if (this.movie.images.length === 0) {
              // Add a placeholder image to the movie.images array
              this.movie.images.push({
                file_path: placeholderImagePath,
                // You can add more properties if needed, such as width and height
              });
            }
            
            this.movie.imagesLoaded = true;
          }
        });
  
        this.fetchActorsForMovies();
        this.fetchGenreForMovie();
      },
      (error) => {
        console.error(error); // Handle the error
      }
    );
  }
  


  getImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }

  goBack() {
    this.router.navigate(['/']); // Replace '/' with the appropriate route for going back
  }

  fetchActorsForMovies() {
      this.movieService.getActors(this.movieId).subscribe((actorData: Actor[]) => {
        this.movie.actors = actorData;
      });
    }

    fetchGenreForMovie() {
      this.movieService.getGenres().subscribe((genreData: Genre[]) => {
        if (genreData.length > 0) {
          const genre: Genre = {
            id: genreData[0].id, // Assign the ID of the first genre
            name: genreData[0].name // Assign the name of the first genre
          };
          this.movie.genre = genre.name;
        }
      });
    }
    
    

}
