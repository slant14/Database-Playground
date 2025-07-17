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
      author: "",
      users: [],
    }
  }

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

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.saveDraft);
  }

  handleAuthorChange = value => {
    this.setState({ author: value }, this.saveDraft);
  };

  async addArticle() {
    const { title, description, author } = this.state;
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
    const newArticle = await createArticle(title, description, author, this.props.classroomID);
    if (newArticle && this.props.onArticleCreated) {
      this.props.onArticleCreated();
      localStorage.removeItem('createArticleDraft');
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
            <label>Author:</label>
            <Select
              placeholder="Select author"
              style={{ width: "100%" }}
              value={this.state.author}
              onChange={this.handleAuthorChange}
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