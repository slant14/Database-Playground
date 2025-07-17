// ...existing imports...
import React from 'react';
import './Template.css';
import { Typography, Button, notification } from 'antd';
import { getTemplateList } from '../../api'
import { setTemplate } from '../../api';
import SingleTemplate from './singleTemplate';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      predefined_template: [
        {
          name: "Book Library | Manages a collection of books, including title, author, genre, publication year, ISBN, and availability status.",
          author: "DPP",
          type: "PSQL",
          dump: "CREATE TABLE books (book_id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, author VARCHAR(100) NOT NULL, genre VARCHAR(50), publication_year INT, isbn VARCHAR(20) UNIQUE, status VARCHAR(20) DEFAULT 'available', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO books (title, author, genre, publication_year, isbn, status) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925, '9780743273565', 'available'), ('To Kill a Mockingbird', 'Harper Lee', 'Classic', 1960, '9780061120084', 'checked_out'), ('1984', 'George Orwell', 'Dystopian', 1949, '9780451524935', 'available'), ('Pride and Prejudice', 'Jane Austen', 'Romance', 1813, '9780141439518', 'available'), ('Moby-Dick', 'Herman Melville', 'Adventure', 1851, '9780142437247', 'available');"
        },
        {
          name: "Guide Collection | Stores guides with title, author, year, and tags.",
          author: "DPP",
          type: "MGDB",
          dump: `{
  "db": {
    "books": [
      {
        "_id": {
          "$oid": "68785d0c387dd8e340e53628"
        },
        "title": "Clean Code",
        "author": "Robert C. Martin",
        "year": 2008,
        "tags": [
          "programming",
          "best practices"
        ]
      },
      {
        "_id": {
          "$oid": "68785d0c387dd8e340e53629"
        },
        "title": "The Pragmatic Programmer",
        "author": "Andrew Hunt",
        "year": 1999,
        "tags": [
          "programming",
          "career"
        ]
      },
      {
        "_id": {
          "$oid": "68785d0c387dd8e340e5362a"
        },
        "title": "Refactoring",
        "author": "Martin Fowler",
        "year": 2018,
        "tags": [
          "programming",
          "refactoring"
        ]
      }
    ]
  }
}`
        }
      ],
      templates: []
    }

  }

  handleTemplateClick = () => {
    // Этот метод для кнопки "Create Template" - не передаем dump
    if (this.props.isLogin) {
      this.props.onTemplateClick(); // Без параметров
    } else {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to use the template',
        placement: 'bottomRight',
        duration: 4
      });
    }
  }

  handleUseTemplate = (dump, db) => {
    // Этот метод для кнопки "Use Template" - передаем dump
    if (this.props.isLogin) {
      this.props.onTemplateClick(dump, db); // С dump
    } else {
      notification.warning({
        message: 'Authentication Required',
        description: 'Please log in to use the template',
        placement: 'bottomRight',
        duration: 4
      });
    }
  }

  async componentDidMount() {
    if (this.props.isLogin) {
      this.fetchTemplates();
    }
  }

  componentDidUpdate(prevProps) {
    // Если пользователь залогинился, сразу подгружаем шаблоны
    if (!prevProps.isLogin && this.props.isLogin) {
      this.fetchTemplates();
    }
  }

  fetchTemplates = () => {
    getTemplateList().then((data) => {
      console.log("Templates fetched:", data);
      this.setState({ templates: data });
    }).catch((error) => {
      console.error("Error fetching templates:", error);
    });
  }

  handleTemplateDeleted = () => {
    // Обновляем список шаблонов после удаления
    this.fetchTemplates();
  }

  render() {
    return (
      <div className="template-container">
        <div className="template-list">
          <span className='template-preview'><Typography.Text className="template-starting-text"> Choose <Typography.Text className="template-starting-text" style={{ color: '#51CB63' }}>template</Typography.Text> from the list above or </Typography.Text> <Button className='my-orange-button-outline' style={{ position: 'relative', top: '-2px', height: '40px', fontSize: '18px' }} onClick={this.handleTemplateClick}>Create Template</Button> </span>
          {this.state.templates && this.state.templates.length > 0 && this.state.templates.map((template, index) => (
            <SingleTemplate
              key={index}
              template={template}
              onTemplateClick={this.handleUseTemplate}
              onTemplateDeleted={this.handleTemplateDeleted}
              isLogin={this.props.isLogin}
            />
          ))}
          <SingleTemplate template={this.state.predefined_template[0]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[1]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[2]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
        </div>
      </div>
    );
  }
}

export default Template;