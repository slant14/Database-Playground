import React from "react"
import './CreateArticle.css';
import { getProfiles, createArticle } from "../../../../api";
import { Modal, Input, Select, Button, notification } from "antd";

const { Option } = Select;

class CreateArticle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      description: "",
      authors: [],
      users: [],
    }
  }

  async componentDidMount() {
    const draft = localStorage.getItem('createArticleDraft');
    if (draft) {
      this.setState(JSON.parse(draft));
    }

    try {
      const allUsers = await getProfiles();
      const filteredUsers = allUsers.filter(user => 
         user.user_name !== 'admin'
      );
      this.setState({ users: filteredUsers });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }

  saveDraft = () => {
    localStorage.setItem('createArticleDraft', JSON.stringify(this.state));
  }

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.saveDraft);
  }

  handleAuthorsChange = value => {
    this.setState({ authors: value }, this.saveDraft);
  };

  async addArticle() {
    const { title, description, authors } = this.state;
    console.log({ title, description, authors });
    if ( title === "") {
      notification.warning({
        message: 'Article creation failed',
        description: 'Please, specify Article name',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    } 
    if (description === "") {
      notification.warning({
        message: 'Article creation failed',
        description: 'Please, specify Article description',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    } 
    if (!authors || authors.length === 0) {
      notification.warning({
        message: 'Article creation failed',
        description: 'Please, specify at least one Author',
        placement: 'bottomRight',
        duration: 3,
      });
      return;
    }
    
    try {
      const newArticle = await createArticle(title, authors, description, this.props.classroomID);
      if (newArticle && this.props.onArticleCreated) {
        notification.success({
          message: 'Article created successfully',
          description: `Article "${title}" has been created`,
          placement: 'bottomRight',
          duration: 3,
        });
        this.props.onArticleCreated();
        localStorage.removeItem('createArticleDraft');
      }
    } catch (error) {
      notification.error({
        message: 'Article creation failed',
        description: error.message || 'Failed to create article. Please try again',
        placement: 'bottomRight',
        duration: 4,
      });
    }
  }

  cancelAdding = () => {
    this.props.onArticleClose();
    localStorage.removeItem('createArticleDraft')
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
        <form 
          ref={el => this.myForm = el}
          onSubmit={e => { e.preventDefault(); this.addArticle(); }}
        >
          <p>Article Title:</p>
          <Input
            name="title"
            placeholder="Title"
            className="classroomTitle"
            value={this.state.title}
            onChange={this.handleInputChange}
          />

          <p>Article Description:</p>
          <Input.TextArea
            name="description"
            placeholder="Description"
            className="classroomDescription"
            value={this.state.description}
            onChange={this.handleInputChange}
            rows={4}
          />

          <div className="tas-row">
            <label>Authors:</label>
            <Select
              placeholder="Select uathors"
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


          <div className="add-button-wraper">
            <Button className="cancel-button"
              type="primary"
              onClick={() => this.cancelAdding()}
            >Cancel</Button>
                    
            <Button className="add-button"
              type="primary"
              onClick={() => this.addArticle()}
            >Add</Button>           
          </div>
        </form>
      </Modal>
    );
  }
}

export default CreateArticle;