import React from "react";
import { Typography } from "antd";
import './Classrooms.css';

const { Title, Paragraph, Text, Link } = Typography;

class ClassRooms extends React.Component {
  render() {
    return (
      <div className="classrooms">
        <Title style={{
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>Will be <Text style={{
          color: "#51CB63",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>later</Text>!</Title>
      </div>
    );
  }


}

export default ClassRooms;