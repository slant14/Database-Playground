import { useEffect, useState } from "react";
import { PlaygroundBar } from "../components/PlaygroundBar";
import QueryInput from "../components/QueryInput";
import SchemaWrapper from "../components/SchemaWrapper";
import ResultsTableWrapper from "../components/ResultsTableWrapper";
import { API_URL } from "../const";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Playground() {
  const [query, setQuery] = useState("");
  const [schemas, setSchemas] = useState([]);
  const [results, setResults] = useState({ results: [] });
  const session_id = localStorage.getItem("session_id");

  useEffect(() => {
    const run = async () => {
      const res = await fetch(
        `${API_URL}/db/schema/?session_id=${session_id}`,
        {
          credentials: "include",
        }
      );
      const json = await res.json();
      setSchemas(json);
    };
    run();
  }, []);

  const sendQuery = async () => {
    const res = await fetch(`${API_URL}/db/query/?session_id=${session_id}`, {
      method: "POST",
      body: query,
      credentials: "include",
    });

    const json = await res.json();
    setResults(json);
    if (json.schema) setSchemas(json.schema);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <PlaygroundBar style={{ margin: 0 }} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
          marginLeft: "15px",
          marginRight: "15px",
          overflow: "hidden",
        }}
      >
        <PanelGroup
          direction="vertical"
          style={{
            flex: 1,
            display: "flex",
          }}
        >
          <Panel style={{ overflow: "hidden", minHeight: 200 }}>
            <PanelGroup
              direction="horizontal"
              style={{
                display: "flex",
              }}
            >
              <Panel
                style={{
                  overflow: "hidden",
                  border: "1px solid #c1c1c1",
                  borderBottomRightRadius: 10,
                  minWidth: 300,
                }}
              >
                {schemas.length !== 0 && (
                  <QueryInput
                    onQueryChange={setQuery}
                    onRunClicked={sendQuery}
                  />
                )}
              </Panel>

              <PanelResizeHandle style={{ width: "10px" }} />

              <Panel
                style={{
                  overflow: "hidden",
                  border: "1px solid #c1c1c1",
                  borderBottomLeftRadius: 10,
                  minWidth: 300,
                }}
              >
                {schemas.length !== 0 && (
                  <SchemaWrapper schemas={schemas.tables} />
                )}
              </Panel>
            </PanelGroup>
          </Panel>

          <PanelResizeHandle style={{ height: "10px" }} />

          <Panel
            style={{
              overflow: "hidden",
              border: "1px solid #c1c1c1",
              marginBottom: 10,
            }}
          >
            <ResultsTableWrapper jason={results} />
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}
