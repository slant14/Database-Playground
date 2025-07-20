import React from "react"
import { Modal, Typography, Input, Button, notification } from "antd";
import { TbPointFilled } from "react-icons/tb";
import { setTemplate, getMyProfile } from "../../api";

class SaveModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      templateName: "",
      templateDescription: "",
      templateAuthor: "",
    }
  }



  handleSave = () => {
    const { templateAuthor, templateName, templateDescription } = this.state;
    if (templateName.trim() === "" || templateDescription.trim() === "") {
      notification.warning({
        message: 'Fields Required',
        description: 'Please fill in both the name and description fields.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }
    if (templateName.includes('|') || templateDescription.includes('|')) {
      notification.warning({
        message: 'Invalid Character',
        description: 'Symbol "|" is not allowed in name or description.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }
    if (templateName.length > 30) {
      notification.warning({
        message: 'Name Too Long',
        description: 'Template name must be no more than 30 characters.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }
    if (templateDescription.length > 100) {
      notification.warning({
        message: 'Description Too Long',
        description: 'Template description must be no more than 100 characters.',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }

    const combinedName = `${templateName.trim()} | ${templateDescription.trim()}`;
    let templateType;
    if (localStorage.getItem("selectedDB") === "PostgreSQL") {
      templateType = "PSQL";
    } else if (localStorage.getItem("selectedDB") === "Chroma") {
      templateType = "CHRM";
    } else {
      templateType = "MGDB";
    }
    getMyProfile()
      .then(profile => {
        const author = profile?.user_name || 'N/A';
        this.setState({ templateAuthor: author });
        console.log("Saving template with data:", { combinedName, author, templateType });
        setTemplate(combinedName, author, templateType)
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
      })
      .catch(error => {
        console.error("Error fetching profile:", error);
        this.setState({ templateAuthor: "Unknown Author" });
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
          <Typography.Text className='modal-text'> <TbPointFilled style={{ position: 'relative', top: '2px' }} /> Save your current database schema as a <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>template</Typography.Text></Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '20px' }}>
            <Typography.Text className='modal-text' > This will save your current database state so you can reuse it later.</Typography.Text>
          </div>

          <div style={{}}>
            <Typography.Text className='modal-text' style={{ display: 'block' }}>Template Name (no more than 30 symbols)</Typography.Text>
            <Input
              placeholder="Enter template name"
              className="login"
              onChange={(e) => this.setState({ templateName: e.target.value })}
              style={{}}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <Typography.Text className='modal-text' style={{ display: 'block' }}>Template Description (No more than 100 symbols)</Typography.Text>
            <Input
              placeholder="Enter template description"
              className="login"
              onChange={(e) => this.setState({ templateDescription: e.target.value })}
              style={{}}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
            <Button onClick={
              this.props.onCancel

            } className="my-orange-button-outline">
              Cancel
            </Button>
            <Button
              type="primary"
              className="my-orange-button-solid"
              onClick={this.handleSave}
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
