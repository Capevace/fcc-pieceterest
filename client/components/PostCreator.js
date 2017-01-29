import React from 'react';
import axios from 'axios';
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalClose,
  ModalBody,
  ModalFooter
} from 'react-modal-bootstrap';

class PostCreator extends React.Component {
  constructor(props) {
    super(props);

    this.submitForm = this.submitForm.bind(this);

    this.state = {
      creating: false,
      error: false,
      errorMessage: '',
      formData: {
        description: '',
        url: ''
      }
    };
  }

  updateForm(key, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        [key]: value
      }
    });
  }

  submitForm(e) {
    e.preventDefault();

    this.setState({
      creating: true
    });

    axios
      .post('/api/post', {
        description: this.state.formData.description,
        pictureUrl: this.state.formData.url
      })
      .then(result => {
        if (this.props.onCreate)
          this.props.onCreate();

        this.setState({
          creating: false,
          error: false,
          errorMessage: '',
          formData: {
            description: '',
            url: ''
          }
        });

        this.props.hideModal();
      })
      .catch(error => {
        console.log(error);
        this.setState({
          creating: false,
          error: true,
          errorMessage: error.response && error.response.data
            ? error.response.data.message
            : 'Unknown error.'
        });
      })
  }

  render() {
    return (
      <form onSubmit={this.submitForm}>
        <Modal isOpen={this.props.opened} onRequestHide={this.props.hideModal}>
          <ModalHeader>
            <ModalTitle>
              {this.state.creating
                ? 'Submitting Piece...'
                : 'Submit Piece'
              }
            </ModalTitle>
            <ModalClose onClick={this.props.hideModal}/>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="url">Piece URL</label>
              <input
                type="url"
                className="form-control"
                id="url"
                placeholder="Piece URL"
                value={this.state.formData.url}
                onChange={e => this.updateForm('url', e.target.value)}
                disabled={this.state.creating} />
            </div>

            <div className="form-group">
              <label htmlFor="description">Piece Description</label>
              <input
                type="text"
                className="form-control"
                id="description"
                aria-describedby="descriptionHelp"
                placeholder="Piece Description"
                value={this.state.formData.description}
                onChange={e => this.updateForm('description', e.target.value)}
                disabled={this.state.creating} />
              <small
                id="descriptionHelp"
                className="form-text text-muted">
                Tell us something about the picture.
              </small>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="submit"
              className='btn btn-primary'
              disabled={this.state.creating}>
              Submit Piece
            </button>
          </ModalFooter>
        </Modal>
      </form>
    );
  }
}

export default PostCreator;
