import React from 'react';
import { Typography, Divider } from 'antd';
import { ImPointRight } from "react-icons/im";


class PostgresResult extends React.Component {

    cleanQueryForDisplay = (query) => {
        return query
            .split('\n')
            .filter(line => {
                const trimmedLine = line.trim();
                return trimmedLine !== '' && !trimmedLine.startsWith('--');
            })
            .join('\n')
            .trim();
    };

    render() {
        const { response } = this.props;

        if (!response || (typeof response !== 'object' && !Array.isArray(response))) {
            return (
                <div>
                    <Typography.Text className='code-initial-text'>Request result will appear here</Typography.Text>
                    
                </div>
            );
        }

        return (
            <div>
                {(!response.results && !response.error && !response.message) ?
                    <Typography.Text className='code-initial-text'>Request result will appear here</Typography.Text> :
                    <div className="code-output-item">
                        {response.error || response.message === "Error occurred while executing command" ? (
                            <div>
                                <Typography.Text className='code-text' style={{ color: '#B22222', fontSize: '16px' }}>
                                    Error!
                                </Typography.Text>
                                {response.details && (
                                    <div style={{ marginTop: '5px' }}>
                                        <Typography.Text className='code-text' style={{ color: '#fff', fontSize: '13px' }}>
                                            {response.details}
                                        </Typography.Text>
                                    </div>
                                )}
                            </div>
                        ) : (
                            Array.isArray(response.results) && response.results.length >= 1 ? (
                                <div>
                                    <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '16px' }}>
                                        Success!
                                    </Typography.Text>
                                    {response.results.map((result, index) => (
                                        <div key={index} style={{ marginTop: '10px' }}>
                                            <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '13px' }}>
                                                Query: <Typography.Text className='code-text' style={{ color: '#fff', fontSize: '13px' }}>{this.cleanQueryForDisplay(result.query)}</Typography.Text>
                                            </Typography.Text>
                                            <br />
                                            <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '13px' }}>
                                                Rows affected: <Typography.Text className='code-text' style={{ color: '#fff', fontSize: '13px' }}>{result.rowcount}</Typography.Text>
                                            </Typography.Text>
                                            <br />
                                            <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '13px' }}>
                                                Execution time: <Typography.Text className='code-text' style={{ color: '#fff', fontSize: '13px' }}>{result.execution_time} seconds</Typography.Text>
                                            </Typography.Text>
                                            {result.data && result.data.length > 0 ? (
                                                <div>
                                                    <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '13px' }}>
                                                        Data:
                                                    </Typography.Text>
                                                    <br />
                                                    {result.data.map((row, rowIndex) => (
                                                        <Typography.Text key={rowIndex} className='code-text' style={{ color: '#fff', fontSize: '13px' }}>
                                                            <ImPointRight style={{ color: '#51CB63' }} /> [{row.map((cell, cellIndex) => (
                                                                <span key={cellIndex}>
                                                                    {cell !== null ? String(cell) : 'NULL'}
                                                                    {cellIndex < row.length - 1 ? ', ' : ''}
                                                                </span>
                                                            ))}]
                                                            <br />
                                                        </Typography.Text>
                                                    ))}
                                                </div>
                                            ) : (
                                                result.rowcount === 0 && (
                                                    result.query.trim().toUpperCase().startsWith('SELECT') ||
                                                    result.query.trim().toUpperCase().startsWith('UPDATE') ||
                                                    result.query.trim().toUpperCase().startsWith('DELETE')
                                                ) && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        <Typography.Text className='code-text' style={{ color: '#B22222', fontSize: '16px' }}>
                                                            No rows found matching the criteria!
                                                        </Typography.Text>
                                                    </div>
                                                )
                                            )}
                                            {index < response.results.length - 1 && <Divider className="my-divider" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                </div>
                            )
                        )}
                    </div>
                }
            </div>
        );
    }
}

export default PostgresResult;