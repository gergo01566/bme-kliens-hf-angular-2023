import { Injectable } from '@angular/core';
import { environment } from '../environments';
import { HttpClient } from '@angular/common/http';
import { Actor } from '../models/actor.type';
import { Observable, map } from 'rxjs';
import { Movie } from '../models/movie.type';


@Injectable({
  providedIn: 'root'
})
export class ActorService {
  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(
    private http: HttpClient
  ){ }

  getActor(actorId: number): Observable<Actor> {
    const url = `${this.apiUrl}/person/${actorId}?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Actor>(url);

  }

  getMoviesByActor(actorId: number): Observable<Movie[]> {
    const url = `${this.apiUrl}/person/${actorId}/movie_credits?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Movie[]>(url);
  }

  getActorDetailsInEnglish(actorId: number): Observable<Actor> {
    const url = `${this.apiUrl}/person/${actorId}?language=en-US&api_key=${this.apiKey}`;
    return this.http.get<Actor>(url);
  }
}


