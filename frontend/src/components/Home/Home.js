import React from "react";
import { Typography, Button } from "antd";
import "./Home.css";
import { SiSqlite } from "react-icons/si";
import { BiLogoPostgresql } from "react-icons/bi";
import { SiMongodb } from "react-icons/si";
import { FaDatabase } from "react-icons/fa";
import MyModal from "../LayOut/Header/modal";
import { MdAccountCircle } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { FaBook } from "react-icons/fa";


const { Title, Paragraph, Text } = Typography;

class Home extends React.Component {
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
                <span style={{ position: "relative", top: "-1px" }}>Template </span> <FaCode />
              </span>
            </Button>
            <Button className="myButton" onClick={() => this.props.handleButtonClick("classrooms")}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Classrooms </span> <FaBook />
              </span>
            </Button>
            {!this.props.isLogin ?
              <Button variant="solid" className="myButton" onClick={() => this.props.handleButtonClick("signin")}><span style={{ position: "relative", top: "-1px" }}>Sign In</span></Button> :
              <Button
                variant="solid"
                className="myButton"
                onClick={() => this.props.handleButtonClick("acc")}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ position: "relative", top: "-1px" }}>Account</span> <MdAccountCircle />
                </span>
              </Button>}
            <MyModal open={this.props.isModalOpen} logIn={this.props.logIn} setPage={this.props.setPage} onCancel={this.props.handleCancel} updateLogIn={this.props.updateLogIn} setCookie={this.props.setCookie} footer={null} setUser={this.props.setUser} title="Sing In" />

          </span>
        </div>
        <div className="icon-row icon-first-row">
          <div className="iconText">
            <SiSqlite className="icon" size={130} />
            <div className="text-container">
              <a className="title" href='https://sqlite.org/' target="_blank" rel="noopener noreferrer">SQLite</a>
              <Text className="description">
                SQLite is an in-process library that implements a self-contained,
                serverless, zero-configuration, transactional SQL database engine.
              </Text>
            </div>
          </div>

          <div className="iconText">
            <SiMongodb className="icon" size={130} />
            <div className="text-container">
              <a className="title" href='https://www.mongodb.com/' target="_blank" rel="noopener noreferrer">MongoBD</a>
              <Text className="description">
                MongoDB is a popular, open-source NoSQL database that stores
                data in flexible, JSON-like documents
              </Text>
            </div>
          </div>
        </div>

        <div className="icon-row">
          <div className="iconText">
            <BiLogoPostgresql className="icon" size={130} />
            <div className="text-container">
              <a className="title" href='https://www.postgresql.org/' target="_blank" rel="noopener noreferrer">PostgreSQL</a>
              <Text className="description">
                PostgreSQL is a powerful, open source object-relational database
                system with a strong reputation for reliability, feature robustness, and performance.
              </Text>
            </div>
          </div>

          <div className="iconText">
            <FaDatabase className="icon" size={130} />
            <div className="text-container">
              <a className="title" href='https://www.trychroma.com/' target="_blank" rel="noopener noreferrer">Chroma</a>
              <Text className="description">
                Chroma or ChromaDB is an open-source vector database tailored
                to applications with large language models
              </Text>
            </div>
          </div>
        </div>

        <div className="start">
          <Paragraph className="home-text" style={{ fontSize: 20, fontWeight: 600 }}>
            <Text className="home-text" style={{ fontSize: 20, fontWeight: 600, color: '#51CB63' }}>No</Text> setup, <Text className="home-text" style={{ fontSize: 20, fontWeight: 600, color: '#51CB63' }}>No</Text> installation. <br />
            Just write queries and explore!
          </Paragraph>
        </div>

      </div>
    );
  }
}

export default Home;