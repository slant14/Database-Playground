import React from 'react';
import './Template.css';
import { Typography, Button } from 'antd';
import SingleTemplate from './singleTemplate';

class Template extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        template: [
            {title: "Insurance Policies", description: "Stores information about clients’ insurance policies, including fields: PolicyID, ClientID, Type (Life/Auto/Health), StartDate, EndDate, Premium, and Status."},
            {title: "Insurance Claims", description: "Tracks claims filed against policies with fields: ClaimID, PolicyID, DateFiled, ClaimType, Amount, AdjusterID, and Status."},
            {title: "Medical Patients", description: "A registry of clinic patients with fields: PatientID, LastName, FirstName, DOB, Gender, Contact, Address, and PrimaryPhysician."},
            {title: "Medical Visits", description: "Records patient visit history with fields: VisitID, PatientID, VisitDate, DoctorID, DiagnosisCode, TreatmentPlan, and Notes."},
            {title: "Pharmacy Inventory", description: "Manages drug stock levels with fields: DrugID, Name, BatchNo, ExpiryDate, QuantityOnHand, SupplierID, and CostPrice."},
            {title: "HR Employees", description: "Contains company staff data with fields: EmployeeID, Name, Position, Department, HireDate, Salary, Email, and Phone."},
            {title: "Commerce Orders", description: "Logs online store orders with fields: OrderID, CustomerID, OrderDate, ProductID, Quantity, UnitPrice, TotalAmount, and Status."},
            {title: "Real Estate Properties", description: "Maintains real estate listings with fields: PropertyID, Address, Type (Apartment/House/Commercial), OwnerID, AreaSqM, Price, ListingDate, and Status."},
            {title: "Project Management", description: "Manages company projects with fields: ProjectID, Name, StartDate, EndDate, ManagerID, Budget, Phase, and Status."},
            {title: "Financial Transactions", description: "Records account transactions with fields: TransactionID, AccountID, Date, Amount, TransactionType, Description, and BalanceAfter."}
        ]
    }

  }
  render() {
    return (
    <div className="template-container">
      <div className="template-list">
        <span className='template-preview'><Typography.Text className="template-starting-text"> Choose <Typography.Text className="template-starting-text" style={{color: '#51CB63'}}>template</Typography.Text> from the list above or </Typography.Text> <Button className='my-orange-button-outline' style={{ position: 'relative', top: '-2px',height: '40px', fontSize: '18px' }} onClick={() => this.props.handleButtonClick("code")}>Create Template</Button> </span>
        {this.state.template.map((item, index) => (
            <SingleTemplate key={index} title={item.title} description={item.description} handleButtonClick={this.props.handleButtonClick}/>
        ))}
      </div>
    </div>
    );
  }
}

export default Template;