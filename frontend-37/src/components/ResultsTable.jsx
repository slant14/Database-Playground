import styles from "./ResultsTable.module.css";

function getTableData(item, headers) {
  let tableData = Array();
  for (let i of headers) {
    tableData.push(item[i]);
  }
  return tableData;
}

function Table({ results }) {
  // if (results.length == 0) return;
  console.log(results);
  let headers = [];
  for (let i in results[0]) {
    headers.push(i);
  }
  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr key={results.indexOf(item)}>
              {getTableData(item, headers).map((data) => (
                <td key={data}>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultsTable({ results }) {
  console.log("TIMUR DAUN", results); // ну реально
  if (results.data === null) {
    return (
      <div className={styles.beautiful}>
        <p>Execution time: {results.execution_time}</p>
        <p>{Math.max(0, results.rowcount)} rows affected.</p>
      </div>
    );
  } else {
    let data = results.data;
    return (
      <div className={styles.beautiful}>
        Execution time: {results.execution_time}
        <Table results={data} />
      </div>
    );
  }
}
