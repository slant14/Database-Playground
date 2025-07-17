import React from "react";
import { Typography, Button, Select } from "antd";
import { getMyClassrooms } from '../../api';
import './Classrooms.css';
import AddClassroom from "./AddClassroom"

const { Title, Paragraph, Text, Link } = Typography;

class ClassRooms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      classrooms: [],
      allClassrooms: [],
      classroomsPrimaryInstructor: [],
      classroomsTA: [],
      classroomsStudents: [],
      isModalOpen:false,
      chosenRole: null
    }
  }

  async componentDidMount() {
    await this.loadClassrooms();
  }

  async loadClassrooms() {
    try {
      const allClassrooms = await getMyClassrooms();
      this.setState({ allClassrooms });
    } catch (error) {
      console.error("Failed to fetch classrooms:", error);
    }
  }
  handleModalOpen = () => {
    this.setState({
      isModalOpen: true,
    });
    if (this.props.setAddClassroomModalOpen) {
      this.props.setAddClassroomModalOpen(true);
    }
  }
  
  handleModalClose = () => {
    this.setState({
      isModalOpen: false,
    });
    if (this.props.setAddClassroomModalOpen) {
      this.props.setAddClassroomModalOpen(false);
    }
  };  

  handleClassroomCreated = (classroom) => {
    this.handleModalClose();
    if (classroom) {
      this.props.selectClassroom(classroom, this.state.chosenRole);
    }
  };

  handlePostLoginUpdate = async () => {
    // Перезагружаем классы после авторизации
    await this.loadClassrooms();
  };

  getBrightColorFromString = (str) => {
    // Simple hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Use hash to get hue (0-359)
    const hue = Math.abs(hash) % 360;
    // Bright color: high saturation, high lightness
    return `hsl(${hue}, 85%, 70%)`;
  }

  render() {
    let classroomsToShow = this.state.allClassrooms;
    if (this.state.chosenRole === "Primary Instructor") {
      classroomsToShow = this.state.classroomsPrimaryInstructor;
    } else if (this.state.chosenRole === "TA") {
      classroomsToShow = this.state.classroomsTA;
    } else if (this.state.chosenRole === "Student") {
      classroomsToShow = this.state.classroomsStudents;
    }

    if (classroomsToShow.length === 0) {
      return (
        <div className="classrooms-header">
          <div className="classrooms-header-left" />

          <div className="classrooms-header-center">
            <Title className="classrooms-title">There are no classrooms yet</Title>
          </div>

          <div className="classrooms-header-right">
            <Select
              className="role-select"
              value={this.state.chosenRole}
              style={{ width: 150, marginRight: '20px' }}
              options={[
                { value: "All Classrooms", label: "All Classrooms" },
                { value: "Primary Instructor", label: "Primary Instructor" },
                { value: "TA", label: "TA" },
                { value: "Student", label: "Student" },
              ]}
              onChange={value => {
                this.setState({ chosenRole: value });
              }}
            />
            <Button className="add-classroom" onClick={this.handleModalOpen}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Add Classroom</span>
              </span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="classrooms">
        
        <div className="classrooms-header">
          <div className="classrooms-header-left" />

          <div className="classrooms-header-center">
            <Title className="classrooms-title">Classrooms</Title>
          </div>

          <div className="classrooms-header-right">
            <Select
              className="role-select"
              value={this.state.chosenRole}
              style={{ width: 150, marginRight: '20px' }}
              options={[
                { value: "Primary Instructor", label: "Primary Instructor" },
                { value: "TA", label: "TA" },
                { value: "Student", label: "Student" },
              ]}
              onChange={value => {
                this.setState({ chosenRole: value });
              }}
            />
            <Button className="add-classroom" onClick={this.handleModalOpen}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ position: "relative", top: "-1px" }}>Add Classroom</span>
              </span>
            </Button>
          </div>
        </div>
        
        <div className="courses">
          {classroomsToShow.map((el, idx) => (
            <div className="card" key={idx} >
               <div
                style={{
                  width: "500px",
                  height: "120px",
                  borderTopLeftRadius: "14px",
                  borderTopRightRadius: "14px",
                  borderBottomLeftRadius: "0",
                  borderBottomRightRadius: "0",
                  background: this.getBrightColorFromString(el.title),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {/* Optionally, show initials or icon here */}
              </div>
              <Text className="plain-title">
                {el.title}
              </Text>
              
              <div className="plain-description">
                <ul>
                  <li>
                    <span>
                      <span style={{color:"#51CB63", fontWeight:400}}>Primary Instructor:</span> {el.primary_instructor_name}
                    </span>
                  </li>
                  <li>
                    <span>
                      <span style={{color:"#51CB63", fontWeight:400}}>Number of Students:</span> {el.capacity}
                    </span>
                  </li>
                    <li>
                    <span className="Created-Button">
                      <span style={{color:"#51CB63", fontWeight:400}}>Created:</span> {
                        (() => {
                          const date = el.created_date.slice(0, 10).split("-");
                          return `${date[2]}/${date[1]}/${date[0]}`;
                        })()
                      }
                      <Button className="view" onClick={() => this.props.selectClassroom(el)}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <span style={{ position: "relative", top: "-1px" }}>View</span>
                        </span>
                      </Button>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      {this.state.isModalOpen && (
        <AddClassroom
          open={this.state.isModalOpen}
          onCancel={this.handleModalClose}
          onClassroomCreated={this.handleClassroomCreated}
          currentUserName={this.props.currentUserName}
        />
      )}
      </div>
    );
  }
  

  selectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom });
  };

  selectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom });
  };

}

export default ClassRooms;