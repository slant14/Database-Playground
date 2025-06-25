import React from 'react';
import { Typography } from 'antd';
import { ImPointRight } from "react-icons/im";

class Get extends React.Component {

    render() {
        return (

            <div>
                {Object.keys(this.props.response).length === 0 ? <Typography.Text className='code-text'>Request result will appear here</Typography.Text> :
                    <div className="code-output-item">
                        {this.props.response.result.error === "Document not found" ? <Typography.Text className='code-text' style={{ color: '#B22222' }}>ID is not found</Typography.Text> :
                            <div>
                                <Typography.Text className='code-text'>Success! </Typography.Text> <br/>
                                <Typography.Text className='code-text'>Execution time: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.execution_time}</Typography.Text></Typography.Text><br />
                                <Typography.Text className='code-text'>Document info: </Typography.Text><br />
                                <Typography.Text className='code-text'><ImPointRight/> ID: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.result.document.id}</Typography.Text></Typography.Text> <br />
                                <Typography.Text className='code-text'><ImPointRight/> Title: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.result.document.document}</Typography.Text></Typography.Text> <br />
                                {this.props.response.result.document.metadata && (
                                    <div className="metadata-fields">
                                        {Object.entries(this.props.response.result.document.metadata).map(([key, value]) => (
                                            <Typography.Text className='code-text' key={key}>
                                                <ImPointRight/> Metadata/{key}: <Typography.Text className='code-text' style={{ color: '#fff' }}>{value}</Typography.Text>
                                                <br />
                                            </Typography.Text>
                                        ))}
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

export default Get;