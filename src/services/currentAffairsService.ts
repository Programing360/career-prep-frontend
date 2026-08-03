import api from '@/lib/axios';
import type {
  CurrentAffairsFilter,
  CurrentAffairsItem,
} from '@/types/currentAffairs';

export interface CurrentAffairsPaginatedResponse {
  data: CurrentAffairsItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const DEFAULT_LIMIT = 10;

export const MOCK_CURRENT_AFFAIRS_CATEGORIES = [
  'Pakistan',
  'International',
  'Economy',
  'Science & Tech',
  'Sports',
  'Important Days',
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MOCK_CURRENT_AFFAIRS: CurrentAffairsItem[] = [
  {
    id: 'ca-001',
    title: 'PM Launches National Digital Census Drive',
    summary:
      'The government has kicked off a nationwide digital census exercise aimed at producing accurate population data to inform policy and resource allocation.',
    content:
      'The Prime Minister formally inaugurated the digital census drive at a ceremony in Islamabad, describing it as a milestone in the country\u2019s modernisation of data collection. The exercise will rely on digital enumeration tools, geo-mapped household data and real-time validation to reduce errors associated with traditional headcounts.\n\nThe results are expected to guide seat allocation, development spending and welfare targeting. Authorities have urged citizens to cooperate with census teams and verify their household details before the official close of the enumeration window.',
    category: 'Pakistan',
    publicationDate: daysAgo(0),
    sourceName: 'Dawn',
    sourceUrl: 'https://www.dawn.com/',
    tags: ['Pakistan', 'Census', 'Digitalisation'],
  },
  {
    id: 'ca-002',
    title: 'UN Climate Summit Concludes with New Finance Pact',
    summary:
      'World leaders reached a landmark agreement on climate finance, pledging scaled-up support for developing economies to accelerate the green transition.',
    content:
      'The annual climate summit wrapped up after marathon negotiations, delivering a financing framework that commits developed nations to substantially increase funding for mitigation and adaptation in vulnerable countries.\n\nClimate experts welcomed the pact as a step forward but cautioned that implementation and accountability mechanisms will determine whether pledges translate into measurable progress. Developing nations secured concessions on loss-and-damage funding and technology transfer.',
    category: 'International',
    publicationDate: daysAgo(0),
    sourceName: 'Reuters',
    sourceUrl: 'https://www.reuters.com/',
    tags: ['International', 'Climate', 'COP'],
  },
  {
    id: 'ca-003',
    title: 'SBP Keeps Policy Rate Steady',
    summary:
      'The State Bank of Pakistan held its benchmark policy rate, citing easing inflation and improving external account conditions.',
    content:
      'The Monetary Policy Committee decided to maintain the policy rate at its current level, balancing the need to anchor inflation expectations against the objective of supporting economic growth.\n\nThe central bank noted that headline inflation has trended downward, while foreign exchange reserves have stabilised. Analysts expect the decision to provide breathing room for businesses ahead of the peak credit-demand season.',
    category: 'Economy',
    publicationDate: daysAgo(0),
    sourceName: 'APP',
    sourceUrl: 'https://www.app.com.pk/',
    tags: ['Economy', 'SBP', 'Monetary Policy'],
  },
  {
    id: 'ca-004',
    title:
      'Pakistan\u2019s First Indigenous Communication Satellite Reaches Orbit',
    summary:
      'Pakistan successfully placed its indigenously developed communication satellite into orbit, marking a significant stride in national space capability.',
    content:
      'The satellite was launched from a foreign launch site and has since established communication with ground stations. The mission is expected to enhance broadband connectivity in remote areas and support disaster-management monitoring.\n\nOfficials described the launch as the beginning of a broader space programme that will expand earth-observation and navigation capabilities over the coming decade.',
    category: 'Science & Tech',
    publicationDate: daysAgo(0),
    sourceName: 'APP',
    sourceUrl: 'https://www.app.com.pk/',
    tags: ['Science & Tech', 'Space', 'Satellite'],
  },
  {
    id: 'ca-005',
    title: 'Federal Budget for Next Fiscal Year Presented in National Assembly',
    summary:
      'The finance minister presented the annual federal budget, outlining plans for public investment, tax reforms and social-sector spending.',
    content:
      'The budget proposes increased allocations for education, health and infrastructure, alongside a series of tax rationalisation measures aimed at broadening the revenue base.\n\nOpposition lawmakers criticised several provisions, while market watchers said the fiscal plan balances growth objectives with the need to meet international financing commitments.',
    category: 'Pakistan',
    publicationDate: daysAgo(1),
    sourceName: 'Dawn',
    sourceUrl: 'https://www.dawn.com/',
    tags: ['Pakistan', 'Budget', 'Finance'],
  },
  {
    id: 'ca-006',
    title: 'G20 Leaders Endorse Framework for Global AI Governance',
    summary:
      'The Group of Twenty adopted a voluntary framework for the safe and ethical development of artificial intelligence systems.',
    content:
      'The framework sets out shared principles on transparency, accountability and human oversight for AI systems used in critical sectors such as healthcare, finance and public administration.\n\nMember states will establish national implementation roadmaps and participate in a peer-review mechanism. Civil-society groups urged stronger binding commitments on surveillance and data protection.',
    category: 'International',
    publicationDate: daysAgo(1),
    sourceName: 'Reuters',
    sourceUrl: 'https://www.reuters.com/',
    tags: ['International', 'G20', 'Artificial Intelligence'],
  },
  {
    id: 'ca-007',
    title: 'National Hockey Team Clinches Azlan Shah Cup Title',
    summary:
      'Pakistan\u2019s hockey side lifted the Azlan Shah Cup after an emphatic win in the final, ending a long title drought.',
    content:
      'The team overcame a determined opposition in a high-scoring final, with standout performances from the forwards and goalkeeper. The triumph marks the country\u2019s first title at the tournament in nearly a decade.\n\nCoaches attributed the success to a revamped youth programme and rigorous fitness camps held over the past year.',
    category: 'Sports',
    publicationDate: daysAgo(1),
    sourceName: 'APP',
    sourceUrl: 'https://www.app.com.pk/',
    tags: ['Sports', 'Hockey', 'Azlan Shah Cup'],
  },
  {
    id: 'ca-008',
    title: 'Nation Marks Youm-e-Takbeer with Ceremonies',
    summary:
      'Youm-e-Takbeer was observed across the country, commemorating the nuclear tests of 1998.',
    content:
      'Official ceremonies, seminars and exhibitions were held nationwide to mark the anniversary of Pakistan\u2019s nuclear tests, which the nation regards as a milestone of strategic self-reliance.\n\nSpeakers at the events reaffirmed the country\u2019s commitment to responsible stewardship of its strategic assets and to peaceful use of nuclear technology.',
    category: 'Important Days',
    publicationDate: daysAgo(0),
    sourceName: 'APP',
    sourceUrl: 'https://www.app.com.pk/',
    tags: ['Important Days', 'Youm-e-Takbeer'],
  },
  {
    id: 'ca-009',
    title: 'Remittances Cross $3 Billion in a Single Month',
    summary:
      'Workers\u2019 remittances surged past the three-billion-dollar mark for the month, providing a strong cushion for the external account.',
    content:
      'Official data showed a sharp uptick in inflows, supported by formalisation incentives and improved exchange-rate stability. The rise follows sustained growth in overseas employment from the Gulf region and Europe.\n\nEconomists said the trend strengthens the currency outlook and improves the country\u2019s ability to service external debt obligations.',
    category: 'Economy',
    publicationDate: daysAgo(2),
    sourceName: 'Dawn',
    sourceUrl: 'https://www.dawn.com/',
    tags: ['Economy', 'Remittances', 'Workers'],
  },
  {
    id: 'ca-010',
    title: 'CPEC Phase-II Enters Final Implementation Stage',
    summary:
      'China\u2013Pakistan Economic Corridor projects moved into the second phase, focusing on industrial cooperation and connectivity.',
    content:
      'Authorities reported progress on several flagship projects under the corridor\u2019s second phase, including special economic zones and railway modernisation schemes.\n\nOfficials described the phase as a shift from infrastructure-building toward industrial development, agriculture modernisation and joint ventures, with an emphasis on local job creation.',
    category: 'Pakistan',
    publicationDate: daysAgo(2),
    sourceName: 'APP',
    sourceUrl: 'https://www.app.com.pk/',
    tags: ['Pakistan', 'CPEC', 'Infrastructure'],
  },
  {
    id: 'ca-011',
    title: 'NDMA Adopts AI-Based Flood Early-Warning System',
    summary:
      'The national disaster authority rolled out an artificial-intelligence-powered system to improve flood forecasting and alert dissemination.',
    content:
      'The new system integrates satellite rainfall data, river-flow sensors and machine-learning models to issue earlier and more accurate flood warnings.\n\nDisaster-management officials said the upgrade will give communities additional lead time to evacuate, reducing the risk to life and property during monsoon seasons.',
    category: 'Science & Tech',
    publicationDate: daysAgo(2),
    sourceName: 'Dawn',
    sourceUrl: 'https://www.dawn.com/',
    tags: ['Science & Tech', 'Disaster Management', 'Artificial Intelligence'],
  },
  {
    id: 'ca-012',
    title: 'WHO Says Global Polio Eradication Within Reach',
    summary:
      'The World Health Organization reported record-low polio case counts, bringing global eradication closer than ever.',
    content:
      'The latest surveillance data shows that wild poliovirus transmission has been confined to a shrinking number of districts. Vaccination campaigns continue in high-risk areas, supported by improved cold-chain logistics.\n\nHealth leaders stressed that sustained immunisation coverage and cross-border coordination remain critical to eliminating the final pockets of transmission.',
    category: 'International',
    publicationDate: daysAgo(3),
    sourceName: 'Reuters',
    sourceUrl: 'https://www.reuters.com/',
    tags: ['International', 'Health', 'WHO'],
  },
  {
    id: 'ca-013',
    title: 'National Cricket Squad Announced for Tri-Series',
    summary:
      'Selectors named an expanded squad for the upcoming tri-nation series, featuring a blend of seasoned players and young talent.',
    content:
      'The 18-member squad includes several uncapped players who impressed in recent domestic competitions. The series will serve as final preparation for the major international assignment later in the season.\n\nThe captain emphasised fitness and fielding standards as selection priorities moving forward.',
    category: 'Sports',
    publicationDate: daysAgo(3),
    sourceName: 'Dawn',
    sourceUrl: 'https://www.dawn.com/',
    tags: ['Sports', 'Cricket', 'Tri-Series'],
  },
  {
    id: 'ca-014',
    title:
      'World Environment Day: Government Pledges Massive Tree-Planting Drive',
    summary:
      'On World Environment Day, authorities announced a national afforestation campaign to combat deforestation and urban heat.',
    content:
      'The campaign aims to plant millions of saplings across urban and riverine areas, with community participation and school-based drives scheduled throughout the year.\n\nEnvironmental groups welcomed the initiative while urging authorities to focus on species selection, irrigation and long-term survival rates rather than planting volumes alone.',
    category: 'Important Days',
    publicationDate: daysAgo(1),
    sourceName: 'APP',
    sourceUrl: 'https://www.app.com.pk/',
    tags: ['Important Days', 'Environment', 'Afforestation'],
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterMockItems(filters: CurrentAffairsFilter): CurrentAffairsItem[] {
  const query = filters.searchQuery?.trim().toLowerCase();

  return MOCK_CURRENT_AFFAIRS.filter((item) => {
    if (filters.category && item.category !== filters.category) return false;
    if (filters.date && item.publicationDate !== filters.date) return false;
    if (query) {
      const haystack =
        `${item.title} ${item.summary} ${item.content} ${item.tags.join(' ')}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  }).sort((a, b) => b.publicationDate.localeCompare(a.publicationDate));
}

function mockGetCurrentAffairs(
  filters: CurrentAffairsFilter
): CurrentAffairsPaginatedResponse {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_LIMIT;
  const filtered = filterMockItems(filters);
  const start = (page - 1) * limit;

  return {
    data: filtered.slice(start, start + limit),
    total: filtered.length,
    page,
    limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

/**
 * Fetch current affairs items.
 * Maps to: GET /api/v1/current-affairs?date=&category=&search=&page=&limit=
 * Falls back to mock data when the backend endpoint is unavailable.
 */
export async function getCurrentAffairs(
  filters: CurrentAffairsFilter = {}
): Promise<CurrentAffairsPaginatedResponse> {
  try {
    const { data } = await api.get<{
      success: boolean;
      data: CurrentAffairsPaginatedResponse;
    }>('/current-affairs', {
      params: {
        date: filters.date || undefined,
        category: filters.category || undefined,
        search: filters.searchQuery || undefined,
        page: filters.page ?? 1,
        limit: filters.limit ?? DEFAULT_LIMIT,
      },
    });
    return data.data;
  } catch {
    await delay(400);
    return mockGetCurrentAffairs(filters);
  }
}

/**
 * Fetch the available current affairs category tags.
 * Maps to: GET /api/v1/current-affairs/categories
 * Falls back to mock categories when the backend endpoint is unavailable.
 */
export async function getCurrentAffairsCategories(): Promise<string[]> {
  try {
    const { data } = await api.get<{ success: boolean; data: string[] }>(
      '/current-affairs/categories'
    );
    return data.data;
  } catch {
    await delay(200);
    return MOCK_CURRENT_AFFAIRS_CATEGORIES;
  }
}

export { MOCK_CURRENT_AFFAIRS };
