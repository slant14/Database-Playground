import React from "react"
import './Assignments.css';
import { Modal, Button, Typography } from "antd";

const { Title } = Typography;

class Assignments extends React.Component {
  fileInputRef = React.createRef();

  handleButtonClick = (e) => {
    e.stopPropagation();
    this.fileInputRef.current.click();
  };

  handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    this.props.onAnswerSubmit(e, this.props.assignment);
    e.target.value = "";
  };

  render() {
    const { open, onCancel, assignment, isActive } = this.props;
    return (
      <Modal 
        className="assignment-modal" 
        open={open} 
        onCancel={onCancel} 
        footer={null}
        width={800}
      >
        <Title className="inner-assignment-title">{assignment.title}</Title>
        <div className="assignment-decription">
            {assignment.description}
        </div>
        <div className="this-row">
            <div className="assignment-period">
                <div><span style={{color:"#51CB63"}}>Open:</span> {assignment.open}</div>
                <div><span style={{color:"#51CB63"}}>Due:</span> {assignment.due}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flex: 1 }}>
              <input
                type="file"
                style={{ display: "none" }}
                ref={this.fileInputRef}
                onChange={this.handleFileChange}
              />
              <div>
                {isActive ? (
                  <Button className="submit-button" onClick={this.handleButtonClick}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ position: "relative", top: "-1px" }}>Submit</span>
                    </span>
                  </Button>
                ) : (
                  <Button className="submit-button" onClick={this.handleButtonClick}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ position: "relative", top: "-1px" }}>Review</span>
                    </span>
                  </Button>
                )}
              </div>
            </div>
        </div>    
      </Modal>
    );
  }
}

export default Assignments;