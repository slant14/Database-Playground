import styles from "./ResultsTable.module.css";
import clockImg from "../assets/clock.jpg";

function Table({ results }) {
  if (!results) return;
  const nums = [];
  if (results.columns) {
    for (let i = 0; i < results.columns[0].length; i++) nums.push(i);

    return (
      <div>
        <table>
          <thead>
            <tr>
              {results.columns.map((col) => (
                <td key={col}>{col}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {nums.map((index) => (
              <tr key={index}>
                {results.columns.map((key) => (
                  <td key={results.data[key][index]}>
                    {results.data[key][index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <pre>{JSON.stringify(results, null, 2)}</pre>;
}

export default function ResultsTable({ results, queryNum }) {
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
            <Table results={data} />
          </div>
        </details>
      </div>
    );
  }
}
