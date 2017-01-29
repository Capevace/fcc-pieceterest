import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Masonry from 'masonry-layout';

import { Row, Col } from './Grid';
import AlertBox from './AlertBox';
import PostCreator from './PostCreator';
import PostBox from './PostBox';
import Loader from './Loader';

class PostContainer extends React.Component {
  constructor(props) {
    super(props);

    this.masonryGrid = null;

    this.state = {
      loading: true,
      posts: [],
      error: false
    };

    this.fetchPosts = this.fetchPosts.bind(this);
    this.rerenderMasonry = this.rerenderMasonry.bind(this);

    this.cancelPostRequest = null;
  }

  componentDidMount() {
    this.fetchPosts();
  }

  componentWillUnmount() {
    if (this.cancelPostRequest)
      this.cancelPostRequest();
  }

  fetchPosts() {
    axios
      .get('/api/posts', {
        cancelToken: new axios.CancelToken((cancelFunction) => {
          this.cancelPostRequest = () => {
            this.cancelPostRequest = null;
            cancelFunction();
          };
        }),
        params: {
          user: this.props.user ? this.props.user._id : null
        }
      })
      .then(result => {
        console.log(result);
        this.setState({
          loading: false,
          posts: result.data.posts,
          error: false
        });
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error);
          this.setState({
            loading: false,
            posts: [],
            error: true
          });
        }
      });
  }

  likePost(post) {
    axios
      .post('/api/post/' + post._id + '/like')
      .then(result => {
        // we dont have to do anything with the response
      })
      .catch(error => {
        console.error(error);
      });
  }

  rerenderMasonry() {
    this.masonryGrid.layout();
  }

  renderError() {
    return (
      <Row>
        <Col xs={12}>
          <AlertBox type="danger">
            <strong>Error fetching posts.</strong> Please try again later.
          </AlertBox>
        </Col>
      </Row>
    );
  }

  renderPosts() {
    return (
      <div>
        <PostCreator
          hideModal={this.props.hideModal}
          opened={this.props.modalOpen}
          onCreate={this.fetchPosts} />
        <Row className="my-3">
          {this.state.posts.length === 0 && <Col xs={12} className="d-flex justify-content-center"><h4>No Pieces yet</h4></Col>}

          <div
            className="masonry-grid w-100"
            ref={div => {
              console.log('set');
              window.mas = this.masonryGrid = new Masonry(div, {
                // options
                itemSelector: '.grid-item',
                columnWidth: '.grid-sizer',
                percentPosition: true
              });
            }}>
            <Col
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="grid-sizer"></Col>
            {this.state.posts.map((post, index) => {
              let userLikesPost = false;
              if (this.props.userId) {
                userLikesPost = post.likes.includes(this.props.userId);
              }

              return (
                <Col
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="grid-item"
                  key={index}>
                  <PostBox
                    post={post}
                    onDoneLoading={this.rerenderMasonry}
                    onToggleLike={() => this.likePost(post)}
                    userLikesPost={userLikesPost}
                    userIsAuthenticated={!!this.props.userId} />
                </Col>
              );
            })}
          </div>
        </Row>
      </div>
    );
  }

  render() {
    console.log(this.state);
    return this.state.loading
      ? <Loader />
      : this.state.error
        ? this.renderError()
        : this.renderPosts();
  }
}

const mapStateToProps = state => {
  return {
    modalOpen: state.modalOpen,
    userId: state.auth.user ? state.auth.user._id : null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    hideModal: () => {
      dispatch({
        type: 'TOGGLE_MODAL',
        open: false
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
