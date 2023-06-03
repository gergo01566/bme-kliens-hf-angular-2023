import { Injectable } from '@angular/core';
import { environment } from '../environments';
import { HttpClient } from '@angular/common/http';
import { Series } from '../models/series.type';
import { SearchResult } from '../models/search-result.ype';
import { Observable } from 'rxjs';
import { Genre } from '../models/genre.type';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(private http: HttpClient) { }

  getPopularSeries(): Observable<SearchResult<Series[]>> {
    const url = `${this.apiUrl}/tv/popular?api_key=${this.apiKey}`;
    return this.http.get<SearchResult<Series[]>>(url);
  }

  searchSeries(query: string, page: number, pageSize: number): Observable<SearchResult<Series[]>> {
    console.log(query);
    if (query === '') {
      const url1 = `${this.apiUrl}/tv/popular?api_key=${this.apiKey}&page=${page}&include_adult=false`;
      return this.http.get<SearchResult<Series[]>>(url1);
    }
    const url = `${this.apiUrl}/search/tv?api_key=${this.apiKey}&language=hu&query=${query}&page=${page}&include_adult=false`;
    return this.http.get<SearchResult<Series[]>>(url);
  }


  getSeriesImages(tvId: number) {
      const url = `${this.apiUrl}/tv/${tvId}/images?api_key=${this.apiKey}`;
      return this.http.get(url);
  }

  getGenres(): Observable<Genre[]> {
    const url = `https://api.themoviedb.org/3/genre/tv/list?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Genre[]>(url);
  }



  // getActors(movieId: number): Observable<Actor[]> {
  //   const url = `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}`;
  //   return this.http.get<Actor[]>(url).pipe(
  //     map((response: any) => response.cast)
  //   );
  // }
}
