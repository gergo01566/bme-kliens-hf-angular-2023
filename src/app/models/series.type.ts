import { Season } from "./season.type";

export interface Series {
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
  images: any[]; // Add the images property
  imagesLoaded: boolean; // Add the imagesLoaded property
  seasons: Season[]; // Add the seasons property
  }