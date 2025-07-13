import React from "react"
import './AddClassroom.css';
import { getProfiles, createClassroom } from '../../api';
import { Modal, Input, Typography, Select, Button } from "antd";

const { Title } = Typography;
const { Option } = Select;

class AddClassroom extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      primaryInstructor: props.currentUser || null,
      tas: [],
      students: [],
      users: [],
      
    }
  }

  async componentDidMount() {
      try {
        const users = await getProfiles();
        this.setState({ users });
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    }
  
  async addClassroom() {
    const { title, description, tas, students, primaryInstructor} = this.state;
    const newClassroom = await createClassroom(title, description, tas, students, primaryInstructor);
    if (newClassroom && this.props.onClassroomCreated) {
      this.props.onClassroomCreated(newClassroom);
    }
  }

  handlePrimaryInstructorChange = value => {
    this.setState({ primaryInstructor: value });
  };
  /*
  handleAutoSelectMe = () => {
    this.setState({ primaryInstructor: this.props.currentUser });
  };
  */  
  handleTAsChange = value => {
    this.setState({ tas: value });
  };

  handleStudentsChange = value => {
    this.setState({ students: value });
  };

  render() {
    const { open, onCancel} = this.props;
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
            placeholder="Title"
            className="classroomTitle"
            value={this.state.title}
            onChange={e => this.setState({ title: e.target.value })}
          />

          <p>Classroom Description:</p>
          <Input
            placeholder="Description"
            className="classroomDescription"
            value={this.state.description}
            onChange={e => this.setState({ description: e.target.value })}
          />

          <p>Primary Instructor:</p>
          <Select
            placeholder="Select primary instructor"
            style={{ width: "100%" }}
            value={this.state.primaryInstructor}
            onChange={this.handlePrimaryInstructorChange}
          >
            {this.state.users.map(instr => (
              <Option key={instr.id} value={instr.id}>{instr.user_name}</Option>
            ))}
          </Select>
          {/*
          <Button style={{ marginTop: 8 }} onClick={this.handleAutoSelectMe} type="link">
            Auto-select myself
          </Button>
            */}
          <p>Teacher Assistants:</p>
          <Select
            placeholder="Select teaching assistants"
            mode="multiple"
            style={{ width: "100%" }}
            value={this.state.tas}
            onChange={this.handleTAsChange}
          >
            {this.state.users.map(ta => (
              <Option key={ta.id} value={ta.id}>{ta.user_name}</Option>
            ))}
          </Select>

          <p>Students:</p>
          <Select
            placeholder="Add students"
            mode="multiple"
            style={{ width: "100%" }}
            value={this.state.students}
            onChange={this.handleStudentsChange}
          >
            {this.state.users.map(student => (
              <Option key={student.id} value={student.id}>{student.user_name}</Option>
            ))}
          </Select>

          <Button className="add-button"
            type="primary" 
            onClick={() => {
              this.addClassroom()
            }}>Add</Button>  
            
        </form>
      </Modal>
    );
  }
}

export default AddClassroom;