import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from '../components/Grid';
import PostContainer from '../components/PostContainer';

function MyPiecesPage({ user }) {
  return (
    <div>
      <Row>
        <Col xs={12}>
          <PostContainer user={user} />
        </Col>
      </Row>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(MyPiecesPage);
