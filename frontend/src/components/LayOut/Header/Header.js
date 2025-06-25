import React from "react"
import RightSideB from "./leftSideB";
import LeftSideB from "./rightSideB";
import "./Header.css";

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
        <RightSideB handleButtonClick={this.handleButtonClick} hoveredButton={this.state.hoveredButton} activeButton={this.state.activeButton} />
        <LeftSideB handleButtonClick={this.handleButtonClick} activeButton={this.state.activeButton} checkLogin={this.props.checkLogin} isModalOpen={this.state.isModalOpen} logIn={this.props.logIn} setPage={this.props.setPage} handleCancel={this.handleCancel} updateLogin={this.props.updateLogin} setUser={this.props.setUser} />
      </header>
    )
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current !== this.props.current) {
      this.setState({ activeButton: this.props.current });
    }
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
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton })
  };

  login = () => {
    this.props.setLogin();
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
  };
}


export default Header;