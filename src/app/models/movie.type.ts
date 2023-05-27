export interface Movie {
    id: number;
    title: string;
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
  }
  