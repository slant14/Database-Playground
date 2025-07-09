import React from "react"
import { Modal, Typography } from "antd";
import { TbPointFilled } from "react-icons/tb";

class HintModalPS extends React.Component {
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
            <Typography.Text className='modal-text'>You can watch tutorial <Typography.Text className='modal-text'><a href='https://share.google/vo5MINeophzmgA77N' target='_blank' rel='noopener noreferrer' className='modal-text' style={{color: '#51CB63', textDecoration: 'none'}}>here</a></Typography.Text></Typography.Text> <br/>

        </div>
        
      </Modal>
    )
  }

  
}

export default HintModalPS