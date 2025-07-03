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
    this.state = {
      response: {},
      db_state: {},
      isModalOpen: false,
      isLoading: false,
      chosenDb: "Choose DB",
      postgresTableInfo: {},
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
  render() {
    return (
      <div className="code-container">
        <Button className='my-back-button' style={{ height: '35px', fontSize: '15px' }} onClick={() => this.props.handleButtonClick("template")}>Back</Button>
        <main>
          <CodeInput
            getIt={(text, chosenDb) => this.getIt(text, chosenDb)}
            onDbSelect={this.handleDbSelection}
            isLoading={this.state.isLoading}
          />
        </main>
        <aside className="code-aside">
          <OutputInputs 
            response={this.state.response} 
            db_state={this.state.db_state} 
            chosenDB={this.state.chosenDb} 
            postgresTableInfo={this.state.postgresTableInfo} 
            postgresResponse={this.state.postgresResponse} 
            userid={this.getUserId()}
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

  getUserId = () => {
    try {
      const loginCookie = getCookie("login") || "";
      const passwordCookie = getCookie("password") || "";
      const combinedString = loginCookie + passwordCookie;
      return combinedString.hashCode ? combinedString.hashCode() : this.generateHashCode(combinedString);
    } catch (error) {
      return "0";
    }
  }

  generateHashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash.toString();
  }

  open = () => {
    this.setState({ isModalOpen: true });
    if (this.props.setHintModalOpen) {
      this.props.setHintModalOpen(true);
    }
    window.history.pushState({ modalType: 'hint', page: 'code' }, '', window.location.pathname);
  };

  close = () => {
    const wasOpen = this.state.isModalOpen;
    this.setState({ isModalOpen: false });
    if (this.props.setHintModalOpen) {
      this.props.setHintModalOpen(false);
    }
    return wasOpen;
  }

  getInitialState() {
    if (this.props.isLogin === false) {
      return;
    }
    this.setLoading(true);
    const userId = this.getUserId();
    getChromaInitialState(userId)
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
    const userId = this.getUserId();
    getPostgresTable(userId)
      .then(data => {
        this.setState({ postgresTableInfo: data.tables});
        this.setLoading(false);
      })
      .catch(error => {
        createPostgresTable(userId)
          .then(data => {
            getPostgresTable(userId)
              .then(data => {
                this.setState({ postgresTableInfo: data.tables });
                this.setState({ isLoading: false });
              })
              .catch(error => {
                this.setState({ isLoading: false });
              })
            this.setLoading(false);
          })
          .catch(error => {
            this.setLoading(false);
          });
        this.setLoading(false);
      })
  }

  handleDbSelection(selectedDb) {
    this.setState({ chosenDb: selectedDb });
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

  async executeCommandsSequentially(commands, userId, error) {
    this.setLoading(true);
    let allResults = [];

    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command === '') continue;

      try {
        const data = await getChromaResponse(command, userId);

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
        message: 'Требуется авторизация',
        description: 'Пожалуйста, войдите в систему для выполнения кода',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "Choose DB") {
      notification.warning({
        message: 'Выберите базу данных',
        description: 'Пожалуйста, выберите базу данных из списка',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    } else if (text === "" || text === null) {
      notification.warning({
        message: 'Пустой код',
        description: 'Пожалуйста, напишите код для выполнения',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "PostgreSQL") {
      this.setLoading(true);
      const userId = this.getUserId();
      queryPostgres(text, userId)
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
        message: 'База данных недоступна',
        description: 'Пожалуйста, выберите другую базу данных',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    if (chosenDb === "MongoDB") {
      notification.warning({
        message: 'База данных недоступна',
        description: 'Пожалуйста, выберите другую базу данных',
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
      const userId = this.getUserId();
      if (!text.includes('\n')) {
        getChromaResponse(text, userId)
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
        this.executeCommandsSequentially(commands, userId, error);
      }

    }
  }
}


String.prototype.hashCode = function () {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString();
};


export default Code;