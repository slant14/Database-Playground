import React from 'react';
import { getCode } from '../../api';
import CodeInput from './codeInput';
import OutputInputs from './output';
import './Code.css';

class Code extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: {
      },
    }
  }



  render() {
    return (
      <div className="code-container">
        <main>
          <CodeInput getIt={(text, chosenDb) => this.getIt(text, chosenDb)} />
        </main>
        <aside className="code-aside">
          <OutputInputs response={this.state.response} />
        </aside>
      </div>
    );
  }
  getIt(text, chosenDb) {
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
    if (chosenDb === "Vector-Based Database") {
      const error = {
        message: "Please try once again, there is an error in your code",
      }
      let string = (this.props.getCookie("login") + this.props.getCookie("password")) || "1";
      getCode(text, string.hashCode())
        .then(data => {
          data === "Error" ? this.setState({ response: error }) : this.setState({ response: data }, () => {
            console.log(this.state.response)
          })
        })
        .catch(error => console.error('Error:', error));

    }
  }
}


String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};


export default Code;