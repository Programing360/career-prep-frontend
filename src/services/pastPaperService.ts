import type { PastPaper, PastPaperFilterState } from '@/types/pastPaper';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const mockPastPapers: Record<string, PastPaper[]> = {
  css: [
    {
      id: 'css-2024-essay',
      examSlug: 'css',
      title: 'CSS Essay Paper 2024',
      year: 2024,
      subject: 'Essay',
      paperType: 'Mains',
      totalPages: 4,
      previewPageCount: 2,
      previewPages: [
        '/previews/css/essay-2024-p1.svg',
        '/previews/css/essay-2024-p2.svg',
      ],
      sourceType: 'official',
      isLocked: true,
    },
    {
      id: 'css-2024-gk',
      examSlug: 'css',
      title: 'General Knowledge (GS) Paper I 2024',
      year: 2024,
      subject: 'General Knowledge',
      paperType: 'Prelims',
      totalPages: 12,
      previewPageCount: 3,
      previewPages: [
        '/previews/css/gk-2024-p1.svg',
        '/previews/css/gk-2024-p2.svg',
        '/previews/css/gk-2024-p3.svg',
      ],
      sourceType: 'official',
      isLocked: false,
    },
    {
      id: 'css-2024-pa',
      examSlug: 'css',
      title: 'Pakistan Affairs 2024',
      year: 2024,
      subject: 'Pakistan Affairs',
      paperType: 'Mains',
      totalPages: 8,
      previewPageCount: 2,
      previewPages: [
        '/previews/css/pa-2024-p1.svg',
        '/previews/css/pa-2024-p2.svg',
      ],
      sourceType: 'official',
      isLocked: true,
    },
    {
      id: 'css-2023-essay',
      examSlug: 'css',
      title: 'CSS Essay Paper 2023',
      year: 2023,
      subject: 'Essay',
      paperType: 'Mains',
      totalPages: 4,
      previewPageCount: 2,
      previewPages: [
        '/previews/css/essay-2023-p1.svg',
        '/previews/css/essay-2023-p2.svg',
      ],
      sourceType: 'official',
      isLocked: false,
    },
    {
      id: 'css-2023-gk',
      examSlug: 'css',
      title: 'General Knowledge (GS) Paper I 2023',
      year: 2023,
      subject: 'General Knowledge',
      paperType: 'Prelims',
      totalPages: 12,
      previewPageCount: 3,
      previewPages: [
        '/previews/css/gk-2023-p1.svg',
        '/previews/css/gk-2023-p2.svg',
        '/previews/css/gk-2023-p3.svg',
      ],
      sourceType: 'official',
      isLocked: false,
    },
    {
      id: 'css-2022-islamic',
      examSlug: 'css',
      title: 'Islamic Studies 2022 (Licensed Reproduce)',
      year: 2022,
      subject: 'Islamic Studies',
      paperType: 'Mains',
      totalPages: 6,
      previewPageCount: 2,
      previewPages: [
        '/previews/css/islamic-2022-p1.svg',
        '/previews/css/islamic-2022-p2.svg',
      ],
      sourceType: 'licensed',
      isLocked: false,
    },
    {
      id: 'css-practice-pa-1',
      examSlug: 'css',
      title: 'Practice Set — Pakistan Affairs (Full Length)',
      year: 2025,
      subject: 'Pakistan Affairs',
      paperType: 'Full Test',
      totalPages: 10,
      previewPageCount: 2,
      previewPages: [
        '/previews/css/practice-pa-1-p1.svg',
        '/previews/css/practice-pa-1-p2.svg',
      ],
      sourceType: 'practice_equivalent',
      isLocked: false,
    },
  ],
  pms: [
    {
      id: 'pms-2024-gk',
      examSlug: 'pms',
      title: 'PMS General Knowledge 2024',
      year: 2024,
      subject: 'General Knowledge',
      paperType: 'Prelims',
      totalPages: 10,
      previewPageCount: 2,
      previewPages: [
        '/previews/pms/gk-2024-p1.svg',
        '/previews/pms/gk-2024-p2.svg',
      ],
      sourceType: 'official',
      isLocked: false,
    },
    {
      id: 'pms-2023-essay',
      examSlug: 'pms',
      title: 'PMS Essay Paper 2023',
      year: 2023,
      subject: 'Essay',
      paperType: 'Mains',
      totalPages: 4,
      previewPageCount: 2,
      previewPages: [
        '/previews/pms/essay-2023-p1.svg',
        '/previews/pms/essay-2023-p2.svg',
      ],
      sourceType: 'official',
      isLocked: true,
    },
    {
      id: 'pms-2023-gk',
      examSlug: 'pms',
      title: 'PMS General Knowledge 2023',
      year: 2023,
      subject: 'General Knowledge',
      paperType: 'Prelims',
      totalPages: 10,
      previewPageCount: 2,
      previewPages: [
        '/previews/pms/gk-2023-p1.svg',
        '/previews/pms/gk-2023-p2.svg',
      ],
      sourceType: 'licensed',
      isLocked: false,
    },
  ],
};

const mockPreviews: Record<string, { id: string; pages: string[] }> = {
  'css-2024-gk': {
    id: 'css-2024-gk',
    pages: [
      '/previews/css/gk-2024-p1.svg',
      '/previews/css/gk-2024-p2.svg',
      '/previews/css/gk-2024-p3.svg',
    ],
  },
  'css-2023-essay': {
    id: 'css-2023-essay',
    pages: [
      '/previews/css/essay-2023-p1.svg',
      '/previews/css/essay-2023-p2.svg',
    ],
  },
  'pms-2024-gk': {
    id: 'pms-2024-gk',
    pages: ['/previews/pms/gk-2024-p1.svg', '/previews/pms/gk-2024-p2.svg'],
  },
};

export async function getPastPapers(
  examSlug: string,
  filters?: Partial<PastPaperFilterState>
): Promise<PastPaper[]> {
  await delay(400);

  const papers = mockPastPapers[examSlug];
  if (!papers) return [];

  let filtered = [...papers];

  if (filters) {
    if (filters.year != null) {
      filtered = filtered.filter((p) => p.year === filters.year);
    }
    if (filters.subject) {
      filtered = filtered.filter((p) =>
        p.subject.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }
    if (filters.paperType) {
      filtered = filtered.filter((p) => p.paperType === filters.paperType);
    }
    if (filters.sourceType) {
      filtered = filtered.filter((p) => p.sourceType === filters.sourceType);
    }
  }

  return filtered;
}

export async function getPastPaperPreview(
  id: string
): Promise<{ id: string; pages: string[] } | null> {
  await delay(300);

  return mockPreviews[id] ?? null;
}
