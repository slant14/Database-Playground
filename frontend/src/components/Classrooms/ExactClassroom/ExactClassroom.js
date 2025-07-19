import React from "react";
import { Typography, Button } from "antd";
import { FaRegFileCode } from "react-icons/fa6";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { MdOutlineArticle } from "react-icons/md";
import './ExactClassroom.css';
import Assignments from './Assignments/Assignments';
import Articles from './Articles/Articles';
import CreateArticle from "./CreateArticle/CreateArticle"
import CreateAssignment from "./CreateAssignment/CreateAssignment";
import { getMyClassroomClassmates, getClassroomMyAssignments, getMyClassroomArticles } from '../../../api';

const { Title, Paragraph, Text, Link } = Typography;

class ExactClassroom extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      students: [],
      assignmentsFinished: [],
      assignmentsActive: [],
      isAssignmentModalOpen: false,
      selectedAssignment: null,
      isAssignmentActive: true,
      isCreateAssignmentModalOpen: false,
      articles: [],
      isArticleModalOpen: false,
      selectedArticle: null,
      isCreateArticleModalOpen: false,
    }

    this.assignmentSectionActiveRef = React.createRef();
    this.assignmentSectionFinishedRef = React.createRef();
  }

  scrollAssignmentsRight = (isActive) => {
    if (isActive) {
      if (this.assignmentSectionActiveRef.current) {
        this.assignmentSectionActiveRef.current.scrollBy({ left: 387, behavior: 'smooth' });
      }
    } else {
      if (this.assignmentSectionFinishedRef.current) {
        this.assignmentSectionFinishedRef.current.scrollBy({ left: 387, behavior: 'smooth' });
      }
    }
    
  };

  scrollAssignmentsLeft = (isActive) => {
    if (isActive) {
      if (this.assignmentSectionActiveRef.current) {
        this.assignmentSectionActiveRef.current.scrollBy({ left: -387, behavior: 'smooth' });
      }
    } else {
      if (this.assignmentSectionFinishedRef.current) {
        this.assignmentSectionFinishedRef.current.scrollBy({ left: -387, behavior: 'smooth' });
      }
    }
  };

  async componentDidMount() {
      if (this.props.classroom && this.props.classroom.id) {
        try {
          const students = await getMyClassroomClassmates(this.props.classroom.id);
          const allAssignments = await getClassroomMyAssignments(this.props.classroom.id);
          const assignmentsActive = allAssignments.not_submitted;
          const assignmentsFinished = allAssignments.finished;
          const articles = await getMyClassroomArticles(this.props.classroom.id)
          this.setState({ students, assignmentsActive, assignmentsFinished, articles });
        } catch (error) {
          console.error("Failed to fetch students:", error);
        }
      }
    }
    
  handleAssignmentTitleClick = (assignment, isActive) => {
    this.setState({
      isAssignmentModalOpen: true,
      selectedAssignment: assignment,
      isAssignmentActive: isActive,
    });
    if (this.props.setAssignmentModalOpen) {
      this.props.setAssignmentModalOpen(true);
    }
  };

  handleAssignmentModalClose = () => {
    this.setState({
      isAssignmentModalOpen: false,
      selectedAssignment: null,
    });
    if (this.props.setAssignmentModalOpen) {
      this.props.setAssignmentModalOpen(false);
    }
  };

  handleAssignmentFileDirectUpload = (e, assignment) => {
    const file = e.target.files[0];
    if (!file) return;
    alert(`File "${file.name}" selected for "${assignment.title}"!`);
    e.target.value = "";
  };

  handleAllAssignmentsClick = (assignments, isActive) => {
    if (this.props.handleAllAssignmentsClick) {
      this.props.handleAllAssignmentsClick(assignments, isActive);
    }
  };

  handleArticleClick = (article) => {
    this.setState({
      isArticleModalOpen: true,
      selectedArticle: article,
    });
    if (this.props.setArticleModalOpen) {
      this.props.setArticleModalOpen(true);
    }
  }

  handleArticleModalClose = () => {
    this.setState({
      isArticleModalOpen: false,
      selectedArticle: null,
    });
    if (this.props.setArticleModalOpen) {
      this.props.setArticleModalOpen(false);
    }
  };

  handleAllArticlesClick = (articles) => {
    if (this.props.handleAllArticlesClick) {
      this.props.handleAllArticlesClick(articles);
    }
  };

  handleCreateArticleModalOpen = () => {
    this.setState({isCreateArticleModalOpen: true});
    if (this.props.setCreateArticleModalOpen) {
      this.props.setCreateArticleModalOpen(true);
    }
  }

  handleCreateArticleModalClose = () => {
    this.setState({isCreateArticleModalOpen: false});
    if (this.props.setCreateArticleModalOpen) {
      this.props.setCreateArticleModalOpen(false);
    }
  }

  handleArticleCreated = async () => {
    this.handleCreateArticleModalClose();
    if (this.props.classroom && this.props.classroom.id) {
      try {
        const allArticles = await getMyClassroomArticles(this.props.classroom.id);
        this.setState({
          articles: allArticles
        });
      } catch (error) {
        console.error("Failed to reload articles:", error);
      }
    }
  };

  handleCreateAssignmentModalOpen = () => {
    this.setState({isCreateAssignmentModalOpen: true});
    if (this.props.setCreateAssignmentModalOpen) {
      this.props.setCreateAssignmentModalOpen(true);
    }
  }

  handleCreateAssignmentModalClose = () => {
    this.setState({isCreateAssignmentModalOpen: false});
    if (this.props.setCreateAssignmentModalOpen) {
      this.props.setCreateAssignmentModalOpen(false);
    }
  }

  handleAssignmentCreated = async () => {
    this.handleCreateAssignmentModalClose();
    if (this.props.classroom && this.props.classroom.id) {
      try {
        const allAssignments = await getClassroomMyAssignments(this.props.classroom.id);
        this.setState({
          assignmentsActive: allAssignments.not_submitted,
          assignmentsFinished: allAssignments.finished,
        });
      } catch (error) {
        console.error("Failed to reload assignments:", error);
      }
    }
  };

  // Handle synchronization with App component modal states
  componentDidUpdate(prevProps, prevState) {
    // Sync assignment modal state
    if (prevProps.isAssignmentModalOpen && !this.props.isAssignmentModalOpen && this.state.isAssignmentModalOpen) {
      this.setState({ isAssignmentModalOpen: false, selectedAssignment: null });
    }
    if (!prevProps.isAssignmentModalOpen && this.props.isAssignmentModalOpen && !this.state.isAssignmentModalOpen) {
      this.setState({ isAssignmentModalOpen: true });
    }

    // Sync article modal state
    if (prevProps.isArticleModalOpen && !this.props.isArticleModalOpen && this.state.isArticleModalOpen) {
      this.setState({ isArticleModalOpen: false, selectedArticle: null });
    }
    if (!prevProps.isArticleModalOpen && this.props.isArticleModalOpen && !this.state.isArticleModalOpen) {
      this.setState({ isArticleModalOpen: true });
    }

    // Sync create assignment modal state
    if (prevProps.isCreateAssignmentModalOpen && !this.props.isCreateAssignmentModalOpen && this.state.isCreateAssignmentModalOpen) {
      this.setState({ isCreateAssignmentModalOpen: false });
    }
    if (!prevProps.isCreateAssignmentModalOpen && this.props.isCreateAssignmentModalOpen && !this.state.isCreateAssignmentModalOpen) {
      this.setState({ isCreateAssignmentModalOpen: true });
    }

    // Sync create article modal state
    if (prevProps.isCreateArticleModalOpen && !this.props.isCreateArticleModalOpen && this.state.isCreateArticleModalOpen) {
      this.setState({ isCreateArticleModalOpen: false });
    }
    if (!prevProps.isCreateArticleModalOpen && this.props.isCreateArticleModalOpen && !this.state.isCreateArticleModalOpen) {
      this.setState({ isCreateArticleModalOpen: true });
    }
  }

  closeAssignmentModal = () => {
    this.setState({ isAssignmentModalOpen: false, selectedAssignment: null });
  };

  closeArticleModal = () => {
    this.setState({ isArticleModalOpen: false, selectedArticle: null });
  };

  closeCreateAssignmentModal = () => {
    this.setState({ isCreateAssignmentModalOpen: false });
  };

  closeCreateArticleModal = () => {
    this.setState({ isCreateArticleModalOpen: false });
  };


  renderAssignmentsBlock(assignments, type, isActive) {
    const label = type === "Active" ? "Active Assignments" : "Finished Assignments";
    const emptyLabel = type === "Active"
      ? "There are no Active Assignments"
      : "There are no Finished Assignments";
    const sectionRef = isActive ? this.assignmentSectionActiveRef : this.assignmentSectionFinishedRef;
    const scrollLeft = () => this.scrollAssignmentsLeft(isActive);
    const scrollRight = () => this.scrollAssignmentsRight(isActive);
    const handleAllClick = () => this.handleAllAssignmentsClick(assignments, isActive);
  
    if (assignments.length === 0) {
      return (
        <Text className="assignment-label-no">{emptyLabel}</Text>
      );
    }
  
    return (
      <div className={`${type.toLowerCase()}-assignments`}>
        <div className="assignments-header">
          <Text className="assignment-label">{label}</Text>
          <span className="see-more"
            style={{ cursor: "pointer" }}
            onClick={handleAllClick}
          >See more</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button
            className="scroll-right-btn"
            style={{ marginRight: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={scrollLeft}
          >
            <GoTriangleLeft size={32} />
          </Button>
          <div
            className="assignment-section"
            ref={sectionRef}
            style={{ flex: 1 }}
          >
            {assignments.slice(0, 5).map((el, idx) => (
              <div className="assignment-card"
                key={idx}
                onClick={e => {
                  if (
                    e.target.tagName === "BUTTON" ||
                    e.target.tagName === "INPUT" ||
                    e.target.closest('.all-button')
                  ) {
                    return;
                  }
                  this.handleAssignmentTitleClick(el, isActive);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="assignment-header">
                  <FaRegFileCode className="assignment-icon"/>
                  <span className="assignment-title">{el.title}</span>
                </div>
                <div className="assignment-info-row">
                  <div className="assignment-info-text">
                    <span>
                      <span>Open:</span> {this.formatDateTime(el.open_at)}
                    </span>
                    <span>
                      <span>Due:</span> {this.formatDateTime(el.close_at)}
                    </span>
                  </div>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    ref={ref => this[isActive ? `fileInputActive${idx}` : `fileInputFinished${idx}`] = ref}
                    onChange={e => this.handleAssignmentFileDirectUpload(e, el)}
                  />
                  <Button
                    className="all-button"
                    onClick={e => {
                      e.stopPropagation();
                      this[isActive ? `fileInputActive${idx}` : `fileInputFinished${idx}`].click();
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ position: "relative", top: "-1px" }}>
                        {isActive ? "Submit" : "Review"}
                      </span>
                    </span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button
            className="scroll-right-btn"
            style={{ marginLeft: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={scrollRight}
          >
            <GoTriangleRight size={32} />
          </Button>
        </div>
      </div>
    );
  }

  formatDateTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const pad = n => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  render() {
    const classroom = this.props.classroom;
    
    if (!classroom) {
      return (
        <div className="classroom">
          <Title style={{
            marginTop: 30,
            color: "#fff",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>Classroom Not Found</Title>

          <div className="classroom-desciption">
            <Text className="class-props">Please select a classroom from the classrooms page</Text>
          </div>
        </div>
      );
    }
    
    return (
      <div className="whole">
        <div className="whole-class">
          <div>
            <Title style={{
              marginTop: 30,
              color: "#fff",
              fontSize: 30,
              fontFamily: "'Noto Sans', sans-serif",
              fontWeight: 500,
              marginBottom: 10,
              marginLeft: 40,
            }}>{classroom.title}</Title>

            <div className="classroom-description">
              <span className="classroom-desc-two-lines">
                  <span className="class-label">Primary Instructor:</span> {classroom.primary_instructor_name}
              </span>
              <span className="classroom-desc-two-lines">
                <span className="class-info">Description:</span> {classroom.description}
              </span>
              <span className="classroom-desc-two-lines">
                <span className="class-label">Number of Students:</span> {classroom.capacity}
              </span>
              <span>
                <span style={{color:"#51CB63", fontWeight:400}}>Created:</span> {
                  (() => {
                    const date = classroom.created_date.slice(0, 10).split("-");
                    return `${date[2]}/${date[1]}/${date[0]}`;
                  })()
                  }
              </span>
            </div>

            <Text style={{
              fontWeight: 400,
              fontSize: 25,
              fontFamily: "'Noto Sans', sans-serif",
              color: "#fff",
              marginTop: 60,
              marginLeft: 40
            }}>List of Students</Text>

            <div className="students-list">
              {this.state.students.map((el, idx) => (
                <Text key={idx} className="student">
                  {el.user_name}
                </Text>
              ))}
            </div>
          </div>
          
          <div className="classroom-assignments">
            {this.renderAssignmentsBlock(this.state.assignmentsActive, "Active", true)}
            {this.renderAssignmentsBlock(this.state.assignmentsFinished, "Finished", false)}
            <Button className="create-assignment-button" onClick={() => this.handleCreateAssignmentModalOpen()}>  
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ position: "relative", top: "-1px" }}>
                      Add Assignment
                  </span>
                </span>
              </Button>
          </div>

          <div className="blog-section">
            <div className="blog-header">
                <Text className="blog-label">Blog</Text>
                <span className="blog-see-more" 
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleAllArticlesClick(this.state.articles)}
                >See more</span>
              </div>

            <div className="articles-list">
              {this.state.articles.slice(0, 3).map((el, idx) => (
                <div className="article-card" key={idx} onClick={() => this.handleArticleClick(el)}>
                  <div className="article-header">
                    <MdOutlineArticle className="article-icon" />
                    <span className="article-title article-title-one-line">{el.title}</span>
                  </div>  
                  <Text className="article-author article-author-one-line">
                    {el.author_names.join(', ')}
                  </Text>
                  <Text className="article-description">
                    {el.description}
                  </Text>
                </div>  
              ))}
            </div> 
            
            <Button className="create-article-button" onClick={() => this.handleCreateArticleModalOpen()}>  
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>
                  Add Article
                </span>
              </span>
            </Button>

            {/*
            {(this.props.chosenRole === "Primary Intructor" || this.props.chosenRole === "TA") && (
              <Button className="all-button">  
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <span style={{ position: "relative", top: "-1px" }}>
                      Add Article
                  </span>
                </span>
              </Button>
            )}
              */}

          </div>
        </div>

        {this.state.isAssignmentModalOpen && this.state.selectedAssignment && (
          <Assignments
            open={this.state.isAssignmentModalOpen}
            onCancel={this.handleAssignmentModalClose}
            assignment={this.state.selectedAssignment}
            onAnswerSubmit={this.handleAssignmentFileDirectUpload}
            isActive={this.state.isAssignmentActive}
            formatDateTime={this.formatDateTime}
          />
        )}

        {this.state.isCreateAssignmentModalOpen && (
          <CreateAssignment
            open={this.state.isCreateAssignmentModalOpen}
            onCancel={this.handleCreateAssignmentModalClose}
            classroomID={this.props.classroom.id}
            onAssignmentCreated={this.handleAssignmentCreated}
            onAsignmentClose={this.handleCreateAssignmentModalClose}
          />
        )}

        {this.state.isArticleModalOpen && this.state.selectedArticle && (
          <Articles
            open={this.state.isArticleModalOpen}
            onCancel={this.handleArticleModalClose}
            article={this.state.selectedArticle}
          />
        )}

        {this.state.isCreateArticleModalOpen && (
          <CreateArticle
            open={this.state.isCreateArticleModalOpen}
            onCancel={this.handleCreateArticleModalClose}
            classroomID={this.props.classroom.id}
            onArticleCreated={this.handleArticleCreated}
            onArticleClose={this.handleCreateArticleModalClose}
          />
        )}

       </div>
    );
  }
}

export default ExactClassroom;