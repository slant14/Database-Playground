import React from "react"
import { Modal, Input, Button, notification } from "antd";
import "./Header.css"
import { registerUser } from "../../../api";

class RegisterModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      login: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  }
  render() {
    return (
      <Modal
        title="Registration"
        open={this.props.open}
        onCancel={this.props.onCancel}
        footer={null}
        width={this.props.width || 520}
        centered
        destroyOnClose
        okText="Register"
        className="my-modal"
      >
        <form ref={el => this.myForm = el}>
          <p>Your login: </p>
          <Input placeholder="Login" className="login" onChange={(data) => this.setState({ login: data.target.value })} />

          <p>Your email: </p>
          <Input placeholder="Email" className="login" onChange={(data) => this.setState({ email: data.target.value })} />

          <p>Your password: </p>
          <Input.Password placeholder="Password" className="damn" onChange={(data) => this.setState({ password: data.target.value })} />

          <p>Confirm password: </p>
          <Input.Password placeholder="Confirm Password" className="damn" onChange={(data) => this.setState({ confirmPassword: data.target.value })} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
            <div>
              <span>Already have an account? </span>
              <span
                style={{ color: '#51CB63', cursor: 'pointer' }}
                onClick={this.props.onSwitchToLogin}
              >
                Sign In
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <Button onClick={() => {
                this.myForm.reset()
                this.props.onCancel()
              }} className="my-orange-button-outline">
                Cancel
              </Button>
              <Button type="primary" onClick={() => {
                this.handleRegister()
              }} className="my-orange-button-solid">
                Register
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    )
  }

  handleRegister = async () => {
    const { login, email, password, confirmPassword } = this.state;

    if (login === "" || email === "" || password === "" || confirmPassword === "") {
      notification.warning({
        message: 'Incomplete data',
        description: 'Please fill in all fields',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }

    if (password !== confirmPassword) {
      notification.error({
        message: 'Passwords do not match',
        description: 'Please make sure passwords match',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }

    if (password.length < 6) {
      notification.warning({
        message: 'Weak password',
        description: 'Password must contain at least 6 characters',
        placement: 'bottomRight',
        duration: 2,
      });
      return;
    }
    try {
      const data = await registerUser(this.state.login, this.state.email, this.state.password);
      if (data.error) {
        switch (data.error) {
          case "302":
            notification.error({
              message: 'Registration failed',
              description: 'User with this data already exists',
              placement: 'bottomRight',
              duration: 3,
            });
            break;
          case "303":
            notification.error({
              message: 'Registration failed',
              description: 'You cannot create user with such email',
              placement: 'bottomRight',
              duration: 3,
            });
            break;
          default:
            notification.error({
              message: 'Registration failed',
              description: 'An unexpected error occurred',
              placement: 'bottomRight',
              duration: 3,
            });
        }
      } else {
        this.props.logIn(this.state.login, this.state.password, this.state.needMemorizing, data.access, data.refresh)
        notification.success({
          message: 'Registration successful!',
          description: 'Your account has been created. You can now log in to the system.',
          placement: 'bottomRight',
          duration: 3,
        });

        this.props.onCancel();
        this.myForm.reset();
        this.setState({
          login: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      notification.error({
        message: 'Registration failed',
        description: error.message || 'Please try again later',
        placement: 'bottomRight',
        duration: 3,
      });
    }



  }
}

export default RegisterModal
