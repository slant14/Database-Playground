import React from "react"
import { Modal, Typography } from "antd";
import { TbPointFilled } from "react-icons/tb";

class HintModal extends React.Component {
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
            <Typography.Text className='modal-text'> <TbPointFilled style={{position: 'relative', top: '2px'}}/> ADD <Typography.Text className='modal-text' style={{color: '#51CB63'}}>text of your file here</Typography.Text> metadata:<Typography.Text className='modal-text' style={{color: '#51CB63'}}>topic</Typography.Text>=<Typography.Text className='modal-text' style={{color: '#51CB63'}}>your topic</Typography.Text></Typography.Text>;<Typography.Text className='modal-text' style={{color: '#51CB63'}}>difficulty</Typography.Text>=<Typography.Text className='modal-text' style={{color: '#51CB63'}}>your difficulty</Typography.Text> <br/>
            <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                <Typography.Text className='modal-text' > This command adds a new text document with given text and metadata.  Metadata is optional, its parameters could be any.</Typography.Text>
            </div>
            <Typography.Text className='modal-text'> <TbPointFilled style={{position: 'relative', top: '2px'}}/> GET id=<Typography.Text className='modal-text' style={{color: '#51CB63'}}>id of your file here</Typography.Text></Typography.Text><br/>
            <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                <Typography.Text className='modal-text' > This command returns a document with given id.</Typography.Text>
            </div>
            <Typography.Text className='modal-text'> <TbPointFilled style={{position: 'relative', top: '2px'}}/> SEARCH <Typography.Text className='modal-text' style={{color: '#51CB63'}}>your search query here</Typography.Text> k=<Typography.Text className='modal-text' style={{color: '#51CB63'}}>number</Typography.Text>filers:<Typography.Text className='modal-text' style={{color: '#51CB63'}}>topic</Typography.Text> </Typography.Text>=<Typography.Text className='modal-text' style={{color: '#51CB63'}}>your topic</Typography.Text> <br/>
            <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                <Typography.Text className='modal-text' > This command returns k most relevant documents and distance to each document.  </Typography.Text> <br/>
                <Typography.Text className='modal-text' > k - wanted number of results, filters and k are optional. </Typography.Text>
            </div>
            <Typography.Text className='modal-text'> <TbPointFilled style={{position: 'relative', top: '2px'}}/> DELETE id=<Typography.Text className='modal-text' style={{color: '#51CB63'}}>id of your file here</Typography.Text></Typography.Text><br/>
            <div style={{marginLeft: '20px', marginBottom: '20px'}}>
                <Typography.Text className='modal-text' > This command deletes a document with given id.</Typography.Text>
            </div>

        </div>
        
      </Modal>
    )
  }

  
}

export default HintModal