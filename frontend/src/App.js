import React from "react";
import Header from "./components/header";
import Footer from "./components/footer";
import Account from "./components/Account";
import Code from "./components/Code";
import Home from "./components/Home";
import ClassRooms from "./components/Classrooms";
import { CSSTransition, SwitchTransition } from "react-transition-group";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "home",
      user: {
        login: "",
        password: "",
        needMemorizing: false,
      },
      isLogin: false
    };
    this.setPage = this.setPage.bind(this);
    this.setUser = this.setUser.bind(this);
    this.login = this.login.bind(this);
    this.logOut = this.logOut.bind(this);
    this.pageRef = {};
  }

  setUser = (user) => {
    this.setState({ user: user });
  }

  setPage = (page) => {
    this.setState({ page });
  };

  getPageRef = (page) => {
  if (!this.pageRefs) this.pageRefs = {};
  if (!this.pageRefs[page]) {
    this.pageRefs[page] = React.createRef();
  }
  return this.pageRefs[page];
};

  renderContent() {
    switch (this.state.page) {
      case "home":
        return (
          <div>
            <Home />
          </div>);
      case "classrooms":
        return (
          <div>
            <ClassRooms />
          </div>);
      case "code":
        return (
          <div>
            <Code output={''}/>
          </div>);
      case "acc":
        return (
          <div>
            <Account user={this.state.user} logOut={this.logOut}/>
          </div>);
      default:
        return <div>Page not found</div>;
    }
  }

  render() {
    const page = this.state.page;
    const nodeRef = this.getPageRef(page);

    return (
      <div className="app-container">
        <Header setPage={this.setPage} current={this.state.page} setUser={this.setUser} setLogin={this.login} checkLogin={this.checkLogin()} />
        <div style={{ flex: 1, position: "relative" }}>
          <SwitchTransition>
            <CSSTransition
              key={page}
              timeout={300}
              classNames="page-fade"
              unmountOnExit
              nodeRef={nodeRef}
            >
              <div ref={nodeRef} style={{ position: "absolute", width: "100%" }}>
                {this.renderContent()}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>
        <Footer />
      </div>
    );
  }

  checkLogin = () => {
    return this.state.isLogin;
  }
  login = () => {
    this.setState({ isLogin: true });
  };

  logOut = () => {
    this.setState({ isLogin: false, user: { login: "", password: "", needMemorizing: false }, page: "home" });
  }
}

export default App;