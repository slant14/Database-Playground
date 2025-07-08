import styles from "./QueryResultItem.module.css";
import clockImg from "../../../assets/clock.jpg";
import { SelectQueryResult } from "./SelectQueryResult";
import { QueryResult } from "../types";

interface QueryResultItemProps {
  result: QueryResult;
  queryNum: number;
}

export function QueryResultItem({ result, queryNum }: QueryResultItemProps) {
  if (!result.data) {
    const rowsAffected = Math.max(0, result.rowcount);
    return (
      <div>
        <details open>
          <summary>
            <span style={{ marginRight: "auto", marginLeft: 10 }}>
              {queryNum}. {result.query}
            </span>
            <span className={styles.greatSpan}>
              <img
                className={styles.clocksImg}
                src={clockImg}
                alt="clock"
                style={{ marginRight: 10 }}
              />
              {(result.execution_time * 1000).toFixed(3)}ms
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
    let data = result.data;
    return (
      <div>
        <details open>
          <summary>
            <span style={{ marginRight: "auto", marginLeft: 10 }}>
              {queryNum}. {result.query}
            </span>
            <span className={styles.greatSpan}>
              <img
                className={styles.clocksImg}
                src={clockImg}
                alt="clock"
                style={{ marginRight: 10 }}
              />
              {(result.execution_time * 1000).toFixed(3)}ms
            </span>
          </summary>
          <div className={styles.beautiful}>
            <SelectQueryResult queryData={data} />
          </div>
        </details>
      </div>
    );
  }
}
