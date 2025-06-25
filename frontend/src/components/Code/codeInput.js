import React from "react"
import { Button, Select, Upload, message } from "antd";
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

class CodeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            chosenDb: 'Choose DB',
        };
    }

    render() {
        return (
            <div>
                <p className="code-general-text">Write your code or <span><Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className='my-orange-button-outline' > Import File</Button>
                </Upload></span></p>
                <textarea className='code-textarea' placeholder='Will your code appear here?' onChange={(data) => this.setState({ code: data.target.value })}></textarea>
                <div className='code-buttons' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
                    <Select
                        className='code-select'
                        defaultValue="Choose DB"
                        style={{ width: 190, marginRight: '10px', marginTop: '10px' }}
                        options={[
                            { value: 'Choose DB', label: 'Choose DB', disabled: true },
                            { value: 'PostgreSQL', label: 'PostgreSQL' },
                            { value: 'SQLite', label: 'SQLite' },
                            { value: 'MongoDB', label: 'MongoDB' },
                            { value: 'Vector-Based Database', label: 'Vector-Based Database' },
                        ]}
                        onChange={value => this.setState({ chosenDb: value })}
                    />
                    < Button className='my-orange-button-outline' type="primary" style={{ marginTop: '10px', marginLeft: '0px' }} onClick={() => this.props.getIt(this.state.code, this.state.chosenDb)}>Run Code</Button>
                </div>
            </div>
        );
    }
}

export default CodeInput;