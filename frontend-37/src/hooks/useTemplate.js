import { create } from "zustand";

export const useTemplate = create((set) => ({
  template: "",
  updateTemplate: (newTemplate) => set({ template: newTemplate }),
}));
