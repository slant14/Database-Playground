import React from 'react';
import { getChromaResponse } from '../../api';
import { getChromaInitialState } from '../../api';
import { getPostgresTable, createPostgresTable, queryPostgres } from '../../api';
import CodeInput from './codeInput';
import OutputInputs from './output';
import { Button, FloatButton, Typography } from 'antd';
import { FaRegLightbulb } from "react-icons/fa";
import HintModal from './hintModal';
import HintModalPS from './hintModalPS';
import './Code.css';

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
          <OutputInputs response={this.state.response} db_state={this.state.db_state} chosenDB={this.state.chosenDb} postgresTableInfo={this.state.postgresTableInfo} postgresResponse={this.state.postgresResponse} userid={this.getUserId()}/>
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
      const loginCookie = this.props.getCookie("login") || "";
      const passwordCookie = this.props.getCookie("password") || "";
      const combinedString = loginCookie + passwordCookie;
      return combinedString.hashCode ? combinedString.hashCode() : this.generateHashCode(combinedString);
    } catch (error) {
      console.error('Error generating user ID:', error);
      return "0"; // fallback ID
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
    console.log(this.state.isModalOpen);
  };

  close = () => {
    this.setState({ isModalOpen: false });
  }

  getInitialState() {
    if (this.props.isLogin === false) {
      console.log("User not logged in, skipping state request");
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
        console.error('Error loading DB state:', error);
        this.setLoading(false);
      });
  }

  postgresTableHandle = () => {
    if (this.props.isLogin === false) {
      console.log("User not logged in, skipping state request");
      return;
    }
    this.setLoading(true);
    const userId = this.getUserId();
    getPostgresTable(userId)
      .then(data => {
        console.log('PostgreSQL table data:', data);
        this.setState({ postgresTableInfo: data.tables});
        this.setLoading(false);
      })
      .catch(error => {
        createPostgresTable(userId)
          .then(data => {
            console.log('PostgreSQL table created:', data);
            getPostgresTable(userId)
              .then(data => {
                console.log('PostgreSQL table data after creation:', data);
                this.setState({ postgresTableInfo: data.tables });
                this.setState({ isLoading: false });
              })
              .catch(error => {
                console.error('Error fetching PostgreSQL table after creation:', error);
                this.setState({ isLoading: false });
              })
            this.setLoading(false);
          })
          .catch(error => {
            console.error('Error creating PostgreSQL table:', error);
            this.setLoading(false);
          });
        this.setLoading(false);
      })
  }

  handleDbSelection(selectedDb) {
    console.log('Database selected:', selectedDb);
    this.setState({ chosenDb: selectedDb });
    switch (selectedDb) {
      case "Chroma":
        this.getInitialState();
        break;
      case "PostgreSQL":
        this.postgresTableHandle();
        break;
      default:
        console.log(`${selectedDb} is not yet supported for state loading`);
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
        console.log(`Executing command ${i + 1}:`, command);
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
      this.setLoading(true);
      const userId = this.getUserId();
      queryPostgres(text, userId)
        .then(data => {
          console.log('Code.js - QueryPostgres result:', data);
          if (data === "Error") {
            this.setState({postgresResponse: { message: "Error occurred while executing command" } });
          } else {
            this.setState({postgresResponse: data}, () => {
              console.log('Code.js - PostgresResponse state:', this.state.postgresResponse);
            });
          }
          this.postgresTableHandle();
          this.setLoading(false);
        })
        .catch(error => {
          console.error('Error:', error);
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
      const userId = this.getUserId();
      console.log("SDASDASDASDAD", userId)
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
              }, () => {
                console.log('Single command result:', this.state.response);
              });
            }
            this.getInitialState(chosenDb);
            this.setLoading(false);
          })
          .catch(error => {
            console.error('Error:', error);
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