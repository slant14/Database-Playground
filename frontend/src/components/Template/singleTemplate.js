import React from 'react';
import './Template.css';
import { Typography, Button } from 'antd';

class SingleTemplate extends React.Component {
  render() {
    return (
    <div className="single-template-container">
        <main>
            <Typography.Text className="single-template-title">{this.props.title}</Typography.Text> <br/>
            <Typography.Text className="single-template-text">{this.props.description}</Typography.Text>
        </main>
        <aside>
            <Button className='my-orange-button-outline' style={{height: '40px', fontSize: '18px' }} onClick={() => this.props.handleButtonClick("code")}>Use Template</Button>
        </aside>
    </div>
    );
  }
}

export default SingleTemplate;