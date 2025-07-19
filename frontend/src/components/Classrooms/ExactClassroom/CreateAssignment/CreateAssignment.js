import React from "react"
import './CreateAssignment.css';
import dayjs from "dayjs";
import { Modal, Input, Select, DatePicker, Button, notification } from "antd";
import { getProfiles, createAssignment } from "../../../../api";

const { Option } = Select;

/*
docker exec -it backend-db psql -U dbpg  -d backend_db

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

*/

class CreateAssignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      openAt: null,
      closeAt: null,
      users: [],
    }
  }

  async componentDidMount() {
    const draft = localStorage.getItem('createAssignmentDraft');
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
    localStorage.setItem('createAssignmentDraft', JSON.stringify(this.state));
  }
    
    
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.saveDraft);
  }

  async addAssignment() {
    const { title, description, openAt, closeAt } = this.state;
    if (title === "") {
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
    const newAssignment = await createAssignment(
      title, description, openAt, closeAt, this.props.classroomID
    );
    if (newAssignment && this.props.onAssignmentCreated) {
      this.props.onAssignmentCreated();
      localStorage.removeItem('createAssignmentDraft');
    }
  }

  cancelAdding = () => {
    this.props.onAssignmentClose();
    localStorage.removeItem('createAssignmentDraft')
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
          <p>Assignment Title:</p>
          <Input
            name="title"
            placeholder="Title"
            className="classroomTitle"
            value={this.state.title}
            onChange={this.handleInputChange}
          />
        
          <p>Assignment Description:</p>
          <Input
            name="description"
            placeholder="Description"
            className="classroomDescription"
            value={this.state.description}
            onChange={this.handleInputChange}
          />
        
          <div style={{ marginBottom: "10px" }}>
            <label>Open Date & Time:</label>
            <DatePicker
              showTime
              style={{ width: "100%", marginTop: "10px" }}
              className="classroomDatePicker"
              value={this.state.openAt ? dayjs(this.state.openAt) : null}
              onChange={(_, dateString) => this.setState({ openAt: dateString })}
            />
          </div>
        
          <div style={{ marginBottom: "10px" }}>
            <label>Close Date & Time:</label>
            <DatePicker
              showTime
              style={{ width: "100%", marginTop: "10px" }}
              className="classroomDatePicker"
              value={this.state.closeAt ? dayjs(this.state.closeAt) : null}
              onChange={(_, dateString) => this.setState({ closeAt: dateString })}
            />
          </div>
        
          <div className="add-button-wraper">
            <Button className="cancel-button"
              type="primary"
              onClick={() => this.cancelAdding()}
            >Cancel</Button>
          
            <Button className="add-button"
              type="primary"
              onClick={() => this.addAssignment()}
            >Add</Button>           
          </div>
        </form>
      </Modal>
    );
  }
}

export default CreateAssignment;