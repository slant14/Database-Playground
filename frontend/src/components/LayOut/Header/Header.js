import React from "react"
import RightSideB from "./rightSideB";
import LeftSideB from "./leftSideB";
import "./Header.css";

class Header extends React.Component {
  lastActiveButton = '';
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <header className="header">
        <LeftSideB handleButtonClick={this.props.handleButtonClick} activeButton={this.props.activeButton} onTemplateClick={this.props.onTemplateClick} />
        <RightSideB logOut={this.props.logOut}handleButtonClick={this.props.handleButtonClick} activeButton={this.props.activeButton} checkLogin={this.props.checkLogin} isModalOpen={this.props.isModalOpen} logIn={this.props.logIn} setPage={this.props.setPage} handleCancel={this.props.handleCancel} updateLogin={this.props.updateLogin} setUser={this.props.setUser} getCookie={this.props.setCookie}/>
      </header>
    )
  }
}


export default Header;