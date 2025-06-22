import { useState } from "react";
import { PlaygroundBar } from "../components/PlaygroundBar";
import QueryInput from "../components/QueryInput";
import SchemaWrapper from "../components/SchemaWrapper";

export default function Playground() {
  const [ query, setQuery ] = useState("");

  const schemas = [
    {
      name: "students",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          attrs: "PRIMARY KEY",
        },
        {
          name: "name",
          type: "VARCHAR(30)",
          attrs: "NOT NULL",
        },
        {
          name: "age",
          type: "INTEGER",
          attrs: "DEFAULT 18",
        },
        {
          name: "email",
          type: "TEXT",
        },
      ],
    },
    {
      name: "grades",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          attrs: "PRIMARY KEY",
        },
        {
          name: "grade",
          type: "INTEGER",
          attrs: "NOT NULL",
        },
        {
          name: "studentId",
          type: "INTEGER",
          attrs: "FOREIGN KEY students",
        },
      ],
    },

    {
      name: "teachers",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          attrs: "PRIMARY KEY",
        },
        {
          name: "name",
          type: "VARCHAR(50)",
          attrs: "NOT NULL",
        },
        {
          name: "class",
          type: "TEXT",
        },
      ],
    },
    {
      name: "students2",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          attrs: "PRIMARY KEY",
        },
        {
          name: "name",
          type: "VARCHAR(30)",
          attrs: "NOT NULL",
        },
        {
          name: "age",
          type: "INTEGER",
          attrs: "DEFAULT 18",
        },
        {
          name: "email",
          type: "TEXT",
        },
      ],
    },
    {
      name: "grades2",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          attrs: "PRIMARY KEY",
        },
        {
          name: "grade",
          type: "INTEGER",
          attrs: "NOT NULL",
        },
        {
          name: "studentId",
          type: "INTEGER",
          attrs: "FOREIGN KEY students",
        },
      ],
    },

    {
      name: "teachers2",
      columns: [
        {
          name: "id",
          type: "SERIAL",
          attrs: "PRIMARY KEY",
        },
        {
          name: "name",
          type: "VARCHAR(50)",
          attrs: "NOT NULL",
        },
        {
          name: "class",
          type: "TEXT",
        },
      ],
    },
  ];

  return (
    <div>
      <PlaygroundBar />
      <div className="mono">
        <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "10px"}}>
          <QueryInput onQueryChange={setQuery} />
          <SchemaWrapper schemas={schemas} />
        </div>
      </div>
    </div>
  );
}
