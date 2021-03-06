import React, { Component } from 'react';
import './app.css';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
//Modal.setAppElement('#yourAppElement')

export default class App extends Component {
  state = {
    nowEditing: false,
    nowSaving: false,
    modalIsOpen: false,
    inputValue: 'test',
    currentItem: {
      id: null,
      body: null,
      status: null,
    },
  };

  componentDidMount() {
    fetch('/api/source')
      .then((res) => res.text())
      .then((t) => {
        this.setState({ sources: t });
      });
  }

  handleClickSaveSource() {
    this.toggleMode();
    fetch('/api/source', {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
      },
      body: this.state.sources,
    });
  }

  handleClickItem(i) {
    fetch(`/api/data/${i}`)
      .then((res) => res.json())
      .then((json) => {
        this.setState((prevState) => ({
          currentItem: {
            ...prevState.currentItem,
            ...json,
          },
        }));
      });
  }

  handleClickSaveItem() {
    this.setState({ nowSaving: true });

    fetch(`/api/data/${this.state.currentItem.id}`, {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
      },
    })
      .then((res) => res.text())
      .then((text) => {
        if (text === 'ok') {
          this.setState({ nowSaving: false });
          this.handleClickItem(this.state.currentItem.id);
        }
      });
  }

  handleChangeValue(e) {
    this.setState({ sources: e.target.value });
  }

  handleClickCancel() {
    this.setState({
      currentItem: {
        id: null,
        body: null,
        status: null,
      },
    });
  }
  handleClickSaveAddSource() {
    fetch('/api/source', {
      method: 'POST',
      headers: {
        Accept: 'text/plain',
        'Content-Type': 'text/plain',
      },
      body: this.state.sources,
    });
    this.setState({ modalIsOpen: false });
  }
  handleClickAddSource() {
    this.setState({
      sources: this.state.sources + this.state.inputValue + '\n',
    });
  }

  handleChangeInputValue(e) {
    this.setState({ inputValue: e.target.value });
  }
  toggleMode() {
    this.setState((prevState) => ({ nowEditing: !prevState.nowEditing }));
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  render() {
    const { sources } = this.state;
    let lis = '';

    if (sources) {
      lis = sources.split('\n').map((line, i) => (
        <li
          className={this.state.currentItem.id === String(i) ? 'active' : ''}
          key={i}
        >
          <a onClick={this.handleClickItem.bind(this, i)}>
            {decodeURIComponent(line)}
          </a>
        </li>
      ));
    }

    return (
      <div>
        <button onClick={this.openModal.bind(this)}>url추가</button>
        <Modal
          isOpen={this.state.modalIsOpen}
          //onAfterOpen={this.afterOpenModal}
          onRequestClose={this.state.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>원하는 url을 입력하세요.</h2>
          <input
            value={this.state.inputValue}
            onChange={this.handleChangeInputValue.bind(this)}
          />
          <button onClick={this.handleClickSaveAddSource.bind(this)}>
            url 저장
          </button>
          <button onClick={this.handleClickAddSource.bind(this)}>
            url 소스에 추가하기
          </button>
          <button onClick={this.closeModal}>취소</button>
        </Modal>

        <h3>article collector (for medium blog)</h3>
        <div className={this.state.nowEditing ? 'hidden' : ''}>
          <header>
            <button onClick={this.toggleMode.bind(this)}>편집</button>
          </header>
          <ul>{lis}</ul>
          <code
            id="content"
            className={
              this.state.currentItem.status === 'nonexist' ? 'hidden' : ''
            }
          >
            {this.state.currentItem.body}
          </code>
          <div
            id="modal"
            className={
              this.state.currentItem.status === 'nonexist' ? '' : 'hidden'
            }
          >
            <div className="modal-content">
              <p>아직 수집되지 않았습니다. 수집 후 파일로 저장하시겠습니까?</p>
              <button
                disabled={this.state.nowSaving}
                onClick={this.handleClickSaveItem.bind(this)}
              >
                수집 후 저장
              </button>
              <button
                disabled={this.state.nowSaving}
                onClick={this.handleClickCancel.bind(this)}
              >
                취소
              </button>
              <span className={this.state.nowSaving ? '' : 'hidden'}>
                저장 중...
              </span>
            </div>
          </div>
        </div>

        <div className={this.state.nowEditing ? '' : 'hidden'}>
          <header>
            <button onClick={this.handleClickSaveSource.bind(this)}>
              저장
            </button>
          </header>
          <div>
            <p>
              내용을 가져올
              <a href="https://medium.com/" target="_blank">
                Medium
              </a>
              post URL을 한줄씩 입력하세요.
            </p>
            <p>
              예:
              <code>
                https://medium.com/@addyosmani/the-cost-of-javascript-in-2018-7d8950fbb5d4
              </code>
            </p>
          </div>
          <textarea
            value={sources}
            onChange={this.handleChangeValue.bind(this)}
          />
        </div>
      </div>
    );
  }
}
