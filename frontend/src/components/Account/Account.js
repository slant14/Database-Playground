import React from "react";
import { Button, Typography, Avatar, Card, Row, Col, Progress } from "antd";
import { UserOutlined, EditOutlined, DatabaseOutlined, CodeOutlined, SearchOutlined } from "@ant-design/icons";
import { getMyProfile } from '../../api'
import { MdAssignment } from "react-icons/md";

import "./Account.css";

const { Title, Text } = Typography;

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: null,
      loading: true
    };
  }

  componentDidMount() {
    this.getProfile();
  }

  getProfile = () => {
    getMyProfile()
      .then(data => {
        console.log("Profile data:", data);
        this.setState({ profile: data, loading: false });
      })
      .catch(error => {
        console.log("Error getting profile", error);
        this.setState({ loading: false });
      })
  }

  render() {
    const { user } = this.props;
    const { profile, loading } = this.state;

    // GPA значение от 0 до 5
    const gpaValue = 4.5; // Пример значения GPA
    const gpaPercentage = (gpaValue / 5) * 100; // Конвертируем в проценты для Progress

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
                  <div className="avatar-edit-button">
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
              <Card className="info-card" title="User information" style={{ height: '100%' }} extra={<Button type="primary" icon={<EditOutlined />} className="my-orange-button-outline" onClick={() => {/* добавить вашу логику редактирования профиля */}} >Edit</Button>}>
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
                  <Col span={24} style={{ marginTop: '20px' }}>
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '15px',
                      backgroundColor: 'transparent !important',
                      borderRadius: '8px',
                      
                    }}>
                      <Text style={{ 
                        color: '#fff', 
                        fontSize: '18px', 
                        fontWeight: 600,
                        fontFamily: 'Noto Sans, sans-serif'
                      }}>
                        Happy Hacking, <Text style={{ 
                        color: '#51CB63', 
                        fontSize: '18px', 
                        fontWeight: 600,
                        fontFamily: 'Noto Sans, sans-serif'
                      }}>{profile?.user_name || user?.login || 'User'}</Text>!
                      </Text>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Расширенный блок статистики с диаграммой-датчиком */}
            <Col span={14}>
              <Card className="stats-card" title="GPA" style={{ height: '100%' }}>
                <div className="gauge-container">
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
                        <div style={{ color: '#51CB63', fontSize: '32px', fontWeight: 700, lineHeight: 1 }}>
                          {gpaValue.toFixed(1)}
                        </div>
                        <div style={{ color: '#a2aab3', fontSize: '14px', fontWeight: 400 }}>
                          / 5.0
                        </div>
                      </div>
                    )}
                  />
                  
                  <Text className="gauge-value">
                    {gpaValue >= 4.0 ? 'Great Job!' : 
                     gpaValue >= 3.0 ? 'Keep up the good work!' : 
                     gpaValue >= 2.0 ? 'It\'s okay to make mistakes!' : 
                     'Нужно подтянуть учебу'}
                  </Text>
                  
                  {/* Дополнительная статистика */}
                  <div style={{ 
                    marginTop: '30px', 
                    marginRight: '30px',
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center',
                    gap: '30px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <DatabaseOutlined style={{ fontSize: '24px', color: '#51CB63', marginBottom: '4px', display: 'block' }} />
                      <div>
                        <Text className="info-value" style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>142</Text>
                        <Text className="info-label" style={{ whiteSpace: 'nowrap' }}>Queries</Text>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <CodeOutlined style={{ fontSize: '24px', color: '#51CB63', marginBottom: '4px', display: 'block' }} />
                      <div>
                        <Text className="info-value" style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>28</Text>
                        <Text className="info-label" style={{ whiteSpace: 'nowrap' }}>Templates</Text>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <MdAssignment style={{ fontSize: '24px', color: '#51CB63', marginBottom: '4px', display: 'block', marginLeft: '4px' }} />
                      <div>
                        <Text className="info-value" style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}>15</Text>
                        <Text className="info-label" style={{ whiteSpace: 'nowrap' }}>H/W</Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Account;