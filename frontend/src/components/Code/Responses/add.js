import React from 'react';
import { Typography } from 'antd';
import { ImPointRight } from "react-icons/im";

class Add extends React.Component {

    render() {
        return (

            <div>
                {Object.keys(this.props.response).length === 0 ? <Typography.Text className='code-text'>Request result will appear here</Typography.Text> :
                    <div className="code-output-item">
                        <Typography.Text className='code-text'>Success! </Typography.Text> <br />
                        <Typography.Text className='code-text'>Status: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.result.status} {this.props.response.result.doc_id}</Typography.Text></Typography.Text> <br />
                        <Typography.Text className='code-text'>Execution time: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.execution_time}</Typography.Text></Typography.Text><br />
                        <Typography.Text className='code-text'>Document info: </Typography.Text><br />
                        <Typography.Text className='code-text'><ImPointRight /> ID: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.db_state[this.props.response.documents_count - 1].id}</Typography.Text></Typography.Text> <br />
                        <Typography.Text className='code-text'><ImPointRight /> Title: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.db_state[this.props.response.documents_count - 1].document}</Typography.Text></Typography.Text> <br />
                        {this.props.response.db_state[this.props.response.documents_count - 1].metadata && (
                            <div className="metadata-fields">
                                {Object.entries(this.props.response.db_state[this.props.response.documents_count - 1].metadata).map(([key, value]) => (
                                    <Typography.Text className='code-text' key={key}>
                                        <ImPointRight /> Metadata/{key}: <Typography.Text className='code-text' style={{ color: '#fff' }}>{value}</Typography.Text>
                                        <br />
                                    </Typography.Text>
                                ))}
                            </div>
                        )}
                    </div>
                }
            </div>
        );
    }

}

export default Add;