/**
 * Generikus SearchResult interfész, amely egy keresési eredményt reprezentál.
 * Az SearchResult interfész használata célja, hogy strukturált formában tárolja a keresés eredményét, beleértve az oldalszámot, 
 * találatok számát, valamint a keresési feltételt. Ezáltal könnyen kezelhetővé teszi a keresési eredményeket és lehetővé teszi az adatok könnyű átvitelét és feldolgozását.
 */
export interface SearchResult<T> {
    results: T[];
    page: number;
    pageSize: number;
    total_pages: number; 
    total_results: number; 
    searchTerm: string;
  }
  