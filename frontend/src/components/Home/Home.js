import React from "react";
import { Typography, Button } from "antd";
import "./Home.css";
import { FaSave } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa";
import MyModal from "../LayOut/Header/modal";
import RegisterModal from "../LayOut/Header/registerModal";
import { MdAccountCircle } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { FaBook } from "react-icons/fa";



const { Title, Paragraph, Text } = Typography;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRegisterModalOpen: false,
    };
  }

  handleSwitchToRegister = () => {
    this.setState({ isRegisterModalOpen: true });
    this.props.handleCancel();
  };

  handleSwitchToLogin = () => {
    this.setState({ isRegisterModalOpen: false });
    this.props.handleButtonClick("signin");
  };

  handleRegisterCancel = () => {
    this.setState({ isRegisterModalOpen: false });
  };
  render() {
    return (
      <div className="home">
        <div className="header-row">
          <Title style={{
            color: "#fff",
            fontSize: 25,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 400,
            margin: 0
          }}><span style={{ color: "#51CB63" }}>Database</span> Playground</Title>
          <span className="button-row">
            <Button className="myButton" onClick={() => this.props.handleButtonClick("template")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Templates </span> <FaSave />
              </span>
            </Button>
            <Button className="myButton" onClick={() => this.props.handleButtonClick("acc")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>acc </span> <FaSave />
              </span>
            </Button>
            <Button className="myButton" onClick={() => this.props.onTemplateClick()}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Code</span> <FaCode />
              </span>
            </Button>
            <Button className="myButton" onClick={() => this.props.handleButtonClick("classrooms")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Classrooms </span> <FaBook />
              </span>
            </Button>
            {!this.props.isLogin ?
              <Button variant="solid" className={this.props.isModalOpen || this.state.isRegisterModalOpen ? "myButton-solid" : "myButton"} onClick={() => this.props.handleButtonClick("signin")}><span style={{ position: "relative", top: "-1px" }}>Sign In</span></Button> :
              <Button
                variant="solid"
                className="myButton"
                onClick={() => this.props.handleButtonClick("acc")}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ position: "relative", top: "-1px" }}>Account</span> <MdAccountCircle />
                </span>
              </Button>}
            <MyModal 
              open={this.props.isModalOpen} 
              logIn={this.props.logIn} 
              setPage={this.props.setPage} 
              onCancel={this.props.handleCancel} 
              updateLogIn={this.props.updateLogIn} 
              setCookie={this.props.setCookie} 
              footer={null} 
              setUser={this.props.setUser} 
              title="Sign In"
              onSwitchToRegister={this.handleSwitchToRegister}
            />
            <RegisterModal 
              open={this.state.isRegisterModalOpen}
              onCancel={this.handleRegisterCancel}
              onSwitchToLogin={this.handleSwitchToLogin}
              logIn={this.props.logIn}
            />

          </span>
        </div>
        <div className="icon-row icon-first-row">
          <div className="iconText">
            <FaSave className="icon" size={130} onClick={() => this.props.handleButtonClick("template")}/>
            <div className="text-container">
              <Text className="title">Templates</Text>
              <Text className="description">
                Ready-to-use code templates and examples for different databases. 
                Quick start with pre-written queries, schemas, and best practices 
                to accelerate your learning and development.
              </Text>
            </div>
          </div>

          <div className="iconText">
            <FaBook className="icon" size={130} onClick={() => this.props.handleButtonClick("classrooms")}/>
            <div className="text-container">
              <Text className="title">Classrooms</Text>
              <Text className="description">
                Interactive learning environment for database education. 
                Join virtual classrooms, complete assignments, track progress, 
                and collaborate with peers in structured learning sessions.
              </Text>
            </div>
          </div>
        </div>

        <div className="icon-row">
          <div className="iconText">
            <MdAccountCircle className="icon" size={130} onClick={() => {this.props.isLogin ? this.props.handleButtonClick("acc") : this.props.handleButtonClick("signin")}}/>
            <div className="text-container">
              <Text className="title">Account</Text>
              <Text className="description">
                Manage your personal profile, track your query history, 
                and customize your database learning experience. 
                Secure authentication and personalized settings.
              </Text>
            </div>
          </div>

          <div className="iconText">
            <FaDatabase className="icon-copy" size={130} />
            <div className="text-container">
              <Text className="title">Databases</Text>
              <Text className="description">
                Multi-database support including{' '}
                <a href="https://www.postgresql.org/" target="_blank" rel="noopener noreferrer" className="db-link">
                  PostgreSQL
                </a>,{' '}
                <a href="https://www.trychroma.com/" target="_blank" rel="noopener noreferrer" className="db-link">
                  Chroma
                </a>,{' '}and{' '}
                <a href="https://www.mongodb.com/" target="_blank" rel="noopener noreferrer" className="db-link">
                  MongoDB
                </a>.{' '}
                Execute queries, manage schemas, and explore different database 
                technologies in one unified platform.
              </Text>
            </div>
          </div>
        </div>

        <div className="start">
          <Paragraph className="home-text" style={{ fontSize: 20, fontWeight: 600 }}>
            <Text className="home-text" style={{ fontSize: 20, fontWeight: 600, color: '#51CB63' }}>No</Text> setup, <Text className="home-text" style={{ fontSize: 20, fontWeight: 600, color: '#51CB63' }}>No</Text> installation <br />
            Just write queries and explore!
          </Paragraph>
        </div>

      </div>
    );
  }
}

export default Home;