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
        { name: "Insurance Policies", author: "System", type: "PSQL", dump: "CREATE TABLE insurance_policies (policy_id SERIAL PRIMARY KEY, policy_number VARCHAR(50) UNIQUE NOT NULL,client_name VARCHAR(100) NOT NULL,policy_type VARCHAR(50) NOT NULL,coverage_amount DECIMAL(12,2) NOT NULL,premium_amount DECIMAL(10,2) NOT NULL,start_date DATE NOT NULL,end_date DATE NOT NULL,status VARCHAR(20) DEFAULT 'active',created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO insurance_policies (policy_number, client_name, policy_type, coverage_amount, premium_amount, start_date, end_date, status) VALUES('POL-2024-001', 'John Smith', 'Life Insurance', 250000.00, 2400.00, '2024-01-01', '2034-01-01', 'active'),('POL-2024-002', 'Maria Garcia', 'Health Insurance', 50000.00, 1800.00, '2024-01-15', '2025-01-15', 'active'),('POL-2024-003', 'Robert Johnson', 'Auto Insurance', 30000.00, 1200.00, '2024-02-01', '2025-02-01', 'active'),('POL-2024-004', 'Emily Brown', 'Home Insurance', 150000.00, 900.00, '2024-02-15', '2025-02-15', 'active'),('POL-2024-005', 'David Wilson', 'Life Insurance', 500000.00, 4800.00, '2024-03-01', '2034-03-01', 'active'),('POL-2024-006', 'Sarah Davis', 'Health Insurance', 75000.00, 2200.00, '2024-03-15', '2025-03-15', 'pending'),('POL-2024-007', 'Michael Miller', 'Auto Insurance', 45000.00, 1500.00, '2024-04-01', '2025-04-01', 'expired'),('POL-2024-008', 'Jennifer Lee', 'Home Insurance', 200000.00, 1100.00, '2024-04-15', '2025-04-15', 'active');" },
        { name: "Insurance Claims", author: "System", type: "PSQL", dump: "CREATE TABLE insurance_claims (claim_id SERIAL PRIMARY KEY, claim_number VARCHAR(50) UNIQUE NOT NULL, policy_id INTEGER, claimant_name VARCHAR(100) NOT NULL, claim_type VARCHAR(50) NOT NULL, claim_amount DECIMAL(12,2) NOT NULL, approved_amount DECIMAL(12,2), incident_date DATE NOT NULL, claim_date DATE NOT NULL, status VARCHAR(20) DEFAULT 'pending', description TEXT, adjuster_name VARCHAR(100), settlement_date DATE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP); INSERT INTO insurance_claims (claim_number, policy_id, claimant_name, claim_type, claim_amount, approved_amount, incident_date, claim_date, status, description, adjuster_name, settlement_date) VALUES('CLM-2024-001', 1, 'John Smith', 'Medical', 5000.00, 4500.00, '2024-06-01', '2024-06-05', 'approved', 'Hospital treatment for injury', 'Alice Johnson', '2024-06-20'),('CLM-2024-002', 2, 'Maria Garcia', 'Medical', 2500.00, 2500.00, '2024-06-15', '2024-06-18', 'settled', 'Dental procedure', 'Bob Wilson', '2024-07-01'),('CLM-2024-003', 3, 'Robert Johnson', 'Auto Accident', 8000.00, 7500.00, '2024-07-01', '2024-07-03', 'approved', 'Collision with another vehicle', 'Carol Davis', '2024-07-25'),('CLM-2024-004', 4, 'Emily Brown', 'Property Damage', 12000.00, NULL, '2024-07-15', '2024-07-18', 'under_review', 'Fire damage to kitchen', 'David Miller', NULL),('CLM-2024-005', 5, 'David Wilson', 'Disability', 25000.00, NULL, '2024-08-01', '2024-08-05', 'pending', 'Work-related injury', 'Eve Anderson', NULL),('CLM-2024-006', 6, 'Sarah Davis', 'Medical', 3500.00, 3000.00, '2024-08-15', '2024-08-18', 'approved', 'Surgery expenses', 'Frank Thompson', '2024-09-01'),('CLM-2024-007', 3, 'Robert Johnson', 'Auto Theft', 15000.00, 14000.00, '2024-09-01', '2024-09-03', 'settled', 'Vehicle stolen from parking lot', 'Grace Lee', '2024-09-20'),('CLM-2024-008', 8, 'Jennifer Lee', 'Property Damage', 7500.00, NULL, '2024-09-15', '2024-09-18', 'rejected', 'Flood damage not covered', 'Henry Clark', NULL);" },
      ],
      templates: []
    }

  }

  handleTemplateClick = () => {
    if (this.props.isLogin) {
      this.props.onTemplateClick();
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
          <SingleTemplate template={this.state.predefined_template[0]} onTemplateClick={this.props.onTemplateClick} isLogin={this.props.isLogin} />
          <SingleTemplate template={this.state.predefined_template[1]} onTemplateClick={this.props.onTemplateClick} isLogin={this.props.isLogin} />
          {this.state.templates && this.state.templates.length > 0 && this.state.templates.map((template, index) => (
            <SingleTemplate
              key={index}
              template={template}
              onTemplateClick={this.props.onTemplateClick}
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