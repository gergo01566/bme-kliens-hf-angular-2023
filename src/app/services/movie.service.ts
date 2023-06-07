import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.type';
import { SearchResult } from '../models/search-result.ype';
import { Genre } from '../models/genre.type';
import { Actor } from '../models/actor.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

/**
 * MovieService osztály a filmek lekéréséhez
 * A metódusok a saját API-kulcsukat (apiKey) és az API végpontot (apiUrl) használják az adatok lekérése céljából. 
 * A HttpClient segítségével HTTP GET kéréseket küldenek a szerverhez, majd az Observable típus segítségével visszatérnek a válaszadattal. 
 * 
 * Ez a szolgáltatásosztály egy API-val kommunikál, és különböző metódusokat kínál a filmekkel kapcsolatos adatok lekérésére. 
 * Az @Injectable() dekorátor megjelöli az osztályt, hogy az injektálható legyen az Angular alkalmazásban.
 */
export class MovieService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  /**
   * Népszerű filmek lekérése API hívással magyar nyelven
   * @returns A népszerű filmek SearchResultként
   */
  getPopularMovies(page: number): Observable<SearchResult<Movie[]>> {
      const url = `${this.apiUrl}/movie/popular?language=hu&page=${page}&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }

  /**
   * Legjobban értékelt filmek lekérése magyar nyelven
   * @returns A legjobban értékelt filmek SearchResultként
   */
  getTopRatedMovies(page: number): Observable<SearchResult<Movie[]>> {
    const url = `${this.apiUrl}/movie/top_rated?language=hu&page=${page}&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }

  /**
   * Jelenleg játszó filmek lekérése magyar nyelven
   * @returns A jelenleg játszó filmek SearchResultként
   */
  getNowPlayingMovies(page: number): Observable<SearchResult<Movie[]>> {
    const url = `${this.apiUrl}/movie/now_playing?language=hu&page=${page}&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }

  /**
   * Felkapott filmek lekérése
   * @returns A felkapott filmek SearchResultként
   */
  getTrendingMovies(page:number): Observable<SearchResult<Movie[]>> {
    const url = `${this.apiUrl}/trending/movie/week?language=hu&page=${page}&api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }

  /**
   * Filmek keresése
   * @param query - A keresési kifejezés
   * @param page - Az oldalszám
   * @param pageSize - Az oldalméret
   * @returns A filmek SearchResultként
   */
  searchMovies(query: string, page: number, pageSize: number): Observable<SearchResult<Movie[]>> {
    if (query === '') {
      const url1 = `${this.apiUrl}/movie/popular?language=hu&api_key=${this.apiKey}&page=${page}&include_adult=false`;
      return this.http.get<SearchResult<Movie[]>>(url1);
    }
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=hu&query=${query}&page=${page}&include_adult=false`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }

  /**
   * Filmképek lekérése
   * @param movieId - A film azonosítója
   * @returns A filmképek
   */
  getMovieImages(movieId: number) {
    const url = `${this.apiUrl}/movie/${movieId}/images?api_key=${this.apiKey}`;
    return this.http.get(url);
  }

  /**
   * Műfajok lekérése
   * @returns A műfajok Genreként
   */
  getGenres(): Observable<Genre[]> {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Genre[]>(url);
  }

  /**
   * Színészek lekérése, itt csak a cast blokkra van szükség ezért csak azt adjuk vissza
   * @param movieId - A film azonosítója
   * @returns A színészek
   */
  getActors(movieId: number): Observable<Actor[]> {
    const url = `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`;
    return this.http.get<Actor[]>(url).pipe(
      map((response: any) => response.cast)
    );
  }

  /**
   * Film lekérése azonosító alapján
   * @param movieId - A film azonosítója
   * @returns A film
   */
  getMovieById(movieId: number): Observable<Movie> {
    const url = `${this.apiUrl}/movie/${movieId}?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Movie>(url);
  }
}
