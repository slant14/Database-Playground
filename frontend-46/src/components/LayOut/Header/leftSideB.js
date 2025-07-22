import React from "react"
import { Button } from "antd";
import { FaCode } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import logoo from "../../../img/logoo.svg";
class LeftSideB extends React.Component {
    render() {
        return (
            <span className="header-logo">
                <Button
                    className="logo-button-outline"
                    onClick={() => this.props.handleButtonClick("home")}
                    style={{
                        
                    }}
                >
                    <img src={logoo} alt="Logo" style={{ height: 32 }} className="header-logo" />
                </Button>
                <Button
                    variant="solid"
                    className={this.props.activeButton === "template" ? "my-orange-button-solid" : "my-orange-button-outline"}
                    onClick={() => this.props.handleButtonClick("template")}
                >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ position: "relative", top: "-1px" }}>Templates</span> <FaSave />
                    </span>
                </Button>
                <Button
                    variant="solid"
                    className={this.props.activeButton === "code" ? "my-orange-button-solid" : "my-orange-button-outline"}
                    onClick={() => this.props.onTemplateClick()}
                >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ position: "relative", top: "-1px" }}>Code</span> <FaCode />
                    </span>
                </Button>
            </span>
        );
    }
}

export default LeftSideB;