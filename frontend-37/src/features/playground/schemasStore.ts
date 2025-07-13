import { create } from "zustand";
import { DBSchema } from "./types";

interface SchemasStore {
  schemas: DBSchema[];
  updateSchemas: (newSchemas: DBSchema[]) => void;
}

export const schemasStore = create<SchemasStore>((set) => ({
  schemas: [],
  updateSchemas: (newSchemas) => set({ schemas: newSchemas }),
}));
