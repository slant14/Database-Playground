import React from "react";
import { Typography, Button } from "antd";
import './Classrooms.css';
import image from "../../img/Screen.jpg"

const { Title, Paragraph, Text, Link } = Typography;

class ClassRooms extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      id: 1,
      courses: [{
        name: "Introduction to Programmming",
        teacher: "Zlata Schedrikova",
        numberOfStudents: 324,
        date: 23
      },
      {
        name: "Analitical Geometry and Linear Algebra",
        teacher: "Zlata Schedrikova",
        numberOfStudents: 324,
        date: 23
        },
      {
        name: "Computer Architecture",
        teacher: "Zlata Schedrikova",
        numberOfStudents: 324,
        date: 23
      },
      {
        name: "Math Analysis",
        teacher: "Zlata Schedrikova",
        numberOfStudents: 324,
        date: 23
      }
      ],
      selectedClassroom: null,
    }
  }


  render() {
    if (this.state.courses.length === 0) {
      return (
        <div className="classrooms">
          <Title style={{
            marginTop: 30,
            color: "#fff",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>There are no <Text style={{
            color: "#51CB63",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>classrooms yet</Text>
          </Title>
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
          marginBottom: 10
        }}>Class<Text style={{
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>rooms</Text>
        </Title>
        
          <div className="courses">
          {this.state.courses.map((el, idx) => (
            <div className="card" key={idx} >
               <img
                src={image}
                alt="course"
                style={{ width: "500px", borderTopLeftRadius: "14px", borderTopRightRadius: "14px", borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }}
              />
              <Text className="plain-title">
                {el.name}
              </Text>
              
              <div className="plain-description">
                <ul>
                  <li>
                    <span>
                      <span style={{color:"#51CB63", fontWeight:400}}>Primary Instructor:</span> {el.teacher}
                    </span>
                  </li>
                  <li>
                    <span>
                      <span style={{color:"#51CB63", fontWeight:400}}>Number of Students:</span> {el.numberOfStudents}
                    </span>
                  </li>
                    <li>
                    <span className="Created-Button">
                      <span style={{color:"#51CB63", fontWeight:400}}>Created:</span> {el.date}
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
      </div>
    );
  }
  

  selectClassroom = (classroom) => {
    this.setState({ selectedClassroom: classroom });
  };

}

export default ClassRooms;