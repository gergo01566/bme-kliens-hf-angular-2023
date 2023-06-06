// series-details.component.ts
import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Series } from '../models/series.type';
import { SeriesService } from '../services/series.service';
import { Genre } from 'src/app/models/genre.type';

@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.css']
})
export class SeriesDetailsComponent implements OnInit{

  tvId: number = 0;
  series!: Series;

  constructor(private seriesService: SeriesService  ,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tvId = +params['id'];
      console.log(this.tvId); // Display the movie ID
    });
    this.fetchSeriesDetails();
    console.log(this.series);
  }

  fetchSeriesDetails() {
    this.seriesService.getSeriesById(this.tvId).subscribe(
      (tv: Series) => {
        this.series = tv;
  
        this.seriesService.getSeriesImages(this.tvId).subscribe((imageData: any) => {
          const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
          if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
            this.series.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
            
            // Check if movie.images array is empty
            if (this.series.images.length === 0) {
              // Add a placeholder image to the movie.images array
              this.series.images.push({
                file_path: placeholderImagePath,
                // You can add more properties if needed, such as width and height
              });
            }
            
            this.series.imagesLoaded = true;
          }
        });
        if (this.series.overview === '') {
          this.seriesService.getSeriesByIdInEngligh(this.tvId).subscribe(
            (seriesDetails: Series) => {
              this.series.overview = seriesDetails.overview;
            }
          );
        }
        this.fetchGenreForSeries();
      }
    )
  }

  getImageURL(filePath: string) {
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const imageSize = 'w500'; // You can adjust the size as per your requirements
    return baseImageUrl + imageSize + filePath;
  }

  fetchGenreForSeries() {
    this.seriesService.getGenres().subscribe((genreData: Genre[]) => {
      if (genreData.length > 0) {
        const genre: Genre = {
          id: genreData[0].id, // Assign the ID of the first genre
          name: genreData[0].name // Assign the name of the first genre
        };
        this.series.genre = genre.name;
      }
    });
  }

  goBack() {
    const type = this.route.snapshot.queryParamMap.get('type') ?? '';
    const pageNumber = this.route.snapshot.queryParamMap.get('page') ?? '';
    const category = this.route.snapshot.queryParamMap.get('category') ?? '';
    console.log(type, pageNumber, category);
  
    if (type && pageNumber) {
      this.router.navigate(['/discover', category, type, pageNumber]);
    } else {
      this.router.navigate(['/discover']);
    }
  }
  

  

}
