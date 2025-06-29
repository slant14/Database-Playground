import React from 'react';
import { Typography, Divider } from 'antd';


class PostgresResult extends React.Component {

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
                                <Typography.Text className='code-text' style={{ color: '#c01619', fontSize: '14px' }}>
                                    Error!
                                </Typography.Text>
                                {response.details && (
                                    <div style={{ marginTop: '5px' }}>
                                        <Typography.Text className='code-text' style={{ color: '#fff', fontSize: '12px' }}>
                                            {response.details}
                                        </Typography.Text>
                                    </div>
                                )}
                            </div>
                        ) : (
                            Array.isArray(response.results) && response.results.length >= 1 ? (
                                <div>
                                    <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '14px' }}>
                                        Success!
                                    </Typography.Text>
                                    {/* Здесь можно добавить детали результата */}
                                </div>
                            ) : (
                                <div>
                                    <Typography.Text className='code-text' style={{ color: '#c01619', fontSize: '14px' }}>
                                        No results found!
                                    </Typography.Text>
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