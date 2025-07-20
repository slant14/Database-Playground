import React from "react";
import { Typography, Button } from "antd";
import { MdOutlineArticle } from "react-icons/md";
import './Blog.css';
import Articles from '../Articles/Articles';

const { Title, Text } = Typography;

class AllAssignments extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isArticleModalOpen: false,
      selectedArticle: null,
    };
  }

  handleArticleClick = (article) => {
    this.setState({
      isArticleModalOpen: true,
      selectedArticle: article,
    });
    if (this.props.setArticleModalOpen) {
      this.props.setArticleModalOpen(true);
    }
  }

  handleArticleModalClose = () => {
    this.setState({
      isArticleModalOpen: false,
      selectedArticle: null,
    });
    if (this.props.setArticleModalOpen) {
      this.props.setArticleModalOpen(false);
    }
  };

  // Handle synchronization with App component modal states
  componentDidUpdate(prevProps, prevState) {
    // Sync article modal state
    if (prevProps.isArticleModalOpen && !this.props.isArticleModalOpen && this.state.isArticleModalOpen) {
      this.setState({ isArticleModalOpen: false, selectedArticle: null });
    }
    if (!prevProps.isArticleModalOpen && this.props.isArticleModalOpen && !this.state.isArticleModalOpen) {
      this.setState({ isArticleModalOpen: true });
    }
  }

  closeArticleModal = () => {
    this.setState({ isArticleModalOpen: false, selectedArticle: null });
  };


  render() {
    const { articles } = this.props
    if (articles.length === 0) {
      return (
        <div className="classrooms">
          <Title style={{
            marginTop: 30,
            color: "#fff",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>There are no <Text style={{
            color: "#51CB63",
            fontSize: 45,
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 600,
            marginBottom: 10
          }}>articles yet</Text>
          </Title>
        </div>
      );
    }

    return (
      <div className="allArticles">
        <Title style={{
          textAlign: "center",
          marginTop: 30,
          color: "#ffffffff",
          fontSize: 45,
          fontFamily: "'Noto Sans', sans-serif",
          fontWeight: 600,
          marginBottom: 30
        }}> Blog </Title>

        <div className="allArticles-list">
          {articles.map((el, idx) => (
            <div className="allArticle-card" key={idx} onClick={() => this.handleArticleClick(el)}>
              <div className="allArticle-header">
                <MdOutlineArticle className="allArticle-icon" />
                <span className="article-title article-title-one-line">{el.title}</span>
              </div>  
              <Text className="article-author article-author-one-line">
                {el.author_names.join(', ')}
              </Text>    
              <Text className="allArticle-description">
                {el.description}
               </Text>
            </div>  
          ))}
        </div>
        {this.state.isArticleModalOpen && this.state.selectedArticle && (
          <Articles
            open={this.state.isArticleModalOpen}
            onCancel={this.handleArticleModalClose}
            article={this.state.selectedArticle}
          />
        )}
      </div>
    );
  }
}

export default AllAssignments;