import React from 'react';
import { Typography } from 'antd';
import Add from './Responses/add';
import Delete from './Responses/delete';
import Get from './Responses/get';
import Search from './Responses/search';


class OutputResult extends React.Component {

    render() {
        return (
            <div className="code-aside">
                <p className="code-general-text" style={{ marginTop: '10px' }} >Request Result:</p>
                <div className="code-result">
                    {Object.keys(this.props.response).length === 0 ? <Typography.Text className='code-initial-text'>Request result will appear here</Typography.Text> :
                        <div className="code-output-item">
                            {this.props.response.message === "Please try once again, there is an error in your code" ? <Typography.Text className='code-text' style={{ color: '#B22222' }}>Please try once again, there is an error in your code</Typography.Text> :
                                <div>
                                    {this.props.response.command === 'ADD' ? <Add response={this.props.response} /> : ""}
                                    {this.props.response.command === 'DELETE' ? <Delete response={this.props.response} /> : ""}
                                    {this.props.response.command === 'GET' ? <Get response={this.props.response} /> : ""}
                                    {this.props.response.command === 'SEARCH' ? <Search response={this.props.response} /> : ""}
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        );
    }

}

export default OutputResult;