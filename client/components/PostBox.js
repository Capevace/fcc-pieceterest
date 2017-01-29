import React from 'react';
import { Row, Grid } from './Grid';

class PostBox extends React.Component {
  constructor(props) {
    super(props);

    this.toggleLike = this.toggleLike.bind(this);

    this.state = {
      liking: !!props.userLikesPost
    };
  }

  toggleLike() {
    if (!this.props.userIsAuthenticated)
      return;

    this.props.onToggleLike();

    this.setState({
      liking: !this.state.liking
    });
  }

  render() {
    const { post, onDoneLoading, userLikesPost, userIsAuthenticated } = this.props;
    let likes = post.likes.length;

    if (userLikesPost)
      likes -= 1;

    if (this.state.liking)
      likes += 1;

    return (
      <div className="card mb-4">
        <img className="card-img-top w-100" src={post.pictureUrl} onLoad={onDoneLoading} />
        <div className="card-block p-2">
          <div className="mb-3">
            <p className="mb-0 text-muted">{post.description}</p>
          </div>
          <div className="d-flex justify-content-between">
            <p className="mb-0 text-muted" style={{
              'white-space': 'nowrap',
              'text-overflow': 'ellipsis'
            }}>By {post.posterDisplayName}</p>
            <button
              onClick={this.toggleLike}
              className={`btn btn-sm btn-${this.state.liking ? 'primary' : 'secondary'}`}>
              ❤ {likes}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default PostBox;
