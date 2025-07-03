import { useRef, useState, useEffect } from "react";
import styles from "./QueryInput.module.css";
import RunButton from "./RunButton";

export default function QueryInput({ onQueryChange, onRunClicked }) {
  let textareaRef = useRef(null);
  let numbersColumnRef = useRef(null);
  let containerRef = useRef(null);

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
      };

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
            if(e.key == "Tab") {
              e.preventDefault();

              let { selectionStart, selectionEnd } = e.target;

              let lineStart = e.target.value.lastIndexOf("\n", selectionStart - 1) + 1;
              let lineEnd = e.target.value.substring(selectionStart).indexOf("\n");
              lineEnd = lineEnd == -1 ? e.target.value.length : selectionStart + lineEnd;

              let actualLineStart = e.target.value.substring(lineStart, selectionEnd).search(/\S/);

              if(actualLineStart == -1) actualLineStart = lineEnd;         

              let replacement = "    ";

              if( selectionStart <= actualLineStart ) {
                replacement = " ".repeat(4 - ((selectionStart - lineStart) % 4));
              }
              
              e.target.setRangeText(replacement, selectionStart, selectionEnd, "end");
            }

            if(e.key == "Shift"){
              shiftDown.current = true;
            }

            if(e.key == "Enter"){
              if(shiftDown.current) onRunClicked();
            }
          }}
          onKeyUp={(e) => {
            if(e.key == "Shift"){
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
