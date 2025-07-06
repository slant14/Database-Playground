// import ResultsTable from "./ResultsTable";
// import styles from "./ResultsTableWrapper.module.css";
// import clockImg from "../assets/clock.jpg";
// import { useResults } from "../hooks/useResults";
//
// function totalExecutionTime(jason) {
//   let total = 0;
//   for (let i of jason.results) {
//     total += i.execution_time;
//   }
//   return total;
// }
//
// function totalRowsAffected(jason) {
//   let total = 0;
//   for (let i of jason.results) {
//     if (i.data == null) {
//       total += i.rowcount;
//     }
//   }
//   return total;
// }
//
// function totalQueriesExecuted(jason) {
//   let total = 0;
//   for (let i of jason.results) {
//     total += 1;
//   }
//   return total;
// }
//
// function takeLine(str) {
//   let a = str.indexOf('"LINE"');
//   let b = str.indexOf("LINE", a + 2);
//   let c = str.substring(0, b);
//   let d = str.substring(b, str.length);
//
//   return [c, d];
// }
//
// export default function ResultsTableWrapper() {
//   const { results } = useResults();
//   const jason = { results: results };
//   if (!jason.results) return <></>;
//
//    else {
//     let rowsAffect = totalRowsAffected(jason);
//     return (
//       <div className={styles.resTable}>
//         <div className={styles.timee}>
//           {jason.results.length != 0 ? (
//             <>
//               <div>
//                 Total: {totalQueriesExecuted(jason)} queries executed,{" "}
//                 {rowsAffect} {rowsAffect == 1 ? "row" : "rows"} affected.
//               </div>
//               <div className={styles.clk}>
//                 <div>
//                   <img className={styles.clockImg} src={clockImg} alt="clock" />
//                 </div>
//                 <div>{(totalExecutionTime(jason) * 1000).toFixed(3)}ms</div>
//               </div>
//             </>
//           ) : (
//             <div></div>
//           )}
//         </div>
//         {jason.results.map((item) => (
//           <ResultsTable
//             key={item}
//             results={item}
//             queryNum={jason.results.indexOf(item) + 1}
//             schema={jason.schema.tables[jason.results.indexOf(item)]}
//           />
//         ))}
//         <div>&nbsp;</div>
//       </div>
//     );
//   }
// }

import { useResults } from "../hooks/useResults";
import ResultsTable from "./ResultsTable";
import styles from "./ResultsTableWrapper.module.css";

function takeLine(str) {
  let a = str.indexOf('"LINE"');
  let b = str.indexOf("LINE", a + 2);
  let c = str.substring(0, b);
  let d = str.substring(b, str.length);

  return [c, d];
}

export default function ResultsTableWrapper() {
  const { results } = useResults();
  if (!results) return <></>;
  if (results.detail) {
    return (
      <div className={styles.errors}>
        <p className={styles.errorIn}>Error in query detected:</p>
        <div className={styles.oshibka}>
          <p style={{ marginBottom: 0 }}>{takeLine(results.detail)[0]}</p>
          <p style={{ marginTop: 0, marginBottom: 0, whiteSpace: "pre" }}>
            {takeLine(results.detail)[1]}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      {results.map((item) => (
        <ResultsTable results={item} queryNum={1} key={item} />
      ))}
    </div>
  );
}
