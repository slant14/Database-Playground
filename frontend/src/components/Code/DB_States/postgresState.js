import React from 'react';
import { Button, Table } from 'antd';
import PostgresModal from './postgresModal';

class PostgresState extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenTable: null,
        };
    }
    render() {
        const { response, db_state, postgresTableInfo } = this.props;
        const userId = this.props.userid;
        return (
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <p className="code-general-text" style={{ margin: 0 }}>Current table state:</p>
                    <Button className={this.props.isPostgresModalOpen ? "my-table-button-solid" : "my-table-button-outline"} style={{ marginTop: '2px', marginLeft: '10px' }} onClick={this.props.open}>View Table</Button>
                    <PostgresModal
                        title="PostgreSQL Table Data"
                        open={this.props.isPostgresModalOpen}
                        onCancel={this.props.close}
                        selectedTable={this.state.chosenTable !== null ? postgresTableInfo[this.state.chosenTable] : null}
                        userId={userId}
                        width={1200} />
                </div>
                <div style={{ marginTop: '10px' }}>
                    <p className="code-general-text" style={{ margin: 0 }}>Choose table:</p>
                    <div className="code-table-list">
                        {postgresTableInfo.length > 0 ? (
                            postgresTableInfo.map((table, index) => (
                                <Button key={index} className={this.state.chosenTable === index ? "my-table-button-solid" : "my-table-button-outline"}
                                    onClick={() => this.handleTableClick(index)}>{table.name || `Table ${index + 1}`}</Button>
                            ))
                        ) : (
                            <p className="code-initial-text">No tables available</p>
                        )}
                    </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                    <p className="code-general-text" style={{ margin: 0 }}>Table scheme:</p>
                    <div className="code-table-scheme">
                        {this.renderTableSchema()}
                    </div>
                </div>
            </div>
        );
    }

    handleTableClick = (index) => {
        this.setState({ chosenTable: index });
        console.log(`Table ${index} clicked`);
    };

    renderTableSchema() {
        const { postgresTableInfo } = this.props;
        
        if (!postgresTableInfo || !Array.isArray(postgresTableInfo) || 
            postgresTableInfo.length === 0 || this.state.chosenTable === null) {
            return null;
        }

        const selectedTable = postgresTableInfo[this.state.chosenTable];
        
        if (!selectedTable || !selectedTable.columns || !Array.isArray(selectedTable.columns)) {
            return <p className="code-initial-text">No schema information available</p>;
        }

        const columns = selectedTable.columns.map(column => ({
            title: column.name,
            dataIndex: column.name,
            key: column.name,
        }));

        let data = {};
        selectedTable.columns.forEach(column => {
            data[column.name] = column.type;
        });
        
        return (
            <Table
                dataSource={[data]} 
                columns={columns}
                pagination={false}
                
            />
        );
    }
}



export default PostgresState;