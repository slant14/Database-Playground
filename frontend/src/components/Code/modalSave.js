import React from "react"
import { Modal, Typography, Input, Button, notification } from "antd";
import { TbPointFilled } from "react-icons/tb";
import { setTemplate } from "../../api";
import { getCookie } from "../../utils";

class SaveModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      templateName: "",
      templateAuthor: getCookie("login") || "",
      templateType: "PSQL",
    }
  }

  handleSave = () => {
    const { templateName, templateAuthor, templateType } = this.state;
    if (templateName.trim() === "") {
      return;
    }
    
    // Передаем также код SQL из пропсов
    setTemplate(templateName, templateAuthor, templateType)
      .then(() => {
        notification.success({
          message: 'Template saved',
          description: `Template "${templateName}" has been saved successfully`,
          placement: 'bottomRight',
          duration: 2,
        });
        this.props.onCancel();
      })
      .catch(error => {
        console.error('Error saving template:', error);
        notification.error({
          message: 'Error saving template',
          description: 'There was an error saving your template. Please try again.',
          placement: 'bottomRight',
          duration: 3,
        });
        this.props.onCancel();
      });
  }

  render() {
    return (
      <Modal
        title={this.props.title}
        open={this.props.open}
        onCancel={this.props.onCancel}
        footer={null}
        width={this.props.width || 520}
        centered
        destroyOnClose
        className="my-modal"
      >
        <div > 
            <Typography.Text className='modal-text'> <TbPointFilled style={{position: 'relative', top: '2px'}}/> Save your current database schema as a <Typography.Text className='modal-text' style={{color: '#51CB63'}}>template</Typography.Text></Typography.Text><br/>
            <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                <Typography.Text className='modal-text' > This will save your current database state so you can reuse it later or share with others.</Typography.Text>
            </div>
            
            <div style={{marginTop: '20px'}}>
              <Typography.Text className='modal-text' style={{display: 'block', marginBottom: '8px'}}>Template Name <Typography.Text style={{color: 'red'}}>*</Typography.Text></Typography.Text>
              <Input 
                placeholder="Enter template name"
                value={this.state.templateName}
                onChange={(e) => this.setState({ templateName: e.target.value })}
                style={{marginBottom: '16px'}}
              />
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
              <Button onClick={this.props.onCancel}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                onClick={this.handleSave}
                disabled={this.state.templateName.trim() === ""}
              >
                Save Template
              </Button>
            </div>
        </div>
        
      </Modal>
    )
  }
}

export default SaveModal
