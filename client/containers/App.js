import React from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import { Container } from '../components/Grid';

function App({ children, loading, hideModal, modalOpen }) {
  return (
    <div>
      <Header />
      <Container className="mt-4">
        {loading
          ? 'Loading'
          : children
        }
      </Container>
      <Container className="my-3 d-flex justify-content-center">
        Made by Lukas von Mateffy (
          <a href="https://twitter.com/Capevace">@Capevace</a>&nbsp;|&nbsp;
          <a href="http://smoolabs.com">smoolabs.com</a>&nbsp;|&nbsp;
          <a href="https://github.com/Capevace">GitHub</a>
        )
      </Container>
      {/* <Footer /> */}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading > 0,
    modalOpen: state.modalOpen
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
