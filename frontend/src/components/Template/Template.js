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
          name: "Insurance Policies | Stores information about clients’ insurance policies, including policy number, client name, type, coverage and premium amounts, dates, and status.",
          author: "DPP",
          type: "PSQL",
          dump: "CREATE TABLE insurance_policies (policy_id SERIAL PRIMARY KEY, policy_number VARCHAR(50) UNIQUE NOT NULL,client_name VARCHAR(100) NOT NULL,policy_type VARCHAR(50) NOT NULL,coverage_amount DECIMAL(12,2) NOT NULL,premium_amount DECIMAL(10,2) NOT NULL,start_date DATE NOT NULL,end_date DATE NOT NULL,status VARCHAR(20) DEFAULT 'active',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO insurance_policies (policy_number, client_name, policy_type, coverage_amount, premium_amount, start_date, end_date, status) VALUES('POL-2024-001', 'John Smith', 'Life Insurance', 250000.00, 2400.00, '2024-01-01', '2034-01-01', 'active'),('POL-2024-002', 'Maria Garcia', 'Health Insurance', 50000.00, 1800.00, '2024-01-15', '2025-01-15', 'active'),('POL-2024-003', 'Robert Johnson', 'Auto Insurance', 30000.00, 1200.00, '2024-02-01', '2025-02-01', 'active'),('POL-2024-004', 'Emily Brown', 'Home Insurance', 150000.00, 900.00, '2024-02-15', '2025-02-15', 'active'),('POL-2024-005', 'David Wilson', 'Life Insurance', 500000.00, 4800.00, '2024-03-01', '2034-03-01', 'active'),('POL-2024-006', 'Sarah Davis', 'Health Insurance', 75000.00, 2200.00, '2024-03-15', '2025-03-15', 'pending'),('POL-2024-007', 'Michael Miller', 'Auto Insurance', 45000.00, 1500.00, '2024-04-01', '2025-04-01', 'expired'),('POL-2024-008', 'Jennifer Lee', 'Home Insurance', 200000.00, 1100.00, '2024-04-15', '2025-04-15', 'active');"
        },
        {
          name: "Book Library | Manages a collection of books, including title, author, genre, publication year, ISBN, and availability status.",
          author: "DPP",
          type: "PSQL",
          dump: "CREATE TABLE books (book_id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, author VARCHAR(100) NOT NULL, genre VARCHAR(50), publication_year INT, isbn VARCHAR(20) UNIQUE, status VARCHAR(20) DEFAULT 'available', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO books (title, author, genre, publication_year, isbn, status) VALUES ('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 1925, '9780743273565', 'available'), ('To Kill a Mockingbird', 'Harper Lee', 'Classic', 1960, '9780061120084', 'checked_out'), ('1984', 'George Orwell', 'Dystopian', 1949, '9780451524935', 'available'), ('Pride and Prejudice', 'Jane Austen', 'Romance', 1813, '9780141439518', 'available'), ('Moby-Dick', 'Herman Melville', 'Adventure', 1851, '9780142437247', 'available');"
        },
        {
          name: "Employee Directory | Stores information about company employees, including name, position, department, email, phone, hire date, and employment status.",
          author: "DPP",
          type: "PSQL",
          dump: "CREATE TABLE employees (employee_id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, position VARCHAR(50) NOT NULL, department VARCHAR(50), email VARCHAR(100) UNIQUE, phone VARCHAR(20), hire_date DATE, status VARCHAR(20) DEFAULT 'active', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO employees (name, position, department, email, phone, hire_date, status) VALUES ('Alice Smith', 'Software Engineer', 'IT', 'alice.smith@company.com', '+1234567890', '2022-03-15', 'active'), ('Bob Johnson', 'Project Manager', 'IT', 'bob.johnson@company.com', '+1234567891', '2021-07-01', 'active'), ('Carol Lee', 'HR Specialist', 'HR', 'carol.lee@company.com', '+1234567892', '2020-11-20', 'active'), ('David Brown', 'Accountant', 'Finance', 'david.brown@company.com', '+1234567893', '2019-05-10', 'inactive'), ('Eva Green', 'Designer', 'Marketing', 'eva.green@company.com', '+1234567894', '2023-01-05', 'active');"
        },
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