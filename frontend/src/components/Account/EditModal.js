import React from "react"
import { Modal, Typography, Input, Button, notification } from "antd";
import { TbPointFilled } from "react-icons/tb";
import { editInfo } from "../../api";

class EditModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: "",
      email: "",
      school: "",
      description: "",
    }
  }

  componentDidMount() {
    console.log("EditModal componentDidMount, profile:", this.props.profile);
    // Заполняем поля текущими данными профиля
    if (this.props.profile) {
      this.setState({
        name: this.props.profile.user_name || "",
        email: this.props.profile.user_email || "",
        school: this.props.profile.school || "",
        description: this.props.profile.description || "",
      });
      console.log("EditModal state updated in componentDidMount:", {
        name: this.props.profile.user_name || "",
        email: this.props.profile.user_email || "",
        school: this.props.profile.school || "",
        description: this.props.profile.description || "",
      });
    }
  }

  componentDidUpdate(prevProps) {
    console.log("EditModal componentDidUpdate", {
      prevProfile: prevProps.profile,
      currentProfile: this.props.profile,
      prevOpen: prevProps.open,
      currentOpen: this.props.open
    });
    
    // Обновляем данные если модалка открылась и есть профиль
    if (!prevProps.open && this.props.open && this.props.profile) {
      console.log("Modal opened, setting initial state from profile");
      this.setState({
        name: this.props.profile.user_name || "",
        email: this.props.profile.user_email || "",
        school: this.props.profile.school || "",
        description: this.props.profile.description || "",
      });
    }
    
    // Обновляем данные если профиль изменился и модалка закрыта
    if (prevProps.profile !== this.props.profile && this.props.profile && !this.props.open) {
      console.log("Profile changed while modal closed, updating state");
      this.setState({
        name: this.props.profile.user_name || "",
        email: this.props.profile.user_email || "",
        school: this.props.profile.school || "",
        description: this.props.profile.description || "",
      });
    }
    
    // Обновляем данные при открытии модального окна (если профиль уже есть)
    if (!prevProps.open && this.props.open && this.props.profile) {
      console.log("Modal opened, updating state with profile data");
      this.setState({
        name: this.props.profile.user_name || "",
        email: this.props.profile.user_email || "",
        school: this.props.profile.school || "",
        description: this.props.profile.description || "",
      });
    }
  }

  handleSave = () => {
    const { name, email, school, description } = this.state;
    
    console.log("EditModal handleSave called with:", { name, email, school, description });
    
    if (name.trim() === "") {
      console.log("Validation failed: name is empty");
      notification.warning({
        message: 'Name Required',
        description: 'Please enter your name.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    if (email.trim() === "") {
      notification.warning({
        message: 'Email Required',
        description: 'Please enter your email.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    // Проверка валидности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notification.warning({
        message: 'Invalid Email',
        description: 'Please enter a valid email address.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    if (name.length > 50) {
      notification.warning({
        message: 'Name Too Long',
        description: 'Name must be no more than 50 characters.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    if (school && school.length > 50) {
      notification.warning({
        message: 'School Name Too Long',
        description: 'School name must be no more than 50 characters.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    if (description && description.length > 100) {
      notification.warning({
        message: 'Description Too Long',
        description: 'Description must be no more than 100 characters.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    // Обновляем информацию профиля
    console.log("Calling editInfo API with:", { name: name.trim(), email: email.trim(), school: school.trim(), description: description.trim() });
    editInfo(name.trim(), email.trim(), school.trim() || null, description.trim() || null)
      .then((response) => {
        console.log("Profile updated successfully", response);
        notification.success({
          message: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
          placement: 'bottomRight',
          duration: 2,
        });
        // Обновляем профиль в родительском компоненте
        if (this.props.onProfileUpdate) {
          console.log("Calling onProfileUpdate");
          this.props.onProfileUpdate();
        }
        this.props.onCancel();
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        
        // Проверяем, если ошибка 302 (дубликат)
        if (error.error === "302") {
          notification.error({
            message: 'Duplicate Data',
            description: 'A user with this name or email already exists. Please choose different values.',
            placement: 'bottomRight',
            duration: 4,
          });
          // НЕ закрываем модалку при ошибке 302
          return;
        }
        
        // Для всех остальных ошибок
        notification.error({
          message: 'Error Updating Profile',
          description: 'There was an error updating your profile. Please try again.',
          placement: 'bottomRight',
          duration: 3,
        });
      });
  }

  render() {
    const { name, email, school, description } = this.state;
    
    console.log("EditModal render, current state:", { name, email, school, description });
    console.log("EditModal render, props:", { profile: this.props.profile, open: this.props.open });

    return (
      <Modal
        title="Edit Profile"
        open={this.props.open}
        onCancel={this.props.onCancel}
        footer={null}
        width={520}
        centered
        destroyOnClose
        className="my-modal"
      >
        <div>
          <Typography.Text className='modal-text'>
            <TbPointFilled style={{ position: 'relative', top: '2px' }} /> 
            Edit your <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>profile information</Typography.Text>
          </Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Typography.Text className='modal-text'>
              Update your personal information.
            </Typography.Text>
          </div>

          {/* Name Field */}
          <div style={{ marginBottom: '15px' }}>
            <Typography.Text className='modal-text' style={{ display: 'block' }}>
              Name (required, no more than 50 characters)
            </Typography.Text>
            <Input
              placeholder="Enter your name"
              className="login"
              value={name}
              onChange={(e) => this.setState({ name: e.target.value })}
            />
          </div>

          {/* Email Field */}
          <div style={{ marginBottom: '15px' }}>
            <Typography.Text className='modal-text' style={{ display: 'block' }}>
              Email (required)
            </Typography.Text>
            <Input
              placeholder="Enter your email"
              className="login"
              type="email"
              value={email}
              onChange={(e) => this.setState({ email: e.target.value })}
            />
          </div>

          {/* School Field */}
          <div style={{ marginBottom: '15px' }}>
            <Typography.Text className='modal-text' style={{ display: 'block' }}>
              School (optional, no more than 100 characters)
            </Typography.Text>
            <Input
              placeholder="Enter your school"
              className="login"
              value={school}
              onChange={(e) => this.setState({ school: e.target.value })}
            />
          </div>

          {/* Description Field */}
          <div style={{ marginBottom: '20px' }}>
            <Typography.Text className='modal-text' style={{ display: 'block' }}>
              Description (optional, no more than 100 characters)
            </Typography.Text>
            <Input.TextArea
              placeholder="Tell us about yourself..."
              className="login"
              value={description}
              onChange={(e) => this.setState({ description: e.target.value })}
              rows={4}
              showCount
              maxLength={100}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
            <Button 
              onClick={this.props.onCancel} 
              className="my-orange-button-outline"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              className="my-orange-button-solid"
              onClick={this.handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    )
  }
}

export default EditModal
