import React from 'react';
import { getCode } from '../../api';
import { getIState } from '../../api';
import CodeInput from './codeInput';
import OutputInputs from './output';
import { Button, FloatButton, Typography } from 'antd';
import { FaRegLightbulb } from "react-icons/fa";
import HintModal from './hintModal';
import './Code.css';
import { getCookie } from '../../utils';

class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {
      },
      db_state: {},
      isModalOpen: false,
      isLoading: false,
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
          <OutputInputs response={this.state.response} db_state={this.state.db_state} />
        </aside>
        <FloatButton icon={<FaRegLightbulb />} type="basic" className='lamp' onClick={this.open} tooltip="Command Tips" />
        <HintModal title={<Typography.Text className='modal-title'>Types of command for <Typography.Text className='modal-title' style={{ color: '#51CB63' }}>Chroma</Typography.Text> </Typography.Text>} onCancel={this.close} open={this.state.isModalOpen} />
      </div>
    );
  }

  setLoading = (loading) => {
    this.setState({ isLoading: loading });
  }

  open = () => {
    this.setState({ isModalOpen: true });
    console.log(this.state.isModalOpen);
  };

  close = () => {
    this.setState({ isModalOpen: false });
  }

  getInitialState(selectedDb = null) {
    if (this.props.isLogin === false) {
      console.log("User not logged in, skipping state request");
      return;
    }
    this.setLoading(true);
    //let string = (this.props.getCookie("login") + this.props.getCookie("password"));
    let string  = getCookie("login") + getCookie("password")
    getIState(string.hashCode())
      .then(data => {
        this.setState({ db_state: data }, () => {
          console.log('DB state loaded for:', selectedDb, this.state.db_state);
        });
        this.setLoading(false);
      })
      .catch(error => {
        console.error('Error loading DB state:', error);
         this.setLoading(false);
      });
  }

  handleDbSelection(selectedDb) {
    console.log('Database selected:', selectedDb);
    if (selectedDb === "Chroma") {
      this.getInitialState(selectedDb);
    } else if (selectedDb === "PostgreSQL" || selectedDb === "SQLite" || selectedDb === "MongoDB") {
      console.log(`${selectedDb} is not yet supported for state loading`);
      this.setState({ db_state: {} });
    } else {
      this.setState({ db_state: {} });
    }
  }

  async executeCommandsSequentially(commands, hashCode, error) {
    this.setLoading(true);
    
    // Массив для накопления всех результатов
    let allResults = [];
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i].trim();
      if (command === '') continue;
      
      try {
        console.log(`Executing command ${i + 1}:`, command);
        const data = await getCode(command, hashCode);
        
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
        
        // Обновляем состояние с накопленными результатами
        this.setState({ 
          response: {
            type: 'multiple_commands',
            commands: allResults,
            totalCommands: allResults.length
          }
        }, () => {
          console.log(`Command ${i + 1} completed. Total results:`, allResults.length);
        });
        
      } catch (error) {
        console.error(`Error in command ${i + 1}:`, error);
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
    
    // Обновляем состояние БД после выполнения всех команд
    this.getInitialState("Chroma");
    this.setLoading(false);
  }

  getIt(text, chosenDb) {
    if (this.props.isLogin === false) {
      alert("Please log in to run the code");
      return;
    }
    if (chosenDb === "Choose DB") {
      alert("Please choose a database");
      return;
    } else if (text === "" || text === null) {
      alert("Please write your code");
      return;
    }
    if (chosenDb === "PostgreSQL") {
      alert("Please choose another DB for now");
      return;
    }
    if (chosenDb === "SQLite") {
      alert("Please choose another DB for now");
      return;
    }
    if (chosenDb === "MongoDB") {
      alert("Please choose another DB for now");
      return;
    }
    if (chosenDb === "Chroma") {
      this.setLoading(true);
      const error = {
        message: "Please try once again, there is an error in your code",
      }
      //let string = (this.props.getCookie("login") + this.props.getCookie("password"));
      let string = getCookie("login") + getCookie("password");
      if (!text.includes('\n')) {
        getCode(text, string.hashCode())
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
              }, () => {
                console.log('Single command result:', this.state.response);
              });
            }
            // Обновляем состояние БД после выполнения команды
            this.getInitialState(chosenDb);
            this.setLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
            this.setLoading(false);
          });
      }
      else{
        let commands = text.split('\n');
        this.executeCommandsSequentially(commands, string.hashCode(), error);
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
  return hash;
};


export default Code;