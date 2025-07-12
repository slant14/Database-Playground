import React from 'react';
import './Template.css';
import { Typography, Button, notification, Popconfirm } from 'antd';
import { deleteTemplate } from '../../api';

class SingleTemplate extends React.Component {
  
  handleTemplateClick = () => {
    if (this.props.isLogin) {
      this.props.onTemplateClick(this.props.template.dump);
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
    
    return (
    <div className="single-template-container">
        <main>
            <Typography.Text className="single-template-title">{this.props.template.name}</Typography.Text> <br/>
            <Typography.Text className="single-template-text">{this.props.template.author} | {this.props.template.type}</Typography.Text>
        </main>
        <aside>
            <Button className='my-orange-button-outline' style={{height: '40px', fontSize: '18px', marginRight: '10px' }} onClick={this.handleTemplateClick}>Use Template</Button>
            {isUserTemplate && (
              <Popconfirm
                title="Delete Template"
                description="Are you sure you want to delete this template?"
                onConfirm={this.handleDeleteTemplate}
                okText="Yes"
                cancelText="No"
              >
                <Button danger style={{height: '40px', fontSize: '18px' }}>Delete</Button>
              </Popconfirm>
            )}
        </aside>
    </div>
    );
  }
}

export default SingleTemplate;