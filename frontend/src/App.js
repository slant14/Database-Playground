import React from "react";
import { getPostgresTable, createPostgresTable, queryPostgres } from './api';
import Footer from "./components/LayOut/footer";
import Header from "./components/LayOut/Header/Header";
import Account from "./components/Account/Account";
import Code from "./components/Code/Code";
import Home from "./components/Home/Home";
import ClassRooms from "./components/Classrooms/Classrooms";
import ExactClassroom from "./components/Classrooms/ExactClassroom/ExactClassroom";
import AllAssignments from "./components/Classrooms/ExactClassroom/AllAssignments/AllAssignments"
import Blog from "./components/Classrooms/ExactClassroom/Blog/Blog"
import Template from "./components/Template/Template";
import CookieNotice from "./components/CookieNotice/CookieNotice";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { getCookie, setCookie, deleteCookie, getFromLocalStorage, setToLocalStorage, removeFromLocalStorage } from './utils';

class App extends React.Component {
  lastActiveButton = '';
  constructor(props) {
    super(props);

    // Проверяем, есть ли активная сессия
    const hasActiveSession = sessionStorage.getItem('activeSession') === 'true';
    const needMemorizing = getCookie("needMemorizing") === "true";
    let lastPage = getFromLocalStorage("lastPage");
    console.log('App constructor - hasActiveSession:', hasActiveSession, 'lastPage:', lastPage);

    // Если нет активной сессии - это новое открытие (не обновление страницы)
    if (!hasActiveSession) {
      console.log('New session detected - clearing lastPage');
      removeFromLocalStorage("lastPage");
      lastPage = null;

      if (!needMemorizing) {
        this.logOut();
      }
    }

    // Устанавливаем флаг активной сессии
    sessionStorage.setItem('activeSession', 'true');

    const login = getCookie("login");

    const selectedClassroom = getFromLocalStorage("selectedClassroom");

    console.log('App constructor - lastPage:', lastPage, 'selectedClassroom:', selectedClassroom);

    this.state = {
      page: lastPage || "home",
      user: {
        login: login || "",
        needMemorizing: needMemorizing,
      },
      isLogin: !!(getCookie("access") && getCookie("refresh")),
      isModalOpen: false,
      activeButton: lastPage || 'home',
      selectedClassroom: selectedClassroom,
      isAddClassroomModalOpen: false,
      allAssignments: [],
      postgresTableInfo: null,
      selectedDB: null,
      allAssignmentsIsActive: true,
      isAssignmentModalOpen: false,
      isArticleModalOpen: false,
      blog: [],
      isHintModalOpen: false,
      isTableModalOpen: false,
      isSaveModalOpen: false,
      isInitialized: false, // Флаг для отслеживания завершения инициализации
    };
    this.setPage = this.setPage.bind(this);
    this.logOut = this.logOut.bind(this);
    this.updateLoginState = this.updateLoginState.bind(this);
    this.pageRef = {};
    this.codeRef = React.createRef();
    this.classroomsRef = React.createRef();
    this.outputDBStateRef = React.createRef();
    this.handleButtonClick = this.handleButtonClick.bind(this)
    this.handleCancel = this.handleCancel.bind(this);
    this.login = this.login.bind(this);
  }

  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
    window.addEventListener('beforeunload', this.handleBeforeUnload);
    window.addEventListener('logout', this.handleLogout);

    sessionStorage.setItem('wasReloaded', 'true');

    window.history.replaceState({ page: this.state.page }, '', window.location.pathname);

    // Устанавливаем флаг инициализации после небольшой задержки
    setTimeout(() => {
      this.setState({ isInitialized: true });
    }, 100);
  }

  componentWillUnmount() {
    window.removeEventListener('popstate', this.handlePopState);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    window.removeEventListener('logout', this.handleLogout);
  }

  handleBeforeUnload = (event) => {
    // При выгрузке страницы сохраняем текущую страницу в localStorage
    // sessionStorage автоматически очистится при закрытии вкладки
    setToLocalStorage("lastPage", this.state.page);
  };

  handlePageHide = (event) => {
    if (event.persisted) {
      sessionStorage.setItem('wasReloaded', 'true');
    } else {
      setTimeout(() => {
        const wasReloaded = sessionStorage.getItem('wasReloaded');
        if (!wasReloaded) {
          this.deleteCookieSync("lastPage");
        }
      }, 100);
    }
  };

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

    if (this.state.isSaveModalOpen) {
      if (this.codeRef.current) {
        const wasClosed = this.codeRef.current.closeSave();
        if (wasClosed) {
          window.history.pushState({ page: 'code' }, '', window.location.pathname);
        }
      } else {
        this.setState({ isSaveModalOpen: false });
        window.history.pushState({ page: 'code' }, '', window.location.pathname);
      }
      return;
    }

    if (this.state.page === "code") {
      this.setState({ page: "template", activeButton: "template" });
      setToLocalStorage("lastPage", "template");
    } else if (this.state.page === "exactClassroom") {
      this.setState({ page: "classrooms", activeButton: "classrooms" });
      setToLocalStorage("lastPage", "classrooms");
    } else if (event.state && event.state.page) {
      this.setState({ page: event.state.page, activeButton: event.state.page });
      setToLocalStorage("lastPage", event.state.page);
    } else {
      this.setState({ page: "home", activeButton: "home" });
      setToLocalStorage("lastPage", "home");
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
              setCookie={setCookie}
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
            <ClassRooms ref={this.classroomsRef} selectClassroom={this.selectClassroom} />
          </div>);
      case "exactClassroom":
        if (!this.state.selectedClassroom) {
          // Если компонент ещё не инициализирован, показываем загрузку
          if (!this.state.isInitialized) {
            return (
              <div>
                <div style={{ padding: '50px', textAlign: 'center' }}>
                  <span>Loading classroom...</span>
                </div>
              </div>
            );
          }
          // Если компонент инициализирован, но нет выбранного класса, перенаправляем на страницу классов
          setTimeout(() => {
            this.setState({ page: "classrooms", activeButton: "classrooms" });
            setToLocalStorage("lastPage", "classrooms");
          }, 100);
          return (
            <div>
              <ExactClassroom 
                classroom={null}
                setAddClassroomModalOpen={this.setAddClassroomModalOpen}
              />
            </div>
          );
        }
        return (
          <div>
            <ExactClassroom 
              classroom={this.state.selectedClassroom}
              handleAllAssignmentsClick={this.handleAllAssignmentsClick}              
              handleAllArticlesClick={this.handleAllArticlesClick}
              setAssignmentModalOpen={this.setAssignmentModalOpen}
              setArticleModalOpen={this.setArticleModalOpen}
              />
          </div>
        )
      case "allAssignments":
        return (
          <div>
            <AllAssignments 
              assignments={this.state.allAssignments}
              isActive={this.state.allAssignmentsIsActive}
            />
          </div>
        )
      case "Blog":
        return (
          <div>
            <Blog 
              articles={this.state.blog}
            />
          </div>
        )  
      case "code":
        return (
          <div>
            <Code
              ref={this.codeRef}
              getCookie={getCookie}
              isLogin={this.state.isLogin}
              handleButtonClick={this.handleButtonClick}
              setHintModalOpen={this.setHintModalOpen}
              setTableModalOpen={this.setTableModalOpen}
              setSaveModalOpen={this.setSaveModalOpen}
              isSaveModalOpen={this.state.isSaveModalOpen}
              outputDBStateRef={this.outputDBStateRef}
              selectedDB={this.state.selectedDB}
              postgresTableInfo={this.state.postgresTableInfo}
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
            <Template onTemplateClick={this.onTemplateClick} setPage={this.setPage} isLogin={this.state.isLogin} handleButtonClick={this.handleButtonClick} />
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
                      setCookie={setCookie}
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
        <CookieNotice />
      </div>
    );
  }

  handleButtonClick = (button) => {
    if (button === "signin") {
      this.lastActiveButton = this.state.activeButton;
      this.setState({ isModalOpen: true, activeButton: "signin" });
      window.history.pushState({ modalType: 'login', page: this.state.page }, '', window.location.pathname);
    } else {
      setToLocalStorage("lastPage", button);
      this.setState({ activeButton: button });
      this.setPage(button);
    }
  };

  logIn = (login, needMemorizing, token, refresh_token) => {
    setCookie("login", login, 7);
    setCookie("needMemorizing", needMemorizing, 7);
    setCookie("access", token, 7);
    setCookie("refresh", refresh_token, 7)
    setToLocalStorage("lastPage", this.state.page);
    let user = {
      login: login,
      needMemorizing: needMemorizing,
      token: token,
      refresh: refresh_token,
    }
    this.setState({ isLogin: true, user: user }, () => {
      // Обновляем данные в компонентах после авторизации
      this.handlePostLoginUpdate();
    });
  }

  onTemplateClick = (code) => {
    // Если передан code (dump), значит используется шаблон - выбираем PostgreSQL
    // Если code не передан, значит создается новый шаблон - оставляем "Choose DB"
    if (code) {
      this.setState({ selectedDB: "PostgreSQL" });
      
      // Создаем объект с данными для отправки
      const payload = { dump: code };
      
      createPostgresTable(payload)
        .then(() => {
          return getPostgresTable();
        })
        .then(data => {
          this.setState({ postgresTableInfo: data.tables });
        })
        .catch(error => {
          console.error("Error creating database:", error);
        });
    } else {
      // Для создания нового шаблона - сбрасываем выбор БД
      this.setState({ selectedDB: "Choose DB" });
      
      // Создаем пустую базу данных
      createPostgresTable({})
        .then(() => {
          return getPostgresTable();
        })
        .then(data => {
          this.setState({ postgresTableInfo: data.tables });
        })
        .catch(error => {
          console.error("Error creating database:", error);
        });
    }
      
    this.setState({ page: "code", activeButton: "code" });
    this.setPage("code");
  }

  componentDidUpdate(prevProps) {
    if (prevProps.current !== this.props.current) {
      this.setState({ activeButton: this.props.current });
    }
  }

  logOut = () => {
    deleteCookie("login");
    deleteCookie("needMemorizing");
    deleteCookie("access");
    deleteCookie("refresh");
    removeFromLocalStorage("lastPage"); // Удаляем lastPage только при выходе
    removeFromLocalStorage("selectedClassroom");

    // Очищаем пользовательские данные
    localStorage.removeItem("selectedDb"); // Очищаем выбранную БД
    // НЕ очищаем cookiesAccepted - это согласие пользователя должно сохраняться
    // deleteCookie("cookiesAccepted"); // Раскомментируйте, если нужно очищать при выходе

    // Обновляем состояние после удаления cookies
    this.setState({
      isLogin: false,
      user: {
        login: "",
        needMemorizing: false,
      },
      selectedClassroom: null,
      page: "home",
      activeButton: "home",
    });

    setToLocalStorage("lastPage", "home");
    this.lastActiveButton = "home";
    window.history.replaceState({ page: "home" }, '', window.location.pathname);
  }

  updateLoginState = () => {
    const login = getCookie("login");
    const token = getCookie("access");
    const refresh_token = getCookie("refresh");
    const wasLoggedIn = this.state.isLogin;
    const isLoggedIn = !!login && !!token;

    this.setState({
      isLogin: isLoggedIn,
    }, () => {
      // Если пользователь только что авторизовался, обновляем данные
      if (!wasLoggedIn && isLoggedIn) {
        this.handlePostLoginUpdate();
      }
    });
  };


  /*getCookie = (name) => {
    for (const entryString of document.cookie.split(";")) {
      const [entryName, entryValue] = entryString.split("=");
      if (decodeURIComponent(entryName.trim()) === name) {
        return decodeURIComponent(entryValue || "");
      }
    }
    return undefined;
  }*/

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

  setSaveModalOpen = (isOpen) => {
    this.setState({ isSaveModalOpen: isOpen });
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
    console.log('Selecting classroom:', classroom);
    if (classroom && classroom.id) {
      this.setState({ selectedClassroom: classroom });
      setToLocalStorage("selectedClassroom", classroom);
      this.setPage("exactClassroom");
      setToLocalStorage("lastPage", "exactClassroom");
    } else {
      console.error('Invalid classroom object:', classroom);
    }
  };

   handleAllAssignmentsClick = (assignments, isActive) => {
    this.setState({
      page: "allAssignments",
      allAssignments: assignments,
      allAssignmentsIsActive: isActive
    });
  }

  setAssignmentModalOpen = (isOpen) => {
    this.setState({
      isAssignmentModalOpen: isOpen,
    });
  };

  setArticleModalOpen = (isOpen) => {
    this.setState({
      isArticleModalOpen: isOpen
    });
  }

  handleAllArticlesClick = (articles) => {
    this.setState({
      page: "Blog",
      blog: articles,
    });
  }

  setAddClassroomModalOpen = (isOpen) => {
    this.setState({
      isAddClassroomModalOpen: isOpen
    });
  }

}

export default App;