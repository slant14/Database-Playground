import React from "react"
import './AddClassroom.css';
import { getProfiles, createClassroom, getMyProfile } from '../../api';
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
      primaryInstructor: this.props.currentUserName,
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
      console.log('Fetching current user profile...');
      const myProfile = await getMyProfile();
      console.log('Current user profile received:', myProfile);
      console.log('Profile ID:', myProfile?.id);
      console.log('Profile structure:', Object.keys(myProfile || {}));
      
      const allUsers = await getProfiles();
      
      // Filter out admin users from dropdown options
      const filteredUsers = allUsers.filter(user => 
        user.user_name !== 'admin'
      );
      
      // Set the primary instructor ID - check different possible field names
      const instructorId = myProfile?.id || myProfile?.user_id || myProfile?.pk || myProfile?.user?.id;

      this.setState({ 
        users: filteredUsers, // Use filtered users without admins
        primaryInstructor: instructorId // Set current user as primary instructor
      });
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

    const primaryId = String(primaryInstructor);
    const taIds = tas.map(String);
    const studentIds = students.map(String);

    console.log('Primary Instructor Id:', primaryId);
    for (const ta of taIds) {
      console.log("TA IDS", ta)
    }
    for (const ta of studentIds) {
      console.log("TA IDS", ta)
    }
    const allRoles = [];
    
    if (primaryId) {
      allRoles.push({ id: primaryId, role: 'Primary Instructor' });
    }
    
    for (const id of taIds) {
      if (allRoles.some(r => r.id === id)) {
        const existingRole = allRoles.find(r => r.id === id).role;
        console.log(`Role intersection detected: User ${id} already has role ${existingRole}`);
        notification.warning({
          message: 'Cannot create classroom',
          description: `A user cannot have multiple roles. This user is already assigned as ${existingRole}`,
          placement: 'bottomRight',
          duration: 4,
        });
        return;
      }
      allRoles.push({ id, role: 'TA' });
    }
    
    for (const id of studentIds) {
      if (allRoles.some(r => r.id === id)) {
        const existingRole = allRoles.find(r => r.id === id).role;
        console.log(`Role intersection detected: User ${id} already has role ${existingRole}`);
        notification.warning({
          message: 'Cannot create classroom',
          description: `A user cannot have multiple roles. This user is already assigned as ${existingRole}`,
          placement: 'bottomRight',
          duration: 4,
        });
        return;
      }
      allRoles.push({ id, role: 'Student' });
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
    
    try {
      const newClassroom = await createClassroom(title, description, tas, students, primaryInstructor);
      if (newClassroom && this.props.onClassroomCreated) {
        notification.success({
          message: 'Classroom created successfully',
          description: `Classroom "${title}" has been created`,
          placement: 'bottomRight',
          duration: 3,
        });
        this.props.onClassroomCreated(newClassroom);
        localStorage.removeItem('addClassroomDraft');
      }
    } catch (error) {
      notification.error({
        message: 'Classroom creation failed',
        description: error.message || 'Failed to create classroom. Please try again',
        placement: 'bottomRight',
        duration: 4,
      });
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
          <Input.TextArea
            name="description"
            placeholder="Description"
            className="classroomDescription"
            value={this.state.description}
            onChange={this.handleInputChange}
            rows={4}
          />

          <div className="primary-instructor-row">
            <label>Primary Instructor:</label>
            <Input
              value={instructorName}
              disabled
              style={{ 
                width: "100%", 
                marginTop: "10px", 
                background: "#191d1a", 
                color: "#a2aab3", 
                border: "1px solid #a2aab3" }}
              className="primary-instructor-input"
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