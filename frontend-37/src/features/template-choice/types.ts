import { DBType } from "@/types/DBType";

export interface Template {
  id: number;
  name: string;
  author: string;
  type: DBType;
}
