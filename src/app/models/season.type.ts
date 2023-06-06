/**
 * Season interfészt, amely egy tévésorozat évadát reprezentálja.
 * 
 * Az Season interfész használata célja, hogy strukturált formában tárolja az egyes tévésorozat évadainak adatait.
 */
export interface Season{
    id: number;
    air_date: string;
    name: string;
    episode_count: number;
    season_number: number;
    poster_path: string;
}