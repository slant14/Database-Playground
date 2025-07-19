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
      allClassrooms: [],
      classroomsPrimaryInstructor: [],
      classroomsTA: [],
      classroomsStudents: [],
      isModalOpen:false,
      chosenRole: "All Classrooms"
    }
  }

  async componentDidMount() {
    await this.loadClassrooms();
  }

  async loadClassrooms() {
    try {
      const allClassrooms = await getMyClassrooms();
      const classroomsPrimaryInstructor = allClassrooms.primary_instructor || [];
      const classroomsTA = allClassrooms.TA || [];
      const classroomsStudents = allClassrooms.student || [];
  
      const all = [
        ...classroomsPrimaryInstructor,
        ...classroomsTA,
        ...classroomsStudents
      ];
      const seen = new Set();
      const allClassroomsUnique = all.filter(c => {
        if (seen.has(c.id)) return false;
        seen.add(c.id);
        return true;
      });
  
      this.setState({
        classroomsPrimaryInstructor,
        classroomsTA,
        classroomsStudents,
        allClassrooms: allClassroomsUnique
      });
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

  // Expose this method for the parent App component to call
  closeModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  // Add this method to handle when modal is closed via back button from App component
  componentDidUpdate(prevProps, prevState) {
    // If App component's modal state changes from outside (like back button), sync our state
    if (prevProps.isAddClassroomModalOpen && !this.props.isAddClassroomModalOpen && this.state.isModalOpen) {
      this.setState({ isModalOpen: false });
    }
    // If App component opens the modal from outside, sync our state
    if (!prevProps.isAddClassroomModalOpen && this.props.isAddClassroomModalOpen && !this.state.isModalOpen) {
      this.setState({ isModalOpen: true });
    }
  }  

  handleClassroomCreated = async (classroom) => {
    this.handleModalClose();
    await this.loadClassrooms();
    if (classroom) {
      this.props.selectClassroom(classroom, this.state.chosenRole);
    }
  };

  handlePostLoginUpdate = async () => {
    await this.loadClassrooms();
  };

  getBrightColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 85%, 70%)`;
  }

  render() {
    let classroomsToShow = [];
    
    if (this.state.chosenRole === "Primary Instructor") {
      classroomsToShow = this.state.classroomsPrimaryInstructor;
    } else if (this.state.chosenRole === "TA") {
      classroomsToShow = this.state.classroomsTA;
    } else if (this.state.chosenRole === "Student") {
      classroomsToShow = this.state.classroomsStudents;
    } else {
      classroomsToShow = this.state.allClassrooms;
    }

    if (classroomsToShow.length === 0) {
      return (
        <div className="classrooms">
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
          {this.state.isModalOpen && (
            <AddClassroom
              open={this.state.isModalOpen}
              onCancel={this.handleModalClose}
              onClassroomCreated={this.handleClassroomCreated}
              currentUserName={this.props.currentUserName}
            />
          )}
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
              </div>
              <Text className="plain-title card-title-one-line">
                {el.title}
              </Text>
              
              <div className="plain-description">
                <ul>
                  <li>
                    <span className="card-instructor-one-line">
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
  };
}
  
export default ClassRooms;