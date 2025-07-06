import React from "react"
import { Modal, Input, Button, notification } from "antd";
import "./Header.css"
import { loginUser } from "../../../api";



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
          <p>Your login: </p> <Input placeholder="Login" className="login" onChange={(data) => this.setState({ login: data.target.value })} />
          <p>Your password: </p> <Input.Password placeholder="Password" className="damn" onChange={(data) => this.setState({ password: data.target.value })} />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" id="isHappy" onChange={(data) => this.setState({ needMemorizing: data.target.checked })} />
            <span>Remember me</span>
          </label>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <div>
              <span>No account? </span>
              <span
                style={{ color: '#51CB63', cursor: 'pointer' }}
                onClick={() => {
                  if (this.props.onSwitchToRegister) {
                    this.props.onSwitchToRegister();
                  }
                }}
              >
                Registration
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button onClick={() => {
                this.myForm.reset()
                this.props.onCancel()
              }} className="my-orange-button-outline">
                Cancel
              </Button>
              <Button type="primary" onClick={async () => {
                if (this.state.login === "" || this.state.password === "") {
                  notification.warning({
                    message: 'Incomplete data',
                    description: 'Please fill in all fields',
                    placement: 'bottomRight',
                    duration: 4
                  });
                } else {
                  const data = await loginUser(this.state.login, this.state.password);
                  if (data.error) {
                    switch (data.error) {
                      case "406":
                        notification.error({
                          message: 'Login failed',
                          description: 'User not found',
                          placement: 'bottomRight',
                          duration: 4,
                        });
                        break;
                      default:
                        notification.error({
                          message: 'Login failed',
                          description: 'An unexpected error occurred',
                          placement: 'bottomRight',
                          duration: 4,
                        });
                    }
                  } else {
                    this.props.logIn(this.state.login, this.state.password, this.state.needMemorizing, data.access, data.refresh)
                    notification.success({
                      message: 'Login successful',
                      description: 'Welcome to the system!',
                      placement: 'bottomRight',
                      duration: 4,
                    });
                    this.props.onCancel()
                    this.setState({
                      login: "",
                      password: "",
                      needMemorizing: false,
                    })
                  }
                }
              }} className="my-orange-button-solid">
                Sign In
              </Button>
            </div>
          </div>
        </form>

      </Modal>
    )
  }


}

export default MyModal