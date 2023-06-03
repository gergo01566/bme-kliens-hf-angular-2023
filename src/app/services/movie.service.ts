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
export class MovieService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<SearchResult<Movie[]>> {
    const url = `${this.apiUrl}/movie/popular?api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }

  searchMovies(query: string, page: number, pageSize: number): Observable<SearchResult<Movie[]>> {
    if (query === '') {
      const url1 = `${this.apiUrl}/movie/popular?language=hu&api_key=${this.apiKey}&page=${page}&include_adult=false`;
      return this.http.get<SearchResult<Movie[]>>(url1);
    }
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=hu&query=${query}&page=${page}&include_adult=false`;
    return this.http.get<SearchResult<Movie[]>>(url);
  }


  getMovieImages(movieId: number) {
      const url = `${this.apiUrl}/movie/${movieId}/images?api_key=${this.apiKey}`;
      return this.http.get(url);
  }

  getGenres(): Observable<Genre[]> {
    const url = `https://api.themoviedb.org/3/genre/movie/list?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Genre[]>(url);
  }

  getActors(movieId: number): Observable<Actor[]> {
    const url = `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`;
    return this.http.get<Actor[]>(url).pipe(
      map((response: any) => response.cast)
    );
  }

}
