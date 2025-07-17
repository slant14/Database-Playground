import React from "react"
import { Modal, Typography } from "antd";
import { TbPointFilled } from "react-icons/tb";

class HintModalMGDB extends React.Component {
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
        width={this.props.width || 720}
        centered
        destroyOnClose
        className="my-modal"
      >
        <div > 
            <Typography.Text className='modal-text'>You can watch documentation <Typography.Text className='modal-text'><a href='https://www.mongodb.com/docs/mongodb-shell/reference/methods/' className='modal-text' style={{color: '#51CB63', textDecoration: 'none'}}>here</a></Typography.Text></Typography.Text> <br/>

        </div>
        
      </Modal>
    )
  }

  
}

export default HintModalMGDB