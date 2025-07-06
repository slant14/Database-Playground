import { useSchemas } from "../hooks/useSchemas";

export default function MongoSchema() {
  const { schemas } = useSchemas();
  if (!schemas) return;

  return (
    <div
      style={{
        paddingTop: 15,
        paddingRight: 20,
        paddingBottom: 15,
        paddingLeft: 5,
        backgroundColor: "#E9E9FF",
        borderRadius: 16,
        width: "fit-content",
        display: "flex",
      }}
    >
      {schemas.map((schema) => (
        <div
          style={{
            fontSize: 24,
            marginLeft: 15,
            fontWeight: "bold",
          }}
          key={schema.name}
        >
          {schema.name}
        </div>
      ))}
    </div>
  );
}
