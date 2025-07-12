import React from "react";
import { Typography, Button } from "antd";
import { FaRegFileCode } from "react-icons/fa6";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { MdOutlineArticle } from "react-icons/md";
import './ExactClassroom.css';
import Assignments from './Assignments/Assignments';
import Articles from './Articles/Articles';
import image from "../../../img/WideScreen.jpg"
import { getMyClassroomClassmates, getClassroomMyAssignments } from '../../../api';

const { Title, Paragraph, Text, Link } = Typography;

class ExactClassroom extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      students: [],
      assignmentsFinished: [
        {
          title: "Assignment 1",
          open: "2025/04/27 00:00:00",
          due: "2025/04/30 00:00:00"
        },
        {
          title: "Assignment 2",
          open: "2025/04/27 00:00:00",
          due: "2025/04/30 00:00:00"
        },
        {
          title: "Assignment 3",
          open: "2025/04/27 00:00:00",
          due: "2025/04/30 00:00:00"
        },
        {
          title: "Assignment 4",
          open: "2025/04/27 00:00:00",
          due: "2025/04/30 00:00:00"
        },
        {
          title: "Assignment 5",
          open: "2025/04/27 00:00:00",
          due: "2025/04/30 00:00:00"
        },
        {
          title: "Assignment 6",
          open: "2025/04/27 00:00:00",
          due: "2025/04/30 00:00:00"
        }
      ],
      assignmentsActive: [],
      isAssignmentModalOpen: false,
      selectedAssignment: null,
      isAssignmentActive: true,
      articles: [
        {
          title: "Pretty Print",
          author: "Nickolay Kudasov",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        },
        {
          title: "Pretty Print",
          author: "Nickolay Kudasov",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        },
        {
          title: "Pretty Print",
          author: "Nickolay Kudasov",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        },
        {
          title: "Pretty Print",
          author: "Nickolay Kudasov",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        }
      ],
      isArticleModalOpen: false,
      selectedArticle: null,
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
          this.setState({ students, assignmentsActive });
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

  render() {
    const classroom = this.props.classroom;
    
    if (!classroom) {
      return (
        <div className="classroom">
          <img className="wide-image" src={image} style={{}}/>
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
        <img className="wide-image" src={image} style={{}}/>

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
              <span>
                  <span className="class-label">Primary Instructor:</span> {classroom.primary_instructor_name}
              </span>
              <span>
                <span className="class-info">Description:</span> {classroom.description}
              </span>
              <span>
                <span className="class-label">Number of Students:</span> {classroom.capacity}
              </span>
              <span>
                <span className="class-label">Created:</span> {classroom.created_date.slice(0, 10).replace(/-/g, "/")}
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
            <div className="active-assignments">
              <div className="assignments-header">
                <Text className="assignment-label">Active Assignments</Text>
                <span className="see-more" 
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleAllAssignmentsClick(this.state.assignmentsActive, true)}
                >See more</span>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  className="scroll-right-btn"
                  style={{ marginRight: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => this.scrollAssignmentsLeft(true)}
                >
                  <GoTriangleLeft size={32} />
                </Button>

                <div
                  className="assignment-section"
                  ref={this.assignmentSectionActiveRef}
                  style={{ flex: 1 }}
                >
                  {this.state.assignmentsActive.slice(0, 5).map((el, idx) => (
                    <div
                      className="assignment-card"
                      key={idx}
                      onClick={e => {
                        // Prevent modal if the click originated from a button or input inside the card
                        if (
                          e.target.tagName === "BUTTON" ||
                          e.target.tagName === "INPUT" ||
                          e.target.closest('.all-button')
                        ) {
                          return;
                        }
                        this.handleAssignmentTitleClick(el, true);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="assignment-header">
                        <FaRegFileCode className="assignment-icon"/>
                        <span className="assignment-title">{el.title}</span>
                      </div>
                      <div className="assignment-info-row">
                        <div className="assignment-info-text">
                          <div>Open: {el.open_at}</div>
                          <div>Due: {el.close_at}</div>
                        </div>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={ref => this[`fileInputActive${idx}`] = ref}
                          onChange={e => this.handleAssignmentFileDirectUpload(e, el)}
                        />
                        <Button
                          className="all-button"
                          onClick={e => {
                            e.stopPropagation();
                            this[`fileInputActive${idx}`].click();
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span style={{ position: "relative", top: "-1px" }}>Submit</span>
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="scroll-right-btn"
                  style={{ marginLeft: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => this.scrollAssignmentsRight(true)}
                >
                  <GoTriangleRight size={32} />
                </Button>
              </div>
            </div>

            <div className="finished-assignments">
              <div className="assignments-header">
                <Text className="assignment-label">Finished Assignments</Text>
                <span className="see-more"
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleAllAssignmentsClick(this.state.assignmentsFinished, false)}
                >See more</span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  className="scroll-right-btn"
                  style={{ marginRight: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => this.scrollAssignmentsLeft(false)}
                >
                  <GoTriangleLeft size={32} />
                </Button>

                <div
                  className="assignment-section"
                  ref={this.assignmentSectionFinishedRef}
                  style={{ flex: 1 }}
                >
                  {this.state.assignmentsFinished.slice(0, 5).map((el, idx) => (
                    <div className="assignment-card" 
                      key={idx}
                      onClick={e => {
                        // Prevent modal if the click originated from a button or input inside the card
                        if (
                          e.target.tagName === "BUTTON" ||
                          e.target.tagName === "INPUT" ||
                          e.target.closest('.all-button')
                        ) {
                          return;
                        }
                        this.handleAssignmentTitleClick(el, false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="assignment-header">
                        <FaRegFileCode className="assignment-icon"/>
                        <span className="assignment-title">{el.title}</span>
                      </div>
                      <div className="assignment-info-row">
                        <div className="assignment-info-text">
                          <div>Open: {el.open}</div>
                          <div>Due: {el.due}</div>
                        </div>
                        <input
                          type="file"
                          style={{ display: "none" }}
                          ref={ref => this[`fileInputFinished${idx}`] = ref}
                          onChange={e => this.handleAssignmentFileDirectUpload(e, el)}
                        />
                        <Button
                          className="all-button"
                          onClick={e => {
                            e.stopPropagation();
                            this[`fileInputFinished${idx}`].click();
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span style={{ position: "relative", top: "-1px" }}>Review</span>
                          </span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="scroll-right-btn"
                  style={{ marginLeft: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={() => this.scrollAssignmentsRight(false)}
                >
                  <GoTriangleRight size={32} />
                </Button>
              </div>
            </div>
          </div>

          <div style={{marginTop: 30,}}>
            <div className="assignments-header">
                <Text style={{
                  fontWeight: 400,
                  fontSize: 25,
                  fontFamily: "'Noto Sans', sans-serif",
                  color: "#fff",
                }}>Blog</Text>
                <span className="see-more" 
                  style={{ cursor: "pointer" }}
                  onClick={() => this.handleAllArticlesClick(this.state.articles)}
                >See more</span>
              </div>

            <div className="articles-list">
              {this.state.articles.slice(0, 3).map((el, idx) => (
                <div className="article-card" key={idx} onClick={() => this.handleArticleClick(el)}>
                  <div className="article-header">
                    <MdOutlineArticle className="article-icon" />
                    <span className="article-title">{el.title}</span>
                  </div>  
                  <Text className="article-author">
                    {el.author}
                  </Text>
                  <Text className="article-description">
                    {el.description}
                  </Text>
                </div>  
              ))}
            </div> 
          </div>
        </div>

        {this.state.isAssignmentModalOpen && this.state.selectedAssignment && (
          <Assignments
            open={this.state.isAssignmentModalOpen}
            onCancel={this.handleAssignmentModalClose}
            assignment={this.state.selectedAssignment}
            onAnswerSubmit={this.handleAssignmentFileDirectUpload}
            isActive={this.state.isAssignmentActive}
          />
        )}

        {this.state.isArticleModalOpen && this.state.selectedArticle && (
          <Articles
            open={this.state.isArticleModalOpen}
            onCancel={this.handleArticleModalClose}
            article={this.state.selectedArticle}
          />
        )}
       </div>
    );
  }
}

export default ExactClassroom;