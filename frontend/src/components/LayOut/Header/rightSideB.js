import React from "react"
import { Button } from "antd";
import MyModal from "./modal";
import { FaBook } from "react-icons/fa";
import { MdAccountCircle } from "react-icons/md";

class LeftSideB extends React.Component {
    render() {
        return (
            <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                    variant="solid"
                    className={this.props.activeButton === "classrooms" ? "my-orange-button-solid" : "my-orange-button-outline"}
                    onClick={() => this.props.handleButtonClick("classrooms")}
                >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span style={{ position: "relative", top: "-1px" }}>Classrooms</span> <FaBook />
                    </span>
                </Button>
                {!this.props.checkLogin ?
                    <Button variant="solid" className={this.props.activeButton === "signin" ? "my-orange-button-solid" : "my-orange-button-outline"} onClick={() => this.props.handleButtonClick("signin")}><span style={{ position: "relative", top: "-1px" }}>Sign In</span></Button> :
                    <Button
                        variant="solid"
                        className={this.props.activeButton === "acc" ? "my-orange-button-solid" : "my-orange-button-outline"}
                        onClick={() => this.props.handleButtonClick("acc")}
                    >
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                            <span style={{ position: "relative", top: "-1px" }}>Account</span> <MdAccountCircle />
                        </span>
                    </Button>}
                <MyModal open={this.props.isModalOpen} logIn={this.props.logIn} setPage={this.props.setPage} onCancel={this.props.handleCancel} updateLogIn={this.props.updateLogIn} setCookie={this.props.setCookie} footer={null} setUser={this.props.setUser} title="Sing In" />
            </div>
        );
    }
}

export default LeftSideB;