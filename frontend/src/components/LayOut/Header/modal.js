import React from "react"
import { Modal, Input, Button } from "antd";
import "./Header.css"

class MyModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: "",
      password: "",
      needMemorizing: false,
    }
  }
  render() {
    return (
      <Modal
        title={this.props.title}
        open={this.props.open}
        onCancel={this.props.onCancel}
        footer={null}
        width={this.props.width || 520}
        centered
        destroyOnClose
        okText="Sign In"
        className="my-modal"
      >
        <form ref={el => this.myForm = el}>
          <p>Your login or email: </p> <Input placeholder="Login" className="login" onChange={(data) => this.setState({ login: data.target.value })} />
          <p>Your password: </p> <Input.Password placeholder="Password" className="damn" onChange={(data) => this.setState({ password: data.target.value })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" id="isHappy" onChange={(data) => this.setState({ needMemorizing: data.target.checked })} />
            <span>Remember me</span>
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <Button onClick={() => {
              this.myForm.reset()
              this.props.onCancel()
            }} className="my-orange-button-outline">
              Cancel
            </Button>
            <Button type="primary" onClick={() => {
              this.myForm.reset()
              if (this.state.login === "" || this.state.password === "") {
                alert("Please fill in all fields")
              } else {
                this.props.logIn(this.state.login, this.state.password, this.state.needMemorizing)
                this.props.onCancel()
              }
            }} className="my-orange-button-solid">
              Sign In
            </Button>

          </div>
        </form>

      </Modal>
    )
  }

  
}

export default MyModal