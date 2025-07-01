import { useEffect, useState } from "react";
import Schema from "./Schema";
import Tab from "./Tab";
import styles from "./SchemaWrapper.module.css";

export default function SchemaWrapper({ schemas }) {
  const [activeSchema, setActiveSchema] = useState(schemas[0] || null);

  useEffect(() => {
    if (!activeSchema || !schemas.includes(activeSchema)) {
      setActiveSchema(schemas[0] || null);
      for (const schema of schemas) {
        if (schema.name == activeSchema.name) {
          setActiveSchema(schema);
          break;
        }
      }
    }
  }, [schemas]);

  if (schemas.length === 0) {
    return <div className={styles.wrapper} />;
  }

  return (
    <div className={styles.wrapper} style={{ width: "100%", height: "100%" }}>
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
