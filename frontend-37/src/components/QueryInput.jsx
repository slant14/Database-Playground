import { useRef, useState, useEffect } from "react";
import styles from "./QueryInput.module.css";
import RunButton from "./RunButton";
import { useResults } from "../hooks/useResults";
import { useSchemas } from "../hooks/useSchemas";
import { API_URL } from "../const";

export default function QueryInput() {
  let textareaRef = useRef(null);
  let numbersColumnRef = useRef(null);
  let containerRef = useRef(null);
  const [query, setQuery] = useState("");
  const { updateResults } = useResults();
  const { updateSchemas } = useSchemas();
  const session_id = localStorage.getItem("session_id");

  let shiftDown = useRef(false);

  let [numberColumnValues, changeNumberColumnValues] = useState(["1"]);

  let containerResizeObserver = new ResizeObserver(adjustSizes);
  let observerObserving = false;

  function getNumberRows() {
    return numberColumnValues.map((val, ind) => <div key={ind}>{val}</div>);
  }

  function adjustSizes() {
    numbersColumnRef.current.style.height = `${textareaRef.current.clientHeight}px`;
  }

  function selectionChangeHandler(e) {
    let { selectionStart, selectionEnd } = e.target;

    onQueryChange(
      selectionEnd > selectionStart
        ? e.target.value.substring(selectionStart, selectionEnd)
        : e.target.value
    );
  }

  const onRunClicked = async () => {
    const res = await fetch(`${API_URL}/db/query/?session_id=${session_id}`, {
      method: "POST",
      body: query,
      credentials: "include",
    });

    const json = await res.json();
    if (json.results) updateResults(json.results);
    else updateResults(json);
    if (json.schema) updateSchemas(json.schema.tables);
  };

  const onQueryChange = setQuery;

  let isSelectionChangeHandlerAdded = useRef(false);

  useEffect(() => {
    let input = textareaRef.current;

    if (input && !isSelectionChangeHandlerAdded.current) {
      input.addEventListener("selectionchange", selectionChangeHandler);
      isSelectionChangeHandlerAdded.current = true;
    }

    return () => {
      if (isSelectionChangeHandlerAdded.current) {
        input.removeEventListener("selectionchange", selectionChangeHandler);
        isSelectionChangeHandlerAdded.current = false;
      }

      shiftDown.current = false;
    };
  }, []);

  return (
    <div className={styles["query-input-container"]} ref={containerRef}>
      <div className={styles["query-input-wrapper"]}>
        <div
          className={styles["query-input-rowcounter"]}
          ref={numbersColumnRef}
        >
          {getNumberRows()}
        </div>
        <textarea
          className={styles["query-input-area"]}
          onChange={(e) => {
            let rows = e.target.value.split("\n");
            let columnValues = rows.map((_, i) => `${i + 1}`);

            changeNumberColumnValues(columnValues);

            adjustSizes();

            if (containerRef.current != null && !observerObserving) {
              observerObserving = true;
              containerResizeObserver.observe(containerRef.current);
            }
          }}
          onScroll={() => {
            if (numbersColumnRef.current) {
              numbersColumnRef.current.scrollTop =
                textareaRef.current.scrollTop;
            }
          }}
          onKeyDown={(e) => {
            if (e.key == "Tab") {
              e.preventDefault();

              let { selectionStart, selectionEnd } = e.target;

              let lineStart =
                e.target.value.lastIndexOf("\n", selectionStart - 1) + 1;
              let lineEnd = e.target.value
                .substring(selectionStart)
                .indexOf("\n");
              lineEnd =
                lineEnd == -1
                  ? e.target.value.length
                  : selectionStart + lineEnd;

              let actualLineStart = e.target.value
                .substring(lineStart, selectionEnd)
                .search(/\S/);

              if (actualLineStart == -1) actualLineStart = lineEnd;

              let replacement = "    ";

              if (selectionStart <= actualLineStart) {
                replacement = " ".repeat(
                  4 - ((selectionStart - lineStart) % 4)
                );
              }

              e.target.setRangeText(
                replacement,
                selectionStart,
                selectionEnd,
                "end"
              );
            }

            if (e.key == "Shift") {
              shiftDown.current = true;
            }

            if (e.key == "Enter") {
              if (shiftDown.current) onRunClicked();
            }
          }}
          onKeyUp={(e) => {
            if (e.key == "Shift") {
              shiftDown.current = false;
            }
          }}
          placeholder="WHITE YOUR QUERY HERE"
          ref={textareaRef}
        ></textarea>
      </div>
      <RunButton handleClick={onRunClicked} />
    </div>
  );
}
