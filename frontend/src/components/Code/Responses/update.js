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
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }

}

export default Update;
