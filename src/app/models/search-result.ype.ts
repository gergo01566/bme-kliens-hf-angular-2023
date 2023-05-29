export interface SearchResult<T> {
    results: T[];
    page: number;
    pageSize: number;
    total_pages: number; // Add this property to represent the total number of pages
    total_results: number; // Rename 'allResults' to 'totalResults' for consistency
    searchTerm: string;
  }
  