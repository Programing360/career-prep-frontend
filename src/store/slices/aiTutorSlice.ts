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
  /** Token balance – seeded from user.aiTokenBalance on mount, kept in sync
   *  from every API response's `tokensRemaining` field. Null means "not loaded yet". */
  tokensRemaining: number | null;
  tokenCostPerQuery: number;
  isPremium: boolean;

  chatHistory: ChatMessage[];
  /** True while an API request is in-flight */
  isStreaming: boolean;

  activeView: TutorView;
  activeFeature: string | null;
  usageHistory: TokenUsageEntry[];

  /** MongoDB _id of the current chat session – passed back on every message so
   *  the backend appends to the same document rather than creating a new one. */
  sessionId: string | null;

  /** Inline error shown in the chat area (cleared on next send) */
  chatError: string | null;

  quizQuestions: QuizQuestion[];
  quizTopic: string;
  quizActive: boolean;
  quizAnswers: Record<string, number>;
  quizSubmitted: boolean;
}

const initialState: AiTutorState = {
  tokensRemaining: null,
  tokenCostPerQuery: 10,
  isPremium: false,

  chatHistory: [],
  isStreaming: false,

  activeView: 'home',
  activeFeature: null,
  usageHistory: [],

  sessionId: null,
  chatError: null,

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
    /** Seed token balance from user profile or first API response */
    setTokensRemaining(state, action: PayloadAction<number>) {
      state.tokensRemaining = action.payload;
    },

    /** Mark the user as premium (unlimited tokens) */
    setIsPremium(state, action: PayloadAction<boolean>) {
      state.isPremium = action.payload;
    },

    /** Persist the backend session ID so subsequent messages update same doc */
    setSessionId(state, action: PayloadAction<string | null>) {
      state.sessionId = action.payload;
    },

    /** Optimistically push the user's message and set streaming state */
    sendMessage(state, action: PayloadAction<string>) {
      state.chatError = null;
      state.chatHistory.push({
        id: `user-${Date.now()}`,
        role: 'user',
        content: action.payload,
        tokenCost: state.tokenCostPerQuery,
        timestamp: new Date().toISOString(),
      });
      state.isStreaming = true;
    },

    /** Push the AI reply and update the token balance from the API response */
    receiveResponse(
      state,
      action: PayloadAction<{ reply: string; tokensRemaining: number }>
    ) {
      const { reply, tokensRemaining } = action.payload;
      state.chatHistory.push({
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: reply,
        tokenCost: 0,
        timestamp: new Date().toISOString(),
      });
      state.tokensRemaining = tokensRemaining;
      state.isStreaming = false;
    },

    /** Set an error to be displayed inside the chat area */
    setChatError(state, action: PayloadAction<string | null>) {
      state.chatError = action.payload;
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
      state.sessionId = null;
      state.chatError = null;
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

    buyTokenPack(state, action: PayloadAction<number>) {
      const added = action.payload;
      state.tokensRemaining = (state.tokensRemaining ?? 0) + added;
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
      state.tokensRemaining = 9999;
      state.usageHistory.unshift({
        id: `uh-${Date.now()}`,
        feature: 'Premium Upgrade',
        description: 'Upgraded to Premium Plan (Unlimited)',
        tokenCost: 9999,
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
  setTokensRemaining,
  setIsPremium,
  setSessionId,
  sendMessage,
  receiveResponse,
  setChatError,
  setStreaming,
  setActiveView,
  setActiveFeature,
  clearChat,
  logTokenUsage,
  buyTokenPack,
  upgradeToPremium,
  startQuiz,
  answerQuizQuestion,
  submitQuiz,
  closeQuiz,
} = aiTutorSlice.actions;

export const aiTutorReducer = aiTutorSlice.reducer;
