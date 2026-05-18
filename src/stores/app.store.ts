import { create } from 'zustand';
import { Card, RemixCard, User, CaptureData, Model3D } from '../types';

interface AppStore {
  // 用户状态
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;

  // 卡牌状态
  cards: Card[];
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  removeCard: (cardId: string) => void;

  // 当前卡牌
  selectedCard: Card | null;
  setSelectedCard: (card: Card | null) => void;

  // 3D模型状态
  currentModel: Model3D | null;
  setCurrentModel: (model: Model3D | null) => void;

  // 捕获数据
  captureData: CaptureData | null;
  setCaptureData: (data: CaptureData | null) => void;

  // 加载状态
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // 错误状态
  error: string | null;
  setError: (error: string | null) => void;

  // Remix选择的卡牌
  remixCards: Card[];
  addRemixCard: (card: Card) => void;
  removeRemixCard: (cardId: string) => void;
  clearRemixCards: () => void;

  // AR状态
  arEnabled: boolean;
  setAREnabled: (enabled: boolean) => void;

  // 清空所有状态
  reset: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),

  cards: [],
  setCards: (cards) => set({ cards }),
  addCard: (card) => set((state) => ({ cards: [card, ...state.cards] })),
  removeCard: (cardId) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== cardId),
    })),

  selectedCard: null,
  setSelectedCard: (card) => set({ selectedCard: card }),

  currentModel: null,
  setCurrentModel: (model) => set({ currentModel: model }),

  captureData: null,
  setCaptureData: (data) => set({ captureData: data }),

  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  error: null,
  setError: (error) => set({ error }),

  remixCards: [],
  addRemixCard: (card) =>
    set((state) => {
      if (state.remixCards.length < 2) {
        return { remixCards: [...state.remixCards, card] };
      }
      return state;
    }),
  removeRemixCard: (cardId) =>
    set((state) => ({
      remixCards: state.remixCards.filter((c) => c.id !== cardId),
    })),
  clearRemixCards: () => set({ remixCards: [] }),

  arEnabled: false,
  setAREnabled: (enabled) => set({ arEnabled: enabled }),

  reset: () =>
    set({
      currentUser: null,
      cards: [],
      selectedCard: null,
      currentModel: null,
      captureData: null,
      isLoading: false,
      error: null,
      remixCards: [],
      arEnabled: false,
    }),
}));
