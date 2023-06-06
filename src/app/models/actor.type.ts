import { Movie } from "./movie.type";

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

