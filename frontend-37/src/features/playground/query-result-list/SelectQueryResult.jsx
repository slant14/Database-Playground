export function SelectQueryResult({ results }) {
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
