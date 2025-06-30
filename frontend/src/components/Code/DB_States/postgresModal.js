import React from "react"
import { Modal, Typography, Table, Spin } from "antd";
import { TbPointFilled } from "react-icons/tb";
import { queryPostgres } from "../../../api";

class PostgresModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      loading: false,
      error: null
    };
  }

  componentDidMount() {
    if (this.props.open && this.props.selectedTable) {
      this.fetchTableData();
    }
  }

  componentDidUpdate(prevProps) {
    if ((this.props.open && !prevProps.open) || 
        (this.props.selectedTable !== prevProps.selectedTable && this.props.open)) {
      this.fetchTableData();
    }
  }

  fetchTableData = async () => {
    if (!this.props.selectedTable) return;

    this.setState({ loading: true, error: null });

    try {
      const query = `SELECT * FROM ${this.props.selectedTable.name} LIMIT 1000;`;
      const userId = this.props.userId || 'default_user';
      
      const result = await queryPostgres(query, userId);

      if (result && result !== "Error") {
        let tableData = [];
        
        if (result.results && result.results.length > 0 && result.results[0].data) {
          tableData = result.results[0].data;
        } else if (result.data) {
          tableData = result.data;
        } else if (result.result) {
          tableData = result.result;
        } else if (result.rows) {
          tableData = result.rows;
        } else if (Array.isArray(result)) {
          tableData = result;
        } else if (result.success && result.data) {
          tableData = result.data;
        } else {
          console.log('PostgresModal - No suitable data structure found');
          tableData = [];
        }
        
        this.setState({ 
          tableData: Array.isArray(tableData) ? tableData : [], 
          loading: false 
        });
      } else {
        console.log('PostgresModal - Result is Error or null');
        this.setState({ 
          error: 'Failed to fetch table data', 
          loading: false 
        });
      }
    } catch (error) {
      console.error('PostgresModal - Catch error:', error);
      this.setState({ 
        error: 'Error: ' + error.message, 
        loading: false 
      });
    }
  };

  renderTableContent = () => {
    const { tableData, loading, error } = this.state;
    const { selectedTable } = this.props;

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p className="modal-text" style={{ marginTop: '20px' }}>
            Loading table data...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p className="modal-text" style={{ color: '#c01619' }}>
            Error: {error}
          </p>
        </div>
      );
    }

    if (!selectedTable) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p className="modal-text">
            No table selected
          </p>
        </div>
      );
    }

    if (!tableData || tableData.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p className="modal-text">
            Table "{selectedTable.name}" is empty or has no data
          </p>
        </div>
      );
    }

    let columns = [];
    
    if (this.props.selectedTable && this.props.selectedTable.columns) {
      columns = this.props.selectedTable.columns.map((column, index) => ({
        title: column.name,
        dataIndex: index.toString(),
        key: column.name,
        width: 150,
        render: (value) => {
          if (value === null || value === undefined) {
            return <span style={{ color: '#a2aab3', fontStyle: 'italic' }}>NULL</span>;
          }
          return String(value);
        }
      }));
    } else {
      const firstRow = tableData[0];
      if (Array.isArray(firstRow)) {
        columns = firstRow.map((_, index) => ({
          title: `Column ${index + 1}`,
          dataIndex: index.toString(),
          key: index.toString(),
          width: 150,
          render: (value) => {
            if (value === null || value === undefined) {
              return <span style={{ color: '#a2aab3', fontStyle: 'italic' }}>NULL</span>;
            }
            return String(value);
          }
        }));
      } else {
        columns = Object.keys(firstRow).map(key => ({
          title: key,
          dataIndex: key,
          key: key,
          width: 150,
          render: (value) => {
            if (value === null || value === undefined) {
              return <span style={{ color: '#a2aab3', fontStyle: 'italic' }}>NULL</span>;
            }
            return String(value);
          }
        }));
      }
    }
    const dataWithKeys = tableData.map((row, rowIndex) => {
      let rowObject = { key: rowIndex };
      
      if (Array.isArray(row)) {
        row.forEach((value, colIndex) => {
          rowObject[colIndex.toString()] = value;
        });
      } else {
        rowObject = { ...row, key: rowIndex };
      }
      
      return rowObject;
    });

    return (
      <div className="postgres-modal-table">
        <div style={{ marginBottom: '15px' }}>
          <p className="modal-text">
            Table: <span style={{ color: '#51CB63', fontWeight: 'bold' }}>{selectedTable.name}</span>
          </p>
          <p className="modal-text">
            Total rows: <span style={{ color: '#51CB63' }}>{tableData.length}</span>
          </p>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataWithKeys}
          pagination={{
            pageSize: 50,
            showSizeChanger: false,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} items`
          }}
          scroll={{ 
            x: Math.max(columns.length * 150, 800),
          }}
          size="small"
        />
      </div>
    );
  };
  render() {
    return (
      <Modal
        title={this.props.title}
        open={this.props.open}
        onCancel={this.props.onCancel}
        footer={null}
        width={this.props.width || 1700}
        centered
        destroyOnClose
        className="my-modal"
        style={{ top: 20 }}
      >
        <div>
          {this.renderTableContent()}
        </div>
      </Modal>
    )
  }

  
}

export default PostgresModal