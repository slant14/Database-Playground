import { useEffect, useState } from "react";
import Schema from "./Schema";
import Tab from "./Tab";
import styles from "./SchemaWrapper.module.css";

export default function SchemaWrapper({ schemas }) {
  const [activeSchema, setActiveSchema] = useState(schemas[0] || null);

  // Синхронизируем активную схему при изменении schemas
  useEffect(() => {
    // Если активной схемы нет или она больше не существует в schemas
    if (!activeSchema || !schemas.includes(activeSchema)) {
      setActiveSchema(schemas[0] || null);
      for (const schema of schemas) {
        if (schema.name == activeSchema.name) {
          setActiveSchema(schema);
          break;
        }
      }
    }
  }, [schemas]); // Зависимость от schemas

  if (schemas.length === 0) {
    return (
      <div
        className={styles.wrapper}
        style={{ width: 700, marginLeft: 20, height: 500 }}
      />
    );
  }

  return (
    <div
      className={styles.wrapper}
      style={{ width: 700, marginLeft: 20, height: 500 }}
    >
      <div className={styles.tabs}>
        {schemas.map((schema) => (
          <Tab
            schema={schema}
            key={schema.name}
            selected={schema === activeSchema}
            onClick={() => setActiveSchema(schema)}
          />
        ))}
      </div>
      <div className={styles.schema}>
        <Schema schema={activeSchema} />
      </div>
    </div>
  );
}
