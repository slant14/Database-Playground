import React from 'react';
import { Divider } from 'antd';
import { Typography } from 'antd';


class OutputDBState extends React.Component {
    render() {
        return (
            <div>
                <p className="code-general-text">Current DB state:</p>
                <div className="code-output">
                    {Object.keys(this.props.response).length === 0 || this.props.response.message === "Please try once again, there is an error in your code" ? <Typography.Text className='code-initial-text'>Current DB state will appear here</Typography.Text> : this.props.response.db_state.map((item, index) => {
                        return (
                            <div className="code-output-item">
                                <Typography.Text className='code-text'>ID: <Typography.Text className='code-text' style={{ color: '#fff' }}>{item.id}</Typography.Text></Typography.Text> <br />
                                <Typography.Text className='code-text'>Title: <Typography.Text className='code-text' style={{ color: '#fff' }}>{item.document}</Typography.Text></Typography.Text><br />
                                {item.metadata && (
                                    <div className="metadata-fields">
                                        {Object.entries(item.metadata).map(([key, value]) => (
                                            <Typography.Text className='code-text' key={key}>
                                                Metadata/{key}: <Typography.Text className='code-text' style={{ color: '#fff' }}>{value}</Typography.Text>
                                                <br />
                                            </Typography.Text>
                                        ))}
                                    </div>
                                )}
                                {index !== this.props.response.db_state.length - 1 && <Divider className="my-divider" />}
                            </div>
                        );
                    })}

                </div>
            </div>
        );
    }
}

export default OutputDBState;