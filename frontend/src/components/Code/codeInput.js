import React from "react"
import { Button, Select, Upload, notification } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import SaveModal from './modalSave';
import './codeInput.css';


class CodeInput extends React.Component {
    constructor(props) {
        super(props);

        const savedDb = localStorage.getItem("selectedDb");
        const chosenDb = savedDb || 'Choose DB';

        this.state = {
            code: '',
            chosenDb: chosenDb,
            isModalOpen: false,
        };

        this.textareaRef = React.createRef();
        this.lineNumbersRef = React.createRef();
        this.wrapperRef = React.createRef();
    }

    componentDidMount() {
        // Если есть сохраненная БД, уведомляем родительский компонент
        if (this.state.chosenDb !== 'Choose DB' && this.props.onDbSelect) {
            this.props.onDbSelect(this.state.chosenDb);
        }
    }

    // Функция для подсчета номеров строк
    getLineNumbers = () => {
        const lines = this.state.code.split('\n');
        const lineCount = Math.max(lines.length, 1);
        return Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');
    };

    // Синхронизация скролла между номерами строк и текстом
    handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const scrollLeft = e.target.scrollLeft;

        if (this.lineNumbersRef.current) {
            this.lineNumbersRef.current.scrollTop = scrollTop;
        }
        if (this.wrapperRef.current) {
            this.wrapperRef.current.scrollLeft = scrollLeft;
        }
    };

    handleCodeChange = (e) => {
        this.setState({ code: e.target.value });
    };

    open = () => {
        this.setState({ isModalOpen: true });
        if (this.props.setSaveModalOpen) {
            this.props.setSaveModalOpen(true)
        }
        window.history.pushState({ modalType: 'save', page: 'code' }, '', window.location.pathname);
    };

    close = () => {
        const wasOpen = this.state.isModalOpen;
        this.setState({ isModalOpen: false });
        if (this.props.setSaveModalOpen) {
            this.props.setSaveModalOpen(false)
        }
        return wasOpen;
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

                <div className="code-editor-container">
                    <div className="code-editor-wrapper" ref={this.wrapperRef}>
                        <div
                            className="line-numbers"
                            ref={this.lineNumbersRef}
                        >
                            {this.getLineNumbers()}
                        </div>
                        <textarea
                            ref={this.textareaRef}
                            className='code-textarea-with-lines'
                            placeholder='Will your code appear here?'
                            value={this.state.code}
                            onChange={this.handleCodeChange}
                            onKeyDown={this.handleKeyDown}
                            onScroll={this.handleScroll}
                            spellCheck={false}
                        />
                    </div>
                </div>

                <div className='code-buttons' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right' }}>
                    <Select
                        className='code-select'
                        value={this.state.chosenDb}
                        style={{ width: 190, marginTop: '10px' }}
                        options={[
                            { value: 'PostgreSQL', label: 'PostgreSQL' },
                            { value: 'SQLite', label: 'SQLite' },
                            { value: 'MongoDB', label: 'MongoDB' },
                            { value: 'Chroma', label: 'Chroma' },
                        ]}
                        onChange={value => {
                            this.setState({ chosenDb: value });
                            localStorage.setItem("selectedDb", value);
                            if (this.props.onDbSelect) {
                                this.props.onDbSelect(value);
                            }
                        }}
                    />
                    <Button
                        className='my-orange-button-outline'
                        style={{ marginTop: '10px', marginRight: '10px' }}
                        onClick={() => this.props.openSave && this.props.openSave()}
                        disabled={!(this.state.chosenDb === "PostgreSQL") }
                    >
                        Save Template
                    </Button>
                    < Button className='my-orange-button-outline' type="primary" style={{ marginTop: '10px', marginLeft: '0px' }} onClick={() => this.props.getIt(this.state.code, this.state.chosenDb)} loading={this.props.isLoading} disabled={this.props.isLoading} iconPosition="end">Run Code</Button>
                </div>
                <SaveModal
                    open={this.props.isSaveModalOpen}
                    onCancel={() => this.props.setSaveModalOpen && this.props.setSaveModalOpen(false)}
                    title="Save Template"
                    selectedDb={this.state.chosenDb}
                    sqlCode={this.state.code}
                    onSave={this.props.onSaveTemplate}
                />
            </div>
        );
    }
}

export default CodeInput;