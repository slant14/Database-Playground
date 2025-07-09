import React from "react"
import { Button } from "antd";
import { FaCode } from "react-icons/fa";
import logo from "../../../img/icon100.png"; 

class LeftSideB extends React.Component {
    render() {
        return (
            <span className="header-logo">
                <Button className="logo-button-outline" onClick={() => this.props.handleButtonClick("home")}><img src={logo} alt="Logo" style={{ height: 32 }} className="header-logo" /></Button>
                <Button
                    variant="solid"
                    className={this.props.activeButton === "template" ? "my-orange-button-solid" : "my-orange-button-outline"}
                    onClick={() => this.props.handleButtonClick("template")}
                >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ position: "relative", top: "-1px" }}>Templates</span> <FaCode />
                    </span>
                </Button>
            </span>
        );
    }
}

export default LeftSideB;