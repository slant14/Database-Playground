import React from 'react';
import { Button, Typography, Upload } from 'antd';
import { message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

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
  render() {
    return (
      <div className="code-container">
        <main>
          <p className="account-text">Write your code or <span><Upload {...uploadProps}>
            <Button icon={<UploadOutlined />} className='my-orange-button-outline' > Import File</Button>
          </Upload></span></p>
          <textarea className='code-textarea' placeholder='Will your code appear here?'></textarea>
        </main>
        <aside className="code-aside">
          <p className="account-text">Output:</p>
          <div className="code-output">
            <Typography.Text className='code-text'>Your output will appear here... Maybe...</Typography.Text>
          </div>
          <Button className='my-orange-button-outline' type="primary" style={{ marginTop: '10px', marginLeft: '0px' }}>Run Code</Button>
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
}

export default Code;