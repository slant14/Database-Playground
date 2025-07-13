import React from "react";
import { Typography, Button } from "antd";
import { getMyClassrooms } from '../../api';
import './Classrooms.css';
import AddClassroom from "./AddClassroom"
import image from "../../img/Screen.jpg"

const { Title, Paragraph, Text, Link } = Typography;

class ClassRooms extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      classrooms: [],
      isModalOpen:false,
    }
  }

  async componentDidMount() {
    await this.loadClassrooms();
  }

  async loadClassrooms() {
    try {
      const classrooms = await getMyClassrooms();
      this.setState({ classrooms });
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
    this.props.selectClassroom(classroom);
  };

  handlePostLoginUpdate = async () => {
    // Перезагружаем классы после авторизации
    await this.loadClassrooms();
  };
  
  render() {
    if (this.state.classrooms.length === 0) {
      return (
        <div className="classrooms">
          <Title style={{
            marginTop: 30,
            color: "#fff",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 0
          }}>There are no <Text style={{
            color: "#51CB63",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 0
          }}>classrooms yet</Text>
          </Title>
          <Button className="add-classroom" onClick={this.handleModalOpen}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ position: "relative", top: "-1px" }}>Add Classroom</span>
          </span>
        </Button>
        {this.state.isModalOpen && (
          <AddClassroom
            open={this.state.isModalOpen}
            onCancel={this.handleModalClose}
          />
        )}
        </div>
      );
    }

    return (
      <div className="classrooms">
        <Title style={{
          marginTop: 30,
          color: "#51CB63",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 0
        }}>Class<Text style={{
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 0
        }}>rooms</Text>
        </Title>
        <Button className="add-classroom" onClick={this.handleModalOpen}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span style={{ position: "relative", top: "-1px" }}>Add Classroom</span>
          </span>
        </Button>
        <div className="courses">
          {this.state.classrooms.map((el, idx) => (
            <div className="card" key={idx} >
               <img
                src={image}
                alt="course"
                style={{ width: "500px", borderTopLeftRadius: "14px", borderTopRightRadius: "14px", borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
              />
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
                      <span style={{color:"#51CB63", fontWeight:400}}>Created:</span> {el.created_date.slice(0, 10).replace(/-/g, "/")}
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