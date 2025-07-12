import React from 'react';
import { getChromaResponse } from '../../api';
import { getChromaInitialState } from '../../api';
import { getPostgresTable, createPostgresTable, queryPostgres } from '../../api';
import CodeInput from './codeInput';
import OutputInputs from './output';
import { Button, FloatButton, Typography, notification } from 'antd';
import { FaRegLightbulb } from "react-icons/fa";
import HintModal from './hintModal';
import HintModalPS from './hintModalPS';
import './Code.css';
import { getCookie } from '../../utils';

class Code extends React.Component {
  constructor(props) {
    super(props);
    
    if (this.props.selectedDb == "PostgreSQL") {
      this.handleDbSelection(this.props.selectedDb);
    }
    const savedDb = localStorage.getItem("selectedDb");
    const chosenDb = savedDb || "Choose DB";
    
    this.state = {
      response: {},
      db_state: {},
      isModalOpen: false,
      isLoading: false,
      chosenDb: chosenDb,
      postgresTableInfo: this.props.postgresTableInfo || {},
      postgresResponse: {},
    }

    this.getIt = this.getIt.bind(this);
    this.getInitialState = this.getInitialState.bind(this);
    this.handleDbSelection = this.handleDbSelection.bind(this);
    this.executeCommandsSequentially = this.executeCommandsSequentially.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.setLoading = this.setLoading.bind(this);
  }
  componentDidMount() {
    // Загружаем данные для выбранной БД при монтировании компонента
    if (this.state.chosenDb !== "Choose DB" && this.props.isLogin) {
      this.loadDbData(this.state.chosenDb);
    }
  }

  render() {
    return (
      <div className="code-container">
        <Button className='my-back-button' style={{ height: '35px', fontSize: '15px' }} onClick={() => this.props.handleButtonClick("template")}>Back</Button>
        <main>
          <CodeInput
            getIt={(text, chosenDb) => this.getIt(text, chosenDb)}
            onDbSelect={this.handleDbSelection}
            isLoading={this.state.isLoading}
            selectedDb={this.state.chosenDb}
            setSaveModalOpen={this.props.setSaveModalOpen}
            isSaveModalOpen={this.props.isSaveModalOpen}
            openSave={this.openSave}
          />
        </main>
        <aside className="code-aside">
          <OutputInputs 
            response={this.state.response} 
            db_state={this.state.db_state} 
            chosenDB={this.state.chosenDb} 
            postgresTableInfo={this.state.postgresTableInfo} 
            postgresResponse={this.state.postgresResponse} 
            setTableModalOpen={this.props.setTableModalOpen}
            outputDBStateRef={this.props.outputDBStateRef}
          />
        </aside>
        {this.state.chosenDb === "Chroma" || this.state.chosenDb === "PostgreSQL" ? <FloatButton icon={<FaRegLightbulb />} type="basic" className='lamp' onClick={this.open} tooltip="Command Tips" /> : null}
        {this.state.chosenDb === "Chroma" ? <HintModal title={<Typography.Text className='modal-title'>Types of command for <Typography.Text className='modal-title' style={{ color: '#51CB63' }}>Chroma</Typography.Text> </Typography.Text>} onCancel={this.close} open={this.state.isModalOpen} /> : null}
        {this.state.chosenDb === "PostgreSQL" ? <HintModalPS title={<Typography.Text className='modal-title'>Types of command for <Typography.Text className='modal-title' style={{ color: '#51CB63' }}>PostgreSQL</Typography.Text> </Typography.Text>} onCancel={this.close} open={this.state.isModalOpen} /> : null}
      </div>
    );
  }

  setLoading = (loading) => {
    this.setState({ isLoading: loading });
  }

  open = () => {
    this.setState({ isModalOpen: true });
    if (this.props.setHintModalOpen) {
      this.props.setHintModalOpen(true);
    }
    window.history.pushState({ modalType: 'hint', page: 'code' }, '', window.location.pathname);
  };

  openSave = () => {
    if (this.props.setSaveModalOpen) {
      this.props.setSaveModalOpen(true);
    }
    window.history.pushState({ modalType: 'save', page: 'code' }, '', window.location.pathname);
  };

  close = () => {
    const wasOpen = this.state.isModalOpen;
    this.setState({ isModalOpen: false });
    if (this.props.setHintModalOpen) {
      this.props.setHintModalOpen(false);
    }
    return wasOpen;
  }

  closeSave = () => {
    const wasOpen = this.props.isSaveModalOpen;
    if (this.props.setSaveModalOpen) {
      this.props.setSaveModalOpen(false);
    }
    return wasOpen;
  }

  getInitialState() {
    if (this.props.isLogin === false) {
      return;
    }
    this.setLoading(true);
    getChromaInitialState()
      .then(data => {
        this.setState({ db_state: data });
        this.setLoading(false);
      })
      .catch(error => {
        this.setLoading(false);
      });
  }

  postgresTableHandle = () => {
    if (this.props.isLogin === false) {
      return;
    }
    this.setLoading(true);
    getPostgresTable()
      .then(data => {
        this.setState({ postgresTableInfo: data.tables});
        this.setLoading(false);
      })
      .catch(error => {
      })
  }

  handleDbSelection(selectedDb) {
    this.setState({ chosenDb: selectedDb });
    localStorage.setItem("selectedDb", selectedDb);
    this.loadDbData(selectedDb);
  }

  loadDbData(selectedDb) {
    switch (selectedDb) {
      case "Chroma":
        this.getInitialState();
        break;
      case "PostgreSQL":
        this.postgresTableHandle();
        break;
      default:
        this.setState({ db_state: {} });
    }
  }

  handlePostLoginUpdate = () => {
    // Если пользователь уже выбрал БД, перезагружаем данные после авторизации
    if (this.state.chosenDb && this.state.chosenDb !== "Choose DB") {
      this.loadDbData(this.state.chosenDb);
    }
  };

  async executeCommandsSequentially(commands, error) {
    this.setLoading(true);
    let allResults = [];

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command === '') continue;

      try {
        const data = await getChromaResponse(command);

        if (data === "Error") {
          allResults.push({
            command: command,
            result: error,
            commandNumber: i + 1
          });
        } else {
          allResults.push({
            command: command,
            result: data,
            commandNumber: i + 1
          });
        }
        this.setState({
          response: {
            type: 'multiple_commands',
            commands: allResults,
            totalCommands: allResults.length
          }
        });

      } catch (error) {
        allResults.push({
          command: command,
          result: { message: "Error occurred while executing command" },
          commandNumber: i + 1
        });

        this.setState({
          response: {
            type: 'multiple_commands',
            commands: allResults,
            totalCommands: allResults.length
          }
        });
      }
    }
    this.getInitialState("Chroma");
    this.setLoading(false);
  }

  getIt(text, chosenDb) {
    if (this.props.isLogin === false) {
      notification.warning({
        message: 'Authorization required',
        description: 'Please log in to execute code',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "Choose DB") {
      notification.warning({
        message: 'Select database',
        description: 'Please select a database from the list',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    } else if (text === "" || text === null) {
      notification.warning({
        message: 'Empty code',
        description: 'Please write code to execute',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "PostgreSQL") {
      this.setLoading(true);
      queryPostgres(text)
        .then(data => {
          if (data === "Error") {
            this.setState({postgresResponse: { message: "Error occurred while executing command" } });
          } else {
            this.setState({postgresResponse: data});
          }
          this.postgresTableHandle();
          this.setLoading(false);
        })
        .catch(error => {
          this.setState({
            postgresResponse: { 
              error: true, 
              message: "Error occurred while executing command",
              details: error.message || "Unknown error"
            }
          });
          this.setLoading(false);
        });
      return;
    }
    if (chosenDb === "SQLite") {
      notification.warning({
        message: 'Database unavailable',
        description: 'Please select another database',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "MongoDB") {
      notification.warning({
        message: 'Database unavailable',
        description: 'Please select another database',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "Chroma") {
      this.setLoading(true);
      const error = {
        message: "Please try once again, there is an error in your code",
      }
      if (!text.includes('\n')) {
        getChromaResponse(text)
          .then(data => {
            if (data === "Error") {
              this.setState({
                response: {
                  type: 'single_command',
                  command: text,
                  result: error
                }
              });
            } else {
              this.setState({
                response: {
                  type: 'single_command',
                  command: text,
                  result: data
                }
              });
            }
            this.getInitialState(chosenDb);
            this.setLoading(false);
          })
          .catch(error => {
            this.setLoading(false);
          });
      }
      else {
        let commands = text.split('\n');
        this.executeCommandsSequentially(commands, error);
      }

    }
  }

  closeSave = () => {
    const wasOpen = this.props.isSaveModalOpen;
    if (this.props.setSaveModalOpen) {
      this.props.setSaveModalOpen(false);
    }
    return wasOpen;
  }
}

export default Code;