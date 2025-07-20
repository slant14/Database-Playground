import React from 'react';
import { Button, Divider, Typography } from 'antd';
import { queryMongo } from '../../../api';
import PostgresModal from './postgresModal';

class MongoState extends React.Component {
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.mongoCollectionsInfo !== this.props.mongoCollectionsInfo) {
            // Если коллекции изменились и есть выбранная коллекция, обновить findResult
            if (this.state.chosenTable !== null) {
                this.handleTableClick(this.state.chosenTable, this.props.mongoCollectionsInfo[this.state.chosenTable]);
            }
        }


    }
    constructor(props) {
        super(props);
        this.state = {
            chosenTable: null,
            findResult: null,
            isLoading: false,
        };
    }

    render() {
        const { response, db_state, mongoCollectionsInfo } = this.props;
        const { findResult, isLoading } = this.state;
        return (
            <div>
                <div style={{ marginTop: '10px' }}>
                    <p className="code-general-text" style={{ margin: 0 }}>Choose table:</p>
                    <div className="code-table-list">
                        {(mongoCollectionsInfo || []).length > 0 ? (
                            mongoCollectionsInfo.map((table, index) => (
                                <Button key={index} className={this.state.chosenTable === index ? "my-table-button-solid" : "my-table-button-outline"}
                                    onClick={() => this.handleTableClick(index, table)}>{table.name || `Table ${index + 1}`}</Button>
                            ))
                        ) : (
                            <p className="code-initial-text">No tables available</p>
                        )}
                    </div>
                </div>
                <div>
                    <p className="code-general-text">Current DB state:</p>
                    <div className="code-output" style={{ height: '228px' }}>
                        {/* Вывод результатов поиска */}
                        {isLoading && <p>Loading...</p>}
                        {findResult && Array.isArray(findResult) && findResult.length > 0 && (
                            <>
                                {findResult.map((item, idx) => (
                                    <div key={idx} className="code-output-item">
                                        {Object.entries(item).map(([key, value]) => (
                                            <div>
                                                <Typography.Text className='code-text' key={key}>{key}: <Typography.Text className='code-text' style={{ color: '#fff' }}>{JSON.stringify(value)}</Typography.Text></Typography.Text><br/>
                                            </div >
                                        ))}
                                        {idx !== findResult.length - 1 && <Divider className="my-divider" />}
                                    </div>
                                ))}
                            </>
                        )}
                        {findResult && Array.isArray(findResult) && findResult.length === 0 && (
                            <>
                                <div><p>Add files to collection</p></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    handleTableClick = async (index, table) => {
        // Проверяем, что table определён и имеет name
        const collectionName = (table && table.name) ? table.name : `Table${index + 1}`;
        this.setState({ chosenTable: index, isLoading: true, findResult: null, lastFindCollectionName: collectionName });
        try {
            // Формируем команду для поиска
            const query = `db.${collectionName}.find()`;
            let result = [];
            queryMongo(query)
                .then(data => {
                    result = data;
                    // Если результат содержит поле result, используем его
                    if (result && result.results) {
                        this.setState({ findResult: result.results[0].data, isLoading: false });
                    } else {
                        this.setState({ findResult: result, isLoading: false });
                    }
                });
        } catch (e) {
            this.setState({ findResult: [{ error: e.message }], isLoading: false });
        }
    };
}



export default MongoState;