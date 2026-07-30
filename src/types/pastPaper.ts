export type SourceType = 'official' | 'licensed' | 'practice_equivalent';

export interface PastPaper {
  id: string;
  examSlug: string;
  title: string;
  year: number;
  subject: string;
  paperType: 'Prelims' | 'Mains' | 'Full Test';
  totalPages: number;
  previewPageCount: number;
  previewPages: string[];
  sourceType: SourceType;
  isLocked: boolean;
}

export interface PastPaperFilterState {
  year: number | null;
  subject: string | null;
  paperType: 'Prelims' | 'Mains' | 'Full Test' | null;
  sourceType: SourceType | null;
}
