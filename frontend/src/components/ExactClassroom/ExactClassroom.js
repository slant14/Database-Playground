import React from "react";
import { Typography, Button } from "antd";
import { FaRegFileCode } from "react-icons/fa6";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import './ExactClassroom.css';
import image from "../../img/WideScreen.jpg"
import image1 from "../../img/Screen.jpg"
import { getMyClassroomClassmates } from '../../api';

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
      assignmentsActive: [
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
      articles: [
        {
          title: "Pretty Print",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        },
        {
          title: "Pretty Print",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        },
        {
          title: "Pretty Print",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        },
        {
          title: "Pretty Print",
          description: "Prettyprint is the process of converting and presenting \
          source code or other objects in a legible and attractive way. A prettyprinter\
           takes blocks of code and prints them in an aesthetically pleasing fashion, presenting\
            the characters with line breaks and indentations to make the code comprehensible",
        }
      ]
    }

    this.assignmentSectionActiveRef = React.createRef();
    this.assignmentSectionFinishedRef = React.createRef();
  }

  scrollAssignmentsRightActive = () => {
    if (this.assignmentSectionActiveRef.current) {
      this.assignmentSectionActiveRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  scrollAssignmentsLeftActive = () => {
    if (this.assignmentSectionActiveRef.current) {
      this.assignmentSectionActiveRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  scrollAssignmentsRightFinished = () => {
    if (this.assignmentSectionFinishedRef.current) {
      this.assignmentSectionFinishedRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  scrollAssignmentsLeftFinished = () => {
    if (this.assignmentSectionFinishedRef.current) {
      this.assignmentSectionFinishedRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  async componentDidMount() {
      try {
        const students = await getMyClassroomClassmates(this.props.classroom.id);
        this.setState({ students });
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    }
    

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
          <div className="classroom">
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
                  {el.name}
                </Text>
              ))}
            </div>
          </div>
          
          <div className="classroom-assignments">
            <div className="active-assignments">
              <Text className="assignment-label">Active Assignments</Text>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  className="scroll-right-btn"
                  style={{ marginRight: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={this.scrollAssignmentsLeftActive}
                >
                  <GoTriangleLeft size={32} />
                </Button>

                <div
                  className="assignment-section"
                  ref={this.assignmentSectionActiveRef}
                  style={{ flex: 1 }}
                >
                  {this.state.assignmentsActive.slice(0, 5).map((el, idx) => (
                    <div className="assignment-card" key={idx}>
                      <div className="assignment-header">
                        <FaRegFileCode className="assignment-icon"/>
                        <span className="assignment-title">{el.title}</span>
                      </div>
                      <div className="assignment-info-row">
                        <div className="assignment-info-text">
                          <div>Open: {el.open}</div>
                          <div>Due: {el.due}</div>
                        </div>
                        <Button className="submit-button">
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
                  onClick={this.scrollAssignmentsRightActive}
                >
                  <GoTriangleRight size={32} />
                </Button>
              </div>
            </div>

            <div className="finished-assignments">
              <Text className="assignment-label">Finished Assignments</Text>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  className="scroll-right-btn"
                  style={{ marginRight: 10, height: 60, width: 60, display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={this.scrollAssignmentsLeftFinished}
                >
                  <GoTriangleLeft size={32} />
                </Button>

                <div
                  className="assignment-section"
                  ref={this.assignmentSectionFinishedRef}
                  style={{ flex: 1 }}
                >
                  {this.state.assignmentsFinished.slice(0, 5).map((el, idx) => (
                    <div className="assignment-card" key={idx}>
                      <div className="assignment-header">
                        <FaRegFileCode className="assignment-icon"/>
                        <span className="assignment-title">{el.title}</span>
                      </div>
                      <div className="assignment-info-row">
                        <div className="assignment-info-text">
                          <div>Open: {el.open}</div>
                          <div>Due: {el.due}</div>
                        </div>
                        <Button className="submit-button">
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
                  onClick={this.scrollAssignmentsRightFinished}
                >
                  <GoTriangleRight size={32} />
                </Button>
              </div>
            </div>
          </div>

          <div style={{marginTop: 30,}}>
            <Text style={{
              fontWeight: 400,
              fontSize: 25,
              fontFamily: "'Noto Sans', sans-serif",
              color: "#fff",
            }}>Blog</Text>

            <div className="articles-list">
              {this.state.articles.slice(0, 3).map((el, idx) => (
                <div className="article-card" key={idx}>
                  <img
                    src={image1}
                    style={{ width: "350px", height: "40px", borderTopLeftRadius: "7px", borderTopRightRadius: "7px", borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
                  />
                  <Text className="article-title">
                    {el.title}
                  </Text>
                  <Text className="article-description">
                    {el.description}
                  </Text>
                  <Button className="view-article">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ position: "relative", top: "-1px" }}>View</span>
                    </span>
                  </Button>
                </div>  
              ))}
            </div>

            <Button className="all-button">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>See all</span>
              </span>
            </Button>
          </div>
          
        </div>
       </div> 
    );
  }
}

export default ExactClassroom;