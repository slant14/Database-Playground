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
      error: null,
      queryResult: null
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
      
      const result = await queryPostgres(query);

      if (result && result !== "Error") {
        let tableData = [];
        
        if (result.results && result.results.length > 0 && result.results[0].data) {
          const resultData = result.results[0].data;
          
          // Обрабатываем новый формат данных с колонками
          if (resultData && typeof resultData === 'object' && resultData.columns && resultData.data) {
            const columns = resultData.columns;
            const dataObj = resultData.data;
            
            // Преобразуем данные в массив строк
            if (columns.length > 0) {
              const firstColumnData = dataObj[columns[0]];
              if (firstColumnData && firstColumnData.length > 0) {
                for (let i = 0; i < firstColumnData.length; i++) {
                  const row = columns.map(col => dataObj[col][i]);
                  tableData.push(row);
                }
              }
            }
          }
          // Обрабатываем старый формат данных (массив строк)
          else if (Array.isArray(resultData)) {
            tableData = resultData;
          }
        } else if (result.data) {
          // Обрабатываем прямой формат данных
          if (result.data && typeof result.data === 'object' && result.data.columns && result.data.data) {
            const columns = result.data.columns;
            const dataObj = result.data.data;
            
            if (columns.length > 0) {
              const firstColumnData = dataObj[columns[0]];
              if (firstColumnData && firstColumnData.length > 0) {
                for (let i = 0; i < firstColumnData.length; i++) {
                  const row = columns.map(col => dataObj[col][i]);
                  tableData.push(row);
                }
              }
            }
          } else if (Array.isArray(result.data)) {
            tableData = result.data;
          }
        } else if (result.result) {
          tableData = result.result;
        } else if (result.rows) {
          tableData = result.rows;
        } else if (Array.isArray(result)) {
          tableData = result;
        } else if (result.success && result.data) {
          tableData = result.data;
        } else {
          tableData = [];
        }
        
        this.setState({ 
          tableData: Array.isArray(tableData) ? tableData : [], 
          loading: false,
          queryResult: result
        });
      } else {
        this.setState({ 
          error: 'Failed to fetch table data', 
          loading: false 
        });
      }
    } catch (error) {
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
    
    // Определяем колонки на основе данных из результата запроса
    if (this.state.queryResult && this.state.queryResult.results && 
        this.state.queryResult.results[0] && this.state.queryResult.results[0].data &&
        this.state.queryResult.results[0].data.columns) {
      // Используем колонки из результата запроса
      const resultColumns = this.state.queryResult.results[0].data.columns;
      columns = resultColumns.map((columnName, index) => ({
        title: columnName,
        dataIndex: index.toString(),
        key: columnName,
        width: 150,
        render: (value) => {
          if (value === null || value === undefined) {
            return <span style={{ color: '#a2aab3', fontStyle: 'italic' }}>NULL</span>;
          }
          return String(value);
        }
      }));
    }
    // Используем колонки из схемы таблицы
    else if (this.props.selectedTable && this.props.selectedTable.columns) {
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
      // Определяем колонки на основе первой строки данных
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