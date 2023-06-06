import { Injectable } from '@angular/core';
import { environment } from '../environments';
import { HttpClient } from '@angular/common/http';
import { Series } from '../models/series.type';
import { SearchResult } from '../models/search-result.ype';
import { Observable, map } from 'rxjs';
import { Genre } from '../models/genre.type';
import { Season } from '../models/season.type';

@Injectable({
  providedIn: 'root'
})

/**
* SeriesService osztály a sorozatok adatainak lekéréséhez
 * A metódusok a saját API-kulcsukat (apiKey) és az API végpontot (apiUrl) használják az adatok lekérése céljából. 
 * A HttpClient segítségével HTTP GET kéréseket küldenek a szerverhez, majd az Observable típus segítségével visszatérnek a válaszadattal. 
 * 
 * Ez a szolgáltatásosztály egy API-val kommunikál, és különböző metódusokat kínál a sorozatokkal kapcsolatos adatok lekérésére. 
 * Az @Injectable() dekorátor megjelöli az osztályt, hogy az injektálható legyen az Angular alkalmazásban.
 */
export class SeriesService {

  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  // Metódusok

  /**
   * Népszerű sorozatok lekérése Api hívással
   * @returns Observable<SearchResult<Series[]>>
   */
  getPopularSeries(): Observable<SearchResult<Series[]>> {
    const url = `${this.apiUrl}/tv/popular?language=hu&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Series[]>>(url);
  }

  /**
   * Legjobban értékelt sorozatok lekérése.
   * @returns Observable<SearchResult<Series[]>>
   */
  getTopRatedSeries(): Observable<SearchResult<Series[]>> {
    const url = `${this.apiUrl}/tv/top_rated?language=hu&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Series[]>>(url);
  }

  /**
   * Jelenleg játszott sorozatok lekérése.
   * @returns Observable<SearchResult<Series[]>>
   */
  getNowPlayingSeries(): Observable<SearchResult<Series[]>> {
    const url = `${this.apiUrl}/tv/airing_today?language=hu&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Series[]>>(url);
  }

  /**
   * Felkapott sorozatok lekérése.
   * @returns Observable<SearchResult<Series[]>>
   */
  getTrendingSeries(): Observable<SearchResult<Series[]>> {
    const url = `${this.apiUrl}/trending/tv/week?language=hu&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Series[]>>(url);
  }

  /**
   * Sorozatok keresése a megadott keresőszó alapján, ha nincs keresési feltétel megadva akkor a legnépszerűbb sorozatokkal tér vissza.
   * @param query A keresőszó
   * @param page Az oldalszám
   * @param pageSize Az oldalméret
   * @returns Observable<SearchResult<Series[]>>
   */
  searchSeries(query: string, page: number, pageSize: number): Observable<SearchResult<Series[]>> {
    console.log(query);
    if (query === '') {
      const url1 = `${this.apiUrl}/tv/popular?language=hu&api_key=${this.apiKey}&page=${page}&include_adult=false`;
      return this.http.get<SearchResult<Series[]>>(url1);
    }
    const url = `${this.apiUrl}/search/tv?api_key=${this.apiKey}&language=hu&query=${query}&page=${page}&include_adult=false`;
    return this.http.get<SearchResult<Series[]>>(url);
  }

  /**
   * Sorozatok képeinek lekérése a megadott sorozat azonosító alapján.
   * @param tvId A sorozat azonosítója
   * @returns any
   */
  getSeriesImages(tvId: number) {
    const url = `${this.apiUrl}/tv/${tvId}/images?api_key=${this.apiKey}`;
    return this.http.get(url);
  }

  /**
   * Sorozatok műfajainak lekérése.
   * @returns Observable<Genre[]>
   */
  getGenres(): Observable<Genre[]> {
    const url = `https://api.themoviedb.org/3/genre/tv/list?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Genre[]>(url);
  }

  /**
   * Sorozatok évadjainak lekérése a megadott sorozat azonosító alapján.
   * @param tvId A sorozat azonosítója
   * @returns Observable<Season[]>
   */
  getSeasons(tvId: number): Observable<Season[]> {
    const url = `${this.apiUrl}/tv/${tvId}?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Season[]>(url).pipe(
      map((response: any) => response.seasons)
    );
  }

  /**
   * Sorozat lekérése az azonosító alapján.
   * @param tvId A sorozat azonosítója
   * @returns Observable<Series>
   */
  getSeriesById(tvId: number): Observable<Series> {
    const url = `${this.apiUrl}/tv/${tvId}?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Series>(url);
  }

  /**
   * Sorozat lekérése az azonosító alapján. Angol részleteket ad vissza
   * @param tvId A sorozat azonosítója
   * @returns Observable<Series>
   */
  getSeriesByIdInEngligh(tvId: number): Observable<Series> {
    const url = `${this.apiUrl}/tv/${tvId}?language=en-US&api_key=${this.apiKey}`;
    return this.http.get<Series>(url);
  }
}