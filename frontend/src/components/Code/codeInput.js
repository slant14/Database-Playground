import React from "react"
import { Button, Select, Upload, notification } from "antd";
import { UploadOutlined} from '@ant-design/icons';


class CodeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: '',
            chosenDb: 'Choose DB',
        };
    }

    handleFileUpload = (file) => {
        const { chosenDb } = this.state;
        let isValidFile = false;
        let errorMessage = '';
        if (chosenDb === 'Chroma') {
            isValidFile = file.type === 'text/plain' || file.name.endsWith('.txt');
            errorMessage = 'For Chroma you can only upload .txt files';
        } else if (chosenDb === 'PostgreSQL') {
            isValidFile = file.name.endsWith('.sql') || file.type === 'application/sql' || file.name.endsWith('.txt') || file.type === 'text/plain';
            errorMessage = 'For PostgreSQL you can only upload .sql and .txt files';
        } else {
            notification.warning({
                message: 'Select database',
                description: 'First select a database from the list',
                placement: 'bottomRight',
                duration: 1.5,
            });
            return false;
        }
        if (!isValidFile) {
            notification.error({
                message: 'Invalid file format',
                description: errorMessage,
                placement: 'bottomRight',
                duration: 1.5,
            });
            return false;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            let content = e.target.result;
            this.setState({ code: content });
            notification.success({
                message: 'File uploaded',
                description: `${file.name} successfully uploaded`,
                placement: 'bottomRight',
                duration: 1.5,
            });
        };
        reader.onerror = () => {
            notification.error({
                message: 'File reading error',
                description: `Failed to read file ${file.name}`,
                placement: 'bottomRight',
                duration: 1.5,
            });
        };
        reader.readAsText(file);
        return false;
    };

    handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = this.state.code.substring(0, start) + '    ' + this.state.code.substring(end);
            this.setState({ code: newValue }, () => {
                textarea.selectionStart = textarea.selectionEnd = start + 4;
            });
        }
    };

    render() {
        const { chosenDb } = this.state;

        let acceptedFiles = '';
        if (chosenDb === 'Chroma') {
            acceptedFiles = '.txt';
        } else if (chosenDb === 'PostgreSQL') {
            acceptedFiles = '.sql,.txt';
        } else if (chosenDb === 'SQLite' || chosenDb === 'MongoDB') {
            acceptedFiles = '.sql,.txt';
        } else {
            acceptedFiles = '.txt,.sql';
        }
        
        const uploadProps = {
            name: 'file',
            accept: acceptedFiles,
            beforeUpload: this.handleFileUpload,
            showUploadList: false,
        };

        return (
            <div>
                <p className="code-general-text">Write your code or <span><Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />} className='my-orange-button-outline' > Import File</Button>
                </Upload></span></p>
                <textarea 
                    className='code-textarea' 
                    placeholder='Will your code appear here?' 
                    value={this.state.code} 
                    onChange={(data) => this.setState({ code: data.target.value })}
                    onKeyDown={this.handleKeyDown}
                ></textarea>
                <div className='code-buttons' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
                    <Select
                        className='code-select'
                        defaultValue="Choose DB"
                        style={{ width: 190, marginRight: '10px', marginTop: '10px' }}
                        options={[
                            { value: 'PostgreSQL', label: 'PostgreSQL' },
                            { value: 'SQLite', label: 'SQLite' },
                            { value: 'MongoDB', label: 'MongoDB' },
                            { value: 'Chroma', label: 'Chroma' },
                        ]}
                        onChange={value => {
                            this.setState({ chosenDb: value });
                            if (this.props.onDbSelect) {
                                this.props.onDbSelect(value);
                            }
                        }}
                    />
                    < Button className='my-orange-button-outline' type="primary" style={{ marginTop: '10px', marginLeft: '0px' }} onClick={() => this.props.getIt(this.state.code, this.state.chosenDb)} loading={this.props.isLoading} disabled={this.props.isLoading} iconPosition="end">Run Code</Button>
                </div>
            </div>
        );
    }
}

export default CodeInput;