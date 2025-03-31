import { create } from "zustand";

export const useQuizzesStore = create(set => ({
  quizCounts: { allCount: 0, draftCount: 0, publishedCount: 0 },
  status: "all",
  setQuizCounts: quizCounts => set({ quizCounts }),
  setStatus: status => set({ status }),
}));
