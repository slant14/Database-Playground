import { create } from "zustand";

interface TemplateStore {
  template: string;
  updateTemplate: (newTemplate: string) => void;
}

export const templateStore = create<TemplateStore>((set) => ({
  template: "",
  updateTemplate: (newTemplate) => set({ template: newTemplate }),
}));
