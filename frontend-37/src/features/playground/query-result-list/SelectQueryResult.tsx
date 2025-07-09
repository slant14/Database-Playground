import { QueryData } from "../types";

interface SelectQueryResultProps {
  queryData: QueryData;
}

export function SelectQueryResult({ queryData }: SelectQueryResultProps) {
  if (!queryData) return;
  const nums = [];
  if (queryData.columns) {
    for (let i = 0; i < queryData.columns[0].length; i++) nums.push(i);

    return (
      <div>
        <table>
          <thead>
            <tr>
              {queryData.columns.map((col) => (
                <td key={col}>{col}</td>
              ))}
            </tr>
          </thead>
          <tbody>
            {nums.map((index) => (
              <tr key={index}>
                {queryData.columns.map((key) => (
                  <td key={queryData.data[key][index]}>
                    {queryData.data[key][index]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <pre>{JSON.stringify(queryData, null, 2)}</pre>;
}
