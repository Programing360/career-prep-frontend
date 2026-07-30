import { useEffect, useRef } from 'react';
import { X, FileText, BookOpen } from 'lucide-react';
import { SourceTypeBadge } from './SourceTypeBadge';
import { PastPaperCTAOverlay } from './PastPaperCTAOverlay';
import type { PastPaper } from '@/types/pastPaper';
import { cn } from '@/lib/utils';

interface PastPaperViewerModalProps {
  paper: PastPaper;
  onClose: () => void;
}

const MOCK_QUESTIONS = [
  {
    stem: 'The concept of "Rule of Law" in the Constitution of Pakistan is derived from which of the following principles?',
    options: [
      'Islamic Shariah',
      'English Common Law',
      'French Civil Code',
      'American Constitution',
    ],
  },
  {
    stem: 'Which Article of the Constitution of Pakistan guarantees the freedom of speech and expression?',
    options: ['Article 17', 'Article 19', 'Article 14', 'Article 8'],
  },
  {
    stem: 'The "Objectives Resolution" was adopted by the Constituent Assembly of Pakistan in which year?',
    options: ['1947', '1949', '1950', '1956'],
  },
  {
    stem: 'Which of the following is NOT a function of the Federal Public Service Commission (FPSC) according to the Constitution?',
    options: [
      'Conducting competitive examinations for All-Pakistan Services',
      'Advising the President on personnel matters',
      'Formulating the national education policy',
      'Making recommendations for appointments to civil posts',
    ],
  },
  {
    stem: "In the context of Pakistan's foreign policy, the principle of 'peaceful coexistence' is known as:",
    options: [
      'Bilateralism',
      'Non-alignment',
      'Regional Integration',
      'Strategic Balance',
    ],
  },
];

const MOCK_QUESTIONS_PAGE2 = [
  {
    stem: 'What is the primary objective of the Benazir Income Support Programme (BISP)?',
    options: [
      'Providing free education to all citizens',
      'Offering financial assistance to low-income families',
      'Developing infrastructure in rural areas',
      'Promoting exports through subsidies',
    ],
  },
  {
    stem: 'The "China-Pakistan Economic Corridor (CPEC)" is primarily a framework for:',
    options: [
      'Military cooperation between China and Pakistan',
      'Regional connectivity and economic integration through infrastructure development',
      'Cultural exchange programs between the two nations',
      'Environmental protection initiatives in South Asia',
    ],
  },
  {
    stem: 'According to the 2017 Census, which is the most populous province of Pakistan?',
    options: ['Sindh', 'Punjab', 'Khyber Pakhtunkhwa', 'Balochistan'],
  },
];

const MOCK_QUESTIONS_PAGE3 = [
  {
    stem: 'Which international organization declared the "State of Palestine" as a non-member observer state in 2012?',
    options: [
      'United Nations General Assembly',
      'United Nations Security Council',
      'Arab League',
      'Organization of Islamic Cooperation',
    ],
  },
  {
    stem: 'The "Kashmir Solidarity Day" is observed in Pakistan on which date?',
    options: ['February 5', 'March 23', 'August 14', 'September 6'],
  },
  {
    stem: 'Which Pakistani scientist is known for contributions to the theory of "Weak Interaction" in physics?',
    options: [
      'Dr. Abdus Salam',
      'Dr. Abdul Qadeer Khan',
      'Dr. Atta-ur-Rahman',
      'Dr. Salimuzzaman Siddiqui',
    ],
  },
  {
    stem: 'The "National Assembly" of Pakistan consists of how many directly elected members?',
    options: ['272', '336', '342', '272'],
  },
];

function ExamPaperPage({
  pageNum,
  totalPages,
  subject,
  questions,
}: {
  pageNum: number;
  totalPages: number;
  subject: string;
  questions: typeof MOCK_QUESTIONS;
}) {
  return (
    <div className="relative mx-auto w-full max-w-xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-inner dark:border-gray-700 dark:bg-gray-50">
      <div className="flex flex-col p-8 sm:p-12">
        {/* Exam Header */}
        <div className="border-b-2 border-gray-300 pb-4 text-center dark:border-gray-500">
          <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase sm:text-xs">
            Government Competitive Examination
          </p>
          <h1 className="mt-1 text-sm font-bold text-gray-900 sm:text-base">
            {subject}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-gray-600 sm:text-xs">
            <span>
              Time Allowed: <strong>3 Hours</strong>
            </span>
            <span>
              Total Marks: <strong>100</strong>
            </span>
          </div>
          <p className="mt-1 text-[10px] text-gray-500 italic">
            (Answer any <strong>FOUR</strong> questions. All questions carry
            equal marks.)
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-3 rounded bg-gray-50 p-3 text-[9px] text-gray-600 sm:text-[10px] dark:bg-gray-100">
          <p className="font-semibold">INSTRUCTIONS:</p>
          <p>
            Read each question carefully. Select the best possible answer from
            the options given. There is no negative marking for incorrect
            responses.
          </p>
        </div>

        {/* Questions */}
        <div className="mt-5 space-y-5">
          {questions.map((q, qi) => (
            <div key={qi}>
              <p className="text-xs font-semibold text-gray-800 sm:text-sm">
                {qi + 1}. {q.stem}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {q.options.map((opt, oi) => {
                  const letter = String.fromCharCode(65 + oi);
                  return (
                    <div
                      key={oi}
                      className="flex items-start gap-1.5 text-[10px] text-gray-700 sm:text-xs"
                    >
                      <span className="mt-0.5 shrink-0 font-semibold text-gray-500">
                        {letter}.
                      </span>
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Dotted space for remaining answers */}
        <div className="mt-6 border-t border-dashed border-gray-200 pt-4 dark:border-gray-400">
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-3 w-full border-b border-dotted border-gray-300 dark:border-gray-400"
              />
            ))}
          </div>
        </div>

        {/* Page Number */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-3 text-[9px] text-gray-500 sm:text-[10px] dark:border-gray-400">
          <span>Roll No: _______________</span>
          <span>
            Page {pageNum} of {totalPages}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function PastPaperViewerModal({
  paper,
  onClose,
}: PastPaperViewerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!paper) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 pb-8 pt-12 backdrop-blur-sm sm:pt-16"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className={cn(
          'relative w-full max-w-3xl animate-fade-in rounded-2xl border shadow-2xl',
          'border-white/20 bg-white dark:border-gray-800/50 dark:bg-gray-900'
        )}
      >
        {/* Sticky Header */}
        <div className="sticky -top-16 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-gray-200/60 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-gray-800/60 dark:bg-gray-900/80">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <SourceTypeBadge sourceType={paper.sourceType} />
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <BookOpen size={11} />
                {paper.year}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                <FileText size={11} />
                {paper.totalPages} pages
              </span>
            </div>
            <h2 className="mt-1.5 text-lg font-bold text-gray-900 dark:text-white">
              {paper.title}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {paper.subject} &middot {paper.paperType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Document Pages */}
        <div className="relative px-6 py-6">
          {/* Page 1 */}
          <div className="relative">
            <ExamPaperPage
              pageNum={1}
              totalPages={8}
              subject={paper.subject}
              questions={MOCK_QUESTIONS}
            />

            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
              <div
                style={{ transform: 'rotate(-28deg)' }}
                className="select-none text-center text-[11px] font-bold uppercase tracking-[0.25em] text-gray-300/40 sm:text-sm dark:text-gray-600/30"
              >
                <span className="block">MERITPREP GATED PREVIEW</span>
                <span className="block mt-0.5">
                  &bull; OFFICIAL PAST PAPER &bull;
                </span>
              </div>
            </div>
          </div>

          {/* Page 2 */}
          <div className="relative mt-6">
            <ExamPaperPage
              pageNum={2}
              totalPages={8}
              subject={paper.subject}
              questions={MOCK_QUESTIONS_PAGE2}
            />

            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
              <div
                style={{ transform: 'rotate(-28deg)' }}
                className="select-none text-center text-[11px] font-bold uppercase tracking-[0.25em] text-gray-300/40 sm:text-sm dark:text-gray-600/30"
              >
                <span className="block">MERITPREP GATED PREVIEW</span>
                <span className="block mt-0.5">
                  &bull; OFFICIAL PAST PAPER &bull;
                </span>
              </div>
            </div>
          </div>

          {/* Page 3 (blurred preview) */}
          <div className="relative mt-6">
            <div className="relative overflow-hidden rounded-xl">
              <ExamPaperPage
                pageNum={3}
                totalPages={8}
                subject={paper.subject}
                questions={MOCK_QUESTIONS_PAGE3}
              />
              {/* Gradient fade to white */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/40 to-white/90 backdrop-blur-[2px] dark:via-gray-900/40 dark:to-gray-900/90" />
            </div>

            {/* Watermark */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl">
              <div
                style={{ transform: 'rotate(-28deg)' }}
                className="select-none text-center text-[11px] font-bold uppercase tracking-[0.25em] text-gray-300/40 sm:text-sm dark:text-gray-600/30"
              >
                <span className="block">MERITPREP GATED PREVIEW</span>
                <span className="block mt-0.5">
                  &bull; OFFICIAL PAST PAPER &bull;
                </span>
              </div>
            </div>
          </div>

          {/* CTA Overlay anchored after page 3 */}
          <div className="relative -mx-6 mt-0">
            <div className="absolute -top-12 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-white/90 dark:to-gray-900/90" />
            <div className="bg-white/95 px-6 pb-4 pt-6 backdrop-blur-md dark:bg-gray-900/95">
              <PastPaperCTAOverlay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
