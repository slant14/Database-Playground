import React from 'react';
import { Divider } from 'antd';
import { Typography } from 'antd';


class ChromaState extends React.Component {
    render() {
        const { response, db_state } = this.props;
        
        const renderDBState = (stateData) => {
            if (!stateData || !stateData.state || !Array.isArray(stateData.state)) {
                return <Typography.Text className='code-text'>No data available</Typography.Text>;
            }
            
            return stateData.state.map((item, index) => (
                <div key={index} className="code-output-item">
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
                    {index !== stateData.state.length - 1 && <Divider className="my-divider" />}
                </div>
            ));
        };
        let dbStateToShow = db_state || { state: [] };
        
        if (response.type === 'multiple_commands' && response.commands && response.commands.length > 0) {
            const lastCommand = response.commands[response.commands.length - 1];
            if (lastCommand && lastCommand.result && lastCommand.result.db_state) {
                dbStateToShow = { state: lastCommand.result.db_state };
            }
        } else if (response.type === 'single_command' && response.result) {
            if (response.result.db_state) {
                dbStateToShow = { state: response.result.db_state };
            }
        } else if (response.db_state) {
            dbStateToShow = { state: response.db_state };
        }

        if (!dbStateToShow || !dbStateToShow.state) {
            dbStateToShow = { state: [] };
        }

        return (
            <div>
                <p className="code-general-text">Current DB state:</p>
                <div className="code-output">
                    {renderDBState(dbStateToShow)}
                </div>
            </div>
        );
    }
}

export default ChromaState;