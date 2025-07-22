import React from "react"
import { Modal, Typography } from "antd";
import { TbPointFilled } from "react-icons/tb";

const { Title, Paragraph, Text, Link } = Typography;

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
        <div>
          <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>About Chroma</Typography.Text><br />
          <Typography.Text className='modal-text'>Chroma is a powerful vector-based database. It provides collections and official <Typography.Text className='modal-text'><a href='https://docs.trychroma.com/docs/collections/manage-collections' target='_blank' rel='noopener noreferrer' className='modal-text' style={{ color: '#51CB63', textDecoration: 'none' }}>instruments</a></Typography.Text> to work with them directly in Python or Typescript. Now you can write simple instructions and do not care about embedding generation. Our tool will parse your code and automatically execute all necessary commands for you to make Chroma usage as simple as possible.</Typography.Text><br /><br />
          <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>Collections</Typography.Text><br />
          <Typography.Text className='modal-text'>Chroma Collections are like folders that store embeddings, which are special representations of data (like text or images) turned into numerical form so you can search, filter, and analyse them smartly.</Typography.Text><br /><br />
          <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>What You Can Do?</Typography.Text><br />
          <Typography.Text className='modal-text'>You can work with files inside the collection with all possible Chroma instruments and even more. So you can:</Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                Add files with given name (content) and optional metadata;
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                Get the concrete file content by its ID;
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                Update the file content and metadata;
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                Search for the nearest files with respect to their content;
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                Delete the file;
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                Drop the whole collection; You should use a semicolon ; at the end of every command
              </span>
            </Typography.Text>
          </div>
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>ADD</Typography.Text><br />
          </div>
          <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}><Typography.Text className='modal-text' style={{ color: '#51CB63' }}>ADD</Typography.Text> content of your file here <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>metadata:</Typography.Text>topic<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>=</Typography.Text>history<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>,</Typography.Text>author<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>=</Typography.Text>Alex<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>;</Typography.Text></Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the command by typing ADD
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must write any content (text) for the file. Embedding will be produced automatically
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '30px', verticalAlign: 'middle', marginRight: '4px' }} />
                You may specify metadata for your file. It could be useful while searching. To do so, write metadata and then some key-value pairs key=value separated by a comma ,
              </span>
            </Typography.Text>
          </div>
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>GET</Typography.Text><br />
          </div>
          <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
            <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>GET -&gt;</Typography.Text> doc_123456789<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>;</Typography.Text>
          </Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the command by typing GET
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must use -&gt; to indicate the following number
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the file ID as doc_sequenceOfNumbers
              </span>
            </Typography.Text>
          </div>
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>UPDATE</Typography.Text><br />
          </div>
          <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
            <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>UPDATE -&gt;</Typography.Text> doc_123456789 new content <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>metadata:</Typography.Text>newTopic<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>=</Typography.Text>AI<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>;</Typography.Text>
          </Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the command by typing UPDATE
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must use -&gt; to indicate the following number
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the file ID as doc_sequenceOfNumbers
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must write any content (text) for the file. Embedding will be produced automatically
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '30px', verticalAlign: 'middle', marginRight: '4px' }} />
                You may specify metadata for your file. It could be useful while searching. To do so, write metadata and then some key-value pairs key=value separated by a comma ,
              </span>
            </Typography.Text>
          </div>
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>SEARCH</Typography.Text><br />
          </div>
          <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
            <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>SEARCH -&gt;</Typography.Text> 5 your search string <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>metadata:</Typography.Text>key1<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>=</Typography.Text>value1<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>;</Typography.Text>
          </Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the command by typing SEARCH
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must use -&gt; to indicate the following number
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the number of expected files
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '19px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must write you search string as a plain text. Chroma will return to you files with the closest content
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '26px', verticalAlign: 'middle', marginRight: '4px' }} />
                You may specify expected metadata for the files. To do so, write metadata and then some key-value pairs key=value separated by a comma ,
              </span>
            </Typography.Text>
          </div>
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>DELETE</Typography.Text><br />
          </div>
          <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
            <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>DELETE -&gt;</Typography.Text> doc_123456789<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>;</Typography.Text>
          </Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the command by typing DELETE
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must use -&gt; to indicate the following number
              </span>
            </Typography.Text><br />
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the file ID as doc_sequenceOfNumbers
              </span>
            </Typography.Text>
          </div>
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>DROP</Typography.Text><br />
          </div>
          <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
            <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>DROP;</Typography.Text>
          </Typography.Text><br />
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>
            <Typography.Text className='modal-text'>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                You must specify the command by typing DROP
              </span>
            </Typography.Text>
          </div>
        </div>

      </Modal>
    )
  }


}

export default HintModal