import {Message} from 'element-ui';

class MessageClass {
  constructor(){}
  error(message){
    Message({
      type: 'error',
      message,
    });
  }
}

export default new MessageClass();
