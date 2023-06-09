import { Actor } from "./actor.type";
/**
 * Movie interfész, amely leírja egy film tulajdonságait és adattagjait.
 * 
 * Az Movie interfész segítségével definiálhatjuk a filmeket reprezentáló objektumok struktúráját és adattagjait, amelyeket a kódban használhatunk példányosításkor és adathozzáférés során.
 */
export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: Array<number>;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
  video: boolean;
  budget: number;
  status: string;
  year: number;
  director: string;
  rating: number;
  genre: string;
  runtime: number;
  description: string;
  imageUrl: string;
  trailerUrl: string;
  images: any[]; // Add the images property
  imagesLoaded: boolean; // Add the imagesLoaded property
  actors: Actor[]; // Add the actors property
  character: string; // Add the actors property
  }

  