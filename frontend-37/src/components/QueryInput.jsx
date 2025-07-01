import { useRef, useState } from "react";
import styles from "./QueryInput.module.css";
import RunButton from "./RunButton";

export default function QueryInput({ onQueryChange, onRunClicked }) {
  let textareaRef = useRef(null);
  let numbersColumnRef = useRef(null);
  let containerRef = useRef(null);

  let [numberColumnValues, changeNumberColumnValues] = useState(["1"]);

  let containerResizeObserver = new ResizeObserver(adjustSizes);
  let observerObserving = false;

  function getNumberRows() {
    return numberColumnValues.map((val, ind) => <div key={ind}>{val}</div>);
  }

  function adjustSizes() {
    numbersColumnRef.current.style.height = `${textareaRef.current.clientHeight}px`;
  }

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

            onQueryChange(e.target.value);
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
          placeholder="WHITE YOUR QUERY HERE"
          ref={textareaRef}
        ></textarea>
      </div>
      <RunButton handleClick={onRunClicked} />
    </div>
  );
}
