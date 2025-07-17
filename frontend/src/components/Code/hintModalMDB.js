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
          <div style={{ marginBottom: '6px' }}>
            <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#51CB63' }}>Commands <Typography.Text className='modal-text' style={{ fontWeight: 600, fontSize: '17px', color: '#fff' }}>that we support:</Typography.Text><br /></Typography.Text>
          </div>
          <div style={{ marginLeft: '20px', marginBottom: '10px', marginTop: '10px' }}>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.getCollectionName()</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command returns an array of strings, where each string is the name of a collection in the current database.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.insertOne{'('}{'{'}</Typography.Text> json  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'}{')'}</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command inserts a single document into the specified MongoDB collection.
                The argument {'{'}json{'}'} should be a valid JSON object representing the data you want to store.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.insertMany{'('}{'['}{'{'}</Typography.Text> json  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'}{','}{'{'}</Typography.Text> json  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'}{']'}{')'}</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command inserts multiple documents into the specified MongoDB collection at once.
                The argument should be an array of valid JSON objects, each representing a document to store.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.find()</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command retrieves documents from the specified MongoDB collection.
                By default, it returns all documents in the collection.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.find{'('}{'{'}</Typography.Text> json <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'}{')'}</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command retrieves documents from the specified MongoDB collection that match the given filter.
                The argument {'{'}json{'}'} should be a valid JSON object specifying the query criteria.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.drop()</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command deletes the specified collection from the database.
                All documents and indexes in the collection will be permanently removed.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.updateOne{'('}{'{'}</Typography.Text> json <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'},{'{'}</Typography.Text> json <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'},{'{'}</Typography.Text> optional json <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'}{')'}</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command updates a single document in the specified MongoDB collection that matches the filter criteria.
                The first argument {'{'}json{'}'} is the filter, the second {'{'}json{'}'} is the update operation, and the third {'{'}optional json{'}'} can specify options like upsert.
              </Typography.Text>
            </Typography.Text>

            <Typography.Text className='modal-text' style={{ marginBottom: '10px', display: 'block' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                <TbPointFilled style={{ color: '#51CB63', fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }} />
                <Typography.Text code className='modal-text' style={{ marginLeft: '-2px', marginTop: '12px', marginBottom: '12px' }}>
                  <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>db.</Typography.Text>collectionName<Typography.Text className='modal-text' style={{ color: '#51CB63' }}>.aggregate{'('}{'['}{'{'}</Typography.Text> json <Typography.Text className='modal-text' style={{ color: '#51CB63' }}>{'}'}, ... {']'}{')'}</Typography.Text>
                </Typography.Text>
              </span>
              <br />
              <Typography.Text className='modal-text' style={{ color: '#fff', fontSize: '14px', paddingLeft: '25px', marginTop: '-4px', display: 'block' }}>
                This command processes data records and returns computed results using the aggregation pipeline.
                The argument [{'{'}, ...] should be an array of JSON objects, each representing a stage in the pipeline.
              </Typography.Text>
            </Typography.Text>

          </div>
          <Typography.Text className='modal-text'>You can see full documentation <Typography.Text className='modal-text'><a href='https://www.mongodb.com/docs/mongodb-shell/reference/methods/' className='modal-text' style={{ color: '#51CB63', textDecoration: 'none' }}>here</a></Typography.Text></Typography.Text> <br />
        </div>

      </Modal>
    )
  }


}

export default HintModalMGDB