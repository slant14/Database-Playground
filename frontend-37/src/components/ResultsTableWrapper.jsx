import ResultsTable from "./ResultsTable";
import styles from "./ResultsTableWrapper.module.css";

function totalExecutionTime(jason) {
    let total = 0;
    for (let i of jason.results) {
        total += i.execution_time;
    }
    return total;
}

export default function ResultsTableWrapper({ jason }) {
    return (
        <div className={styles.resTable}>
            <p>Total execution time: {totalExecutionTime(jason)}</p>
            {jason.results.map((item) => (
        <ResultsTable results={item} />
      ))}
        </div>
    );
}