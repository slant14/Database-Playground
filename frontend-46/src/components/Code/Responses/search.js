import React from 'react';
import { Typography, Divider } from 'antd';
import { ImPointRight } from "react-icons/im";

class Search extends React.Component {

    render() {
        return (

            <div>
                {Object.keys(this.props.response).length === 0 ? <Typography.Text className='code-text'>Request result will appear here</Typography.Text> :
                    <div className="code-output-item">
                        {this.props.response.result.error === "Document not found" ? <Typography.Text className='code-text' style={{ color: '#B22222' }}>ID is not found</Typography.Text> :
                            <div>
                                <Typography.Text className='code-text'>Success! </Typography.Text> <br />
                                <Typography.Text className='code-text'>Documents info: </Typography.Text><br />
                                {this.props.response.result.search_results.map((item, index) => {
                                    return (
                                        <div className="code-output-item">
                                            <Typography.Text className='code-text'><ImPointRight/> ID: <Typography.Text className='code-text' style={{ color: '#fff' }}>{item.id}</Typography.Text></Typography.Text> <br />
                                            <Typography.Text className='code-text'><ImPointRight/> Title: <Typography.Text className='code-text' style={{ color: '#fff' }}>{item.document}</Typography.Text></Typography.Text><br />
                                            <Typography.Text className='code-text'><ImPointRight/> Distance: <Typography.Text className='code-text' style={{ color: '#fff' }}>{item.distance}</Typography.Text></Typography.Text><br />
                                            {item.metadata && (
                                                <div className="metadata-fields">
                                                    {Object.entries(item.metadata).map(([key, value]) => (
                                                        <Typography.Text className='code-text' key={key}>
                                                            <ImPointRight/>Metadata/{key}: <Typography.Text className='code-text' style={{ color: '#fff' }}>{value}</Typography.Text>
                                                            <br />
                                                        </Typography.Text>
                                                    ))}
                                                </div>
                                            )}
                                            {index !== this.props.response.result.search_results.length - 1 && <Divider className="my-divider" />}
                                        </div>
                                    );
                                }
                                )}
                            </div>
                        }

                    </div>
                }
            </div>
        );
    }

}

export default Search;