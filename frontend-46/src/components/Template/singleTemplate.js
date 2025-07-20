import React from 'react';
import './Template.css';
import { Typography, Button, notification, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteTemplate } from '../../api';

class SingleTemplate extends React.Component {

  handleTemplateClick = () => {
    if (this.props.isLogin) {
      this.props.onTemplateClick(this.props.template.dump, this.props.template.type); // Передаем dump и db
      notification.success({
        message: 'Template Applied',
        description: 'Template has been successfully applied!',
        placement: 'bottomRight',
        duration: 4,
      });
    } else {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to use the template',
        placement: 'bottomRight',
        duration: 4
      });
    }
  }

  handleDeleteTemplate = async () => {
    if (!this.props.isLogin) {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to delete templates',
        placement: 'bottomRight',
        duration: 4
      });
      return;
    }

    try {
      await deleteTemplate(this.props.template.id);
      notification.success({
        message: 'Template Deleted',
        description: 'Template has been successfully deleted!',
        placement: 'bottomRight',
        duration: 4,
      });

      // Обновляем список шаблонов
      if (this.props.onTemplateDeleted) {
        this.props.onTemplateDeleted();
      }
    } catch (error) {
      notification.error({
        message: 'Delete Failed',
        description: 'Failed to delete template. Please try again.',
        placement: 'bottomRight',
        duration: 4,
      });
      console.error('Error deleting template:', error);
    }
  }

  render() {
    // Проверяем, что template передан
    if (!this.props.template) {
      return null;
    }

    // Проверяем, является ли это пользовательским шаблоном (имеет id)
    const isUserTemplate = this.props.template.id;

    let DB;

    switch (this.props.template.type) {
      case 'MSQL':
        DB = 'MySQL';
        break;
      case 'PSQL':
        DB = 'PostgreSQL';
        break;
      case 'SQLT':
        DB = 'SQLite';
        break;
      case 'MGDB':
        DB = 'MongoDB';
        break;
      case 'CHRM':
        DB = 'Chroma';
        break;
      default:
        DB = 'Unknown';
    }

    // Парсим имя и описание по знаку |
    const [title, description] = this.props.template.name.split('|').map(str => str.trim());
    return (
      <div className="single-template-container">
        <main>
          <Typography.Text className="single-template-title">{title}</Typography.Text> <br />
          {description && (
            <>
              <Typography.Text className="single-template-text">
                <span style={{ fontWeight: 500, color: '#51CB63' }}>Description:</span> <span>{description}</span>
              </Typography.Text>
              <br />
            </>
          )}
          <Typography.Text className="single-template-text">
            <span style={{ fontWeight: 500, color: '#51CB63' }}>Author:</span> {this.props.template.author} &nbsp;|&nbsp; <span style={{ fontWeight: 500, color: '#51CB63' }}>DB:</span> {DB}
          </Typography.Text>
        </main>
        <aside style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isUserTemplate && (
            <Popconfirm
              title="Delete Template"
              overlayStyle={{ color: '#fff' }}
              description="Are you sure you want to delete this template?"
              onConfirm={this.handleDeleteTemplate}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                size="small"
                className="delete-icon-button"
              />
            </Popconfirm>
          )}
          <Button className='my-orange-button-outline' style={{ height: '40px', fontSize: '18px' }} onClick={this.handleTemplateClick}>Use Template</Button>
        </aside>
      </div>
    );
  }
}

export default SingleTemplate;