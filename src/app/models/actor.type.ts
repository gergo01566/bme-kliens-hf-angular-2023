import { Movie } from "./movie.type";
/**
 * Actor interfészt, amely leírja egy színész tulajdonságait és adattagjait.
 * 
 * Az Actor interfész meghatározza a színész objektum struktúráját és adattagjait, amelyeket a kódban használhatunk példányosításkor és adathozzáférés során.
 */
export interface Actor{
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    orriginal_name: string;
    popularity: number;
    poster_path: string;
    profile_path: string
    cast_id: number;
    character: string;
    credit_id: number;
    order: number;
    images: any[];
    movies: Movie[];
    biography: string;
    birthday: string;
    place_of_birth: string;
    imagesLoaded: boolean; // Add the imagesLoaded property
}

