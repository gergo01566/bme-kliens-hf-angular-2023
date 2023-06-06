import { Season } from "./season.type";
/**
 * Series interfészt, amely egy tévésorozatot reprezentál.
 */
export interface Series {
number_of_seasons: string;
  name: string;
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
  first_air_date: string;
  images: any[]; 
  imagesLoaded: boolean; 
  seasons: Season[];
  }