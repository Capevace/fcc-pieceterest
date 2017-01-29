import React from 'react';
import { Row, Col } from '../components/Grid';
import PostContainer from '../components/PostContainer';

function HomePage() {
  return (
    <div>
      <Row>
        <Col xs={12}>
          <PostContainer />
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
