import React from 'react';
import { Typography } from 'antd';
import { ImPointRight } from "react-icons/im";

class Update extends React.Component {

    render() {
        return (
            <div>
                {Object.keys(this.props.response).length === 0 ? 
                    <Typography.Text className='code-text'>Request result will appear here</Typography.Text> :
                    <div className="code-output-item">
                        {this.props.response.error ? 
                            <Typography.Text className='code-text' style={{ color: '#B22222' }}>
                                {this.props.response.error}
                            </Typography.Text> :
                            <div>
                                <Typography.Text className='code-text'>Success! </Typography.Text> <br />
                                <Typography.Text className='code-text'>Status: <Typography.Text className='code-text' style={{ color: '#fff' }}>Updated</Typography.Text></Typography.Text> <br />
                                <Typography.Text className='code-text'>Execution time: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.execution_time}</Typography.Text></Typography.Text><br />
                                <Typography.Text className='code-text'>Document info: </Typography.Text><br />
                                {this.props.response.db_state && this.props.response.db_state.find(doc => doc.id === this.props.response.doc_id) && (
                                    <div>
                                        <Typography.Text className='code-text'><ImPointRight /> ID: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.doc_id}</Typography.Text></Typography.Text> <br />
                                        <Typography.Text className='code-text'><ImPointRight /> Title: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.db_state.find(doc => doc.id === this.props.response.doc_id).document}</Typography.Text></Typography.Text> <br />
                                        {this.props.response.db_state.find(doc => doc.id === this.props.response.doc_id).metadata && (
                                            <div className="metadata-fields">
                                                {Object.entries(this.props.response.db_state.find(doc => doc.id === this.props.response.doc_id).metadata).map(([key, value]) => (
                                                    <Typography.Text className='code-text' key={key}>
                                                        <ImPointRight /> Metadata/{key}: <Typography.Text className='code-text' style={{ color: '#fff' }}>{value}</Typography.Text>
                                                        <br />
                                                    </Typography.Text>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }

}

export default Update;
