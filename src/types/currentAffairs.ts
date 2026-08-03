export interface CurrentAffairsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  publicationDate: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string;
  tags: string[];
}

export interface CurrentAffairsFilter {
  category?: string | null;
  date?: string | null;
  searchQuery?: string | null;
  page?: number;
  limit?: number;
}
