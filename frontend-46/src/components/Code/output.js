import React from "react"
import OutputDBState from "./outputDBState";
import OutputResult from "./outputResult";

class OutputInputs extends React.Component {
    render() {
        return (
            <>
                <OutputDBState 
                    ref={this.props.outputDBStateRef}
                    response={this.props.response} 
                    db_state={this.props.db_state} 
                    chosenDB={this.props.chosenDB} 
                    postgresTableInfo={this.props.postgresTableInfo} 
                    mongoCollectionsInfo={this.props.mongoCollectionInfo}
                    setTableModalOpen={this.props.setTableModalOpen}
                />
                <OutputResult response={this.props.response} postgresResponse={this.props.postgresResponse} mongoResponse={this.props.mongoResponse} chosenDB={this.props.chosenDB} />
            </>
        );
    }
}

export default OutputInputs;