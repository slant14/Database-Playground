import { create } from "zustand";

export const schemasStore = create((set) => ({
  schemas: [],
  updateSchemas: (newSchemas) => set({ schemas: newSchemas }),
}));
