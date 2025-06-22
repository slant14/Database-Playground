import { useState } from "react";
import { PlaygroundBar } from "../components/PlaygroundBar";
import QueryInput from "../components/QueryInput";
import SchemaWrapper from "../components/SchemaWrapper";
import ResultsTableWrapper from "../components/ResultsTableWrapper";

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

  let jason = {
    "results": [
      {
         "query": "SELECT name, age FROM users;",
         "rowcount": 6,
         "data": [
          { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
          { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
          { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
          { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
          { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
          { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
         ],
         "execution_time": 0.4
      },
      {
        "query": "Insert (tomato, cucumber) into database",
        "rowcount": 6,
        "data": null,
        "execution_time": 0.0042
     },
     {
      "query": "Delete onion where stocked = false",
      "rowcount": 3,
      "data": [
       { category: "Vegetables", price: "$2", stocked: false, name: "Onion" },
       { category: "Vegetables", price: "$4", stocked: false, name: "Onion" },
       { category: "Vegetables", price: "$1", stocked: false, name: "Onion" }
      ],
      "execution_time": 0.12
   }
    ],
    "schema": {
       "name": "db_name",
       "tables": [
           {
              "name": "table_name",
           }
        ]
    }
  }
  
  return (
    <div>
      <PlaygroundBar />
      <div className="mono">
        <div style={{display: "flex", justifyContent: "space-evenly", margin: "10px 0px 10px 0px"}}>
          <QueryInput onQueryChange={setQuery} onRunClicked={() => console.log("salam bro")} />
          <SchemaWrapper schemas={schemas} />
        </div>
      </div>
      <ResultsTableWrapper jason={jason} />
    </div>
  );
}
