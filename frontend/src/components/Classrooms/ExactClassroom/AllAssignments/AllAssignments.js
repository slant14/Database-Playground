import React from "react";
import { Typography, Button } from "antd";
import './AllAssignments.css';
import { FaRegFileCode } from "react-icons/fa6";
import Assignments from '../Assignments/Assignments';

const { Title, Text } = Typography;

class AllAssignments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isAssignmentModalOpen: false,
      selectedAssignment: null,
      isAssignmentActive: props.isActive,
    };
  }

  handleAssignmentTitleClick = (assignment) => {
    this.setState({
      isAssignmentModalOpen: true,
      selectedAssignment: assignment,
      isAssignmentActive: this.props.isActive,
    });
    if (this.props.setAssignmentModalOpen) {
      this.props.setAssignmentModalOpen(true);
    }
  };

  handleAssignmentModalClose = () => {
    this.setState({
      isAssignmentModalOpen: false,
      selectedAssignment: null,
    });
    if (this.props.setAssignmentModalOpen) {
      this.props.setAssignmentModalOpen(false);
    }
  };

  handleAssignmentFileDirectUpload = (e, assignment) => {
    const file = e.target.files[0];
    if (!file) return;
    alert(`File "${file.name}" selected for "${assignment.title}"!`);
    e.target.value = "";
  };

  formatDateTime = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const pad = n => n.toString().padStart(2, "0");
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  render() {
    const { assignments, isActive } = this.props;
    const { isAssignmentModalOpen, selectedAssignment, isAssignmentActive } = this.state;
    if (assignments.length === 0) {
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
          }}>assignments yet</Text>
          </Title>
        </div>
      );
    }

    return (
      <div className="allAssignments">
        <Title style={{
          textAlign: "center",
          marginTop: 30,
          color: "#fff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 30
        }}>
          {isActive ? "Active Assignments" : "Finished Assignments"}
        </Title>
        <div className="all-assignments">
          {assignments.map((el, idx) => (
            <div
              className="allAssignment-card"
              key={idx}
              onClick={e => {
                if (
                  e.target.tagName === "BUTTON" ||
                  e.target.tagName === "INPUT" ||
                  e.target.closest('.allAssignment-button')
                ) {
                  return;
                }
                this.handleAssignmentTitleClick(el);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="allAssignment-header">
                <FaRegFileCode className="allAssignment-icon"/>
                <span className="assignment-title">{el.title}</span>
              </div>
              <div className="allAssignment-info-row">
                <div className="allAssignment-info-text">
                  <span>
                      <span>Open:</span> {this.formatDateTime(el.open_at)}
                    </span>
                    <span>
                      <span>Due:</span> {this.formatDateTime(el.close_at)}
                    </span>
                </div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  ref={ref => isActive
                    ? this[`fileInputActive${idx}`] = ref
                    : this[`fileInputFinished${idx}`] = ref}
                  onChange={e => this.handleAssignmentFileDirectUpload(e, el)}
                />
                {isActive ? (
                  <Button
                    className="allAssignment-button"
                    onClick={e => {
                      e.stopPropagation();
                      this[`fileInputActive${idx}`].click();
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ position: "relative", top: "-1px" }}>Submit</span>
                    </span>
                  </Button>
                ) : (
                  <Button
                    className="allAssignment-button"
                    onClick={e => {
                      e.stopPropagation();
                      this[`fileInputFinished${idx}`].click();
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <span style={{ position: "relative", top: "-1px" }}>Review</span>
                    </span>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
        {isAssignmentModalOpen && selectedAssignment && (
          <Assignments
            open={isAssignmentModalOpen}
            onCancel={this.handleAssignmentModalClose}
            assignment={selectedAssignment}
            onAnswerSubmit={this.handleAssignmentFileDirectUpload}
            isActive={isAssignmentActive}
            formatDateTime={this.formatDateTime}
          />
        )}
      </div>
    );
  }
}

export default AllAssignments;