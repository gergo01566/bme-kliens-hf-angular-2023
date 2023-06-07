// series-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Series } from '../models/series.type';
import { SeriesService } from '../services/series.service';
import { Genre } from 'src/app/models/genre.type';

/**
 * Component
 */
@Component({
  selector: 'app-series-details',
  templateUrl: './series-details.component.html',
  styleUrls: ['./series-details.component.css']
})

/**
 * Angular komponens, amely a sorozatok részleteit jeleníti meg.
 */
export class SeriesDetailsComponent implements OnInit{

  tvId: number = 0;
  series!: Series;
/**
 * Az osztály konstruktora inicializálja a szolgáltatásokat és az útválasztót a szükséges függőségekkel.
 * @param seriesService 
 * @param route 
 * @param router 
 */
constructor(private seriesService: SeriesService  ,private route: ActivatedRoute, private router: Router) {}

/**
 * Inicializáló metódus, a route-ból kapott paramétert megfelelteti a tvId-val, így lekérhető az adott sorozat
 */
ngOnInit() {
    this.route.params.subscribe(params => {
      this.tvId = +params['id'];
    });
    this.fetchSeriesDetails();
  }

/**
 * Sorozat részleteit kéri le a seriesService getSeriesbyId metódusával
 * Majd a képeket hozzárendeli az adott sorozathoz
 * Ehhez előbb lekéri a képeket Id alapján, ha a kép nem létezik, akkor elérési útvonalként egy placeholder image url-t állít be
 * Ha a leírás az adott sorozatról nem létezik magyar nyelven, akkor azt lekéri angolul
 */
fetchSeriesDetails() {
    this.seriesService.getSeriesById(this.tvId).subscribe(
      (tv: Series) => {
        this.series = tv;
  
        this.seriesService.getSeriesImages(this.tvId).subscribe((imageData: any) => {
          const placeholderImagePath = 'https://www.unfe.org/wp-content/uploads/2019/04/SM-placeholder.png';
          if (imageData && imageData.backdrops && imageData.backdrops.length > 0) {
            this.series.images = imageData.backdrops.filter((image: any) => image.file_path !== null);
            const placeholderImagePath = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';
            
            if (this.series.images.length === 0 || this.series.images[0].file_path === null) {
              this.series.images.push({
                file_path: placeholderImagePath,
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

  /**
   * Egy kép URL-t generál a TMDB (The Movie Database) szolgáltatásból. 
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
   * A sorozathoz tartozó műfaj lekérdezése a SeriesService segítségével.
   * Beállítja a komponens property-jébe a kapott adatok alapján.
   */
fetchGenreForSeries() {
    this.seriesService.getGenres().subscribe((genreData: Genre[]) => {
      if (genreData.length > 0) {
        const genre: Genre = {
          id: genreData[0].id, 
          name: genreData[0].name 
        };
        this.series.genre = genre.name;
      }
    });
  }

/**
 * Visszanavigál a paraméterek alapján az előző oldalra
 */
goBack() {
    const type = this.route.snapshot.queryParamMap.get('type') ?? '';
    const pageNumber = this.route.snapshot.queryParamMap.get('page') ?? '';
    const category = this.route.snapshot.queryParamMap.get('category') ?? '';
  
    if (type && pageNumber) {
      this.router.navigate(['/discover', category, type, pageNumber]);
    } else {
      this.router.navigate(['/discover']);
    }
  }
  
}
