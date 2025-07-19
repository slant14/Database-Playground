import React from "react"
import './AddClassroom.css';
import { getProfiles, createClassroom } from '../../api';
import { Modal, Input, Typography, Select, Button, notification } from "antd";
import { getCookie } from '../../utils';

const { Title, Text } = Typography;
const { Option } = Select;

class AddClassroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      primaryInstructor: this.props.id,
      tas: [],
      students: [],
      users: [],
    }
  }

  async componentDidMount() {
    const draft = localStorage.getItem('addClassroomDraft');
    if (draft) {
      this.setState(JSON.parse(draft));
    }

    try {
      const users = await getProfiles();
      this.setState({ users });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  saveDraft = () => {
    localStorage.setItem('addClassroomDraft', JSON.stringify(this.state));
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.saveDraft);
  }

  handleTAsChange = value => {
    this.setState({ tas: value }, this.saveDraft);
  };

  handleStudentsChange = value => {
    this.setState({ students: value }, this.saveDraft);
  };

  async addClassroom() {
    const { title, description, tas, students, primaryInstructor } = this.state;

    // Convert all IDs to strings for comparison
    const primaryId = String(primaryInstructor);
    const taIds = tas.map(String);
    const studentIds = students.map(String);

    // Check for intersection
    if (
      taIds.includes(primaryId) ||
      studentIds.includes(primaryId) ||
      taIds.some(id => studentIds.includes(id))
    ) {
      notification.warning({
        message: 'Classroom creation failed',
        description: 'Primary Instructor, TAs, and Students must not overlap.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    if ( title === "") {
      notification.warning({
        message: 'Classroom creation failed',
        description: 'Please, specify Classroom name',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    } 
    if (description === "") {
      notification.warning({
        message: 'Classroom creation failed',
        description: 'Please, specify Classroom description',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    } 
    if (!tas || tas.length === 0) {
      notification.warning({
        message: 'Classroom creation failed',
        description: 'Please, specify at least 1 TA',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }
    const newClassroom = await createClassroom(title, description, tas, students, primaryInstructor);
    if (newClassroom && this.props.onClassroomCreated) {
      this.props.onClassroomCreated(newClassroom);
      localStorage.removeItem('addClassroomDraft');
    }
  };

  cancelAdding = () => {
    this.props.onClassroomCreated(null);
    localStorage.removeItem('addClassroomDraft')
  };

  render() {
    const { open, onCancel, currentUserName } = this.props;
    
    // Get the current user name from props or cookie as fallback
    const instructorName = currentUserName || getCookie("login") || "Current User";
    
    return (
      <Modal
        className="addClassroom-modal"
        open={open}
        onCancel={onCancel}
        footer={null}
        width={800}
      >
        <form ref={el => this.myForm = el}>
          <p>Classroom Title:</p>
          <Input
            name="title"
            placeholder="Title"
            className="classroomTitle"
            value={this.state.title}
            onChange={this.handleInputChange}
          />

          <p>Classroom Description:</p>
          <Input
            name="description"
            placeholder="Description"
            className="classroomDescription"
            value={this.state.description}
            onChange={this.handleInputChange}
          />

          <div className="primary-instructor-row">
            <label>Primary Instructor:</label>
            <Input
              value={instructorName}
              disabled
              style={{ 
                width: "100%",
                background: "#090f09", 
                color: "#51CB63", 
                border: "1px solid #51CB63",
                cursor: "not-allowed"
              }}
              className="primary-instructor-input"
              suffix={
                <Text style={{ color: '#51CB63', fontSize: '12px' }}>
                  ✓ You
                </Text>
              }
            />
          </div>
          
          <div className="tas-row">
            <label>Teacher Assistants:</label>
            <Select
              placeholder="Select teacher assistants"
              mode="multiple"
              style={{ width: "100%" }}
              value={this.state.tas}
              onChange={this.handleTAsChange}
              showSearch
              optionFilterProp="children"
            >
              {this.state.users.map(ta => (
                <Option key={ta.id} value={ta.id}>{ta.user_name}</Option>
              ))}
            </Select>
          </div>
          
          <div className="students-row">
            <label>Students:</label>
              <Select
              placeholder="Add students"
              mode="multiple"
              style={{ width: "100%" }}
              value={this.state.students}
              onChange={this.handleStudentsChange}
              showSearch
              optionFilterProp="children"
            >
              {this.state.users.map(student => (
                <Option key={student.id} value={student.id}>{student.user_name}</Option>
              ))}
            </Select>
          </div>

          <div className="add-button-wraper">
            <Button className="cancel-button"
              type="primary"
              onClick={() => this.cancelAdding()}
            >Cancel</Button>

            <Button className="add-button"
              type="primary"
              onClick={() => this.addClassroom()}
            >Add</Button>           
          </div>
        </form>
      </Modal>
    );
  }
}

export default AddClassroom;