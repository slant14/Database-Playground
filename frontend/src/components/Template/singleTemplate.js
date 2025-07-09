import React from 'react';
import './Template.css';
import { Typography, Button } from 'antd';

class SingleTemplate extends React.Component {
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
    <div className="single-template-container">
        <main>
            <Typography.Text className="single-template-title">{this.props.title}</Typography.Text> <br/>
            <Typography.Text className="single-template-text">{this.props.description}</Typography.Text>
        </main>
        <aside>
            <Button className='my-orange-button-outline' style={{height: '40px', fontSize: '18px' }} onClick={() => this.props.handleButtonClick("code")}>Use Template</Button>
        </aside>
    </div>
    );
  }
}

export default SingleTemplate;