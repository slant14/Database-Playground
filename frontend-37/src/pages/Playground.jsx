import { useEffect, useState } from "react";
import { PlaygroundBar } from "../components/PlaygroundBar";
import QueryInput from "../components/QueryInput";
import SchemaWrapper from "../components/SchemaWrapper";
import ResultsTableWrapper from "../components/ResultsTableWrapper";

export default function Playground() {
  const [query, setQuery] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [results, setResults] = useState({ results: [] });
  const session_id = localStorage.getItem("session_id");

  useEffect(() => {
    const run = async () => {
      const res = await fetch(
        `https://api.dbpg.ru/db/schema/?session_id=${session_id}`,
        {
          credentials: "include",
        },
      );
      const json = await res.json();
      console.log(json);
      setSchemas(json);
    };
    run();
  }, []);

  const sendQuery = async () => {
    const res = await fetch(
      `https://api.dbpg.ru/db/query/?session_id=${session_id}`,
      {
        method: "POST",
        body: query,
        credentials: "include",
      },
    );

    const json = await res.json();
    console.log(json);
    setResults(json);
    setSchemas(json.schema);
  };

  return (
    <div>
      <PlaygroundBar />
      {schemas.length != 0 && (
        <div className="mono">
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              margin: "10px 0px 10px 0px",
            }}
          >
            <QueryInput onQueryChange={setQuery} onRunClicked={sendQuery} />
            <SchemaWrapper schemas={schemas.tables} />
          </div>
        </div>
      )}

      <ResultsTableWrapper jason={results} />
    </div>
  );
}
