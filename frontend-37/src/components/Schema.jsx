import styles from "./Schema.module.css";

export default function Schema({ schema }) {
  return (
    <div>
      {schema.columns.map((col) => (
        <div className={styles.item} key={col.name}>
          {col.name} {col.type} {col.attrs}
        </div>
      ))}
    </div>
  );
}
