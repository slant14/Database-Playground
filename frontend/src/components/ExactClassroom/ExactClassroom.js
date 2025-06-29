import React from "react";
import { Typography, Button } from "antd";
import './ExactClassroom.css';
import image from "../../img/WideScreen.jpg"

const { Title, Paragraph, Text, Link } = Typography;

class ExactClassroom extends React.Component {
  
  render() {
    const classroom = this.props.classroom;
    
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
        }}>{classroom.name}</Title>

        <div className="classroom-desciption">
          <Text className="class-props">Primary Instructor: {classroom.teacher}</Text><br />
          <Text className="class-props">Number of Students: {classroom.numberOfStudents}</Text><br />
          <Text className="class-props">Created: {classroom.date}</Text>
        </div>
        
      </div>
    );
  }
}

export default ExactClassroom;