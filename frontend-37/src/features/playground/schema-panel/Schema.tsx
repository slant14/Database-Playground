import { DBSchema } from "../types";
import styles from "./Schema.module.css";

interface SchemaProps {
  schema: DBSchema;
}

export function Schema({ schema }: SchemaProps) {
  if (!schema) return <></>;
  return (
    <div>
      {schema.columns.map((col) => (
        <div className={styles.item} key={col.name}>
          {col.name} {col.type} {col?.attrs}
        </div>
      ))}
    </div>
  );
}
