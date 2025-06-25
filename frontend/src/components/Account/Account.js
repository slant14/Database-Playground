import React from "react";
import { Button, Typography } from "antd";
import "./Account.css";

const { Title, Paragraph, Text, Link } = Typography;

class Account extends React.Component {
  render() {
    return (
      <div className="account-container">
        <Title style={{
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>Hello, <Text style={{
          color: "#51CB63",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 10
        }}>{this.props.user.login}</Text>!</Title>

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

        <Paragraph className="account-text">
          <ul>
            <li>
              <Link href="/docs/spec/proximity">Principles</Link>
            </li>
            <li>
              <Link href="/docs/spec/overview">Patterns</Link>
            </li>
            <li>
              <Link href="/docs/resources">Resource Download</Link>
            </li>
          </ul>
        </Paragraph>

        <Paragraph className="account-text">
          Press <Text keyboard className="account-text">Esc</Text> to exit...
        </Paragraph>
        <Button variant="solid" className="my-danger-button" onClick={this.props.logOut}>Log out</Button>
      </div>
    );
  }
}

export default Account;