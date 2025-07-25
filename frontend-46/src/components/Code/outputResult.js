import React from 'react';
import ChromaResult from './Results/chromaResult';
import PostgresResult from './Results/postgresResult';
import MongoResult from './Results/MongoResults';

class OutputResult extends React.Component {

    render() {
        const { response, postgresResponse } = this.props;
        return (
            <div>
                <p className="code-general-text" style={{ marginTop: '10px' }} >Request Result:</p>
                <div className="code-result"> 
                    {this.props.chosenDB === "Chroma" ? <ChromaResult response={response} /> : null}
                    {this.props.chosenDB === "PostgreSQL" ? <PostgresResult response={postgresResponse} /> : null}
                    {this.props.chosenDB === "MongoDB" ? <MongoResult response={this.props.mongoResponse} /> : null}
                </div>
            </div>
        );
    }



}

export default OutputResult;