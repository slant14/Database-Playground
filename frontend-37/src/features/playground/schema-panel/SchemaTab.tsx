import styles from "./SchemaTab.module.css";
import { DBSchema } from "../types";

interface SchemaTabProps {
  schema: DBSchema;
  selected: boolean;
  onClick: () => void;
}

export function SchemaTab({ schema, selected, onClick }: SchemaTabProps) {
  return (
    <div
      className={[styles.tab, selected && styles.selected].join(" ")}
      onClick={onClick}
    >
      {schema.name}
    </div>
  );
}
