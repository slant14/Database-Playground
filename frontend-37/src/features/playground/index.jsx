import { useEffect, useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { API_URL } from "../../config/env";
import { templateStore } from "../../shared/store/templateStore";
import { schemasStore } from "./schemasStore";
import { MongoSchema } from "./schema-panel/MongoSchema";
import { QueryResultList } from "./query-result-list";
import { PlaygroundTopBar } from "./TopBar";
import { SchemaPanel } from "./schema-panel/SchemaPanel";
import { QueryInput } from "./query-input";

export function Playground() {
  const session_id = localStorage.getItem("session_id");
  const { updateSchemas } = schemasStore();
  const [templateType, setTemplateType] = useState("");
  const { updateTemplate } = templateStore();

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
          <PlaygroundTopBar style={{ margin: 0 }} />

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
                    <SchemaPanel />
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
                <QueryResultList />
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
            <PlaygroundTopBar style={{ margin: 0 }} />
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
                <QueryResultList />
              </Panel>
            </PanelGroup>
          </div>
        </div>
      )}
    </>
  );
}
