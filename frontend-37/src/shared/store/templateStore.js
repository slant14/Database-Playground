import { create } from "zustand";

export const templateStore = create((set) => ({
  template: "",
  updateTemplate: (newTemplate) => set({ template: newTemplate }),
}));
