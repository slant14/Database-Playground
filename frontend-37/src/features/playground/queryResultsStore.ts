import { create } from "zustand";
import { QueryResult } from "./types";

interface TemplateStore {
  error?: string;
  results?: QueryResult[];
  updateResults: (newResults: QueryResult[]) => void;
  updateError: (newError: string) => void;
}

export const queryResultsStore = create<TemplateStore>((set) => ({
  results: [],
  error: "",
  updateResults: (newResults) => set({ results: newResults, error: "" }),
  updateError: (newError) => set({ results: [], error: newError }),
}));
