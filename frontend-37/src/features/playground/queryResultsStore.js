import { create } from "zustand";

export const queryResultsStore = create((set) => ({
  results: [],
  updateResults: (newResults) => set({ results: newResults }),
}));
