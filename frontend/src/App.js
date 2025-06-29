import React from "react";
import Footer from "./components/LayOut/footer";
import Header from "./components/LayOut/Header/Header";
import Account from "./components/Account/Account";
import Code from "./components/Code/Code";
import Home from "./components/Home/Home";
import ClassRooms from "./components/Classrooms/Classrooms";
import ExactClassroom from "./components/ExactClassroom/ExactClassroom";
import Template from "./components/Template/Template";
import { CSSTransition, SwitchTransition } from "react-transition-group";

class App extends React.Component {
  lastActiveButton = '';
  constructor(props) {
    super(props);
    const lastPage = this.getCookie("lastPage");
    this.state = {
      page: lastPage || "home",
      user: {
        login: this.getCookie("login"),
        password: this.getCookie("password"),
        needMemorizing: this.getCookie("needMemorizing") === "true" ? true : false,
      },
      isLogin: this.getCookie("login") ? true : false,
      isModalOpen: false,
      activeButton: 'home',
      selectedClassroom: null,
    };
    this.setPage = this.setPage.bind(this);
    this.logOut = this.logOut.bind(this);
    this.updateLoginState = this.updateLoginState.bind(this);
    this.pageRef = {};
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this);
    this.login = this.login.bind(this);
  }

  setPage = (page) => {
    this.setState({ page: page });
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
            <Home setPage={this.setPage}
              current={this.state.page}
              updateLogIn={this.updateLoginState}
              logIn={this.logIn}
              setCookie={this.setCookie}
              isLogin={this.state.isLogin}
              activeButton={this.state.activeButton}
              isModalOpen={this.state.isModalOpen}
              handleButtonClick={this.handleButtonClick}
              handleCancel={this.handleCancel}
              login={this.login} />
          </div>
        );
      case "classrooms":
        return (
          <div>
            <ClassRooms selectClassroom={this.selectClassroom}/>
          </div>);
      case "exactClassroom":
        return (
          <div>
            <ExactClassroom classroom={this.state.selectedClassroom}/>
          </div>
        )
      case "code":
        return (
          <div>
            <Code getCookie={this.getCookie} isLogin={this.state.isLogin} handleButtonClick={this.handleButtonClick}/>
          </div>);
      case "acc":
        return (
          <div>
            <Account user={this.state.user} logOut={this.logOut} />
          </div>);
      case "template":
        return (
          <div>
            <Template handleButtonClick={this.handleButtonClick}/>
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
        <div className="main-content">
          <div>
            <SwitchTransition>
              <CSSTransition
                key={page}
                timeout={300}
                classNames="page-fade"
                unmountOnExit
                nodeRef={nodeRef}
              >
                <div>
                  {this.state.page !== "home" && (
                    <Header
                      setPage={this.setPage}
                      current={this.state.page}
                      updateLogIn={this.updateLoginState}
                      logIn={this.logIn}
                      setCookie={this.setCookie}
                      checkLogin={this.state.isLogin}
                      activeButton={this.state.activeButton}
                      isModalOpen={this.state.isModalOpen}
                      handleButtonClick={this.handleButtonClick}
                      handleCancel={this.handleCancel}
                      login={this.login}
                    />
                  )}
                  <div ref={nodeRef} style={{ position: "absolute", width: "100%" }}>
                    {this.renderContent()}
                  </div>
                </div>
              </CSSTransition>
            </SwitchTransition>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  handleButtonClick = (button) => {
    if (button === "signin") {
      this.lastActiveButton = this.state.activeButton;
      this.setState({ isModalOpen: true, activeButton: "signin" });
    } else {
      this.setCookie("lastPage", button, 7);
      this.setState({ activeButton: button });
      this.setPage(button);
    }
  };

  logIn = (login, password, needMemorizing) => {
    this.setCookie("login", login, 7);
    this.setCookie("password", password, 7);
    this.setCookie("needMemorizing", needMemorizing, 7);
    this.setPage("home");
    let user = {
      login: login,
      password: password,
      needMemorizing: needMemorizing,
    }
    this.setState({ isLogin: true, user: user });

  }

  componentDidUpdate(prevProps) {
    if (prevProps.current !== this.props.current) {
      this.setState({ activeButton: this.props.current });
    }
  }

  logOut = () => {
    this.deleteCookie("login");
    this.deleteCookie("password");
    this.deleteCookie("needMemorizing");
    this.updateLoginState();
    this.setPage("home");
  }

  setCookie = (name, value, options = {}) => {
    let newEntryBody = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    const optionsAsString = Object.entries(options)
      .map(([key, val]) => `${key}=${val}`)
      .join("; ");

    if (optionsAsString) {
      newEntryBody += `; ${optionsAsString}`;
    }

    document.cookie = newEntryBody;
  };

  deleteCookie = (name) => {
    this.setCookie(name, "", { 'max-age': -1 });
    this.updateLoginState();
  }


  updateLoginState = () => {
    const login = this.getCookie("login");
    const password = this.getCookie("password");
    this.setState({
      isLogin: !!login && !!password,
    });
  };


  getCookie = (name) => {
    for (const entryString of document.cookie.split(";")) {
      const [entryName, entryValue] = entryString.split("=");
      if (decodeURIComponent(entryName) === name) {
        return entryValue
      }
    }
    return undefined;
  }

  handleCancel = () => {
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton })
  };

  login = () => {
    this.setLogin();
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
  };

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  selectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom, page: "exactClassroom" });
  };
}

export default App;