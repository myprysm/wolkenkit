import { CommandData, CommandHandler, Schema } from 'wolkenkit';
import { MessageState } from '../MessageState';
import { precondition } from '../middlewares/precondition';
import { SentData } from '../domainEvents/sent';


export interface SendData extends CommandData {
  text: string;
}

export const send: CommandHandler<MessageState, SendData> = {
  getSchema (): Schema {
    return {
      type: 'object',
      properties: {
        text: { type: 'string' }
      },
      required: [ 'text' ],
      additionalProperties: false
    };
  },

  isAuthorized (): boolean {
    return true;
  },

  middleware: [
    precondition<MessageState, SendData>(
        ({ command }): boolean => !!command.data.text,
        'Text is missing.'
    )
  ],

  handle (_state, command, { aggregate }): void {
    aggregate.publishDomainEvent<SentData>('sent', {
      text: command.data.text
    });
  }
};
