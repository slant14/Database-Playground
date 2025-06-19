import React from "react";
import { Button, Typography } from "antd";

const { Title, Paragraph, Text, Link } = Typography;

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <Title style={{
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>Greetings!</Title>

        <Paragraph className="account-text">
          In the process of internal desktop applications development, many different design specs and
          implementations would be involved, which might cause designers and developers difficulties and
          duplication and reduce the efficiency of development.
        </Paragraph>

        <Title level={2} style={{
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>Guidelines and Resources</Title>

        <Paragraph className="account-text">
          We supply a series of design principles, practical patterns and high quality design resources
          (<Text code className="account-text">Sketch</Text> and <Text code className="account-text">Axure</Text>), to help people create their product
          prototypes beautifully and efficiently.
        </Paragraph>
      </div>
    );
  }


}

export default Home;