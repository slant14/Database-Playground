import React from "react";
import { Button, Typography, Avatar, Card, Row, Col, Progress, notification } from "antd";
import { UserOutlined, EditOutlined, DatabaseOutlined, CodeOutlined, SearchOutlined } from "@ant-design/icons";
import { getMyProfile, editAvatar, getMyClassrooms, getTemplateList } from '../../api'
import EditModal from "./EditModal";
import { FaSave } from "react-icons/fa";
import { FaBook } from "react-icons/fa";

import "./Account.css";

const { Title, Text } = Typography;

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: true,
      classroomsCount: 0,
      templatesCount: 0,
    };
  }

  componentDidMount() {
    this.getProfile();
    this.getStatistics();
  }

  getProfile = () => {
    console.log("Account: getProfile called");
    getMyProfile()
      .then(data => {
        console.log("Account: Profile data received:", data);
        this.setState({ profile: data, loading: false });
      })
      .catch(error => {
        console.log("Account: Error getting profile", error);
        this.setState({ loading: false });
      })
  }

  getStatistics = () => {
    // Получаем количество классов (студент)
    getMyClassrooms()
      .then(data => {
        console.log("Account: Classrooms data received:", data);
        const studentClassrooms = data.student || [];
        this.setState({ classroomsCount: studentClassrooms.length });
      })
      .catch(error => {
        console.log("Account: Error getting classrooms", error);
        this.setState({ classroomsCount: 0 });
      });

    // Получаем количество шаблонов
    getTemplateList()
      .then(data => {
        console.log("Account: Templates data received:", data);
        const templatesArray = Array.isArray(data) ? data : [];
        this.setState({ templatesCount: templatesArray.length });
      })
      .catch(error => {
        console.log("Account: Error getting templates", error);
        this.setState({ templatesCount: 0 });
      });
  }

  handleEditClick = () => {
    console.log("Account: Edit button clicked, current profile:", this.state.profile);
    if (this.props.setEditModalOpen) {
      this.props.setEditModalOpen(true);
    }
  }

  handleEditModalClose = () => {
    console.log("Account: Edit modal closing");
    if (this.props.setEditModalOpen) {
      this.props.setEditModalOpen(false);
    }
  }

  handleProfileUpdate = () => {
    console.log("Account: Profile update requested");
    // Обновляем профиль после редактирования
    this.getProfile();
  }

  handleAvatarClick = () => {
    // Создаём скрытый input для выбора файла
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        this.handleAvatarUpload(file);
      }
    };
    input.click();
  }

  handleAvatarUpload = (file) => {
    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      notification.error({
        message: 'Invalid File Type',
        description: 'Please select an image file.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    console.log("Account: Uploading avatar file:", file.name);
    
    editAvatar(file)
      .then((response) => {
        console.log("Avatar updated successfully", response);
        notification.success({
          message: 'Avatar Updated',
          description: 'Your avatar has been updated successfully.',
          placement: 'bottomRight',
          duration: 2,
        });
        // Обновляем профиль для получения нового аватара
        this.getProfile();
      })
      .catch(error => {
        console.error('Error updating avatar:', error);
        notification.error({
          message: 'Error Updating Avatar',
          description: 'There was an error updating your avatar. Please try again.',
          placement: 'bottomRight',
          duration: 3,
        });
      });
  }

  getGpaMessage = (gpaValue) => {
    if (gpaValue === 5.0) {
      return { text: 'Happy Hacking!', color: '#51CB63' }; // Зеленый для идеального GPA
    } else if (gpaValue >= 4.0) {
      return { text: 'Great Job!', color: '#52c41a' }; // Светло-зеленый для отличного GPA
    } else if (gpaValue >= 3.0) {
      return { text: 'Keep up the good work!', color: '#fadb14' }; // Желтый для хорошего GPA
    } else if (gpaValue >= 2.0) {
      return { text: 'It\'s okay to make mistakes!', color: '#fa8c16' }; // Оранжевый для удовлетворительного GPA
    } else if (gpaValue >= 1) {
      return { text: 'See you on the retake!', color: '#ff7875' }; // Светло-красный для низкого GPA
    } else if (gpaValue < 1 && gpaValue !== 0) {
      return { text: 'Drop is coming!', color: '#ff4d4f' }; // Красный для очень низкого GPA
    } else {
      return { text: 'Try classes!', color: '#8c8c8c' }; // Темно-серый для отсутствия GPA
    }
  }

  render() {
    const { user } = this.props;
    const { profile, loading, classroomsCount, templatesCount } = this.state;

    // GPA значение от 0 до 5
    const gpaValue = profile?.gpa || 0; // Получаем значение GPA из профиля
    const gpaPercentage = (gpaValue / 5) * 100; // Конвертируем в проценты для Progress
    const gpaMessage = this.getGpaMessage(gpaValue); // Получаем сообщение и цвет для GPA

    return (
      <div className="account-page">
        {/* Хедер на едином фоне */}
        <div className="account-header">
          <div className="header-content">
            <Row align="middle" gutter={24}>
              <Col>
                <div className="avatar-container">
                  <Avatar 
                    size={120} 
                    icon={<UserOutlined />} 
                    className="user-avatar"
                    src={profile?.avatar}
                  />
                  <div className="avatar-edit-button" onClick={this.handleAvatarClick} style={{ cursor: 'pointer' }}>
                    <EditOutlined />
                  </div>
                </div>
              </Col>
              <Col flex="auto">
                <div className="user-info">
                  <Title level={1} className="user-name">
                    {profile?.user_name || user?.login || 'User'}
                  </Title>
                  <Text className="user-email">
                    {profile?.user_email || user?.email || 'user@example.com'}
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Основной контент */}
        <div className="account-content">
          <Row gutter={[24, 24]}>
            {/* Информация о пользователе - уменьшенный блок */}
            <Col span={10}>
              <Card className="info-card" title="User information" style={{ height: '100%' }} extra={<Button type="primary" icon={<EditOutlined />} className="my-orange-button-outline" onClick={this.handleEditClick} >Edit</Button>}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <div className="info-item">
                      <Text strong className="info-label">User login:</Text>
                      <Text className="info-value">{profile?.user_name || user?.login || 'N/A'}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text strong className="info-label">Email:</Text>
                      <Text className="info-value">{profile?.user_email || user?.email || 'N/A'}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text strong className="info-label">Registration date:</Text>
                      <Text className="info-value">{profile?.user_created_date ? new Date(profile.user_created_date).toLocaleDateString() : new Date().toLocaleDateString()}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text strong className="info-label">User ID:</Text>
                      <Text className="info-value">{profile?.id || 'N/A'}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text strong className="info-label">School:</Text>
                      <Text className="info-value">{profile?.school || 'Not specified'}</Text>
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className="info-item">
                      <Text strong className="info-label">Description:</Text>
                      <Text className="info-value">{profile?.description || 'Not specified'}</Text>
                    </div>
                  </Col>
                  
                </Row>
              </Card>
            </Col>

            {/* Расширенный блок статистики с диаграммой-датчиком */}
            <Col span={14}>
              <Card className="stats-card" title="GPA" style={{ height: '100%' }}>
                <div className="gauge-container" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text className="gauge-title">GPA</Text>
                  
                  {/* Круговая диаграмма GPA */}
                  <Progress
                    type="circle"
                    percent={gpaPercentage}
                    size={200}
                    strokeColor={{
                      '100%': gpaValue < 2.0 ? '#ff4d4f' : gpaValue < 3.0 ? '#fa8c16' : gpaValue < 4.0 ? '#fadb14' : '#51CB63',
                      '0%': gpaValue < 2.0 ? '#cf1322' : gpaValue < 3.0 ? '#d46b08' : gpaValue < 4.0 ? '#d4b106' : '#3a9547',
                    }}
                    trailColor="#30363d"
                    strokeWidth={12}
                    format={() => (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: gpaMessage.color, fontSize: '21px', fontWeight: 700, lineHeight: 1 }}>
                          {gpaValue.toFixed(1)}
                        </div>
                        <div style={{ color: '#a2aab3', fontSize: '14px', fontWeight: 400 }}>
                          / 5.0
                        </div>
                      </div>
                    )}
                  />
                  
                  <Text style={{ color: gpaMessage.color, fontSize: '32px', fontWeight: '500', textAlign: 'center', display: 'block', marginTop: '20px' }}>
                    {gpaMessage.text}
                  </Text>
                  
                  {/* Дополнительная статистика */}
                  <div style={{ 
                    marginTop: '30px', 
                    marginLeft: '5px',
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: '40px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <FaBook style={{ fontSize: '24px', color: gpaMessage.color, marginBottom: '4px', display: 'block', marginLeft: '13px' }} />
                      <div>
                        <Text className="info-value" style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>{classroomsCount}</Text>
                        <Text className="info-label-card" style={{ whiteSpace: 'nowrap' }}>Classes</Text>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <FaSave style={{ fontSize: '24px', color: gpaMessage.color, marginBottom: '4px', display: 'block', marginLeft: '23px' }} />
                      <div>
                        <Text className="info-value" style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>{templatesCount}</Text>
                        <Text className="info-label-card" style={{ whiteSpace: 'nowrap' }}>Templates</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        {/* Edit Modal */}
        <EditModal
          open={this.props.isEditModalOpen}
          onCancel={this.handleEditModalClose}
          profile={profile}
          onProfileUpdate={this.handleProfileUpdate}
        />
        {console.log("Account: Rendering EditModal with props:", { 
          open: this.props.isEditModalOpen, 
          profile: profile 
        })}
      </div>
    );
  }
}

export default Account;