import React from 'react';
import { Typography, Divider } from 'antd';
import Add from '../Responses/add';
import Delete from '../Responses/delete';
import Get from '../Responses/get';
import Search from '../Responses/search';


class ChromaResult extends React.Component {

    render() {
        const { response } = this.props;
        return (
                <div>
                    {Object.keys(response).length === 0 ? 
                        <Typography.Text className='code-initial-text'>Request result will appear here</Typography.Text> :
                        <div className="code-output-item">
                            {response.type === 'multiple_commands' ? (
                                <div>
                                    {response.commands.map((commandData, index) => (
                                        <div key={index} className="code-output-item">
                                            <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '14px' }}>
                                                Command {commandData.commandNumber}: {commandData.command}
                                            </Typography.Text>
                                            <div style={{ marginTop: '5px' }}>
                                                {this.renderSingleResult(commandData.result)}
                                            </div>
                                            {index !== response.commands.length - 1 && <Divider className="my-divider" />}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                response.type === 'single_command' ? (
                                    <div>
                                        <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '14px' }}>
                                            Command: {response.command}
                                        </Typography.Text>
                                        <div style={{ marginTop: '5px' }}>
                                            {this.renderSingleResult(response.result)}
                                        </div>
                                    </div>
                                ) : (
                                    this.renderSingleResult(response.result)
                                )
                            )}
                        </div>
                    }
                </div>
        );
    }
    
    renderSingleResult(result) {
        if (result.message === "Please try once again, there is an error in your code") {
            return <Typography.Text className='code-text' style={{ color: '#B22222' }}>Please try once again, there is an error in your code</Typography.Text>;
        }
        
        return (
            <div>
                {result.command === 'ADD' ? <Add response={result} /> : ""}
                {result.command === 'DELETE' || result.error === "Document not found" ? <Delete response={result} /> : ""}
                {result.command === 'GET' ? <Get response={result} /> : ""}
                {result.command === 'SEARCH' ? <Search response={result} /> : ""}
            </div>
        );
    }

}

export default ChromaResult;