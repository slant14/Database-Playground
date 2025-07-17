import React from "react"
import './CreateAssignment.css';
import dayjs from "dayjs";
//import { getProfiles, createClassroom } from '../../api';
import { Modal, Input, Typography, Select, DatePicker, Button, notification } from "antd";

const { Option } = Select;

class CreateAssignment extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      openAt: null,
      closeAt: null,
      authors: [],
      users: [],
    }
  }

  /*
  async componentDidMount() {
    const draft = localStorage.getItem('createArticleDraft');
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
    localStorage.setItem('createArticleDraft', JSON.stringify(this.state));
  }
    */
  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.saveDraft);
  }

  handleAuthorssChange = value => {
    this.setState({ authors: value }, this.saveDraft);
  };

  /*
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
    */

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
        
          <div className="tas-row">
            <label>Authors:</label>
            <Select
              placeholder="Select teacher assistants"
              mode="multiple"
              style={{ width: "100%" }}
              value={this.state.authors}
              onChange={this.handleAuthorsChange}
              showSearch
              optionFilterProp="children"
            >
              {this.state.users.map(author => (
                <Option key={author.id} value={author.id}>{author.user_name}</Option>
              ))}
            </Select>
          </div>
        
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
              onClick={() => this.addClassroom()}
            >Add</Button>           
          </div>
        </form>
      </Modal>
    );
  }
}

export default CreateAssignment;