import React from "react"
import './AddClassroom.css';
import { getProfiles, createClassroom } from '../../api';
import { Modal, Input, Typography, Select, Button, notification } from "antd";

const { Title } = Typography;
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
  }

  render() {
    const { open, onCancel, currentUserName } = this.props;
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
            <Select
              disabled
              value={currentUserName}
              style={{ width: "100%", marginTop: "10px" }}
              className="primary-instructor-select"
            >
              <Option value={currentUserName}>{currentUserName}</Option>
            </Select>
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