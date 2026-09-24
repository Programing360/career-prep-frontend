/**
 * ExamEngineDemoPage
 *
 * Dev/preview page for the ExamEnginePanel component.
 * Route: /dev/exam-engine
 *
 * Toggle `aiTokenBalance` below to preview all three states:
 *   15  → IN_PROGRESS  (normal exam flow)
 *    0  → TOKEN_EXHAUSTED (upgrade prompt)
 * Submit → SUBMITTED_RESULT (score breakdown)
 */

import { useState } from 'react';
import { ExamEnginePanel } from '@/components/mock-test';
import { Zap } from 'lucide-react';

const SCENARIOS = [
  { label: 'Normal (15 tokens)', tokens: 15 },
  { label: 'Low (3 tokens)', tokens: 3 },
  { label: 'Exhausted (0 tokens)', tokens: 0 },
];

export default function ExamEngineDemoPage() {
  const [selectedTokens, setSelectedTokens] = useState(15);
  // Remount the panel when scenario changes so state resets cleanly
  const [mountKey, setMountKey] = useState(0);

  function handleScenario(tokens: number) {
    setSelectedTokens(tokens);
    setMountKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--background))] px-4 py-10">
      {/* Page header */}
      <div className="mx-auto mb-8 max-w-3xl">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[rgb(var(--color-text-muted))]">
          Developer Preview
        </p>
        <h1 className="mt-1 text-2xl font-black text-[rgb(var(--color-text-primary))]">
          ExamEnginePanel — MeritPrep Pakistan
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text-secondary))]">
          Toggle scenarios below to preview all three exam states. The component
          is fully self-contained with mock data and a simulated backend API.
        </p>

        {/* Scenario switcher */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-[rgb(var(--color-text-muted))]">
            <Zap size={12} />
            Token scenario:
          </span>
          {SCENARIOS.map(({ label, tokens }) => (
            <button
              key={tokens}
              type="button"
              onClick={() => handleScenario(tokens)}
              className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                selectedTokens === tokens
                  ? 'border-violet-500 bg-violet-500 text-white'
                  : 'border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] text-[rgb(var(--color-text-secondary))] hover:border-violet-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Panel */}
      <ExamEnginePanel
        key={mountKey}
        user={{
          name: 'Ali Hassan',
          avatarInitials: 'AH',
          aiTokenBalance: selectedTokens,
        }}
        onGoToDashboard={() => alert('Navigate to /dashboard')}
        onReviewAnswers={() => alert('Navigate to answer review')}
      />
    </div>
  );
}
