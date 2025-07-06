import { create } from "zustand";

export const useSchemas = create((set) => ({
  schemas: [],
  updateSchemas: (newSchemas) => set({ schemas: newSchemas }),
}));
