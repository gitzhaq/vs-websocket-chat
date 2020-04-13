import React from 'react'
import { MessageBox } from 'react-chat-elements';
import Cookies from 'js-cookie';
import moment from 'moment';

export default ({ username, message, date }) =>
  <MessageBox
    position={Cookies.get('username') === username ? 'left' : 'right'}
    type={'text'}
    title={username}
    text={message}
    dateString={moment(date).format("HH:mm")}
  />
