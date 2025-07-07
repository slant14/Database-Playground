import styles from "./QueryResultItem.module.css";
import clockImg from "../../../assets/clock.jpg";
import { SelectQueryResult } from "./SelectQueryResult";

export function QueryResultItem({ results, queryNum }) {
  if (results === null) {
    const rowsAffected = Math.max(0, results.rowcount);
    return (
      <div>
        <details open>
          <summary>
            <span style={{ marginRight: "auto", marginLeft: 10 }}>
              {queryNum}. {results.query}
            </span>
            <span className={styles.greatSpan}>
              <img
                className={styles.clocksImg}
                src={clockImg}
                alt="clock"
                style={{ marginRight: 10 }}
              />
              {(results.execution_time * 1000).toFixed(3)}ms
            </span>
          </summary>
          <p className={styles.rowAffect}>
            <em>
              {rowsAffected} {rowsAffected == 1 ? "row" : "rows"} affected.
            </em>
          </p>
        </details>
      </div>
    );
  } else {
    let data = results.data;
    return (
      <div>
        <details open>
          <summary>
            <span style={{ marginRight: "auto", marginLeft: 10 }}>
              {queryNum}. {results.query}
            </span>
            <span className={styles.greatSpan}>
              <img
                className={styles.clocksImg}
                src={clockImg}
                alt="clock"
                style={{ marginRight: 10 }}
              />
              {(results.execution_time * 1000).toFixed(3)}ms
            </span>
          </summary>
          <div className={styles.beautiful}>
            <SelectQueryResult results={data} />
          </div>
        </details>
      </div>
    );
  }
}
