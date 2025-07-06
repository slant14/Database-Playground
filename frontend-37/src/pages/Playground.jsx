import { useEffect, useState } from "react";
import { PlaygroundBar } from "../components/PlaygroundBar";
import QueryInput from "../components/QueryInput";
import SchemaWrapper from "../components/SchemaWrapper";
import ResultsTableWrapper from "../components/ResultsTableWrapper";
import { API_URL } from "../const";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useSchemas } from "../hooks/useSchemas";
import { useTemplate } from "../hooks/useTemplate";
import MongoSchema from "../components/MongoSchema";

export default function Playground() {
  const session_id = localStorage.getItem("session_id");
  const { updateSchemas } = useSchemas();
  const [templateType, setTemplateType] = useState("");
  const { updateTemplate } = useTemplate();

  useEffect(() => {
    const run = async () => {
      const res1 = await fetch(
        `${API_URL}/db/schema/?session_id=${session_id}`,
        {
          credentials: "include",
        }
      );
      const json1 = await res1.json();
      updateSchemas(json1.tables);

      const res2 = await fetch(
        `${API_URL}/session/info/?session_id=${session_id}`
      );
      const json2 = await res2.json();

      const res3 = await fetch(`${API_URL}/template/${json2.template}`);
      const json3 = await res3.json();
      updateTemplate(json3.name);
      setTemplateType(json3.type);
    };
    run();
  }, []);

  return (
    <>
      {templateType == "PSQL" ? (
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
            className="mono"
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
                    <QueryInput />
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
                    <SchemaWrapper />
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
                <ResultsTableWrapper />
              </Panel>
            </PanelGroup>
          </div>
        </div>
      ) : (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div>
            <PlaygroundBar style={{ margin: 0 }} />
            <div style={{ marginLeft: 15, marginTop: 10 }}>
              <MongoSchema />
            </div>
          </div>
          <div
            className="mono"
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
              direction="horizontal"
              style={{
                display: "flex",
                marginBottom: 15,
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
                <QueryInput />
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
                <ResultsTableWrapper />
              </Panel>
            </PanelGroup>
          </div>
        </div>
      )}
    </>
  );
}
