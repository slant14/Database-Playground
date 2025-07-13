import React from "react"
import './Articles.css';
import { Modal, Typography } from "antd";

const { Title } = Typography;

class Articles extends React.Component {
  render() {
    const { open, onCancel, article } = this.props;
    if (!article) return null; // <-- Prevents error if article is undefined
    return (
      <Modal 
        className="article-modal" 
        open={open} 
        onCancel={onCancel} 
        footer={null}
        width={800}
      >
        <Title className="inner-article-title">{article.title}</Title>
        <div className="inner-article-author">
            {article.author}
        </div>
        <div className="inner-article-decription">
            {article.description}
        </div>
      </Modal>
    );
  }
}

export default Articles;