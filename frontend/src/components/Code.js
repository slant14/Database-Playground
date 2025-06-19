import React from 'react';
import { Button, Typography, Upload } from 'antd';
import { message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {getCode} from '../api'; // Assuming getCode is defined in api.js

const uploadProps = {
  name: 'file',
  action: '/upload',
  headers: { authorization: 'auth' },
  onChange(info) {
    const { status, name } = info.file;
    if (status === 'done') {
      message.success(`${name} успешно загружен`);
    } else if (status === 'error') {
      message.error(`${name} не смог загрузиться`);
    }
  },
};

class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: ""
    }
  }
  render() {
    return (
      <div className="code-container">
        <main>
          <p className="account-text">Write your code or <span><Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} className='my-orange-button-outline' > Import File</Button>
          </Upload></span></p>
          <textarea className='code-textarea' placeholder='Will your code appear here?' onChange={(data) => this.setState({ code: data.target.value })}></textarea>
        </main>
        <aside className="code-aside">
          <p className="account-text">Output:</p>
          <div className="code-output">
            <Typography.Text className='code-text'>Your output will appear here... Maybe...</Typography.Text>
          </div>
          <Button className='my-orange-button-outline' type="primary" style={{ marginTop: '10px', marginLeft: '0px' }} onClick={() => this.getIt(this.state.code)}>Run Code</Button>
          <Select
            className='code-select'
            defaultValue="PostgreSQL"
            style={{ width: 190, marginLeft: '10px', marginTop: '10px' }}
            options={[
              { value: 'PostgreSQL', label: 'PostgreSQL' },
              { value: 'SQLite', label: 'SQLite' },
              { value: 'MongoDB', label: 'MongoDB' },
              { value: 'Vector-Based Database', label: 'Vector-Based Database' },
            ]}
          />
        </aside>
      </div>
    );
  }
  getIt(text) {
    getCode(text)
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }
}

export default Code;