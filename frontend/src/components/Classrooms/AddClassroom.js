import React from "react"
import './AddClassroom.css';
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

      primaryInstructorsList: [
        {
            id: 1,
            name: "Anna"
        },
        {
            id: 2,
            name: "Anastasia"
        },
        {
            id: 3,
            name: "Kristina"
        }
      ],
      tasList: [],
      studentsList: [],
      
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
            {this.state.primaryInstructorsList.map(instr => (
              <Option key={instr.id} value={instr.id}>{instr.name}</Option>
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
            {this.state.tasList.map(ta => (
              <Option key={ta.id} value={ta.id}>{ta.name}</Option>
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
            {this.state.studentsList.map(student => (
              <Option key={student.id} value={student.id}>{student.name}</Option>
            ))}
          </Select>

          {/*
          <Button type="primary" 
            onClick={async () => {
                if (this.state.title === "" || this.state.description === "" || this.state.primaryInstructor == [] || this.state.tas == []) {
                  notification.warning({
                    message: 'Incomplete data',
                    description: 'Please fill in all fields',
                    placement: 'bottomRight',
                    duration: 4
                  });
                } else {
                  const data = await addClassroom(this.state.title, this.state.description, this.state.primaryInstructor, this.state.tas, this.state.students);
                  if (data.error) {
                    switch (data.error) {
                      case "406":
                        notification.error({
                          message: 'Login failed',
                          description: 'User not found',
                          placement: 'bottomRight',
                          duration: 4,
                        });
                        break;
                      default:
                        notification.error({
                          message: 'Login failed',
                          description: 'An unexpected error occurred',
                          placement: 'bottomRight',
                          duration: 4,
                        });
                    }
                  } else {
                    this.props.logIn(this.state.login, this.state.password, this.state.needMemorizing, data.access, data.refresh)
                    notification.success({
                      message: 'Login successful',
                      description: 'Welcome to the system!',
                      placement: 'bottomRight',
                      duration: 4,
                    });
                    this.props.onCancel()
                    this.setState({
                      login: "",
                      password: "",
                      needMemorizing: false,
                    })
                  }
                }
              }}>
            Add
          </Button>  
            */}
        </form>
      </Modal>
    );
  }
}

export default AddClassroom;