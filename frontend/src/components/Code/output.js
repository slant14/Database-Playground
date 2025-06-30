import React from "react"
import OutputDBState from "./outputDBState";
import OutputResult from "./outputResult";

class OutputInputs extends React.Component {
    render() {
        return (
            <>
                <OutputDBState response={this.props.response} db_state={this.props.db_state} chosenDB={this.props.chosenDB} postgresTableInfo={this.props.postgresTableInfo} userid={this.props.userid}/>
                <OutputResult response={this.props.response} postgresResponse={this.props.postgresResponse} chosenDB={this.props.chosenDB} />
            </>
        );
    }
}

export default OutputInputs;