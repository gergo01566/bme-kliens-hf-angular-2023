import { Injectable } from '@angular/core';
import { environment } from '../environments';
import { HttpClient } from '@angular/common/http';
import { Actor } from '../models/actor.type';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.type';


@Injectable({
  providedIn: 'root'
})

/**
 * ActorService osztály a színészek adatainak lekéréséhez
 * A metódusok a saját API-kulcsukat (apiKey) és az API végpontot (apiUrl) használják az adatok lekérése céljából. 
 * A HttpClient segítségével HTTP GET kéréseket küldenek a szerverhez, majd az Observable típus segítségével visszatérnek a válaszadattal. 
 * 
 * Ez a szolgáltatásosztály egy API-val kommunikál, és különböző metódusokat kínál a színészekkel kapcsolatos adatok lekérésére. 
 * Az @Injectable() dekorátor megjelöli az osztályt, hogy az injektálható legyen az Angular alkalmazásban.
 */
export class ActorService {

  private apiKey = environment.apiKey;
  private apiUrl = 'https://api.themoviedb.org/3';

  constructor(
    private http: HttpClient
  ){ }
  
  /**
   * Színész lekérése
   * @param actorId - A színész azonosítója
   * @returns A színész
   */
  getActor(actorId: number): Observable<Actor> {
    const url = `${this.apiUrl}/person/${actorId}?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Actor>(url);
  }

  /**
   * Filmek lekérése színész alapján
   * @param actorId - A színész azonosítója
   * @returns A filmek színész alapján
   */
  getMoviesByActor(actorId: number): Observable<Movie[]> {
    const url = `${this.apiUrl}/person/${actorId}/movie_credits?language=hu&api_key=${this.apiKey}`;
    return this.http.get<Movie[]>(url);
  }

  /**
   * Színész részleteinek lekérése angol nyelven, ha a színész egyes adatai magyar nyelven nem elérhetőek
   * @param actorId - A színész azonosítója
   * @returns A színész részletei angol nyelven
   */
  getActorDetailsInEnglish(actorId: number): Observable<Actor> {
    const url = `${this.apiUrl}/person/${actorId}?language=en-US&api_key=${this.apiKey}`;
    return this.http.get<Actor>(url);
  }
}
