import React from "react";
import { App as AntApp } from "antd";
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
    const login = this.getCookie("login");
    const password = this.getCookie("password");
    const needMemorizing = this.getCookie("needMemorizing") === "true";
    const savedClassroom = this.getCookie("selectedClassroom");
    let selectedClassroom = null;
    if (savedClassroom) {
      try {
        selectedClassroom = JSON.parse(savedClassroom);
      } catch (error) {
        selectedClassroom = null;
      }
    }
    
    this.state = {
      page: lastPage || "home",
      user: {
        login: login || "",
        password: password || "",
        needMemorizing: needMemorizing,
      },
      isLogin: !!(login && password),
      isModalOpen: false,
      activeButton: lastPage || 'home',
      selectedClassroom: selectedClassroom,
      isHintModalOpen: false,
      isTableModalOpen: false,
    };
    this.setPage = this.setPage.bind(this);
    this.logOut = this.logOut.bind(this);
    this.updateLoginState = this.updateLoginState.bind(this);
    this.pageRef = {};
    this.codeRef = React.createRef();
    this.outputDBStateRef = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
    window.history.replaceState({ page: this.state.page }, '', window.location.pathname);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
  }

  handlePopState = (event) => {
    if (this.state.isModalOpen) {
      this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
      window.history.pushState({ page: this.state.page }, '', window.location.pathname);
      return;
    }
    
    if (this.state.isHintModalOpen) {
      if (this.codeRef.current) {
        const wasClosed = this.codeRef.current.close();
        if (wasClosed) {
          window.history.pushState({ page: 'code' }, '', window.location.pathname);
        }
      } else {
        this.setState({ isHintModalOpen: false });
        window.history.pushState({ page: 'code' }, '', window.location.pathname);
      }
      return;
    }
    
    if (this.state.isTableModalOpen) {
      if (this.outputDBStateRef.current) {
        const wasClosed = this.outputDBStateRef.current.close();
        if (wasClosed) {
          window.history.pushState({ page: 'code' }, '', window.location.pathname);
        }
      } else {
        this.setState({ isTableModalOpen: false });
        window.history.pushState({ page: 'code' }, '', window.location.pathname);
      }
      return;
    }
    
    if (this.state.page === "code") {
      this.setState({ page: "template", activeButton: "template" });
      this.setCookie("lastPage", "template", 7);
    } else if (this.state.page === "exactClassroom") {
      this.setState({ page: "classrooms", activeButton: "classrooms" });
      this.setCookie("lastPage", "classrooms", 7);
    } else if (event.state && event.state.page) {
      this.setState({ page: event.state.page, activeButton: event.state.page });
      this.setCookie("lastPage", event.state.page, 7);
    } else {
      this.setState({ page: "home", activeButton: "home" });
      this.setCookie("lastPage", "home", 7);
    }
  };

  setPage = (page) => {
    this.setState({ page: page });
    window.history.pushState({ page: page }, '', window.location.pathname);
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
        if (!this.state.selectedClassroom) {
          setTimeout(() => {
            this.handleButtonClick("classrooms");
          }, 0);
          return (
            <div>
              <ExactClassroom classroom={null}/>
            </div>
          );
        }
        return (
          <div>
            <ExactClassroom classroom={this.state.selectedClassroom}/>
          </div>
        )
      case "code":
        return (
          <div>
            <Code 
              ref={this.codeRef}
              getCookie={this.getCookie} 
              isLogin={this.state.isLogin} 
              handleButtonClick={this.handleButtonClick}
              setHintModalOpen={this.setHintModalOpen}
              setTableModalOpen={this.setTableModalOpen}
              outputDBStateRef={this.outputDBStateRef}
            />
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
      window.history.pushState({ modalType: 'login', page: this.state.page }, '', window.location.pathname);
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
    this.setCookie("lastPage", this.state.page, 7);
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
    this.deleteCookie("selectedClassroom");
    this.updateLoginState();
    this.setState({ selectedClassroom: null });
    this.setPage("home");
    this.setCookie("lastPage", "home", 7);
    this.lastActiveButton = "home";
  }

  setCookie = (name, value, days = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresString = expires.toUTCString();
    
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expiresString}; path=/`;
  };

  deleteCookie = (name) => {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
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
      if (decodeURIComponent(entryName.trim()) === name) {
        return decodeURIComponent(entryValue || "");
      }
    }
    return undefined;
  }

  handleCancel = () => {
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
    window.history.pushState({ page: this.state.page }, '', window.location.pathname);
  };

  setHintModalOpen = (isOpen) => {
    this.setState({ isHintModalOpen: isOpen });
  };

  setTableModalOpen = (isOpen) => {
    this.setState({ isTableModalOpen: isOpen });
  };

  login = () => {
    this.setLogin();
    this.setState({ isModalOpen: false, activeButton: this.lastActiveButton });
    window.history.pushState({ page: this.state.page }, '', window.location.pathname);
  };

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  selectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom});
    this.setCookie("selectedClassroom", JSON.stringify(classroom), 7);
    this.setPage("exactClassroom");
    this.setCookie("lastPage", "exactClassroom", 7);
  };
}

export default App;