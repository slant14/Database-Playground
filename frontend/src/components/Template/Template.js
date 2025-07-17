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
          name: "Employee Management | Tracks employee information including personal details, department, salary, and hire date.",
          author: "DPP",
          type: "PSQL",
          dump: "CREATE TABLE employees (emp_id SERIAL PRIMARY KEY, first_name VARCHAR(50) NOT NULL, last_name VARCHAR(50) NOT NULL, email VARCHAR(100) UNIQUE NOT NULL, department VARCHAR(50), position VARCHAR(50), salary DECIMAL(10,2), hire_date DATE NOT NULL, is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO employees (first_name, last_name, email, department, position, salary, hire_date) VALUES ('John', 'Doe', 'john.doe@company.com', 'Engineering', 'Software Developer', 75000.00, '2023-01-15'), ('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 'Marketing Manager', 65000.00, '2022-03-20'), ('Mike', 'Johnson', 'mike.johnson@company.com', 'Sales', 'Sales Representative', 55000.00, '2023-05-10'), ('Sarah', 'Wilson', 'sarah.wilson@company.com', 'HR', 'HR Specialist', 60000.00, '2022-11-08'), ('David', 'Brown', 'david.brown@company.com', 'Engineering', 'Senior Developer', 90000.00, '2021-07-12');"
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
        },
        {
          name: "Product Inventory | Manages product catalog with details, pricing, and stock information.",
          author: "DPP",
          type: "MGDB",
          dump: `{
  "db": {
    "products": [
      {
        "_id": {
          "$oid": "64785d0c387dd8e340e53630"
        },
        "name": "Wireless Headphones",
        "brand": "TechSound",
        "price": 89.99,
        "category": "electronics",
        "stock": 45,
        "description": "High-quality wireless headphones with noise cancellation",
        "features": [
          "bluetooth 5.0",
          "noise cancellation",
          "30-hour battery"
        ]
      },
      {
        "_id": {
          "$oid": "64785d0c387dd8e340e53631"
        },
        "name": "Gaming Mouse",
        "brand": "GamePro",
        "price": 49.99,
        "category": "electronics",
        "stock": 23,
        "description": "Precision gaming mouse with RGB lighting",
        "features": [
          "12000 DPI",
          "RGB lighting",
          "programmable buttons"
        ]
      },
      {
        "_id": {
          "$oid": "64785d0c387dd8e340e53632"
        },
        "name": "Coffee Maker",
        "brand": "BrewMaster",
        "price": 129.99,
        "category": "appliances",
        "stock": 12,
        "description": "Automatic drip coffee maker with timer",
        "features": [
          "12-cup capacity",
          "programmable timer",
          "auto shut-off"
        ]
      }
    ]
  }
}`
        },
        {
          name: "Academic Papers | Collection of research papers and academic articles with metadata.",
          author: "DPP",
          type: "CHRM",
          dump: "ADD Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data without being explicitly programmed metadata:topic=machine-learning,author=John Smith,year=2023,journal=AI Review; ADD Natural language processing enables computers to understand and interpret human language through computational linguistics metadata:topic=nlp,author=Sarah Johnson,year=2022,conference=ACL; ADD Computer vision algorithms can analyze and understand visual content from images and videos metadata:topic=computer-vision,author=Mike Chen,year=2023,journal=IEEE Vision; ADD Deep learning neural networks with multiple layers can model complex patterns in large datasets metadata:topic=deep-learning,author=Lisa Wang,year=2022,conference=NeurIPS; ADD Reinforcement learning agents learn optimal actions through interaction with their environment metadata:topic=reinforcement-learning,author=David Kumar,year=2023,journal=JMLR;"
        },
        {
          name: "Recipe Collection | Cooking recipes with ingredients, instructions, and dietary information.",
          author: "DPP",
          type: "CHRM",
          dump: "ADD Heat olive oil in a pan add diced onions and garlic cook until fragrant Add ground beef and cook until browned Stir in tomato sauce herbs and simmer for 20 minutes metadata:dish=spaghetti_bolognese,cuisine=italian,difficulty=easy; ADD Whisk eggs with milk and vanilla dip bread slices and cook in buttered pan until golden brown on both sides metadata:dish=french_toast,cuisine=american,difficulty=easy,dietary=vegetarian; ADD Mix flour cocoa powder sugar and baking powder Add wet ingredients and chocolate chips bake at 350F for 25 minutes metadata:dish=chocolate_muffins,cuisine=american,difficulty=easy,dietary=vegetarian; ADD Marinate chicken in yogurt and spices for 2 hours grill until cooked through and serve with naan bread metadata:dish=chicken_tikka,cuisine=indian,difficulty=medium; ADD Toss mixed greens with cherry tomatoes cucumber feta cheese olives and Greek dressing metadata:dish=greek_salad,cuisine=greek,difficulty=easy,dietary=vegetarian;"
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
          <SingleTemplate template={this.state.predefined_template[0]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[1]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[2]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[3]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[4]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[5]} onTemplateClick={this.handleUseTemplate} isLogin={this.props.isLogin} />
          {this.state.templates && this.state.templates.length > 0 && this.state.templates.map((template, index) => (
            <SingleTemplate
              key={index}
              template={template}
              onTemplateClick={this.handleUseTemplate}
              onTemplateDeleted={this.handleTemplateDeleted}
              isLogin={this.props.isLogin}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Template;