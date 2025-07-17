import React from 'react';
import { Typography, Divider } from 'antd';
import Add from '../Responses/add';
import Delete from '../Responses/delete';
import Get from '../Responses/get';
import Search from '../Responses/search';
import Update from '../Responses/update';


class ChromaResult extends React.Component {

    render() {
        const { response } = this.props;
        console.log("ChromaResult responseeeeeeeeeeeee:", response);
        const hasCommands = response && response.result && Array.isArray(response.result.commands) && response.result.commands.length > 0;
        const hasParseError = response && response.result && response.result.result && response.result.result.command === 'PARSE_ERROR';
        return (
            <div>
                {response && response.result && response.result.execution_time ? <div> <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '14px' }}>Execution time: <Typography.Text className='code-text' style={{ color: '#fff', fontSize: '14px' }}>{response.result.execution_time}</Typography.Text></Typography.Text><br /> </div> : null}
                {hasCommands ? (
                    <div className="code-output-item">
                        <div>
                            {response.result.commands.map((commandData, index) => (
                                <div key={index} className="code-output-item">
                                    <Typography.Text className='code-text' style={{ color: '#51CB63', fontSize: '14px' }}>
                                        Command {commandData.commandNumber}:
                                    </Typography.Text>
                                    <div style={{ marginTop: '5px' }}>
                                        {this.renderSingleResult(commandData.result, response)}
                                    </div>
                                    {index !== response.result.commands.length - 1 && <Divider className="my-divider" />}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : hasParseError ? (
                    <Typography.Text className='code-text' style={{ color: '#B22222' }}>
                        Parse Error: {response.result.result.error}
                    </Typography.Text>
                ) : (
                    <Typography.Text className='code-initial-text'>Request result will appear here</Typography.Text>
                )}
            </div>
        );
    }

    renderSingleResult(result, response) {
        if (!result) return null;
        if (result.message === "Please try once again, there is an error in your code") {
            return <Typography.Text className='code-text' style={{ color: '#B22222' }}>Please try once again, there is an error in your code</Typography.Text>;
        }
        // Create a response object that includes the full response data for individual commands
        const responseForComponent = {
            ...result,
            execution_time: this.props.response.result.execution_time,
        };

        return (
            <div>
                {result.command === 'ADD' ? <Add response={responseForComponent} /> : ""}
                {result.command === 'DELETE' || result.error === "Document not found" ? <Delete response={responseForComponent} /> : ""}
                {result.command === 'GET' ? <Get response={responseForComponent} /> : ""}
                {result.command === 'SEARCH' ? <Search response={responseForComponent} /> : ""}
                {result.command === 'UPDATE' ? <Update response={responseForComponent} /> : ""}
                {result.command === 'DROP' ? <Typography.Text className='code-text' style={{ color: '#51CB63' }}>Success! Database dropped.</Typography.Text> : ""}
            </div>
        );
    }

}

export default ChromaResult;