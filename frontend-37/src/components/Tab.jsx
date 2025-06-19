import styles from "./Tab.module.css";

export default function Tab({ schema, selected, onClick }) {
  return (
    <div
      className={[styles.tab, selected && styles.selected].join(" ")}
      onClick={onClick}
    >
      {schema.name}
    </div>
  );
}
