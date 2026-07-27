import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tokenCost: number;
  timestamp: string;
}

export interface TokenUsageEntry {
  id: string;
  feature: string;
  description: string;
  tokenCost: number;
  type: 'debit' | 'credit';
  timestamp: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export type TutorView = 'home' | 'chat';

interface AiTutorState {
  dailyTokensRemaining: number;
  dailyTokensTotal: number;
  tokenCostPerQuery: number;
  isPremium: boolean;
  chatHistory: ChatMessage[];
  isStreaming: boolean;
  activeView: TutorView;
  activeFeature: string | null;
  usageHistory: TokenUsageEntry[];
  quizQuestions: QuizQuestion[];
  quizTopic: string;
  quizActive: boolean;
  quizAnswers: Record<string, number>;
  quizSubmitted: boolean;
}

const initialState: AiTutorState = {
  dailyTokensRemaining: 350,
  dailyTokensTotal: 500,
  tokenCostPerQuery: 10,
  isPremium: false,
  chatHistory: [],
  isStreaming: false,
  activeView: 'home',
  activeFeature: null,
  usageHistory: [
    {
      id: 'uh-1',
      feature: 'AI Explanation',
      description: 'Explanation: CSS Officer Selection Process',
      tokenCost: 10,
      type: 'debit',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'uh-2',
      feature: 'AI Study Planner',
      description: 'Generated 30-day study plan',
      tokenCost: 15,
      type: 'debit',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'uh-3',
      feature: 'AI Flashcards',
      description: '12 flashcards for Pakistan Affairs',
      tokenCost: 8,
      type: 'debit',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: 'uh-4',
      feature: 'Daily Refresh',
      description: 'Daily Free Token Refresh',
      tokenCost: 350,
      type: 'credit',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
    },
  ],
  quizQuestions: [],
  quizTopic: '',
  quizActive: false,
  quizAnswers: {},
  quizSubmitted: false,
};

const aiTutorSlice = createSlice({
  name: 'aiTutor',
  initialState,
  reducers: {
    sendMessage(state, action: PayloadAction<string>) {
      const cost = state.tokenCostPerQuery;
      if (state.dailyTokensRemaining < cost) return;

      state.dailyTokensRemaining -= cost;
      state.chatHistory.push({
        id: `user-${Date.now()}`,
        role: 'user',
        content: action.payload,
        tokenCost: cost,
        timestamp: new Date().toISOString(),
      });
      state.usageHistory.unshift({
        id: `uh-${Date.now()}`,
        feature: 'AI Chat',
        description: action.payload.slice(0, 60),
        tokenCost: cost,
        type: 'debit',
        timestamp: new Date().toISOString(),
      });
      state.isStreaming = true;
    },

    receiveResponse(state, action: PayloadAction<string>) {
      state.chatHistory.push({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: action.payload,
        tokenCost: 0,
        timestamp: new Date().toISOString(),
      });
      state.isStreaming = false;
    },

    setStreaming(state, action: PayloadAction<boolean>) {
      state.isStreaming = action.payload;
    },

    setActiveView(state, action: PayloadAction<TutorView>) {
      state.activeView = action.payload;
    },

    setActiveFeature(state, action: PayloadAction<string | null>) {
      state.activeFeature = action.payload;
    },

    clearChat(state) {
      state.chatHistory = [];
    },

    logTokenUsage(
      state,
      action: PayloadAction<{
        feature: string;
        description: string;
        tokenCost: number;
        type?: 'debit' | 'credit';
      }>
    ) {
      const {
        feature,
        description,
        tokenCost,
        type = 'debit',
      } = action.payload;
      state.usageHistory.unshift({
        id: `uh-${Date.now()}`,
        feature,
        description,
        tokenCost,
        type,
        timestamp: new Date().toISOString(),
      });
    },

    deductTokens(state, action: PayloadAction<number>) {
      state.dailyTokensRemaining = Math.max(
        0,
        state.dailyTokensRemaining - action.payload
      );
    },

    buyTokenPack(state, action: PayloadAction<number>) {
      const added = action.payload;
      state.dailyTokensRemaining += added;
      state.usageHistory.unshift({
        id: `uh-${Date.now()}`,
        feature: 'Token Purchase',
        description: `Purchased ${added.toLocaleString()} tokens`,
        tokenCost: added,
        type: 'credit',
        timestamp: new Date().toISOString(),
      });
    },

    upgradeToPremium(state) {
      state.isPremium = true;
      state.dailyTokensRemaining = 9999;
      state.dailyTokensTotal = 9999;
      state.usageHistory.unshift({
        id: `uh-${Date.now()}`,
        feature: 'Premium Upgrade',
        description: 'Upgraded to Premium Plan (Unlimited)',
        tokenCost: 9999,
        type: 'credit',
        timestamp: new Date().toISOString(),
      });
    },

    resetDailyTokens(state) {
      const restored = state.isPremium ? 9999 : state.dailyTokensTotal;
      state.dailyTokensRemaining = restored;
      state.usageHistory.unshift({
        id: `uh-${Date.now()}`,
        feature: 'Daily Refresh',
        description: 'Daily Free Token Refresh',
        tokenCost: restored,
        type: 'credit',
        timestamp: new Date().toISOString(),
      });
    },

    startQuiz(
      state,
      action: PayloadAction<{ topic: string; questions: QuizQuestion[] }>
    ) {
      state.quizTopic = action.payload.topic;
      state.quizQuestions = action.payload.questions;
      state.quizActive = true;
      state.quizAnswers = {};
      state.quizSubmitted = false;
    },

    answerQuizQuestion(
      state,
      action: PayloadAction<{ questionId: string; optionIndex: number }>
    ) {
      state.quizAnswers[action.payload.questionId] = action.payload.optionIndex;
    },

    submitQuiz(state) {
      state.quizSubmitted = true;
    },

    closeQuiz(state) {
      state.quizActive = false;
      state.quizQuestions = [];
      state.quizTopic = '';
      state.quizAnswers = {};
      state.quizSubmitted = false;
    },
  },
});

export const {
  sendMessage,
  receiveResponse,
  setStreaming,
  setActiveView,
  setActiveFeature,
  clearChat,
  logTokenUsage,
  deductTokens,
  buyTokenPack,
  upgradeToPremium,
  resetDailyTokens,
  startQuiz,
  answerQuizQuestion,
  submitQuiz,
  closeQuiz,
} = aiTutorSlice.actions;

export const aiTutorReducer = aiTutorSlice.reducer;
