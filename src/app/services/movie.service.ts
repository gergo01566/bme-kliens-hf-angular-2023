import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getPopularMovies(): Observable<Movie[]> {
    const url = `${this.apiUrl}/movie/popular?api_key=${this.apiKey}`;
    return this.http.get<Movie[]>(url);
  }

  searchMovies(query: string): Observable<Movie[]> {
    if(query === '') {
      const url1 = `${this.apiUrl}/movie/popular?api_key=${this.apiKey}`;
      return this.http.get<Movie[]>(url1);
    }
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&language=hu&query=${query}`;
    return this.http.get<Movie[]>(url);
  }

  getMovieImages(movieId: number) {
    const url = `${this.apiUrl}/movie/${movieId}/images?api_key=${this.apiKey}`;
    return this.http.get(url);
  }
}
