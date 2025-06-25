import React from "react"
import OutputDBState from "./outputDBState";
import OutputResult from "./outputResult";

class OutputInputs extends React.Component {
    render() {
        return (
            <div className="code-output-container">
                <OutputDBState response={this.props.response} />
                <OutputResult response={this.props.response} />
            </div>
        );
    }
}

export default OutputInputs;