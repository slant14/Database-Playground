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
                        <Typography.Text className='code-text'>Status: <Typography.Text className='code-text' style={{ color: '#fff' }}>Added</Typography.Text></Typography.Text> <br />
                        <Typography.Text className='code-text'> ID: <Typography.Text className='code-text' style={{ color: '#fff' }}>{this.props.response.doc_id}</Typography.Text></Typography.Text> <br />
                    </div>
                }
            </div>
        );
    }

}

export default Add;