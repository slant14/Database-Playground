import React from "react";
import { Typography, Button } from "antd";
import './ExactClassroom.css';
import image from "../../img/WideScreen.jpg"
import { getMyClassroomClassmates } from '../../api';

const { Title, Paragraph, Text, Link } = Typography;

class ExactClassroom extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      students: [],
      assignmentsFinished: [],
      assignmentsActive: []
    }
  }

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
    
    // Если classroom не передан, показываем сообщение
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
            <Text className="class-props">Please select a classroom from the classrooms page.</Text>
          </div>
        </div>
      );
    }
    
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
        }}>{classroom.title}</Title>

        <div className="classroom-desciption">
          <Text className="class-props">Primary Instructor: {classroom.primary_instructor_name}</Text><br />
          <Text className="class-props">Number of Students: {classroom.capacity}</Text><br />
          <Text className="class-props">Created: {classroom.created_date}</Text>
        </div>
        
        <div className="students-list">
          {this.state.students.map((el, idx) => {
            <Text>
              el.name
            </Text>
          })

          }
        </div>

      </div>
    );
  }
}

export default ExactClassroom;