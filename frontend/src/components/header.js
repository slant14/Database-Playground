import React from "react"
import { Button } from "antd";
import logo from "../img/icon100.png";
import MyModal from "./modal";
import { FaCode, FaBook } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

class Header extends React.Component {
  lastActiveButton = '';
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      activeButton: 'home',
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

  }
  render() {
    return (
      <header className="header">
        <span className="header-logo">
          <Button className="logo-button-outline" onClick={() => this.handleButtonClick("home")}><img src={logo} alt="Logo" style={{ height: 32 }} className="header-logo" /></Button>
          <Button
            variant="solid"
            className={this.state.activeButton === "code" ? "my-orange-button-solid" : "my-orange-button-outline"}
            onClick={() => this.handleButtonClick("code")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ position: "relative", top: "-1px" }}>Code</span> <FaCode />
            </span>
          </Button>
        </span>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            variant="solid"
            className={this.state.activeButton === "classrooms" ? "my-orange-button-solid" : "my-orange-button-outline"}
            onClick={() => this.handleButtonClick("classrooms")}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span style={{ position: "relative", top: "-1px" }}>Classrooms</span> <FaBook />
            </span>
          </Button>
          {!this.props.checkLogin ?
            <Button variant="solid" className={this.state.activeButton === "signin" ? "my-orange-button-solid" : "my-orange-button-outline"} onClick={() => this.handleButtonClick("signin")}><span style={{ position: "relative", top: "-1px" }}>Sign In</span></Button> :
            <Button
              variant="solid"
              className={this.state.activeButton === "acc" ? "my-orange-button-solid" : "my-orange-button-outline"}
              onClick={() => this.handleButtonClick("acc")}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Account</span> <MdAccountCircle />
              </span>
            </Button>}
          <MyModal open={this.state.isModalOpen} onCancel={this.handleCancel} onOk={this.login} footer={null} setUser={this.props.setUser} title="Sing In" />
        </div>
      </header>
    )
  }

  handleButtonClick = (button) => {
    if (button === "signin") {
      this.lastActiveButton = this.state.activeButton;
      this.setState({ isModalOpen: true, activeButton: "signin" });
    } else {
      this.setState({ activeButton: button });
      this.props.setPage(button);
    }
  };

  handleCancel = () => {
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
  };

  login = () => {
    this.props.setLogin();
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
  };
}

export default Header