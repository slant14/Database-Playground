import styles from "./SchemaTab.module.css";

export function SchemaTab({ schema, selected, onClick }) {
  return (
    <div
      className={[styles.tab, selected && styles.selected].join(" ")}
      onClick={onClick}
    >
      {schema.name}
    </div>
  );
}
