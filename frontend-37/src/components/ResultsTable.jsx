import styles from "./ResultsTable.module.css";
import clockImg from "../assets/clock.jpg";

function getTableData(item, headers) {
  let tableData = [];
  for (let i of headers) {
    console.log(+i.index, item[+i.index]);
    tableData.push(item[+i.index]);
  }
  return tableData;
}

// function parser(query) {
//   let a = [];
//   query = query.toLowerCase();
//   query = query.trim();
//   query = query.substring(query.indexOf(), query.indexOf("from"));
//   select 
// }

function Table({ results, schema }) {
  // if (results.length == 0) return;
  
  const headers = [];
  for (const i in schema.columns) {
    headers.push({index: i, name: schema.columns[i].name});
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((item) => (
              <td>{item.name}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((item) => (
            <tr>
              {getTableData(item, headers).map((data) => (
                <td>{data}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ResultsTable({ results, queryNum, schema }) {
  console.log("TIMUR ZDRAVSTVUY!", results); // ну реально || нет неправда
  const jason = {
    "results": [
      {
         "query": "SELECT name, age FROM users;",
         "rowcount": 1,
         "data": [
            ['Viktor', 18]
         ],
         "execution_time": 0.0042
      }
    ],
    "schema": {
       "name": "db_name",
       "tables": [
           {
              "name": "table_name",
              "columns": [
                {
                  "name": "column_name",
                  "type": "column type"
                }
              ]
           }
        ]
    }
  }  
  if (results.data === null) {
    const rowsAffected = Math.max(0, results.rowcount);
    return (
      <div>
        <details open>
          <summary>
            <span style={{marginRight: "auto", marginLeft: 10}}>{queryNum}. {results.query}</span>
            <span className={styles.greatSpan}>
              <img className={styles.clocksImg} src={clockImg} alt="clock" style={{marginRight: "auto", marginRight: 10}} />
              {(results.execution_time * 1000).toFixed(3)}ms
            </span>
          </summary>
          <p className={styles.rowAffect}><em>{rowsAffected} {rowsAffected == 1 ? "row" : "rows"} affected.</em></p>
        </details>
        {/* <div className={styles.timee}>
          <div>{queryNum}. {results.query}</div>
          <div className={styles.clk}>
            <div>
              <img className={styles.clocksImg} src={clockImg} alt="clock" />
            </div>
            <div>
              {(results.execution_time * 1000).toFixed(3)}ms
            </div>
          </div>
        </div>
        <p className={styles.rowAffect}><em>{rowsAffected} {rowsAffected == 1 ? "row" : "rows"} affected.</em></p>*/}
      </div> 
    );
  } else {
    let data = results.data;
    return (
      <div>
        <details open>
          <summary>
            <span style={{marginRight: "auto", marginLeft: 10}}>{queryNum}. {results.query}</span>
            <span className={styles.greatSpan}>
              <img className={styles.clocksImg} src={clockImg} alt="clock" style={{ marginRight: 10}} />
              {(results.execution_time * 1000).toFixed(3)}ms
            </span>
          </summary>
        <div className={styles.beautiful}>
          <Table results={data} schema={schema} />
        </div>
        </details>
      </div>
    );
  }
}