import React, { Component } from 'react'
import { Input, Button } from 'react-chat-elements'
import PropTypes from 'prop-types'

class ChatInput extends Component {
  static propTypes = {
    onSubmitMessage: PropTypes.func.isRequired,
  };

  state = {
    message: '',
  };

  render() {
    return (
      <div>
        <Input
          placeholder={"Gib eine Nachricht ein..."}
          multiline={true}
          ref={'input'}
          onChange={(text) => {
            this.setState({
              message: text.currentTarget ? text.currentTarget.value : null
            })
          }}
          onKeyPress={(e) => {
            if (e.shiftKey && e.charCode === 13) {
              return true;
            }
            if (e.charCode === 13) {
              this.props.onSubmitMessage(this.state.message, new Date());
              this.setState({ message: '' });
              this.refs.input.clear();
              e.preventDefault();
              return false;
            }
          }}
          rightButtons={
            <Button
              color='white'
              backgroundColor='#8f6cd0'
              text='Senden'
              onClick={() => {
                this.props.onSubmitMessage(this.state.message, new Date());
                this.setState({ message: '' });
                this.refs.input.clear();
              }}
            />
          }/>
      </div>

    )
  }
}

export default ChatInput
