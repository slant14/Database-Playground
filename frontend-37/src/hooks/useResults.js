import { create } from "zustand";

export const useResults = create((set) => ({
  results: [],
  updateResults: (newResults) => set({ results: newResults }),
}));
